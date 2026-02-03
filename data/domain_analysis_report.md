# Agent+Model 领域表现分析报告

## 概述

本报告分析了不同Agent+Model组合在AI领域和Web领域任务上的表现差异。

- **数据来源**: merged_results_v30.json, AI-Tasks.xlsx
- **总CVE数量**: 189
- **AI相关CVE**: 19个
- **Web相关CVE**: 119个 (PHP, JavaScript, TypeScript, Ruby)
- **Agent+Model组合数**: 34个

---

## 1. AI领域任务分析

### 1.1 核心结论

**大部分 (88.2%) Agent+Model组合在AI任务上表现更差**

| 指标 | 数值 |
|------|------|
| AI任务平均成功率 | 15.50% |
| 非AI任务平均成功率 | 25.78% |
| 平均差异 | -10.28% |

### 1.2 统计分布

| 类别 | 数量 | 占比 |
|------|------|------|
| AI任务表现**更好** | 4 | 11.8% |
| AI任务表现**更差** | 30 | 88.2% |

### 1.3 AI任务表现更好的组合 (4)

| 组合 | AI成功率 | 非AI成功率 | 差异 |
|------|---------|-----------|------|
| DeepSeek V3.2 + OpenHands | 5.3% | 1.8% | +3.5% |
| Qwen 3 Coder 480B + OpenHands | 5.3% | 1.8% | +3.5% |
| Gemini 3 Pro + Terminus-2 | 31.6% | 29.4% | +2.2% |
| Claude Sonnet 4 + Mini-SWE-Agent | 21.1% | 20.0% | +1.1% |

### 1.4 AI任务表现最差的组合 (Top 10)

| 组合 | AI成功率 | 非AI成功率 | 差异 |
|------|---------|-----------|------|
| Claude Opus 4.5 + OpenHands | 10.5% | 32.4% | -21.8% |
| Qwen 3 Coder 480B + Terminus-2 | 0.0% | 21.2% | -21.2% |
| Claude Sonnet 4.5 + Mini-SWE-Agent | 15.8% | 36.5% | -20.7% |
| Claude Opus 4.5 + Mini-SWE-Agent | 26.3% | 42.9% | -16.6% |
| Claude Opus 4.5 + Mini-SWE-Agent | 26.3% | 42.9% | -16.6% |
| GLM-4.6 + Terminus-2 | 10.5% | 27.1% | -16.5% |
| GPT-5.1-Codex + Mini-SWE-Agent | 5.3% | 21.8% | -16.5% |
| MiniMax M2 + Terminus-2 | 15.8% | 31.8% | -16.0% |
| MiniMax M2 + Terminus-2 | 15.8% | 31.8% | -16.0% |
| MiniMax M2 + Mini-SWE-Agent | 10.5% | 26.5% | -15.9% |

---

## 2. Web领域任务分析

### 2.1 核心结论

**大部分 (91.2%) Agent+Model组合在Web任务上表现更好**

| 指标 | 数值 |
|------|------|
| Web任务平均成功率 | 27.94% |
| 非Web任务平均成功率 | 20.08% |
| 平均差异 | +7.86% |

### 2.2 统计分布

| 类别 | 数量 | 占比 |
|------|------|------|
| Web任务表现**更好** | 31 | 91.2% |
| Web任务表现**更差** | 3 | 8.8% |

### 2.3 Web任务表现最好的组合 (Top 10)

| 组合 | Web成功率 | 非Web成功率 | 差异 |
|------|---------|-----------|------|
| Claude Sonnet 4.5 + Claude Code | 31.2% | 14.3% | +17.0% |
| DeepSeek V3.2 + Mini-SWE-Agent | 27.7% | 11.7% | +16.0% |
| MiniMax M2 + Mini-SWE-Agent | 31.2% | 15.6% | +15.7% |
| MiniMax M2 + Mini-SWE-Agent | 31.2% | 15.6% | +15.7% |
| Claude Opus 4.5 + Claude Code | 31.2% | 15.6% | +15.7% |
| GPT-5.1-Codex + OpenHands | 17.9% | 5.2% | +12.7% |
| DeepSeek V3.1-Terminus + Mini-SWE-Agent | 29.5% | 16.9% | +12.6% |
| GLM-4.6 + Terminus-2 | 30.4% | 18.2% | +12.2% |
| Gemini 3 Pro + Mini-SWE-Agent | 32.1% | 20.8% | +11.4% |
| Claude Sonnet 4.5 + OpenHands | 32.1% | 20.8% | +11.4% |

---

## 3. AI vs Web 领域对比

| 领域 | 平均成功率 | vs 整体差异 | 表现更好的组合占比 |
|------|-----------|------------|-------------------|
| **Web任务** | 27.94% | **+3.20%** | 91.2% (31/34) |
| **AI任务** | 15.50% | -9.25% | 11.8% (4/34) |

---

## 4. 完整数据表

| Model | Agent | 整体成功率 | AI成功率 | AI差异 | Web成功率 | Web差异 |
|-------|-------|-----------|---------|--------|----------|---------|
| Claude Opus 4.5 | Terminus-2 | 42.3% | 42.1% | -0.2% | 43.8% | +3.5% |
| Claude Opus 4.5 | Terminus-2 | 42.3% | 42.1% | -0.2% | 43.8% | +3.5% |
| Claude Opus 4.5 | Mini-SWE-Agent | 41.3% | 26.3% | -16.6% | 45.5% | +10.5% |
| Claude Opus 4.5 | Mini-SWE-Agent | 41.3% | 26.3% | -16.6% | 45.5% | +10.5% |
| Claude Sonnet 4.5 | Terminus-2 | 38.1% | 31.6% | -7.2% | 42.0% | +9.5% |
| Claude Sonnet 4.5 | Mini-SWE-Agent | 34.4% | 15.8% | -20.7% | 34.8% | +1.1% |
| MiniMax M2 | Terminus-2 | 30.2% | 15.8% | -16.0% | 32.1% | +4.9% |
| MiniMax M2 | Terminus-2 | 30.2% | 15.8% | -16.0% | 32.1% | +4.9% |
| Claude Opus 4.5 | OpenHands | 30.2% | 10.5% | -21.8% | 30.4% | +0.5% |
| Gemini 3 Pro | Terminus-2 | 29.6% | 31.6% | +2.2% | 30.4% | +1.8% |
| Gemini 3 Pro | Mini-SWE-Agent | 27.5% | 26.3% | -1.3% | 32.1% | +11.4% |
| Claude Sonnet 4.5 | OpenHands | 27.5% | 21.1% | -7.2% | 32.1% | +11.4% |
| GLM-4.6 | Terminus-2 | 25.4% | 10.5% | -16.5% | 30.4% | +12.2% |
| MiniMax M2 | Mini-SWE-Agent | 24.9% | 10.5% | -15.9% | 31.2% | +15.7% |
| MiniMax M2 | Mini-SWE-Agent | 24.9% | 10.5% | -15.9% | 31.2% | +15.7% |
| Claude Opus 4.5 | Claude Code | 24.9% | 15.8% | -10.1% | 31.2% | +15.7% |
| DeepSeek V3.1-Terminus | Mini-SWE-Agent | 24.3% | 10.5% | -15.4% | 29.5% | +12.6% |
| Claude Sonnet 4.5 | Claude Code | 24.3% | 21.1% | -3.7% | 31.2% | +17.0% |
| Claude Sonnet 4 | Terminus-2 | 23.3% | 15.8% | -8.3% | 26.8% | +8.6% |
| DeepSeek V3.1-Terminus | Terminus-2 | 23.3% | 15.8% | -8.3% | 22.3% | -2.4% |
| DeepSeek V3.2 | Terminus-2 | 22.8% | 15.8% | -7.7% | 23.2% | +1.1% |
| DeepSeek V3.2 | Mini-SWE-Agent | 21.2% | 10.5% | -11.8% | 27.7% | +16.0% |
| GPT-5.1-Codex | Terminus-2 | 21.2% | 15.8% | -6.0% | 25.0% | +9.4% |
| Claude Sonnet 4 | Mini-SWE-Agent | 20.1% | 21.1% | +1.1% | 20.5% | +1.1% |
| GLM-4.6 | Mini-SWE-Agent | 20.1% | 10.5% | -10.7% | 22.3% | +5.4% |
| GPT-5.1-Codex | Mini-SWE-Agent | 20.1% | 5.3% | -16.5% | 23.2% | +7.6% |
| Qwen 3 Coder 480B | Mini-SWE-Agent | 19.6% | 5.3% | -15.9% | 24.1% | +11.1% |
| Qwen 3 Coder 480B | Terminus-2 | 19.0% | 0.0% | -21.2% | 22.3% | +8.0% |
| DeepSeek V3.1-Terminus | OpenHands | 18.5% | 5.3% | -14.7% | 22.3% | +9.3% |
| GLM-4.6 | OpenHands | 16.9% | 5.3% | -13.0% | 21.4% | +11.0% |
| Gemini 3 Pro | OpenHands | 14.8% | 5.9% | -10.0% | 17.8% | +8.0% |
| GPT-5.1-Codex | OpenHands | 12.7% | 0.0% | -14.1% | 17.9% | +12.7% |
| DeepSeek V3.2 | OpenHands | 2.1% | 5.3% | +3.5% | 1.8% | -0.8% |
| Qwen 3 Coder 480B | OpenHands | 2.1% | 5.3% | +3.5% | 1.8% | -0.8% |

---

## 5. 分析与结论

### 5.1 为什么AI任务表现更差?

1. **训练数据稀缺**: AI/ML项目相对较新,训练数据中相关代码较少
2. **架构复杂**: AI框架(PyTorch, TensorFlow等)架构复杂,依赖关系难以理解
3. **领域知识要求高**: 需要理解机器学习概念才能正确修复漏洞
4. **代码模式不同**: AI代码的安全漏洞模式与传统Web漏洞差异较大

### 5.2 为什么Web任务表现更好?

1. **训练数据丰富**: Web开发代码在训练数据中占比高
2. **漏洞模式固定**: SQL注入、XSS、路径遍历等漏洞模式相对固定
3. **文档完善**: PHP/JS等语言的安全修复文档和示例丰富
4. **框架熟悉**: Agent对常见Web框架(Laravel, Express等)更熟悉

### 5.3 建议

1. 对于AI/ML相关的漏洞修复任务,需要更专业的Agent或额外的领域知识
2. Web领域任务可以更多依赖自动化Agent完成
3. 未来可以针对AI领域专门训练或微调Agent

---

## 6. CWE类型对领域性能的影响分析

### 6.1 核心发现：领域差异完全由CWE分布解释

| 领域 | 实际成功率 | 预期成功率* | 差异 | 结论 |
|------|-----------|------------|------|------|
| AI | 19.3% | 19.4% | **-0.1%** | 完全符合预期 |
| Web | 28.0% | 27.9% | **+0.0%** | 完全符合预期 |

*预期成功率 = 基于该领域CWE分布，按整体CWE成功率计算的加权平均

**关键结论：AI领域成功率低不是因为AI项目本身更难，而是因为AI项目的CWE类型更难。**

### 6.2 CWE难度分布差异

| 难度等级 | AI领域 | Web领域 | 说明 |
|----------|--------|---------|------|
| Easy (命令注入、SQL注入) | **2.9%** | 11.8% | AI几乎没有简单任务 |
| Medium (XSS、访问控制) | 14.3% | 19.3% | Web略多 |
| Hard (路径遍历、反序列化) | 31.4% | 31.9% | 两者相当 |
| Unknown (未分类) | **51.4%** | 37.0% | AI有大量新型漏洞 |

**分析：**
- AI领域简单任务(Easy CWE)仅占2.9%，而Web领域有11.8%
- AI领域有51.4%的CVE属于未分类的新型漏洞，这些通常更难修复
- 这解释了为什么AI领域整体成功率较低

### 6.3 同CWE类型下的跨领域差异

即使控制CWE类型，不同领域仍存在显著差异：

| CWE类型 | 漏洞描述 | AI成功率 | Web成功率 | 差异 |
|---------|----------|----------|-----------|------|
| CWE-918 | SSRF | **85.3%** | 0% | +85.3% |
| CWE-200,284 | 信息泄露+访问控制 | **38.2%** | 0% | +38.2% |
| CWE-306 | 认证缺失 | **32.4%** | 20.6% | +11.8% |
| CWE-79 | XSS | 17.6% | 19.5% | -1.9% |
| CWE-770 | 资源耗尽 | 8.8% | **17.6%** | -8.8% |
| CWE-190 | 整数溢出 | 0% | **17.6%** | -17.6% |
| CWE-78 | OS命令注入 | 5.9% | **61.7%** | -55.8% |

**发现：**
- Python的SSRF(requests库)比PHP(curl)更容易修复
- Python的命令注入(subprocess)比PHP/JS难修复得多
- 同类型漏洞在不同语言/框架下的修复难度差异巨大

### 6.4 各Agent的领域表现（控制CWE前后）

| Agent | AI成功率 | Web成功率 | 原始差异 | 说明 |
|-------|----------|-----------|----------|------|
| Terminus-2 | 22.8% | 31.2% | -8.4% | CWE分布导致 |
| Mini-SWE-Agent | 20.3% | 30.7% | -10.3% | CWE分布导致 |
| Claude Code | 19.1% | 31.2% | -12.1% | CWE分布导致 |
| OpenHands | 12.6% | 18.2% | -5.6% | CWE分布导致 |

所有Agent在Web领域都表现更好，但这主要是CWE分布导致的，而非Agent对特定领域的偏好。

### 6.5 结论

| 影响因素 | 影响程度 | 说明 |
|----------|----------|------|
| **CWE类型分布** | **主要因素** | 完全解释了AI vs Web的整体差异(19.3% vs 28.0%) |
| **领域/语言特性** | 次要因素 | 同CWE下仍有差异，反映语言/框架特性 |

**AI领域成功率低(19.3% vs 28.0%)的真实原因：**

1. **简单任务占比极低**: Easy CWE仅2.9%（Web有11.8%）
2. **新型漏洞占比高**: 51.4%未分类（Web为37.0%）
3. **不是AI项目本身更难**: 控制CWE后，领域差异消失

**对第5节结论的修正：**

原报告认为AI任务表现差是因为"训练数据稀缺"、"架构复杂"等AI领域特性。实际上，**主要原因是AI项目的漏洞类型分布更难**（缺少简单的SQL注入、命令注入等），而非AI代码本身更难理解。

---

## 7. 论文分析段落

### Impact of Application Domain on Vulnerability Repair Performance

To investigate whether application domain (AI/ML vs. Web) influences automated vulnerability repair effectiveness, we analyzed performance differences between AI-related CVEs (n=35, primarily Python-based ML projects) and Web-related CVEs (n=119, PHP/JavaScript/TypeScript/Ruby applications).

**Table 1: Domain Performance - Actual vs. Expected**

| Domain | Actual Rate | Expected Rate* | Δ |
|--------|-------------|----------------|---|
| AI | 19.3% | 19.4% | -0.1% |
| Web | 28.0% | 27.9% | +0.0% |

*Expected rate calculated as weighted average based on CWE distribution

Initial observations suggest AI-related tasks are substantially more challenging, with success rates 8.7 percentage points lower than Web tasks. However, when controlling for CWE distribution, this difference entirely disappears (Δ < 0.1%), indicating that the performance gap is attributable to vulnerability type composition rather than inherent domain complexity.

**Table 2: CWE Difficulty Distribution by Domain**

| Difficulty | AI Domain | Web Domain |
|------------|-----------|------------|
| Easy (SQLi, Command Injection) | 2.9% | 11.8% |
| Medium (XSS, Access Control) | 14.3% | 19.3% |
| Hard (Path Traversal, Deserialization) | 31.4% | 31.9% |
| Unknown/Novel | 51.4% | 37.0% |

The AI domain exhibits a markedly different CWE profile: only 2.9% of vulnerabilities fall into "easy" categories (compared to 11.8% for Web), while 51.4% remain unclassified—likely representing novel vulnerability patterns in emerging ML frameworks that lack established repair templates.

**Table 3: Cross-Domain Performance for Shared CWE Types**

| CWE | Description | AI | Web | Δ |
|-----|-------------|-----|-----|---|
| CWE-918 | SSRF | 85.3% | 0% | +85.3% |
| CWE-78 | Command Injection | 5.9% | 61.7% | -55.8% |
| CWE-79 | XSS | 17.6% | 19.5% | -1.9% |

Interestingly, when examining identical CWE types across domains, substantial performance variations persist. Python's `subprocess` module proves significantly more challenging to secure than PHP's `exec()` functions (5.9% vs. 61.7% for command injection), while Python's `requests` library is more amenable to SSRF remediation than PHP's `curl` wrappers (85.3% vs. 0%). These findings suggest that language-specific API designs and security patterns significantly influence repair tractability.

**Conclusion**: The observed AI-Web performance gap represents a compositional artifact rather than evidence of domain-specific model limitations. AI projects predominantly feature harder vulnerability categories and novel attack patterns, while Web applications benefit from well-documented injection vulnerabilities with established fix templates. These findings caution against interpreting aggregate domain-level metrics as evidence of fundamental capability differences and highlight the importance of CWE-stratified analysis in vulnerability repair benchmarking.

---

### 应用领域对漏洞修复性能的影响（中文版）

为探究应用领域（AI/ML vs. Web）是否影响自动化漏洞修复效果，我们分析了AI相关CVE（n=35，主要是Python ML项目）与Web相关CVE（n=119，PHP/JavaScript/TypeScript/Ruby应用）之间的性能差异。

**表1：领域性能 - 实际 vs 预期**

| 领域 | 实际成功率 | 预期成功率* | 差异 |
|------|-----------|------------|------|
| AI | 19.3% | 19.4% | -0.1% |
| Web | 28.0% | 27.9% | +0.0% |

*预期成功率基于CWE分布的加权平均计算

初步观察显示AI相关任务明显更具挑战性，成功率比Web任务低8.7个百分点。然而，当控制CWE分布后，这一差异完全消失（Δ < 0.1%），表明性能差距源于漏洞类型组成而非领域固有复杂性。

**表2：按领域划分的CWE难度分布**

| 难度 | AI领域 | Web领域 |
|------|--------|---------|
| 简单 (SQL注入、命令注入) | 2.9% | 11.8% |
| 中等 (XSS、访问控制) | 14.3% | 19.3% |
| 困难 (路径遍历、反序列化) | 31.4% | 31.9% |
| 未知/新型 | 51.4% | 37.0% |

AI领域呈现出明显不同的CWE分布：仅2.9%的漏洞属于"简单"类别（Web为11.8%），而51.4%未被分类——这可能代表新兴ML框架中缺乏成熟修复模板的新型漏洞模式。

**表3：共有CWE类型的跨领域性能**

| CWE | 描述 | AI | Web | 差异 |
|-----|------|-----|-----|------|
| CWE-918 | SSRF | 85.3% | 0% | +85.3% |
| CWE-78 | 命令注入 | 5.9% | 61.7% | -55.8% |
| CWE-79 | XSS | 17.6% | 19.5% | -1.9% |

有趣的是，在检查跨领域的相同CWE类型时，仍存在显著的性能差异。Python的`subprocess`模块比PHP的`exec()`函数更难安全修复（命令注入：5.9% vs 61.7%），而Python的`requests`库比PHP的`curl`封装更易于SSRF修复（85.3% vs 0%）。这些发现表明，语言特定的API设计和安全模式显著影响修复的可行性。

**结论**：观察到的AI-Web性能差距代表的是组成性偏差而非领域特定模型限制的证据。AI项目主要包含更难的漏洞类别和新型攻击模式，而Web应用受益于文档完善的注入漏洞及其成熟的修复模板。这些发现警示不应将领域级聚合指标解读为基本能力差异的证据，并强调了在漏洞修复基准测试中进行CWE分层分析的重要性。

---

*报告生成时间: 2026-01-29*
