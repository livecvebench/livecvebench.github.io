```
\section{LiveCVEbench}

%% 下面展示了我们再LiveCVEBench中，在 Cluade Code，Terminus-2， Mini-SWE-Agent，OpenHands 四个模型上，跨越 10 个模型的测试结果。

\begin{table*}[htbp]
\begin{small}
\centering
\caption{Main Experimental Results on LiveCVEBench. \textbf{Bold} values with {\color{bestgreen}$\blacktriangle$} indicate best performance.}
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
\multirow{11}{*}{Terminus-2}
 & Claude Opus 4.5 & \textbf{42.33}{\color{bestgreen}$\blacktriangle$} & 24.3 & 426,488 & 27.3 & 657,913 \\
 & Claude Sonnet 4.5 & 38.10 & 30.6 & 484,271 & 34.1 & 660,326 \\
 & Claude Sonnet 4 & 23.28 & 32.8 & 534,587 & 37.2 & 681,429 \\
 & Gemini 3 Pro & 29.63 & \textbf{16.8}{\color{bestgreen}$\blacktriangle$} & 237,714 & 21.0 & 366,009 \\
 & GPT-5.1-Codex & 21.16 & 18.3 & \textbf{191,532}{\color{bestgreen}$\blacktriangle$} & \textbf{19.1}{\color{bestgreen}$\blacktriangle$} & \textbf{250,254}{\color{bestgreen}$\blacktriangle$} \\
 & GLM-4.6 & 25.40 & 30.7 & 394,184 & 39.4 & 632,040 \\
 & MiniMax M2 & 30.16 & 41.3 & 700,035 & 46.8 & 984,070 \\
 & Qwen 3 Coder 480B & 19.05 & 34.1 & 407,784 & 46.1 & 730,546 \\
 & DeepSeek V3.2 & 22.75 & 23.4 & 432,778 & 21.7 & 406,347 \\
 & DeepSeek V3.1-Terminus & 23.28 & 17.3 & 217,177 & 19.6 & 302,482 \\
\midrule
\multirow{11}{*}{Mini-SWE-Agent}
 & Claude Opus 4.5 & 41.27 & 40.1 & 798,860 & 43.6 & 1,008,186 \\
 & Claude Sonnet 4.5 & 34.39 & 39.4 & 659,811 & 39.4 & 658,626 \\
 & Claude Sonnet 4 & 20.11 & 29.8 & 340,386 & 37.3 & 559,877 \\
 & Gemini 3 Pro & 27.51 & 29.8 & 432,771 & 31.7 & 564,593 \\
 & GPT-5.1-Codex & 20.11 & 22.5 & 232,122 & 22.5 & 238,922 \\
 & GLM-4.6 & 20.11 & 33.3 & 344,088 & 37.6 & 496,109 \\
 & MiniMax M2 & 24.87 & 42.5 & 551,593 & 55.1 & 850,276 \\
 & Qwen 3 Coder 480B & 19.58 & 39.5 & 480,659 & 45.1 & 578,253 \\
 & DeepSeek V3.2 & 21.16 & 35.2 & 348,645 & 35.6 & 393,126 \\
 & DeepSeek V3.1-Terminus & 24.34 & 30.8 & 282,647 & 32.1 & 328,044 \\
\midrule
 \multirow{6}{*}{OpenHands}
 & Claude Opus 4.5 & 30.16 & 30.8 & 1,069,481 & 28.4 & 1,066,426 \\
 & Claude Sonnet 4.5 & 27.51 & 42.7 & 1,171,678 & 45.6 & 1,393,851 \\
 & Gemini 3 Pro & 14.81 & 46.2 & 1,228,641 & 23.2 & 507,147 \\
 & GPT-5.1-Codex & 12.70 & 31.2 & 597,763 & 38.7 & 898,759 \\
 & GLM-4.6 & 16.93 & 33.6 & 710,058 & 33.2 & 672,933 \\
 & DeepSeek V3.1-Terminus & 18.52 & 38.9 & 951,072 & 40.8 & 996,215 \\
\bottomrule
\end{tabular}
\end{small}
\end{table*}

% CWE 类别结果分析
\subsection{CWE Categories}
%% 我们对12个前沿大语言模型在189个真实CVE漏洞上进行了全面评估，并按通用缺陷枚举(CWE)类型进行分类。分析揭示了不同漏洞类别间显著的性能异质性：聚合成功率从代码注入(CWE-94)的10.8%到OS命令注入(CWE-78)的46.6%不等。值得注意的是，基于注入的漏洞（SQL注入、命令注入）表现出显著更高的修复率(38-47%)，而逻辑依赖型漏洞如访问控制(27.1%)和路径遍历(17.9%)则明显更低。这表明LLM的模式匹配能力对于语法层面的漏洞模式比语义安全推理更为有效。
%% 一个突出的发现是模型容量对复杂漏洞类型的影响效应。Claude Opus 4.5在代码注入任务上达到30.6%的成功率，而Claude Sonnet 4.5——尽管在简单注入类型上表现相当——仅达到4.2%，性能差距达7.3倍。这种差异在内存安全(41.0% vs. 32.7%)和访问控制(44.2% vs. 33.8%)类别中保持一致，表明需要深度代码理解和多步推理的漏洞修复从更大的模型容量中获益尤为显著。
%% 跨平台分析显示，XSS(CWE-79)尽管是测试频率最高的类别(n=850)，但对所有模型仍具挑战性(μ=25.1%, σ=6.2%)，这归因于输出编码的上下文依赖性以及对HTML/JavaScript交互语义进行推理的需求。此外，Agent框架的选择显著影响特定类别的性能：Terminus-2在内存安全漏洞上表现出色(32.7%)，而Claude Code则展现出卓越的XSS检测能力(38.0%)，这表明脚手架设计选择与漏洞语义之间存在非平凡的交互作用。这些发现强调了在自动化漏洞修复系统基准测试中采用CWE分层评估的重要性，并指出代码注入和访问控制是未来模型开发需要重点关注的关键能力缺口。


\begin{table}[htbp]
\caption{Distribution of Programming Languages in the Benchmark}
\label{tab:language-distribution}
\vskip 0.15in
\begin{center}
\begin{small}
\renewcommand{\arraystretch}{0.8}
\begin{tabular}{lrr}
\toprule
\textbf{Language} & \textbf{Count} & \textbf{Percentage} \\
\midrule
PHP & 76 & 25.9\% \\
JavaScript & 53 & 18.0\% \\
Python & 48 & 16.3\% \\
Shell & 44 & 15.0\% \\
C & 25 & 8.5\% \\
TypeScript & 21 & 7.1\% \\
Go & 9 & 3.1\% \\
Java & 6 & 2.0\% \\
C++ & 4 & 1.4\% \\
Ruby & 3 & 1.0\% \\
Rust & 2 & 0.7\% \\
C\# & 1 & 0.3\% \\
Lua & 1 & 0.3\% \\
Erlang & 1 & 0.3\% \\
\midrule
\textbf{Total (unique languages)} & \textbf{14} & -- \\
\bottomrule
\end{tabular}
\end{small}
\end{center}
\vskip -0.1in
\end{table}

%% 代码语言分析
\subsection{}
%% 如表tab:language-distribution，我们分析了数量较多的代码语言表现：PHP，Javascript，Python，C。首先得出反直觉结果，PassRate上 PHP>Python>C
%% 但是我们结合CWE类别进行进一步分析，发现语言与CWE出现强相关，- PHP 有最多的"简单任务"(OS命令注入、SQL注入)，所以整体成功率高- Python 简单任务最少，困难任务比例高，所以成功率低- C 任务主要是"中等"难度的内存安全问题，但模型对C的处理能力有限。

%% AI task 与 Web Task对比
\subsection{}
%% 我们抽取了所有与AI相关的任务，共计包含19个。发现AI/ML相关任务表现显著比其他任务差。其余反而Web任务，LLM效果更好
%% 这是由于 AI 相关的任务新，包含未知的CWE类型，模型训练语料少，没训过。 AI领域成功率低不是因为AI项目本身更难，而是因为AI项目的CWE类型更难。


%% Agent 能力分析
\subsection{Agent Capability}
%% 传统观点认为，更详细的指令和更复杂的工作流设计能够提升Agent的任务完成能力。然而，本研究的实证数据揭示了一个反直觉的现象：系统提示词最短的terminus-2（315词）在整体成功率上超越了提示词最长的openhands（2,400词）达12.1个百分点（27.5% vs 15.4%）。这一发现表明，在当前LLM的能力边界下，**工作流的结构化程度比指令的详尽程度更为重要**。terminus-2采用的JSON结构化输出格式，通过显式的analysis-plan-commands三段式框架，有效降低了模型的输出熵，减少了格式错误和解析失败的可能性。

%% terminus-2的命令批处理机制使其在成功任务上的平均轮次（27.1轮）显著低于mini-swe-agent（35.2轮）和openhands（36.2轮）。这一效率优势在需要多文件探索的CVE任务中尤为明显。以CVE-2025-48866为例，terminus-2在Claude-4.5-Opus上仅需6轮即完成修复，而采用单命令/轮设计的mini-swe-agent则因探索效率不足而失败。**批处理机制通过减少API调用次数，不仅降低了延迟和成本，还减少了中间状态丢失的风险**，从而提升了整体任务成功率。

%% 通过对189个CVE任务的差异化分析，我们发现不同类型的任务存在最优Agent匹配。terminus-2在需要多文件探索和系统性分析的复杂任务（如CVE-2025-23209、CVE-2025-48866）上表现优异，而mini-swe-agent在简单的单文件修复任务（如CVE-2025-9136、CVE-2025-57764）上更为高效。这一发现支持了**"没有万能Agent"的假设**，并为实际应用中的Agent选择提供了指导：应根据任务的预期复杂度选择相应的Agent框架，而非盲目追求功能最全面的Agent。


%% 无仓库的任务分析
\subsection{ }
%% 初步观察显示一个反直觉的发现：Non-GitHub来源的成功率高出14.7个百分点。然而，这种表面优势源于显著的样本偏差，而非仓库特性本身。
%% 

```

