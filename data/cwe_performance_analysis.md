# CWE类别模型性能分析报告

## 1. 数据概览

- **测试CVE总数**: 189个独立漏洞
- **测试模型数量**: 12个LLM模型
- **Agent框架**: 4个 (Terminus-2, Mini-SWE-Agent, Claude Code, OpenHands)
- **总测试次数**: 6,399次

---

## 2. 漏洞类别难度排名

| 难度等级 | 漏洞类别 | 成功率 | 样本数 |
|:--------:|----------|:------:|:------:|
| 最易 | OS命令注入 (CWE-78) | 46.6% | 268 |
| 较易 | SQL注入 (CWE-89) | 38.2% | 238 |
| 中等 | 访问控制 (CWE-284/306/862) | 27.1% | 678 |
| 中等 | 内存安全 (CWE-119/125/416/787) | 26.7% | 439 |
| 中等 | XSS (CWE-79) | 25.1% | 850 |
| 较难 | 命令注入 (CWE-77) | 24.3% | 338 |
| 较难 | 反序列化 (CWE-502) | 19.4% | 170 |
| 困难 | 路径遍历 (CWE-22/23/24) | 17.9% | 442 |
| 困难 | 文件上传 (CWE-434) | 17.8% | 135 |
| 困难 | 资源管理 (CWE-400/770) | 16.3% | 270 |
| 最难 | 代码注入 (CWE-94) | 10.8% | 204 |

---

## 3. 顶级模型按漏洞类别性能对比

| 漏洞类别 | Claude Opus 4.5 | Claude Sonnet 4.5 | MiniMax M2 | Gemini 3 Pro | DeepSeek V3.1 |
|----------|:---------------:|:-----------------:|:----------:|:------------:|:-------------:|
| OS命令注入 | 52.1% | 56.2% | 56.2% | 45.0% | 41.7% |
| SQL注入 | 59.5% | **60.7%** | 35.7% | 47.6% | 23.8% |
| XSS | 32.0% | **36.0%** | 34.0% | 18.7% | 20.0% |
| 代码注入 | **30.6%** | 4.2% | 16.7% | 5.6% | 0.0% |
| 路径遍历 | **24.4%** | 17.3% | 23.1% | 20.5% | 17.9% |
| 内存安全 | **41.0%** | 32.7% | 26.9% | 25.0% | 23.1% |
| 访问控制 | **44.2%** | 33.8% | 30.0% | 22.4% | 23.3% |
| SSRF | 27.8% | 25.0% | **33.3%** | **33.3%** | **33.3%** |

---

## 4. Agent框架性能对比

| Agent框架 | 总体成功率 | OS命令注入 | SQL注入 | XSS | 代码注入 | 内存安全 |
|-----------|:----------:|:----------:|:-------:|:---:|:--------:|:--------:|
| **Terminus-2** | **29.0%** | **53.1%** | 42.9% | 26.7% | 18.1% | **32.7%** |
| Mini-SWE-Agent | 26.6% | 46.9% | 33.3% | 30.3% | 8.3% | 30.1% |
| Claude Code | 24.6% | 31.2% | **57.1%** | **38.0%** | **25.0%** | 11.5% |
| OpenHands | 15.6% | 40.0% | 33.9% | 11.5% | 0.0% | 15.8% |

---

## 5. 各类别最佳模型

| 漏洞类别 | 最佳模型 | 成功率 | 样本数 |
|----------|----------|:------:|:------:|
| SQL注入 | Claude Sonnet 4.5 | 60.7% | 28 |
| OS命令注入 | GLM-4.6 | 58.3% | 24 |
| 访问控制 | Claude Opus 4.5 | 44.2% | 120 |
| 内存安全 | Claude Opus 4.5 | 41.0% | 78 |
| XSS | Claude Sonnet 4.5 | 36.0% | 100 |
| 代码注入 | Claude Opus 4.5 | 30.6% | 36 |
| 路径遍历 | Claude Opus 4.5 | 24.4% | 78 |

---

## 6. 核心洞察 (Key Insights)

### Insight 1: 代码注入是区分模型推理能力的关键指标

代码注入(CWE-94)展现了所有漏洞类别中最大的模型间性能差异:
- Claude Opus 4.5: 30.6%
- MiniMax M2: 16.7%
- Claude Sonnet 4.5: **仅4.2%**
- DeepSeek V3.1: 0.0%

这表明代码注入修复需要深层次的代码理解和推理能力，而非简单的模式匹配。较小的模型在此类任务上严重落后。

### Insight 2: XSS是所有模型的普遍性难题

XSS (CWE-79) 拥有最大的测试样本量(850次)，但所有模型的成功率均低于40%:
- 最佳表现: Claude Sonnet 4.5 (36.0%)
- 平均表现: ~25%

原因分析: XSS漏洞高度依赖上下文，需要同时理解HTML结构、JavaScript执行流和用户输入的交互关系。

### Insight 3: 注入类漏洞相对容易修复

SQL注入和OS命令注入是成功率最高的两类漏洞:
- OS命令注入: 46.6%
- SQL注入: 38.2%

这两类漏洞具有相对固定的模式（如字符串拼接、未转义输入），LLM可以通过学习到的安全编码实践进行有效修复。

### Insight 4: 逻辑类漏洞比注入类漏洞更难

访问控制类漏洞(27.1%)的修复难度显著高于注入类漏洞(38.2%):
- 注入类: 模式匹配 + 输入验证
- 访问控制: 需要理解业务逻辑和授权语义

### Insight 5: 模型规模在复杂漏洞上优势显著

Claude Opus 4.5在需要深度推理的漏洞类型上表现最佳:
- 内存安全: 41.0% (领先第二名约8%)
- 访问控制: 44.2%
- 代码注入: 30.6%

这表明更大的模型容量对于理解复杂代码结构和安全语义至关重要。

### Insight 6: Agent框架特性差异显著

- **Terminus-2**: 整体最佳，尤其擅长命令注入和内存安全
- **Claude Code**: 在XSS和SQL注入上表现优异，但内存安全极差(11.5%)
- **OpenHands**: 整体表现最弱，代码注入成功率为0%

---

## 7. 细粒度CWE性能统计

| CWE | 成功数 | 总数 | 成功率 |
|-----|:------:|:----:|:------:|
| CWE-79 | 111 | 578 | 19.2% |
| CWE-22 | 3 | 204 | 1.5% |
| CWE-74, CWE-89 | 69 | 204 | 33.8% |
| CWE-79, CWE-94 | 53 | 170 | 31.2% |
| CWE-78 | 84 | 167 | 50.3% |
| CWE-284, CWE-434 | 49 | 136 | 36.0% |
| CWE-119, CWE-416 | 23 | 136 | 16.9% |
| CWE-770 | 18 | 136 | 13.2% |
| CWE-1321 | 18 | 136 | 13.2% |
| CWE-434 | 24 | 135 | 17.8% |
| CWE-77 | 32 | 134 | 23.9% |
| CWE-400, CWE-770 | 32 | 34 | 94.1% |
| CWE-179 | 27 | 33 | 81.8% |
| CWE-22, CWE-306 | 27 | 34 | 79.4% |
| CWE-611 | 26 | 33 | 78.8% |
| CWE-22, CWE-23 | 26 | 34 | 76.5% |
| CWE-119, CWE-126 | 25 | 34 | 73.5% |

---

## 8. ICML论文分析段落

**Performance Analysis Across CWE Categories**

We conducted a comprehensive evaluation of 12 state-of-the-art large language models across 189 real-world CVEs, categorized by their Common Weakness Enumeration (CWE) types. Our analysis reveals significant performance heterogeneity across vulnerability categories, with aggregate success rates ranging from 10.8% for code injection (CWE-94) to 46.6% for OS command injection (CWE-78). Notably, injection-based vulnerabilities (SQL injection, command injection) exhibit substantially higher repair rates (38-47%) compared to logic-dependent vulnerabilities such as access control (27.1%) and path traversal (17.9%), suggesting that pattern-matching capabilities of LLMs are more effective for syntactic vulnerability patterns than semantic security reasoning.

A striking finding is the model capacity effect on complex vulnerability types. Claude Opus 4.5 achieves 30.6% success on code injection tasks, while Claude Sonnet 4.5—despite comparable performance on simpler injection types—achieves only 4.2%, representing a 7.3× performance gap. This disparity is consistent across memory safety (41.0% vs. 32.7%) and access control (44.2% vs. 33.8%) categories, indicating that vulnerability repair requiring deep code comprehension and multi-step reasoning benefits disproportionately from increased model capacity.

Cross-platform analysis reveals that XSS (CWE-79), despite being the most frequently tested category (n=850), remains challenging for all models (μ=25.1%, σ=6.2%), attributable to the context-dependent nature of output encoding and the need to reason about HTML/JavaScript interaction semantics. Furthermore, agent framework selection significantly impacts category-specific performance: Terminus-2 excels at memory safety vulnerabilities (32.7%) while Claude Code demonstrates superior XSS detection (38.0%), suggesting that scaffolding design choices interact non-trivially with vulnerability semantics. These findings underscore the importance of CWE-stratified evaluation in benchmarking automated vulnerability repair systems and highlight code injection and access control as critical capability gaps for future model development.

---

## 9. ICML论文分析段落（中文版）

**基于CWE类别的性能分析**

我们对12个前沿大语言模型在189个真实CVE漏洞上进行了全面评估，并按通用缺陷枚举(CWE)类型进行分类。分析揭示了不同漏洞类别间显著的性能异质性：聚合成功率从代码注入(CWE-94)的10.8%到OS命令注入(CWE-78)的46.6%不等。值得注意的是，基于注入的漏洞（SQL注入、命令注入）表现出显著更高的修复率(38-47%)，而逻辑依赖型漏洞如访问控制(27.1%)和路径遍历(17.9%)则明显更低。这表明LLM的模式匹配能力对于语法层面的漏洞模式比语义安全推理更为有效。

一个突出的发现是模型容量对复杂漏洞类型的影响效应。Claude Opus 4.5在代码注入任务上达到30.6%的成功率，而Claude Sonnet 4.5——尽管在简单注入类型上表现相当——仅达到4.2%，性能差距达7.3倍。这种差异在内存安全(41.0% vs. 32.7%)和访问控制(44.2% vs. 33.8%)类别中保持一致，表明需要深度代码理解和多步推理的漏洞修复从更大的模型容量中获益尤为显著。

跨平台分析显示，XSS(CWE-79)尽管是测试频率最高的类别(n=850)，但对所有模型仍具挑战性(μ=25.1%, σ=6.2%)，这归因于输出编码的上下文依赖性以及对HTML/JavaScript交互语义进行推理的需求。此外，Agent框架的选择显著影响特定类别的性能：Terminus-2在内存安全漏洞上表现出色(32.7%)，而Claude Code则展现出卓越的XSS检测能力(38.0%)，这表明脚手架设计选择与漏洞语义之间存在非平凡的交互作用。这些发现强调了在自动化漏洞修复系统基准测试中采用CWE分层评估的重要性，并指出代码注入和访问控制是未来模型开发需要重点关注的关键能力缺口。

---

*Report generated: 2026-01-29*
