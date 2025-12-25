# LiveCVEBench Leaderboard Website

Leaderboard website for LiveCVEBench: https://livecvebench.github.io

## Updating the Leaderboard

### 1. Merge Submissions

```bash
# Clone submissions repo (if not already)
git clone https://github.com/livecvebench/submissions ../submissions

# Merge all submission files
python scripts/merge_submissions.py ../submissions
```

This generates `data/merged_results_vX.json` with auto-incremented version.

### 2. Update CVE Dates (if needed)

If there are new CVEs, add their publication dates to `data/cve_publish_dates.json`.

### 3. Generate Leaderboard

```bash
# Auto-detect latest merged_results file
python scripts/convert.py

# Or specify a file
python scripts/convert.py data/merged_results_v6.json
```

### 4. Deploy

```bash
git add .
git commit -m "Update leaderboard data"
git push
```

GitHub Pages will automatically deploy to https://livecvebench.github.io

## Project Structure

```
├── index.html                  # Main page
├── submit.html                 # Submission guide (EN)
├── submit-zh.html              # Submission guide (中文)
├── css/style.css
├── js/main.js
├── scripts/
│   ├── merge_submissions.py    # Merge submission files
│   └── convert.py              # Generate leaderboard.json
└── data/
    ├── leaderboard.json        # Generated (DO NOT edit manually)
    ├── cve_publish_dates.json  # CVE dates
    └── merged_results_vX.json  # Merged submissions
```

## Related Repositories

- [LiveCVEBench-Preview](https://github.com/livecvebench/LiveCVEBench-Preview) - Main project
- [submissions](https://github.com/livecvebench/submissions) - Submit results here
