#!/usr/bin/env python3
"""
Merge all submission JSON files into a single merged_results file.

Usage:
    python scripts/merge_submissions.py <submissions_dir>

Example:
    python scripts/merge_submissions.py ../submissions
    python scripts/merge_submissions.py /path/to/livecvebench/submissions
"""

import json
import sys
import os
from datetime import datetime
from pathlib import Path


def load_submission(file_path):
    """Load a single submission file."""
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)

        # Validate required fields
        required = ['model', 'agent', 'modelType', 'agentType', 'cve_results']
        for field in required:
            if field not in data:
                print(f"  Warning: Missing '{field}' in {file_path}")
                return None

        return data
    except json.JSONDecodeError as e:
        print(f"  Error: Invalid JSON in {file_path}: {e}")
        return None
    except Exception as e:
        print(f"  Error: Failed to read {file_path}: {e}")
        return None


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/merge_submissions.py <submissions_dir>")
        print("Example: python scripts/merge_submissions.py ../submissions")
        sys.exit(1)

    submissions_dir = Path(sys.argv[1])

    if not submissions_dir.exists():
        print(f"Error: Directory not found: {submissions_dir}")
        sys.exit(1)

    # Find all JSON files
    json_files = list(submissions_dir.glob("**/*.json"))

    # Filter out any non-submission files (like package.json, etc.)
    json_files = [f for f in json_files if not f.name.startswith('.')]

    if not json_files:
        print(f"Error: No JSON files found in {submissions_dir}")
        sys.exit(1)

    print(f"Found {len(json_files)} JSON files in {submissions_dir}\n")

    # Load all submissions
    results = []
    all_cves = set()

    for file_path in sorted(json_files):
        print(f"Loading: {file_path.name}")
        submission = load_submission(file_path)

        if submission:
            results.append(submission)
            all_cves.update(submission.get('cve_results', {}).keys())

    print(f"\nSuccessfully loaded: {len(results)} submissions")
    print(f"Total unique CVEs: {len(all_cves)}")

    # Count by instruction_type
    by_type = {}
    for r in results:
        t = r.get('instruction_type', 'unknown')
        by_type[t] = by_type.get(t, 0) + 1

    print("\nBy instruction_type:")
    for t, count in sorted(by_type.items()):
        print(f"  - {t}: {count}")

    # Create output
    output = {
        "generated_at": datetime.now().isoformat(),
        "total_cves": len(all_cves),
        "total_combinations": len(results),
        "results": results
    }

    # Determine output filename
    script_dir = Path(__file__).parent
    data_dir = script_dir.parent / 'data'

    # Find next version number
    existing = list(data_dir.glob("merged_results_v*.json"))
    if existing:
        versions = []
        for f in existing:
            try:
                v = int(f.stem.split('_v')[1])
                versions.append(v)
            except:
                pass
        next_version = max(versions) + 1 if versions else 1
    else:
        next_version = 1

    output_file = data_dir / f"merged_results_v{next_version}.json"

    # Write output
    with open(output_file, 'w') as f:
        json.dump(output, f, indent=2)

    print(f"\nGenerated: {output_file}")
    print(f"\nNext step: python scripts/convert.py")


if __name__ == '__main__':
    main()
