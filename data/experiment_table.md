# Experiment Results Table (User Report) - ACL Format

## Required Packages

```latex
\usepackage{booktabs}
\usepackage{multirow}
```

## LaTeX Code

```latex
\begin{table*}[htbp]
\centering
\caption{Main Experimental Results on CVE Benchmark (User Report)}
\label{tab:main_results}
\begin{tabular}{llccc}
\toprule
\textbf{Agent} & \textbf{Model} & \textbf{Pass Rate (\%)} & \textbf{Avg. Turns} & \textbf{Avg. Tokens} \\
\midrule
\multirow{2}{*}{Claude Code}
 & Claude Opus 4.5 & 30.18 & 19.7 & 2,476,255 \\
 & Claude Sonnet 4.5 & 21.30 & 22.0 & 593,021 \\
\midrule
\multirow{9}{*}{OpenHands}
 & Claude Opus 4.5 & 25.44 & 56.0 & 1,986,683 \\
 & Claude Sonnet 4.5 & 24.26 & 84.3 & 2,364,341 \\
 & Claude Sonnet 4 & 6.51 & 73.0 & 2,105,890 \\
 & Gemini 3 Pro & 8.88 & 55.1 & 2,245,732 \\
 & GPT-5.1-Codex & 15.38 & 63.8 & 2,790,584 \\
 & GLM-4.6 & 18.93 & 66.9 & 2,236,242 \\
 & Qwen 3 Coder 480B & 0.59 & -- & -- \\
 & DeepSeek V3.2 & 0.59 & 117.1 & 3,607,927 \\
 & DeepSeek V3.1-Terminus & 18.34 & 85.7 & 2,164,247 \\
\midrule
\multirow{10}{*}{Mini-SWE-Agent}
 & Claude Opus 4.5 & 34.32 & 38.8 & 799,319 \\
 & Claude Sonnet 4.5 & 28.99 & 37.1 & 590,964 \\
 & Claude Sonnet 4 & 7.69 & -- & -- \\
 & Gemini 3 Pro & 28.40 & 34.7 & 600,927 \\
 & GPT-5.1-Codex & 17.75 & 20.7 & 190,703 \\
 & GLM-4.6 & 19.53 & 35.4 & 448,551 \\
 & MiniMax M2 & 19.53 & 61.3 & 1,040,872 \\
 & Qwen 3 Coder 480B & 19.53 & 45.2 & 565,438 \\
 & DeepSeek V3.2 & 17.75 & 46.1 & 573,318 \\
 & DeepSeek V3.1-Terminus & 22.49 & 30.6 & 294,749 \\
\midrule
\multirow{10}{*}{Terminus-2}
 & Claude Opus 4.5 & 36.09 & 28.6 & 154,955 \\
 & Claude Sonnet 4.5 & 34.32 & 34.5 & 158,645 \\
 & Claude Sonnet 4 & 8.88 & 20.4 & 720,017 \\
 & Gemini 3 Pro & 36.09 & 22.4 & 474,489 \\
 & GPT-5.1-Codex & 21.89 & 24.7 & 489,978 \\
 & GLM-4.6 & 26.63 & 39.2 & 840,429 \\
 & MiniMax M2 & 24.26 & 42.1 & 856,209 \\
 & Qwen 3 Coder 480B & 15.98 & 43.6 & 851,163 \\
 & DeepSeek V3.2 & 21.89 & 27.3 & 624,450 \\
 & DeepSeek V3.1-Terminus & 20.71 & 19.1 & 318,074 \\
\bottomrule
\end{tabular}
\end{table*}
```

## Notes

- `table*` environment spans both columns in ACL two-column format
- **Pass Rate (%)**: Percentage of successfully resolved CVEs
- **Avg. Turns**: Average number of interaction turns (excluding entries with 0 turns)
- **Avg. Tokens**: Average token consumption (excluding entries with 0 tokens)
- **--**: Data not available
