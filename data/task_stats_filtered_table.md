# Task Stats Filtered Results (User Report) - ACL Format

## Required Packages

```latex
\usepackage{booktabs}
\usepackage{multirow}
\usepackage{xcolor}
\usepackage{amssymb}

% Define colors
\definecolor{bestgreen}{RGB}{34, 139, 34}
```

---

## 主结果表：User Report（189 个 CVE）

```latex
\begin{table*}[htbp]
\centering
\caption{Main Experimental Results on CVE Benchmark (User Report, 189 CVEs). \textbf{Bold} values with {\color{bestgreen}$\blacktriangle$} indicate best performance per column.}
\label{tab:main_results_filtered}
\begin{tabular}{llccccc}
\toprule
& & & \multicolumn{2}{c}{\textbf{Success}} & \multicolumn{2}{c}{\textbf{Failed}} \\
\cmidrule(lr){4-5} \cmidrule(lr){6-7}
\textbf{Agent} & \textbf{Model} & \textbf{Pass (\%)} & \textbf{Turns} & \textbf{Tokens} & \textbf{Turns} & \textbf{Tokens} \\
\midrule
\multirow{2}{*}{Claude Code}
 & Claude Opus 4.5 & 27.78 & -- & -- & -- & -- \\
 & Claude Sonnet 4.5 & 24.34 & -- & -- & -- & -- \\
\midrule
\multirow{6}{*}{OpenHands}
 & Claude Opus 4.5 & 30.16 & 30.8 & 1,069,481 & 28.4 & 1,066,426 \\
 & Claude Sonnet 4.5 & 27.51 & 42.7 & 1,171,678 & 45.6 & 1,393,851 \\
 & Gemini 3 Pro & 14.81 & 46.2 & 1,228,641 & 23.2 & 507,147 \\
 & GPT-5.1-Codex & 12.70 & 31.2 & 597,763 & 38.7 & 898,759 \\
 & GLM-4.6 & 16.93 & 33.6 & 710,058 & 33.2 & 672,933 \\
 & DeepSeek V3.1-Terminus & 18.52 & 38.9 & 951,072 & 40.8 & 996,215 \\
\midrule
\multirow{10}{*}{Mini-SWE-Agent}
 & Claude Opus 4.5 & 41.27 & 40.1 & 798,860 & 43.6 & 1,008,186 \\
 & Claude Sonnet 4.5 & 34.39 & 39.4 & 659,811 & 39.4 & 658,626 \\
 & Claude Sonnet 4 & 20.11 & 29.8 & 340,386 & 37.3 & 559,877 \\
 & Gemini 3 Pro & 27.51 & 29.8 & 432,771 & 31.7 & 564,593 \\
 & GPT-5.1-Codex & 20.11 & 22.5 & 232,122 & 22.5 & \textbf{238,922}{\color{bestgreen}$\blacktriangle$} \\
 & GLM-4.6 & 20.11 & 33.3 & 344,088 & 37.6 & 496,109 \\
 & MiniMax M2 & 24.87 & 42.5 & 551,593 & 55.1 & 850,276 \\
 & Qwen 3 Coder 480B & 19.58 & 39.5 & 480,659 & 45.1 & 578,253 \\
 & DeepSeek V3.2 & 21.16 & 35.2 & 348,645 & 35.6 & 393,126 \\
 & DeepSeek V3.1-Terminus & 24.34 & 30.8 & 282,647 & 32.1 & 328,044 \\
\midrule
\multirow{10}{*}{Terminus-2}
 & Claude Opus 4.5 & \textbf{42.33}{\color{bestgreen}$\blacktriangle$} & 24.3 & 426,488 & 27.3 & 657,913 \\
 & Claude Sonnet 4.5 & 38.10 & 30.6 & 484,271 & 34.1 & 660,326 \\
 & Claude Sonnet 4 & 23.28 & 32.8 & 534,587 & 37.2 & 681,429 \\
 & Gemini 3 Pro & 29.63 & \textbf{16.8}{\color{bestgreen}$\blacktriangle$} & 237,714 & 21.0 & 366,009 \\
 & GPT-5.1-Codex & 21.16 & 18.3 & \textbf{191,532}{\color{bestgreen}$\blacktriangle$} & \textbf{19.1}{\color{bestgreen}$\blacktriangle$} & 250,254 \\
 & GLM-4.6 & 25.40 & 30.7 & 394,184 & 39.4 & 632,040 \\
 & MiniMax M2 & 30.16 & 41.3 & 700,035 & 46.8 & 984,070 \\
 & Qwen 3 Coder 480B & 19.05 & 34.1 & 407,784 & 46.1 & 730,546 \\
 & DeepSeek V3.2 & 22.75 & 23.4 & 432,778 & 21.7 & 406,347 \\
 & DeepSeek V3.1-Terminus & 23.28 & 17.3 & 217,177 & 19.6 & 302,482 \\
\bottomrule
\end{tabular}
\end{table*}
```

---

## 关键发现

### 1. 最佳表现

| 指标 | 最佳值 | Agent + Model |
|------|--------|---------------|
| **Pass Rate** | **42.33%** | Terminus-2 + Claude Opus 4.5 |
| **Success Turns** | **16.8** | Terminus-2 + Gemini 3 Pro |
| **Success Tokens** | **191,532** | Terminus-2 + GPT-5.1-Codex |
| **Failed Turns** | **19.1** | Terminus-2 + GPT-5.1-Codex |
| **Failed Tokens** | **238,922** | Mini-SWE-Agent + GPT-5.1-Codex |

### 2. Agent 整体表现

| Agent | 最高 Pass Rate | 平均 Pass Rate |
|-------|----------------|----------------|
| **Terminus-2** | 42.33% | 27.52% |
| **Mini-SWE-Agent** | 41.27% | 25.34% |
| **OpenHands** | 30.16% | 20.11% |
| **Claude Code** | 27.78% | 26.06% |

### 3. 分析解读

- **Terminus-2** 在 Pass Rate 和资源效率上均表现最优
- **Mini-SWE-Agent** 紧随其后，Claude Opus 4.5 达到 41.27%
- **OpenHands** 在 Claude 系列模型上表现较好
- **Claude Code** 缺少 Turns/Tokens 详细数据

---

## 说明

- **CVE 数量**：189 个（filtered 版本）
- **--**：数据不可用
- **最佳值标注**：
  - Pass Rate：越高越好
  - Turns/Tokens：越低越好
- `{\color{bestgreen}$\blacktriangle$}` 生成绿色三角标记
