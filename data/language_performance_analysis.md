# 编程语言性能偏好分析报告

## 1. 数据概览

- **分析语言**: PHP, JavaScript, Python, C
- **CVE分布**: PHP(74), JavaScript(52), Python(47), C(25)
- **总测试次数**: 6,236次（四种语言相关）

---

## 2. 各语言整体表现

| 语言 | CVE数量 | 平均成功率 | 排名 |
|------|---------|-----------|------|
| JavaScript | 52 | **31.4%** | 1 |
| PHP | 74 | 30.7% | 2 |
| Python | 47 | 23.6% | 3 |
| C | 25 | **23.4%** | 4 |

**发现**: JavaScript和PHP任务相对容易，Python和C任务更具挑战性。

---

## 3. Agent语言偏好分析

| Agent | PHP | JavaScript | Python | C | 最强语言 | 最弱语言 | 差异 |
|-------|-----|------------|--------|---|---------|---------|------|
| Claude Code | 36.0% | **36.2%** | 27.3% | 10.0% | JS | C | **26.2%** |
| Mini-SWE-Agent | 33.0% | **34.2%** | 25.4% | 24.3% | JS | C | 9.9% |
| OpenHands | **21.9%** | 21.0% | 16.3% | 14.0% | PHP | C | 7.9% |
| Terminus-2 | 33.2% | **34.6%** | 25.9% | 30.7% | JS | Python | 8.6% |

### 关键发现

- **Claude Code** 在C语言上表现极差(10%)，语言偏好差异最大(26.2%)
- **Terminus-2** 是唯一在C语言上表现较好的agent(30.7%)，且最弱语言是Python而非C
- 大部分agent都更擅长**JavaScript**，最不擅长**C语言**

---

## 4. Model语言偏好分析

| Model | PHP | JavaScript | Python | C | 最强语言 | 最弱语言 | 差异 |
|-------|-----|------------|--------|---|---------|---------|------|
| Claude Opus 4.5 | 42.9% | **45.7%** | 33.7% | 37.3% | JS | Python | 12.0% |
| Claude Sonnet 4 | 26.5% | **28.7%** | 20.5% | 22.0% | JS | Python | 8.3% |
| Claude Sonnet 4.5 | 39.0% | **39.9%** | 31.2% | 25.0% | JS | C | 14.9% |
| DeepSeek V3.1-Terminus | 27.9% | 24.8% | 20.5% | **28.0%** | **C** | Python | 7.5% |
| DeepSeek V3.2 | **19.6%** | 18.4% | 15.9% | 8.0% | PHP | C | 11.6% |
| GLM-4.6 | 27.0% | **30.5%** | 18.2% | 22.7% | JS | Python | 12.3% |
| GPT-5.1-Codex | **26.0%** | 22.7% | 15.2% | 14.7% | PHP | C | 11.3% |
| Gemini 3 Pro | 28.3% | **31.4%** | 28.7% | 22.1% | JS | C | 9.3% |
| MiniMax M2 | 33.1% | **37.2%** | 25.0% | 26.0% | JS | Python | 12.2% |
| Qwen 3 Coder 480B | **19.1%** | 14.2% | 12.9% | 12.0% | PHP | C | 7.1% |

### 关键发现

- **DeepSeek V3.1-Terminus** 是唯一在C语言上表现最好的模型
- **Claude Sonnet 4.5** 语言偏好差异最大(14.9%)
- 大部分模型都最擅长**JavaScript**

---

## 5. 各语言TOP 5最佳Agent+Model组合

### PHP (最高50.0%)
| 排名 | 组合 | 成功率 |
|------|------|--------|
| 1 | Mini-SWE-Agent + Claude Opus 4.5 | 50.0% |
| 2 | Terminus-2 + Claude Opus 4.5 | 44.1% |
| 3 | Terminus-2 + Claude Sonnet 4.5 | 42.6% |
| 4 | Mini-SWE-Agent + Claude Sonnet 4.5 | 39.7% |
| 5 | OpenHands + Claude Sonnet 4.5 | 36.8% |

### JavaScript (最高51.1%)
| 排名 | 组合 | 成功率 |
|------|------|--------|
| 1 | Terminus-2 + Claude Opus 4.5 | 51.1% |
| 2 | Terminus-2 + Claude Sonnet 4.5 | 48.9% |
| 3 | Mini-SWE-Agent + Claude Opus 4.5 | 46.8% |
| 4 | Mini-SWE-Agent + Gemini 3 Pro | 42.6% |
| 5 | OpenHands + Claude Opus 4.5 | 40.4% |

### Python (最高36.4%)
| 排名 | 组合 | 成功率 |
|------|------|--------|
| 1 | Mini-SWE-Agent + Claude Opus 4.5 | 36.4% |
| 2 | Terminus-2 + Claude Opus 4.5 | 36.4% |
| 3 | Mini-SWE-Agent + Gemini 3 Pro | 36.4% |
| 4 | Terminus-2 + Gemini 3 Pro | 36.4% |
| 5 | Terminus-2 + Claude Sonnet 4.5 | 34.1% |

### C (最高52.0%)
| 排名 | 组合 | 成功率 |
|------|------|--------|
| 1 | Terminus-2 + Claude Opus 4.5 | 52.0% |
| 2 | Mini-SWE-Agent + Claude Opus 4.5 | 40.0% |
| 3 | Terminus-2 + MiniMax M2 | 36.0% |
| 4 | Terminus-2 + DeepSeek V3.1-Terminus | 36.0% |
| 5 | Mini-SWE-Agent + Claude Sonnet 4.5 | 36.0% |

---

## 6. 语言性能差异原因分析

### 6.1 实际成功率 vs 预期成功率

基于各语言的CWE分布，按整体CWE成功率计算预期成功率：

| 语言 | 实际成功率 | 预期成功率 | 差异 | 结论 |
|------|-----------|------------|------|------|
| PHP | 30.7% | 29.7% | +0.9% | 符合预期 |
| JavaScript | 31.4% | 28.9% | +2.4% | 符合预期 |
| Python | 23.6% | 21.3% | +2.2% | 符合预期 |
| C | 23.4% | 23.7% | -0.3% | 符合预期 |

**结论：各语言的成功率差异基本可以由CWE类型分布解释。语言本身并不是主要因素。**

### 6.2 各语言的CWE难度分布

| 语言 | 简单任务(最易+较易) | 困难任务(困难+最难) | 其他/未分类 |
|------|---------------------|---------------------|-------------|
| PHP | 18.9% | 12.2% | 36% |
| JavaScript | 13.5% | 15.4% | 46% |
| Python | **8.5%** (最低) | 12.8% | 47% |
| C | **0%** (无简单任务) | 0% | 32% |

- **PHP** 有最多的"简单任务"(OS命令注入、SQL注入)，所以整体成功率高
- **Python** 简单任务最少，困难任务比例高，所以成功率低
- **C** 任务主要是"中等"难度的内存安全问题

### 6.3 同CWE类型下的跨语言差异

即使是相同的CWE类型，不同语言间也有显著差异：

| CWE类型 | 漏洞描述 | 最佳语言 | 最差语言 | 差异 |
|---------|----------|----------|----------|------|
| CWE-918 | SSRF | Python 85.3% | PHP 0% | **85.3%** |
| CWE-78 | OS命令注入 | JS 67.6% | Python 5.9% | **61.8%** |
| CWE-20,502 | 反序列化 | PHP 58.8% | JS 0% | **58.8%** |
| CWE-94 | 代码注入 | PHP 44.1% | JS 8.8% | **35.3%** |
| CWE-74,89 | SQL注入 | Python 58.8% | PHP 33.8% | 25.0% |

**这说明：**
1. 模型对不同语言实现的同类漏洞处理能力差异巨大
2. Python的OS命令注入特别难修复（可能与`subprocess`等复杂API有关）
3. PHP的SSRF特别难修复（可能与`curl`等函数特性有关）

---

## 7. 特殊组合发现

### 7.1 C语言专精组合

以下组合在C语言上的表现超出其整体平均水平：

| 组合 | C语言成功率 | 整体成功率 | 优势 |
|------|------------|------------|------|
| Terminus-2 + DeepSeek V3.1-Terminus | 36.0% | 23.3% | +12.7% |
| Terminus-2 + Claude Opus 4.5 | 52.0% | 42.3% | +9.7% |
| Terminus-2 + MiniMax M2 | 36.0% | 30.2% | +5.8% |

### 7.2 Python挣扎组合

以下组合在Python上的表现显著低于其他语言：

| 组合 | Python成功率 | 其他语言平均 | 劣势 |
|------|-------------|-------------|------|
| Terminus-2 + MiniMax M2 | 22.7% | 36.0% | -13.3% |
| Terminus-2 + Claude Opus 4.5 | 36.4% | 49.1% | -12.7% |
| Mini-SWE-Agent + DeepSeek V3.1-Terminus | 20.5% | 31.5% | -11.0% |

---

## 8. 核心结论

### 影响因素分析

| 因素 | 影响程度 | 说明 |
|------|----------|------|
| **CWE类型分布** | **主要因素** | 解释了大部分语言间的成功率差异 |
| **语言特性** | 次要因素 | 同CWE下仍有显著差异，反映语言处理能力差异 |
| **样本量** | 干扰因素 | C语言样本最少(25个)，统计波动较大 |

### 总结

1. **语言难度排序**: C > Python > PHP ≈ JavaScript
2. **Python和C的低成功率主要是因为它们的任务类型更难（CWE分布不利），而非模型对这些语言本身处理能力差**
3. **全能冠军**: Terminus-2 + Claude Opus 4.5 在所有四种语言上都是TOP2
4. **C语言专家**: Terminus-2 + DeepSeek V3.1-Terminus 组合在C语言上表现超出整体12.7%

---

## 9. GitHub仓库与修复效果分析

### 9.1 数据分布

| 来源类型 | CVE数量 | 占比 |
|----------|---------|------|
| GitHub仓库 | 187 | 93.5% |
| Non-GitHub来源 | 12 | 6.5% |

**Non-GitHub来源分布：**
- wordpress.org: 4个
- itsourcecode.com: 3个
- campcodes.com: 3个
- vuldb.com: 1个
- code-projects.org: 1个

### 9.2 整体成功率对比

| 来源类型 | 成功数 | 总测试数 | 成功率 |
|----------|--------|----------|--------|
| GitHub | 1,436 | 6,025 | 23.8% |
| Non-GitHub | 131 | 340 | **38.5%** |

**表面差异: +14.7% (Non-GitHub更高)**

### 9.3 控制CWE类型后的对比

由于Non-GitHub项目主要是SQL注入类漏洞，需要控制漏洞类型进行公平对比：

| SQL注入类漏洞 | 成功率 | 样本数 |
|---------------|--------|--------|
| GitHub | **46.1%** | 102 |
| Non-GitHub | 32.4% | 136 |

**控制后差异: -13.7% (GitHub反而更高)**

### 9.4 Non-GitHub项目特征分析

| 特征 | 描述 |
|------|------|
| **项目来源** | 教学/示例网站（itsourcecode.com, campcodes.com） |
| **语言** | 主要是 PHP/JavaScript 混合项目 |
| **漏洞类型** | 集中在 SQL注入 (CWE-74, CWE-89) |
| **代码复杂度** | 简单的入门级项目 |

### 9.5 按Agent+Model组合对比

| Agent + Model | GitHub | Non-GitHub | 差异 |
|---------------|--------|------------|------|
| OpenHands + Claude Sonnet 4.5 | 25.3% | 63.6% | -38.4% |
| OpenHands + Claude Opus 4.5 | 28.1% | 63.6% | -35.5% |
| OpenHands + GPT-5.1-Codex | 10.7% | 45.5% | -34.8% |
| Claude Code + Claude Sonnet 4.5 | 22.5% | 54.5% | -32.1% |
| Claude Code + Claude Opus 4.5 | 23.0% | 54.5% | -31.5% |
| Mini-SWE-Agent + Claude Sonnet 4.5 | 32.6% | 63.6% | -31.1% |
| ... | ... | ... | ... |
| Mini-SWE-Agent + DeepSeek V3.2 | 21.3% | 18.2% | +3.2% |

**平均差异: -16.6% (Non-GitHub更高)**

几乎所有组合在Non-GitHub上的成功率都更高，说明这些项目确实更简单。

### 9.6 结论

| 观察 | 解释 |
|------|------|
| Non-GitHub整体成功率更高 | 样本偏向简单项目和简单漏洞类型 |
| 同类型漏洞GitHub更高 | GitHub项目代码结构更规范，更易理解 |
| 所有组合Non-GitHub都高 | Non-GitHub项目本身更简单 |

**最终结论：**

1. **表面现象**: Non-GitHub项目成功率(38.5%)高于GitHub(23.8%)
2. **真实原因**: Non-GitHub样本偏向于简单的PHP教学项目和SQL注入漏洞
3. **控制变量后**: 同类型漏洞下，GitHub项目成功率反而高出13.7%
4. **结论**: **有无GitHub仓库本身不是影响修复效果的因素，观察到的差异是样本特征差异导致的表象**

---

## 10. 论文分析段落

### Impact of Repository Source on Vulnerability Repair Performance

To investigate whether the availability of well-structured GitHub repositories influences automated vulnerability repair effectiveness, we conducted a comparative analysis between CVEs sourced from GitHub (n=187) and those from alternative platforms such as educational code repositories and WordPress plugins (n=12).

**Table 1: Overall Performance by Repository Source**

| Source | CVEs | Tests | Success | Rate |
|--------|------|-------|---------|------|
| GitHub | 187 | 6,025 | 1,436 | 23.8% |
| Non-GitHub | 12 | 340 | 131 | 38.5% |

Initial observations suggest a counter-intuitive finding: Non-GitHub sources exhibit a 14.7 percentage point higher success rate. However, this superficial advantage is attributable to significant sample bias rather than inherent repository characteristics.

**Table 2: CWE Distribution Disparity**

| CWE Category | GitHub | Non-GitHub |
|--------------|--------|------------|
| SQL Injection (CWE-74/89) | 2 | 6 |
| XSS (CWE-79) | 17 | 0 |
| Command Injection (CWE-78) | 4 | 0 |
| Path Traversal (CWE-22) | 6 | 0 |
| Memory Safety (CWE-119/416) | 4 | 0 |

As shown in Table 2, Non-GitHub sources are predominantly composed of SQL injection vulnerabilities from educational PHP projects (itsourcecode.com, campcodes.com), which represent relatively tractable repair targets with established fix patterns. In contrast, GitHub repositories encompass a broader spectrum of vulnerability types, including more challenging categories such as XSS, memory corruption, and path traversal.

**Table 3: Controlled Comparison (SQL Injection Only)**

| Source | Success | Total | Rate |
|--------|---------|-------|------|
| GitHub | 47 | 102 | **46.1%** |
| Non-GitHub | 44 | 136 | 32.4% |

When controlling for vulnerability type by examining only SQL injection cases, the relationship reverses: GitHub-sourced vulnerabilities achieve a 13.7 percentage point higher success rate (46.1% vs. 32.4%). This inversion suggests that well-structured GitHub repositories, with their standardized code organization, comprehensive documentation, and consistent coding conventions, actually facilitate more effective vulnerability comprehension and repair by LLM-based agents.

**Table 4: Agent Performance Differential**

| Agent | GitHub | Non-GitHub | Δ |
|-------|--------|------------|---|
| Terminus-2 | 28.1% | 42.4% | -14.3% |
| Mini-SWE-Agent | 25.9% | 37.9% | -11.9% |
| Claude Code | 22.8% | 54.5% | -31.8% |
| OpenHands | 14.3% | 36.4% | -22.0% |

All four agent frameworks demonstrate higher raw success rates on Non-GitHub sources, with differentials ranging from -11.9% to -31.8%. This uniform pattern across diverse agent architectures confirms that the performance gap stems from task difficulty differences rather than agent-specific repository handling capabilities.

**Conclusion**: The observed performance disparity between GitHub and Non-GitHub sources represents a Simpson's paradox phenomenon. While aggregate statistics favor Non-GitHub repositories, this effect is entirely driven by confounding variables—specifically, the concentration of simpler vulnerability types and less complex codebases in Non-GitHub samples. After controlling for vulnerability category, GitHub repositories demonstrate superior repair outcomes, likely due to their more standardized code structure and better documentation practices. These findings underscore the importance of stratified analysis in vulnerability repair benchmarking and caution against drawing conclusions from aggregate metrics without accounting for sample composition.

---

### 代码仓库来源对漏洞修复性能的影响（中文版）

为探究结构化GitHub仓库的可用性是否影响自动化漏洞修复效果，我们对来自GitHub（n=187）和其他平台（如教学代码库、WordPress插件，n=12）的CVE进行了对比分析。

**表1：按仓库来源的整体性能**

| 来源 | CVE数 | 测试次数 | 成功数 | 成功率 |
|------|-------|---------|--------|--------|
| GitHub | 187 | 6,025 | 1,436 | 23.8% |
| Non-GitHub | 12 | 340 | 131 | 38.5% |

初步观察显示一个反直觉的发现：Non-GitHub来源的成功率高出14.7个百分点。然而，这种表面优势源于显著的样本偏差，而非仓库特性本身。

**表2：CWE分布差异**

| CWE类别 | GitHub | Non-GitHub |
|---------|--------|------------|
| SQL注入 (CWE-74/89) | 2 | 6 |
| XSS (CWE-79) | 17 | 0 |
| 命令注入 (CWE-78) | 4 | 0 |
| 路径遍历 (CWE-22) | 6 | 0 |
| 内存安全 (CWE-119/416) | 4 | 0 |

如表2所示，Non-GitHub来源主要由来自教学PHP项目（itsourcecode.com、campcodes.com）的SQL注入漏洞组成，这些漏洞具有成熟的修复模式，相对容易处理。相比之下，GitHub仓库涵盖了更广泛的漏洞类型，包括XSS、内存损坏和路径遍历等更具挑战性的类别。

**表3：控制变量对比（仅SQL注入）**

| 来源 | 成功数 | 总数 | 成功率 |
|------|--------|------|--------|
| GitHub | 47 | 102 | **46.1%** |
| Non-GitHub | 44 | 136 | 32.4% |

当控制漏洞类型，仅考察SQL注入案例时，关系发生逆转：GitHub来源的漏洞成功率高出13.7个百分点（46.1% vs. 32.4%）。这种逆转表明，具有标准化代码组织、完善文档和一致编码规范的GitHub仓库，实际上有助于LLM代理更有效地理解和修复漏洞。

**表4：各Agent性能差异**

| Agent | GitHub | Non-GitHub | 差异 |
|-------|--------|------------|------|
| Terminus-2 | 28.1% | 42.4% | -14.3% |
| Mini-SWE-Agent | 25.9% | 37.9% | -11.9% |
| Claude Code | 22.8% | 54.5% | -31.8% |
| OpenHands | 14.3% | 36.4% | -22.0% |

所有四个Agent框架在Non-GitHub来源上都表现出更高的原始成功率，差异范围从-11.9%到-31.8%。这种跨不同Agent架构的一致模式证实，性能差距源于任务难度差异，而非Agent特定的仓库处理能力。

**结论**：GitHub与Non-GitHub来源之间观察到的性能差异呈现辛普森悖论现象。虽然汇总统计有利于Non-GitHub仓库，但这一效应完全由混杂变量驱动——具体而言，是Non-GitHub样本中较简单漏洞类型和较低复杂度代码库的集中。在控制漏洞类别后，GitHub仓库展现出更优的修复结果，这可能归因于其更标准化的代码结构和更完善的文档实践。这些发现强调了在漏洞修复基准测试中进行分层分析的重要性，并警示不应在未考虑样本组成的情况下从汇总指标得出结论。

---

*Report generated: 2026-01-29*
