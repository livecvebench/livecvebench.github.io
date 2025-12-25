#!/usr/bin/env python3
"""
Convert merged submission results to leaderboard.json format.

Usage:
    python scripts/convert.py [merged_results_file]

Example:
    python scripts/convert.py data/merged_results_v5.json
"""

import json
import sys
import os
from datetime import datetime

def main():
    # Determine input file
    if len(sys.argv) > 1:
        merged_file = sys.argv[1]
    else:
        # Find the latest merged_results file
        data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        merged_files = [f for f in os.listdir(data_dir) if f.startswith('merged_results') and f.endswith('.json')]
        if not merged_files:
            print("Error: No merged_results file found in data/")
            sys.exit(1)
        merged_files.sort()
        merged_file = os.path.join(data_dir, merged_files[-1])
        print(f"Using latest: {merged_files[-1]}")

    # Paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(script_dir, '..', 'data')
    cve_dates_file = os.path.join(data_dir, 'cve_publish_dates.json')
    output_file = os.path.join(data_dir, 'leaderboard.json')

    # Read source files
    print(f"Reading {merged_file}...")
    with open(merged_file, 'r') as f:
        data = json.load(f)

    print(f"Reading {cve_dates_file}...")
    with open(cve_dates_file, 'r') as f:
        cve_dates = json.load(f)

    # Create CVE date lookup
    date_lookup = {cve['id']: cve['date'] for cve in cve_dates['cves']}

    # Get all unique CVE IDs from results
    all_cves = set()
    for result in data['results']:
        for cve_id in result['cve_results'].keys():
            all_cves.add(cve_id)

    # Create CVE list with real dates
    cve_list = []
    missing_dates = []
    for cve_id in sorted(all_cves):
        date = date_lookup.get(cve_id, None)
        if date:
            cve_list.append({"id": cve_id, "date": date})
        else:
            year = cve_id.split('-')[1]
            cve_list.append({"id": cve_id, "date": f"{year}-01-01"})
            missing_dates.append(cve_id)

    if missing_dates:
        print(f"\nWarning: {len(missing_dates)} CVEs missing dates (using fallback):")
        for cve_id in missing_dates:
            print(f"  - {cve_id}")
        print()

    # Sort by date
    cve_list.sort(key=lambda x: x['date'])

    # Split results by instruction_type
    cve_description_results = []
    user_report_results = []

    for result in data['results']:
        converted = {
            "model": result['model'],
            "agent": result['agent'],
            "modelType": result['modelType'],
            "agentType": result['agentType'],
            "cve_results": result['cve_results']
        }

        if result.get('instruction_type') == 'user_report':
            user_report_results.append(converted)
        else:
            cve_description_results.append(converted)

    # Create output
    output = {
        "metadata": {
            "lastUpdated": datetime.now().strftime("%Y-%m-%d"),
            "version": "1.0.0"
        },
        "cves": cve_list,
        "results": {
            "cve_description": cve_description_results,
            "user_report": user_report_results
        }
    }

    # Write output
    with open(output_file, 'w') as f:
        json.dump(output, f, indent=2)

    print(f"Generated {output_file}")
    print(f"  - {len(cve_list)} CVEs")
    print(f"  - CVE Description: {len(cve_description_results)} entries")
    print(f"  - User Report: {len(user_report_results)} entries")

if __name__ == '__main__':
    main()
