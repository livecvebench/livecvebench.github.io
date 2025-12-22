#!/usr/bin/env python3
"""
LiveCVEBench Submission Processing Script

Usage:
    python process_submission.py <submission_file>
    python process_submission.py --all                  # Process all files in submissions/
    python process_submission.py --validate <file>      # Only validate, don't merge

Example:
    python scripts/process_submission.py submissions/GPT-4o_OpenHands.json
"""

import json
import os
import sys
import re
from datetime import datetime
from pathlib import Path

# Paths
SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent / "data"
SUBMISSIONS_DIR = SCRIPT_DIR.parent / "submissions"
LEADERBOARD_FILE = DATA_DIR / "leaderboard.json"


def load_leaderboard():
    """Load the current leaderboard data."""
    if not LEADERBOARD_FILE.exists():
        return {
            "metadata": {
                "lastUpdated": datetime.now().strftime("%Y-%m-%d"),
                "version": "1.0.0"
            },
            "cves": [],
            "results": []
        }

    with open(LEADERBOARD_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_leaderboard(data):
    """Save the leaderboard data."""
    data["metadata"]["lastUpdated"] = datetime.now().strftime("%Y-%m-%d")

    with open(LEADERBOARD_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print(f"✓ Saved to {LEADERBOARD_FILE}")


def validate_cve_id(cve_id):
    """Validate CVE ID format."""
    pattern = r"^CVE-\d{4}-\d{4,}$"
    return bool(re.match(pattern, cve_id))


def validate_submission(submission):
    """Validate a submission file."""
    errors = []
    warnings = []

    # Required fields
    required_fields = ["model", "agent", "modelType", "agentType", "cve_results"]
    for field in required_fields:
        if field not in submission:
            errors.append(f"Missing required field: {field}")

    if errors:
        return errors, warnings

    # Validate types
    if submission["modelType"] not in ["open", "closed"]:
        errors.append(f"modelType must be 'open' or 'closed', got: {submission['modelType']}")

    if submission["agentType"] not in ["open", "closed"]:
        errors.append(f"agentType must be 'open' or 'closed', got: {submission['agentType']}")

    # Validate cve_results
    cve_results = submission.get("cve_results", {})
    if not isinstance(cve_results, dict):
        errors.append("cve_results must be an object")
        return errors, warnings

    if len(cve_results) == 0:
        errors.append("cve_results cannot be empty")

    for cve_id, result in cve_results.items():
        # Validate CVE ID format
        if not validate_cve_id(cve_id):
            errors.append(f"Invalid CVE ID format: {cve_id}")
            continue

        # Validate result fields
        if not isinstance(result, dict):
            errors.append(f"{cve_id}: result must be an object")
            continue

        if "success" not in result:
            errors.append(f"{cve_id}: missing 'success' field")
        elif not isinstance(result["success"], bool):
            errors.append(f"{cve_id}: 'success' must be a boolean")

        if "turns" not in result:
            errors.append(f"{cve_id}: missing 'turns' field")
        elif not isinstance(result["turns"], (int, float)) or result["turns"] < 0:
            errors.append(f"{cve_id}: 'turns' must be a non-negative number")

        if "tokens" not in result:
            errors.append(f"{cve_id}: missing 'tokens' field")
        elif not isinstance(result["tokens"], (int, float)) or result["tokens"] < 0:
            errors.append(f"{cve_id}: 'tokens' must be a non-negative number")

    return errors, warnings


def merge_submission(leaderboard, submission):
    """Merge a submission into the leaderboard."""
    model = submission["model"]
    agent = submission["agent"]

    # Find existing entry
    existing_idx = None
    for idx, result in enumerate(leaderboard["results"]):
        if result["model"] == model and result["agent"] == agent:
            existing_idx = idx
            break

    # Create new entry
    new_entry = {
        "model": model,
        "agent": agent,
        "modelType": submission["modelType"],
        "agentType": submission["agentType"],
        "cve_results": {}
    }

    # If existing, merge cve_results
    if existing_idx is not None:
        existing = leaderboard["results"][existing_idx]
        new_entry["cve_results"] = existing.get("cve_results", {}).copy()
        print(f"  Updating existing entry: {model} + {agent}")
    else:
        print(f"  Adding new entry: {model} + {agent}")

    # Merge new CVE results (overwrite existing)
    for cve_id, result in submission["cve_results"].items():
        new_entry["cve_results"][cve_id] = result

    # Update or add entry
    if existing_idx is not None:
        leaderboard["results"][existing_idx] = new_entry
    else:
        leaderboard["results"].append(new_entry)

    # Check for new CVEs and warn
    known_cve_ids = {cve["id"] for cve in leaderboard["cves"]}
    new_cves = set(submission["cve_results"].keys()) - known_cve_ids
    if new_cves:
        print(f"  ⚠ Warning: These CVEs are not in the CVE list: {new_cves}")
        print(f"    Please add them to the 'cves' array with their dates")

    return leaderboard


def process_file(filepath, validate_only=False):
    """Process a single submission file."""
    print(f"\nProcessing: {filepath}")

    # Load submission
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            submission = json.load(f)
    except json.JSONDecodeError as e:
        print(f"  ✗ Invalid JSON: {e}")
        return False
    except Exception as e:
        print(f"  ✗ Error reading file: {e}")
        return False

    # Validate
    errors, warnings = validate_submission(submission)

    for warning in warnings:
        print(f"  ⚠ {warning}")

    if errors:
        print(f"  ✗ Validation failed:")
        for error in errors:
            print(f"    - {error}")
        return False

    print(f"  ✓ Validation passed")

    if validate_only:
        return True

    # Load and merge
    leaderboard = load_leaderboard()
    leaderboard = merge_submission(leaderboard, submission)
    save_leaderboard(leaderboard)

    return True


def process_all():
    """Process all submissions in the submissions directory."""
    if not SUBMISSIONS_DIR.exists():
        print(f"Submissions directory not found: {SUBMISSIONS_DIR}")
        return

    files = list(SUBMISSIONS_DIR.glob("*.json"))
    if not files:
        print("No submission files found")
        return

    print(f"Found {len(files)} submission file(s)")

    success = 0
    failed = 0

    for filepath in files:
        if process_file(filepath):
            success += 1
        else:
            failed += 1

    print(f"\n{'='*40}")
    print(f"Results: {success} succeeded, {failed} failed")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    arg = sys.argv[1]

    if arg == "--all":
        process_all()
    elif arg == "--validate":
        if len(sys.argv) < 3:
            print("Usage: python process_submission.py --validate <file>")
            sys.exit(1)
        process_file(sys.argv[2], validate_only=True)
    else:
        process_file(arg)


if __name__ == "__main__":
    main()
