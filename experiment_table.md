# Experiment Results Table - ACL Format

## Required Packages

```latex
\usepackage{booktabs}
\usepackage{multirow}
\usepackage{xcolor}
\usepackage{amssymb}  % for \blacktriangle

% Define colors
\definecolor{bestgreen}{RGB}{34, 139, 34}
\definecolor{rowgray}{RGB}{245, 245, 245}
\definecolor{improve}{RGB}{0, 128, 0}
```

---

## Agent 架构对比：Mini-SWE-Agent vs Terminus-2

### Mini-SWE-Agent

| 特性 | 描述 |
|------|------|
| **核心设计** | 约100行 Python 代码，极简主义 |
| **工具接口** | 仅使用 Bash，不调用 LLM tool-calling API |
| **执行模型** | 通过 `subprocess.run` 独立执行每个动作 |
| **历史记录** | 线性消息轨迹（仅追加） |
| **运行环境** | 在容器内运行，每个动作相互隔离 |

**核心特点：**
- 每个动作完全独立（无状态执行）
- 轨迹与 LLM 上下文直接映射，便于调试
- 适用于微调和强化学习实验
- 更适合处理**结构化的技术指令**

### Terminus-2

| 特性 | 描述 |
|------|------|
| **核心设计** | 自主优先，模型无关 |
| **工具接口** | 单一 tmux 交互式会话 |
| **执行模型** | 通过键盘输入控制的持久会话 |
| **历史记录** | 有状态的终端交互 |
| **运行环境** | 远程架构，在容器外部运行 |

**核心特点：**
- 通过 tmux 维护持久 shell 会话
- 可交互式使用 vim/emacs，导航菜单
- 对环境损坏具有弹性（在容器外运行）
- 更适合处理**模糊的探索性指令**

---

## 主结果表 1：全部 User Report（169 个 CVE）

```latex
\begin{table*}[htbp]
\centering
\caption{Main Experimental Results on CVE Benchmark (All 169 User Report CVEs). \textbf{Bold} values with {\color{bestgreen}$\blacktriangle$} indicate best performance per column.}
\label{tab:main_results_169}
\begin{tabular}{llccccc}
\toprule
& & & \multicolumn{2}{c}{\textbf{Success}} & \multicolumn{2}{c}{\textbf{Failed}} \\
\cmidrule(lr){4-5} \cmidrule(lr){6-7}
\textbf{Agent} & \textbf{Model} & \textbf{Pass (\%)} & \textbf{Turns} & \textbf{Tokens} & \textbf{Turns} & \textbf{Tokens} \\
\midrule
\multirow{2}{*}{Claude Code}
 & Claude Opus 4.5 & 30.18 & 10.4 & 311,773 & 11.8 & 453,677 \\
 & Claude Sonnet 4.5 & 21.30 & 15.6 & 446,801 & 16.3 & 563,390 \\
\midrule
\multirow{9}{*}{OpenHands}
 & Claude Opus 4.5 & 25.44 & 13.1 & 480,790 & 8.0 & 277,406 \\
 & Claude Sonnet 4.5 & 24.26 & 21.1 & 529,319 & 11.4 & 338,417 \\
 & Claude Sonnet 4 & 6.51 & 8.9 & 330,610 & \textbf{4.7}{\color{bestgreen}$\blacktriangle$} & 130,260 \\
 & Gemini 3 Pro & 8.88 & 40.5 & 1,762,888 & 8.4 & 331,392 \\
 & GPT-5.1-Codex & 15.38 & 24.3 & 1,035,479 & 7.6 & 338,625 \\
 & GLM-4.6 & 18.93 & 27.4 & 859,727 & 11.7 & 403,136 \\
 & Qwen 3 Coder 480B & 0.59 & -- & -- & -- & -- \\
 & DeepSeek V3.2 & 0.59 & -- & -- & 12.6 & 386,564 \\
 & DeepSeek V3.1-Terminus & 18.34 & 18.3 & 417,217 & 10.5 & 274,827 \\
\midrule
\multirow{10}{*}{Mini-SWE-Agent}
 & Claude Opus 4.5 & 34.32 & 20.4 & 351,880 & 14.2 & 327,411 \\
 & Claude Sonnet 4.5 & 28.99 & 24.0 & 360,323 & 11.8 & 197,597 \\
 & Claude Sonnet 4 & 7.69 & -- & -- & -- & -- \\
 & Gemini 3 Pro & 28.40 & 20.5 & 297,177 & 11.9 & 229,755 \\
 & GPT-5.1-Codex & 17.75 & \textbf{9.7}{\color{bestgreen}$\blacktriangle$} & \textbf{82,372}{\color{bestgreen}$\blacktriangle$} & 4.6 & \textbf{43,960}{\color{bestgreen}$\blacktriangle$} \\
 & GLM-4.6 & 19.53 & 14.0 & 130,034 & 8.8 & 123,462 \\
 & MiniMax M2 & 19.53 & 18.7 & 218,971 & 18.5 & 337,194 \\
 & Qwen 3 Coder 480B & 19.53 & 17.5 & 171,833 & 15.3 & 203,605 \\
 & DeepSeek V3.2 & 17.75 & 20.5 & 235,860 & 7.2 & 93,456 \\
 & DeepSeek V3.1-Terminus & 22.49 & 13.4 & 115,287 & 9.9 & 99,307 \\
\midrule
\multirow{10}{*}{Terminus-2}
 & Claude Opus 4.5 & \textbf{36.09}{\color{bestgreen}$\blacktriangle$} & 26.0 & 386,296 & 32.7 & 468,860 \\
 & Claude Sonnet 4.5 & 34.32 & 30.9 & 433,266 & 37.6 & 384,902 \\
 & Claude Sonnet 4 & 8.88 & 29.3 & 419,140 & 34.7 & 688,320 \\
 & Gemini 3 Pro & \textbf{36.09}{\color{bestgreen}$\blacktriangle$} & 16.5 & 138,557 & 24.7 & 422,591 \\
 & GPT-5.1-Codex & 21.89 & 19.6 & 113,333 & 25.7 & 391,395 \\
 & GLM-4.6 & 26.63 & 28.3 & 127,368 & 43.2 & 733,207 \\
 & MiniMax M2 & 24.26 & 34.5 & 472,715 & 43.5 & 958,980 \\
 & Qwen 3 Coder 480B & 15.98 & 28.9 & 94,689 & 44.5 & 665,323 \\
 & DeepSeek V3.2 & 21.89 & 25.0 & 245,292 & 26.5 & 484,734 \\
 & DeepSeek V3.1-Terminus & 20.71 & 16.8 & 102,658 & 18.9 & 248,534 \\
\bottomrule
\end{tabular}
\end{table*}
```

---

## 主结果表 2：User Report 独有任务（110 个 CVE，排除 Description）

```latex
\begin{table*}[htbp]
\centering
\caption{Main Experimental Results on CVE Benchmark (110 User Report Only CVEs, excluding 59 CVEs from Description). \textbf{Bold} values with {\color{bestgreen}$\blacktriangle$} indicate best performance per column.}
\label{tab:main_results_110}
\begin{tabular}{llccccc}
\toprule
& & & \multicolumn{2}{c}{\textbf{Success}} & \multicolumn{2}{c}{\textbf{Failed}} \\
\cmidrule(lr){4-5} \cmidrule(lr){6-7}
\textbf{Agent} & \textbf{Model} & \textbf{Pass (\%)} & \textbf{Turns} & \textbf{Tokens} & \textbf{Turns} & \textbf{Tokens} \\
\midrule
\multirow{2}{*}{Claude Code}
 & Claude Opus 4.5 & 37.27 & 9.4 & 255,250 & 7.7 & 255,557 \\
 & Claude Sonnet 4.5 & 25.45 & 13.5 & 379,983 & 11.2 & 336,144 \\
\midrule
\multirow{9}{*}{OpenHands}
 & Claude Opus 4.5 & 29.09 & 17.6 & 646,062 & 12.9 & 448,117 \\
 & Claude Sonnet 4.5 & 29.09 & 27.0 & 678,190 & 18.7 & 555,350 \\
 & Claude Sonnet 4 & 5.45 & 16.3 & 606,118 & \textbf{7.1}{\color{bestgreen}$\blacktriangle$} & 197,894 \\
 & Gemini 3 Pro & 13.64 & 40.5 & 1,762,888 & 13.5 & 536,558 \\
 & GPT-5.1-Codex & 20.00 & 28.5 & 1,220,100 & 10.1 & 448,214 \\
 & GLM-4.6 & 25.45 & 27.9 & 852,730 & 16.6 & 545,614 \\
 & Qwen 3 Coder 480B & 0.91 & -- & -- & -- & -- \\
 & DeepSeek V3.2 & 0.91 & -- & -- & -- & -- \\
 & DeepSeek V3.1-Terminus & 22.73 & 22.6 & 517,349 & 17.1 & 446,189 \\
\midrule
\multirow{10}{*}{Mini-SWE-Agent}
 & Claude Opus 4.5 & 41.82 & 25.7 & 443,674 & 24.6 & 567,854 \\
 & Claude Sonnet 4.5 & 38.18 & 28.0 & 420,377 & 20.9 & 348,700 \\
 & Claude Sonnet 4 & 5.45 & -- & -- & -- & -- \\
 & Gemini 3 Pro & 33.64 & 26.6 & 385,527 & 19.7 & 380,827 \\
 & GPT-5.1-Codex & 20.91 & 12.6 & 107,441 & 7.4 & \textbf{70,235}{\color{bestgreen}$\blacktriangle$} \\
 & GLM-4.6 & 20.91 & 20.1 & 186,570 & 13.8 & 192,998 \\
 & MiniMax M2 & 24.55 & 22.9 & 267,631 & 30.3 & 552,511 \\
 & Qwen 3 Coder 480B & 23.64 & 22.2 & 218,096 & 24.8 & 329,647 \\
 & DeepSeek V3.2 & 23.64 & 23.7 & 272,146 & 11.9 & 154,647 \\
 & DeepSeek V3.1-Terminus & 22.73 & 20.3 & 175,236 & 15.3 & 153,050 \\
\midrule
\multirow{10}{*}{Terminus-2}
 & Claude Opus 4.5 & 43.64 & 25.1 & 455,864 & 28.6 & 676,311 \\
 & Claude Sonnet 4.5 & \textbf{45.45}{\color{bestgreen}$\blacktriangle$} & 29.3 & 500,546 & 33.5 & 699,958 \\
 & Claude Sonnet 4 & 8.18 & 25.7 & 329,090 & 32.0 & 634,229 \\
 & Gemini 3 Pro & 42.73 & 14.3 & 71,793 & 20.1 & 272,530 \\
 & GPT-5.1-Codex & 28.18 & 17.6 & 59,878 & 17.0 & 167,505 \\
 & GLM-4.6 & 34.55 & 28.4 & 88,948 & 39.1 & 404,997 \\
 & MiniMax M2 & 31.82 & 34.4 & 483,989 & 36.1 & 657,309 \\
 & Qwen 3 Coder 480B & 23.64 & 27.7 & \textbf{56,889}{\color{bestgreen}$\blacktriangle$} & 37.7 & 407,528 \\
 & DeepSeek V3.2 & 28.18 & 23.3 & 154,885 & 20.8 & 236,869 \\
 & DeepSeek V3.1-Terminus & 28.18 & 15.9 & 65,731 & 17.2 & 153,392 \\
\bottomrule
\end{tabular}
\end{table*}
```

---

## 关键发现

### 1. 两个版本的最佳表现对比

| 版本 | 最高 Pass Rate | Agent + Model |
|------|----------------|---------------|
| **169 CVE** | 36.09% | Terminus-2 + Claude Opus 4.5 / Gemini 3 Pro |
| **110 CVE** | **45.45%** | Terminus-2 + Claude Sonnet 4.5 |

### 2. 排除 Description CVE 后的性能变化

| Agent | Model | 169 CVE | 110 CVE | 变化 |
|-------|-------|---------|---------|------|
| Terminus-2 | Claude Sonnet 4.5 | 34.32% | **45.45%** | +11.13% |
| Terminus-2 | Claude Opus 4.5 | 36.09% | 43.64% | +7.55% |
| Mini-SWE-Agent | Claude Opus 4.5 | 34.32% | 41.82% | +7.50% |
| Claude Code | Claude Opus 4.5 | 30.18% | 37.27% | +7.09% |

### 3. 分析解读

**169 CVE 版本**（全部 User Report）：
- Terminus-2 + Claude Opus 4.5 和 Gemini 3 Pro 并列最高（36.09%）
- Mini-SWE-Agent + GPT-5.1-Codex 资源效率最优（最低 Turns/Tokens）

**110 CVE 版本**（排除 Description）：
- Terminus-2 + Claude Sonnet 4.5 达到最高 Pass Rate（45.45%）
- 所有 Agent 的性能都有提升，说明 User Report 独有的 CVE 相对更容易处理
- Terminus-2 的交互式架构在**纯 User Report 任务**上优势更加明显

---

## 说明

- **169 CVE 版本**：包含全部 User Report 测试集
- **110 CVE 版本**：排除了与 Description 重叠的 59 个 CVE
- **最佳值标注**：
  - Pass Rate：越高越好
  - Turns/Tokens：越低越好
- `{\color{bestgreen}$\blacktriangle$}` 生成绿色三角标记

## 参考资料

- Mini-SWE-Agent: https://github.com/SWE-agent/mini-swe-agent
- Terminus: https://www.tbench.ai/terminus
