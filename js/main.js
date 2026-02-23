// LiveCVEBench Leaderboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();

    // Initialize navbar burger
    initNavbarBurger();

    // Load leaderboard data (this will init timeline after data is loaded)
    loadLeaderboard();

    // Initialize sorting
    initSorting();
});

// Theme toggle functionality
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Apply saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// Navbar burger toggle for mobile
function initNavbarBurger() {
    const burger = document.querySelector('.navbar-burger');
    const menu = document.querySelector('#navMenu');

    if (burger && menu) {
        burger.addEventListener('click', function() {
            burger.classList.toggle('is-active');
            menu.classList.toggle('is-active');
        });
    }
}

// Global state
let allResultsData = {};  // { cve_description: [], user_report: [] }
let allCveData = [];  // All CVEs
let cveDataByType = {};  // { cve_description: [], user_report: [] }
let leaderboardData = [];
let cveData = [];
let currentInstructionType = 'user_report';
let currentSort = { field: 'accuracy', direction: 'desc' };
let currentFilters = {
    model: 'all',
    agent: 'all',
    modelType: 'all',
    agentType: 'all',
    timeline: { type: 'all' }
};

// Full tasks view state
let allTasksData = [];
const TASKS_PER_PAGE = 24;
let tasksCurrentPage = 1;
let tasksFilters = {
    timeline: { type: 'all' },
    difficulty: 'all',
    tag: 'all',
    search: ''
};

// Load leaderboard data from JSON
async function loadLeaderboard() {
    try {
        const [leaderboardResponse, tasksResponse] = await Promise.all([
            fetch('data/leaderboard.json'),
            fetch('data/cve_tasks_summary.json')
        ]);
        const data = await leaderboardResponse.json();
        const tasksSummary = await tasksResponse.json();

        // Store all results by instruction type
        allResultsData = data.results;
        allCveData = data.cves || [];

        // Build date lookup from leaderboard CVEs
        const cveDateMap = {};
        allCveData.forEach(cve => { cveDateMap[cve.id] = cve.date; });

        // Build allTasksData by joining dates
        allTasksData = tasksSummary.map(task => ({
            cve_id: task.cve_id,
            instruction: task.instruction,
            difficulty: task.difficulty,
            tags: task.tags || [],
            date: cveDateMap[task.cve_id] || null
        }));

        // Build CVE data by instruction type
        for (const type of ['cve_description', 'user_report']) {
            const results = allResultsData[type] || [];
            const cveIds = new Set();
            results.forEach(r => {
                Object.keys(r.cve_results || {}).forEach(id => cveIds.add(id));
            });
            cveDataByType[type] = allCveData.filter(cve => cveIds.has(cve.id));
        }

        // Set current data
        leaderboardData = allResultsData[currentInstructionType] || [];
        cveData = cveDataByType[currentInstructionType] || [];

        // Update metadata (guarded — only on pages with these elements)
        const lastUpdatedEl = document.getElementById('lastUpdated');
        const totalCVEsEl = document.getElementById('totalCVEs');
        if (lastUpdatedEl) lastUpdatedEl.textContent = data.metadata.lastUpdated;
        if (totalCVEsEl) totalCVEsEl.textContent = cveData.length;

        // Update stats section (index page)
        updateStats(data);

        // Render top performers preview (index page)
        renderTopPerformers();

        // Render sample tasks (index page)
        renderSampleTasks();

        // Leaderboard page features
        if (document.getElementById('leaderboardBody')) {
            populateFilters();
            initFilters();
            initTimeline();
            renderLeaderboard();
        }

        // Tasks page features (auto-init when on tasks.html)
        if (document.getElementById('fullTasksGrid')) {
            populateTaskFilters();
            initTasksTimeline();
            initTasksFilterListeners();
            tasksCurrentPage = 1;
            renderFullTasks();
        }
    } catch (error) {
        console.error('Failed to load data:', error);
        const tbody = document.getElementById('leaderboardBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="has-text-centered has-text-grey">
                        <i class="fas fa-exclamation-circle"></i> Failed to load leaderboard data
                    </td>
                </tr>
            `;
        }
    }
}

// Update stats section with animated numbers
function updateStats(data) {
    const cveCount = allCveData.length;
    const models = new Set();
    const agents = new Set();

    // Count unique models and agents across all instruction types
    for (const type of ['cve_description', 'user_report']) {
        const results = allResultsData[type] || [];
        results.forEach(r => {
            models.add(r.model);
            agents.add(r.agent);
        });
    }

    // Animate stats
    animateNumber('statCVEs', cveCount);
    animateNumber('statModels', models.size);
    animateNumber('statAgents', agents.size);

    // Update last updated
    const statUpdated = document.getElementById('statUpdated');
    if (statUpdated && data.metadata.lastUpdated) {
        statUpdated.textContent = data.metadata.lastUpdated;
    }
}

// Animate number counting up
function animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 1500;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (target - startValue) * easeOut);

        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

// Render top performers preview
function renderTopPerformers() {
    const container = document.getElementById('performersList');
    if (!container) return;

    // Get top 5 from current instruction type
    const results = leaderboardData
        .map(item => {
            const cveResults = item.cve_results || {};
            const tested = Object.keys(cveResults);
            const success = tested.filter(id => cveResults[id]?.success).length;
            return {
                ...item,
                accuracy: tested.length > 0 ? success / tested.length : 0,
                tested: tested.length
            };
        })
        .filter(item => item.tested > 0)
        .sort((a, b) => b.accuracy - a.accuracy)
        .slice(0, 5);

    if (results.length === 0) {
        container.innerHTML = '<div class="performer-loading">No data available</div>';
        return;
    }

    const html = results.map((item, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? `rank-${rank}` : 'rank-default';
        const accuracyPercent = (item.accuracy * 100).toFixed(1);
        const scoreClass = item.accuracy >= 0.7 ? 'score-high' : item.accuracy >= 0.4 ? 'score-medium' : 'score-low';

        const isOurs = item.model === 'Abacus-CVE';
        const modelLabel = isOurs
            ? `<span class="performer-model">${item.model} <span class="ours-badge"><i class="fas fa-star"></i> Ours</span></span>`
            : `<span class="performer-model">${item.model}</span>`;

        return `
            <div class="performer-item ${isOurs ? 'performer-ours' : ''}">
                <div class="performer-rank ${rankClass}">${rank}</div>
                <div class="performer-info">
                    <div>${modelLabel}</div>
                    <div class="performer-agent">${item.agent}</div>
                </div>
                <div class="performer-accuracy ${scoreClass}">${accuracyPercent}%</div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

// Render a single task card (shared between sample and full views)
function renderTaskCard(task) {
    const difficulty = task.difficulty || 'medium';
    const tags = task.tags || [];
    const firstLine = (task.instruction || '').split('\n').filter(l => l.trim()).slice(0, 3).join(' ');

    const tagsHtml = tags.slice(0, 4).map(tag => `
        <span class="task-tag">
            <i class="fas fa-tag"></i> ${escapeHtml(tag)}
        </span>
    `).join('');

    return `
        <div class="task-card" data-cve-id="${escapeHtml(task.cve_id)}">
            <div class="task-header">
                <span class="task-cve-id">${escapeHtml(task.cve_id)}</span>
                <span class="task-difficulty ${difficulty}">${difficulty}</span>
            </div>
            <div class="task-instruction">${escapeHtml(firstLine)}</div>
            <div class="task-meta">
                ${tagsHtml}
            </div>
            <div class="task-date">
                <i class="fas fa-calendar"></i> ${task.date || 'Unknown date'}
            </div>
        </div>
    `;
}

// Open task detail modal
function openTaskDetail(cveId) {
    const task = allTasksData.find(t => t.cve_id === cveId);
    if (!task) return;

    const modal = document.getElementById('taskDetailModal');
    if (!modal) return;

    // Populate modal content
    document.getElementById('modalCveId').textContent = task.cve_id;
    const diffEl = document.getElementById('modalDifficulty');
    diffEl.textContent = task.difficulty || 'medium';
    diffEl.className = 'task-difficulty ' + (task.difficulty || 'medium');

    document.getElementById('modalDate').textContent = task.date || 'Unknown date';

    // Full instruction with preserved formatting
    const instructionEl = document.getElementById('modalInstruction');
    instructionEl.textContent = task.instruction || 'No instruction available';

    // All tags
    const tagsEl = document.getElementById('modalTags');
    const tags = task.tags || [];
    tagsEl.innerHTML = tags.map(tag => `
        <span class="task-tag">
            <i class="fas fa-tag"></i> ${escapeHtml(tag)}
        </span>
    `).join('');

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
}

// Close task detail modal
function closeTaskDetail() {
    const modal = document.getElementById('taskDetailModal');
    if (modal) {
        modal.classList.remove('is-active');
        document.body.style.overflow = '';
    }
}

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeTaskDetail();
});

// Event delegation for task card clicks
document.addEventListener('click', function(e) {
    const card = e.target.closest('.task-card[data-cve-id]');
    if (card) {
        openTaskDetail(card.dataset.cveId);
    }
});

// Escape HTML to prevent XSS
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Render sample CVE tasks
function renderSampleTasks() {
    const container = document.getElementById('tasksGrid');
    if (!container) return;

    if (allTasksData.length === 0) {
        container.innerHTML = '<div class="task-loading">No CVE data available</div>';
        return;
    }

    // Get random sample of tasks (up to 6)
    const sampleTasks = [...allTasksData]
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);

    container.innerHTML = sampleTasks.map(task => renderTaskCard(task)).join('');
}

// Re-populate filter dropdowns when switching tabs
function repopulateFilters() {
    const modelFilter = document.getElementById('modelFilter');
    const agentFilter = document.getElementById('agentFilter');

    // Clear existing options except "All"
    modelFilter.innerHTML = '<option value="all">All</option>';
    agentFilter.innerHTML = '<option value="all">All</option>';

    // Reset filter values
    currentFilters.model = 'all';
    currentFilters.agent = 'all';

    // Add new options
    const models = [...new Set(leaderboardData.map(item => item.model))].sort();
    const agents = [...new Set(leaderboardData.map(item => item.agent))].sort();

    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelFilter.appendChild(option);
    });

    agents.forEach(agent => {
        const option = document.createElement('option');
        option.value = agent;
        option.textContent = agent;
        agentFilter.appendChild(option);
    });
}

// Populate filter dropdowns with unique values
function populateFilters() {
    const modelFilter = document.getElementById('modelFilter');
    const agentFilter = document.getElementById('agentFilter');
    if (!modelFilter || !agentFilter) return;

    const models = [...new Set(leaderboardData.map(item => item.model))].sort();
    const agents = [...new Set(leaderboardData.map(item => item.agent))].sort();

    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelFilter.appendChild(option);
    });

    agents.forEach(agent => {
        const option = document.createElement('option');
        option.value = agent;
        option.textContent = agent;
        agentFilter.appendChild(option);
    });
}

// Get value for sorting
function getSortValue(item, field) {
    switch (field) {
        case 'rank':
            return item.originalRank;
        case 'model':
            return item.model.toLowerCase();
        case 'agent':
            return item.agent.toLowerCase();
        case 'accuracy':
            return item.accuracy;
        case 'totalCVEs':
            return item.totalCVEs;
        case 'success_turns':
            return item.success.turns;
        case 'success_tokens':
            return item.success.tokens;
        case 'failed_turns':
            return item.failed.turns;
        case 'failed_tokens':
            return item.failed.tokens;
        default:
            return item.accuracy;
    }
}

// Compare function for sorting (handles strings and numbers)
function compareValues(a, b, direction) {
    if (typeof a === 'string' && typeof b === 'string') {
        return direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
    }
    return direction === 'desc' ? b - a : a - b;
}

// Get score class based on accuracy value
function getAccuracyClass(score) {
    if (score >= 0.7) return 'score-high';
    if (score >= 0.4) return 'score-medium';
    return 'score-low';
}

// Get rank badge class
function getRankBadgeClass(rank) {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return 'rank-default';
}

// Format number with commas
function formatNumber(num) {
    return num.toLocaleString();
}

// Format turns/tokens value, show "-" if zero or invalid
function formatValue(value, isTokens = false) {
    // Check for falsy values (0, null, undefined) or NaN
    if (!value || value <= 0 || Number.isNaN(value)) {
        return '-';
    }
    if (isTokens) {
        return formatNumber(Math.round(value));
    }
    return value.toFixed(1);
}

// Get CVEs that match the timeline filter
function getFilteredCVEIds() {
    const timeline = currentFilters.timeline;

    if (timeline.type === 'all') {
        return cveData.map(cve => cve.id);
    }

    return cveData.filter(cve => {
        const cveDate = new Date(cve.date);
        const cveYear = cveDate.getFullYear();

        if (timeline.type === 'year') {
            return cveYear === timeline.year;
        }

        if (timeline.type === 'range') {
            return cveDate >= timeline.startDate && cveDate <= timeline.endDate;
        }

        return true;
    }).map(cve => cve.id);
}

// Update timeline CVE count display
function updateTimelineCVECount() {
    const filteredCVEIds = getFilteredCVEIds();
    const countEl = document.getElementById('timelineCVECount');
    if (countEl) {
        const timeline = currentFilters.timeline;
        let text = '';

        if (timeline.type === 'all') {
            text = `Total ${filteredCVEIds.length} CVEs`;
        } else if (timeline.type === 'year') {
            text = `${filteredCVEIds.length} CVEs in ${timeline.year}`;
        } else if (timeline.type === 'range') {
            const formatDate = (date) => {
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, '0');
                const d = String(date.getDate()).padStart(2, '0');
                return `${y}-${m}-${d}`;
            };
            text = `${filteredCVEIds.length} CVEs from ${formatDate(timeline.startDate)} to ${formatDate(timeline.endDate)}`;
        }

        countEl.textContent = text;
    }
}

// Check if item passes timeline filter
function passesTimelineFilter(item, filteredCVEIds) {
    if (!item.cve_results) {
        return false;
    }

    const itemCVEs = Object.keys(item.cve_results);

    // Check if item has any CVEs in the filtered set
    return itemCVEs.some(cveId => filteredCVEIds.includes(cveId));
}

// Calculate stats for an item based on filtered CVEs
function calculateStats(item, filteredCVEIds) {
    const cveResults = item.cve_results || {};
    const testedCVEs = Object.keys(cveResults).filter(id => filteredCVEIds.includes(id));
    const missingCVEs = filteredCVEIds.filter(id => !cveResults[id]);

    if (testedCVEs.length === 0) {
        return null;
    }

    let successCount = 0;
    let successTurns = 0;
    let successTokens = 0;
    let failedTurns = 0;
    let failedTokens = 0;
    let failedCount = 0;

    testedCVEs.forEach(cveId => {
        const result = cveResults[cveId];
        if (result.success) {
            successCount++;
            successTurns += result.turns;
            successTokens += result.tokens;
        } else {
            failedCount++;
            failedTurns += result.turns;
            failedTokens += result.tokens;
        }
    });

    return {
        accuracy: successCount / testedCVEs.length,
        success: {
            turns: successCount > 0 ? successTurns / successCount : 0,
            tokens: successCount > 0 ? successTokens / successCount : 0
        },
        failed: {
            turns: failedCount > 0 ? failedTurns / failedCount : 0,
            tokens: failedCount > 0 ? failedTokens / failedCount : 0
        },
        totalCVEs: testedCVEs.length,
        missingCVEs: missingCVEs
    };
}

// Render leaderboard table
function renderLeaderboard() {
    const tbody = document.getElementById('leaderboardBody');
    if (!tbody) return;

    // Get filtered CVE IDs
    const filteredCVEIds = getFilteredCVEIds();
    const filteredCVEsEl = document.getElementById('filteredCVEs');
    const totalCVEsHeaderEl = document.getElementById('totalCVEsHeader');
    if (filteredCVEsEl) filteredCVEsEl.textContent = filteredCVEIds.length;
    if (totalCVEsHeaderEl) totalCVEsHeaderEl.textContent = `/ ${filteredCVEIds.length}`;

    // Filter and calculate stats for each item
    let filteredData = leaderboardData
        .filter(item => {
            if (currentFilters.model !== 'all' && item.model !== currentFilters.model) {
                return false;
            }
            if (currentFilters.agent !== 'all' && item.agent !== currentFilters.agent) {
                return false;
            }
            if (currentFilters.modelType !== 'all' && item.modelType !== currentFilters.modelType) {
                return false;
            }
            if (currentFilters.agentType !== 'all' && item.agentType !== currentFilters.agentType) {
                return false;
            }
            if (!passesTimelineFilter(item, filteredCVEIds)) {
                return false;
            }
            return true;
        })
        .map(item => {
            const stats = calculateStats(item, filteredCVEIds);
            return {
                ...item,
                ...stats
            };
        })
        .filter(item => item.accuracy !== undefined);

    // First sort by accuracy (desc), then by success tokens (asc) for tie-breaking
    const byAccuracy = [...filteredData].sort((a, b) => {
        if (b.accuracy !== a.accuracy) {
            return b.accuracy - a.accuracy;
        }
        // Same accuracy: sort by success tokens (lower is better)
        // But 0 (no data) should be at the bottom
        const aTokens = a.success.tokens || Infinity;
        const bTokens = b.success.tokens || Infinity;
        return aTokens - bTokens;
    });

    // Assign ranks with ties (1, 1, 1, 4, 4 style)
    let currentRank = 1;
    byAccuracy.forEach((item, idx) => {
        if (idx === 0) {
            item.originalRank = 1;
        } else {
            const prevItem = byAccuracy[idx - 1];
            if (item.accuracy === prevItem.accuracy) {
                // Same accuracy = same rank
                item.originalRank = prevItem.originalRank;
            } else {
                // Different accuracy = rank is position + 1
                item.originalRank = idx + 1;
            }
        }
    });

    // Then sort by current sort field
    filteredData.sort((a, b) => {
        const aVal = getSortValue(a, currentSort.field);
        const bVal = getSortValue(b, currentSort.field);
        const result = compareValues(aVal, bVal, currentSort.direction);

        // If sorting by accuracy and values are equal, use success tokens as tie-breaker
        if (result === 0 && currentSort.field === 'accuracy') {
            const aTokens = a.success.tokens || Infinity;
            const bTokens = b.success.tokens || Infinity;
            return aTokens - bTokens;  // Lower tokens is better
        }

        return result;
    });

    // Generate HTML
    const html = filteredData.map((item) => {
        const rank = item.originalRank;

        // Build tooltip content
        let tooltipContent;
        if (item.missingCVEs.length === 0) {
            tooltipContent = `<div class="tooltip-content">All ${item.totalCVEs} CVEs tested ✓</div>`;
        } else {
            const missingList = item.missingCVEs.map(cve => `<span>${cve}</span>`).join('');
            const scrollClass = item.missingCVEs.length > 9 ? 'scrollable' : '';
            tooltipContent = `
                <div class="tooltip-content wide ${scrollClass}">
                    <div class="tooltip-title">Missing ${item.missingCVEs.length} CVEs:</div>
                    <div class="tooltip-list">${missingList}</div>
                </div>
            `;
        }

        return `
            <tr>
                <td class="has-text-centered">
                    <span class="rank-badge ${getRankBadgeClass(rank)}">${rank}</span>
                </td>
                <td>
                    <div class="model-name">${item.model}</div>
                    <span class="type-badge type-${item.modelType}">${item.modelType === 'open' ? 'Open' : 'Closed'}</span>
                </td>
                <td>
                    <div class="agent-name">${item.agent}</div>
                    <span class="type-badge type-${item.agentType}">${item.agentType === 'open' ? 'Open' : 'Closed'}</span>
                </td>
                <td class="has-text-centered cve-cell">
                    <div class="tooltip-wrapper">
                        <span class="cve-count">${item.totalCVEs}</span>
                        <span class="cve-missing ${item.missingCVEs.length === 0 ? 'complete' : ''}">
                            ${item.missingCVEs.length === 0 ? '<i class="fas fa-check-circle"></i>' : `<i class="fas fa-exclamation-circle"></i> -${item.missingCVEs.length}`}
                        </span>
                        ${tooltipContent}
                    </div>
                </td>
                <td class="has-text-centered score-cell ${getAccuracyClass(item.accuracy)}">
                    <strong>${(item.accuracy * 100).toFixed(1)}%</strong>
                </td>
                <td class="has-text-centered score-cell">
                    ${formatValue(item.success.turns)}
                </td>
                <td class="has-text-centered score-cell">
                    ${formatValue(item.success.tokens, true)}
                </td>
                <td class="has-text-centered score-cell">
                    ${formatValue(item.failed.turns)}
                </td>
                <td class="has-text-centered score-cell">
                    ${formatValue(item.failed.tokens, true)}
                </td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = html || `
        <tr>
            <td colspan="9" class="has-text-centered has-text-grey">
                No results found matching the filters
            </td>
        </tr>
    `;
}

// Initialize filters
function initFilters() {
    const modelFilter = document.getElementById('modelFilter');
    const agentFilter = document.getElementById('agentFilter');
    const modelTypeFilter = document.getElementById('modelTypeFilter');
    const agentTypeFilter = document.getElementById('agentTypeFilter');

    if (!modelFilter || !agentFilter) return;

    modelFilter.addEventListener('change', function() {
        currentFilters.model = this.value;
        renderLeaderboard();
    });

    agentFilter.addEventListener('change', function() {
        currentFilters.agent = this.value;
        renderLeaderboard();
    });

    modelTypeFilter.addEventListener('change', function() {
        currentFilters.modelType = this.value;
        renderLeaderboard();
    });

    agentTypeFilter.addEventListener('change', function() {
        currentFilters.agentType = this.value;
        renderLeaderboard();
    });
}

// Initialize timeline
function initTimeline() {
    const leaderboardTimeline = document.querySelector('#leaderboard .timeline-filter');
    if (!leaderboardTimeline) return;
    const rangeMin = document.getElementById('rangeMin');
    const rangeMax = document.getElementById('rangeMax');
    const rangeSelected = document.getElementById('rangeSelected');
    const dateStartEl = document.getElementById('dateStart');
    const dateEndEl = document.getElementById('dateEnd');
    const timelineTicks = document.getElementById('timelineTicks');

    // Compute end date from CVE data: last day of the month of the latest CVE
    const minDate = new Date('2025-01-01');
    let maxDate;
    const dates = allCveData.map(c => c.date).filter(Boolean).sort();
    if (dates.length > 0) {
        const latest = new Date(dates[dates.length - 1]);
        maxDate = new Date(latest.getFullYear(), latest.getMonth() + 1, 0); // last day of that month
    } else {
        maxDate = new Date('2025-12-31');
    }
    const totalDays = Math.floor((maxDate - minDate) / (1000 * 60 * 60 * 24));

    rangeMin.max = totalDays;
    rangeMax.max = totalDays;
    rangeMin.value = 0;
    rangeMax.value = totalDays;

    // Generate tick marks for 1st of each month within range
    function generateTicks() {
        let html = '';
        const startMonth = minDate.getMonth();
        const endMonth = maxDate.getMonth() + (maxDate.getFullYear() - minDate.getFullYear()) * 12;
        for (let m = startMonth; m <= endMonth; m++) {
            const tickDate = new Date(2025, m, 1);
            if (tickDate < minDate || tickDate > maxDate) continue;
            const daysSinceStart = Math.floor((tickDate - minDate) / (1000 * 60 * 60 * 24));
            const percent = daysSinceStart / totalDays;
            const position = `calc(10px + ${percent * 100}% - ${percent * 20}px)`;
            const label = `${tickDate.getMonth() + 1}/1`;
            html += `<span class="timeline-tick" style="left: ${position}">${label}</span>`;
        }
        // End tick
        const endPosition = `calc(10px + 100% - 20px)`;
        const em = maxDate.getMonth() + 1;
        const ed = maxDate.getDate();
        html += `<span class="timeline-tick" style="left: ${endPosition}">${em}/${ed}</span>`;
        timelineTicks.innerHTML = html;
    }

    generateTicks();

    function valueToDate(value) {
        return new Date(minDate.getTime() + Math.floor(value) * 24 * 60 * 60 * 1000);
    }

    function formatDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function updateRangeSlider() {
        const minVal = parseInt(rangeMin.value);
        const maxVal = parseInt(rangeMax.value);
        const minPercent = (minVal / totalDays) * 100;
        const maxPercent = (maxVal / totalDays) * 100;

        rangeSelected.style.left = minPercent + '%';
        rangeSelected.style.width = (maxPercent - minPercent) + '%';

        const startDate = valueToDate(minVal);
        const endDate = valueToDate(maxVal);

        dateStartEl.textContent = formatDate(startDate);
        dateEndEl.textContent = formatDate(endDate);

        dateStartEl.style.left = minPercent + '%';
        dateStartEl.style.transform = 'translateX(-50%)';
        dateEndEl.style.left = maxPercent + '%';
        dateEndEl.style.right = 'auto';
        dateEndEl.style.transform = 'translateX(-50%)';

        currentFilters.timeline = {
            type: 'range',
            startDate: startDate,
            endDate: endDate
        };

        updateTimelineCVECount();
        renderLeaderboard();
    }

    rangeMin.addEventListener('input', function() {
        if (parseInt(rangeMin.value) > parseInt(rangeMax.value)) {
            rangeMin.value = rangeMax.value;
        }
        updateRangeSlider();
    });

    rangeMax.addEventListener('input', function() {
        if (parseInt(rangeMax.value) < parseInt(rangeMin.value)) {
            rangeMax.value = rangeMin.value;
        }
        updateRangeSlider();
    });

    // Initialize: full range selected
    updateRangeSlider();
}

// Initialize sorting
function initSorting() {
    const sortableHeaders = document.querySelectorAll('.sortable');
    if (sortableHeaders.length === 0) return;

    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const field = this.dataset.sort;

            // Update sort direction
            if (currentSort.field === field) {
                currentSort.direction = currentSort.direction === 'desc' ? 'asc' : 'desc';
            } else {
                currentSort.field = field;
                currentSort.direction = 'desc';
            }

            // Update header styles
            sortableHeaders.forEach(h => {
                h.classList.remove('active');
                h.querySelector('i').className = 'fas fa-sort';
            });

            this.classList.add('active');
            this.querySelector('i').className = currentSort.direction === 'desc'
                ? 'fas fa-sort-down'
                : 'fas fa-sort-up';

            // Re-render
            renderLeaderboard();
        });
    });
}

// Populate tag dropdown from data
function populateTaskFilters() {
    const tagFilter = document.getElementById('tasksTagFilter');
    if (!tagFilter || tagFilter.options.length > 1) return; // already populated

    const allTags = new Set();
    allTasksData.forEach(task => {
        (task.tags || []).forEach(tag => allTags.add(tag));
    });

    [...allTags].sort().forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
}

// Initialize tasks timeline (isolated from leaderboard timeline)
let tasksTimelineInitialized = false;
function initTasksTimeline() {
    if (tasksTimelineInitialized) return;
    tasksTimelineInitialized = true;

    const rangeMin = document.getElementById('tasksRangeMin');
    const rangeMax = document.getElementById('tasksRangeMax');
    const rangeSelected = document.getElementById('tasksRangeSelected');
    const dateStartEl = document.getElementById('tasksDateStart');
    const dateEndEl = document.getElementById('tasksDateEnd');
    const timelineTicks = document.getElementById('tasksTimelineTicks');

    // Compute end date from tasks data: last day of the month of the latest task
    const minDate = new Date('2025-01-01');
    let maxDate;
    const dates = allTasksData.map(t => t.date).filter(Boolean).sort();
    if (dates.length > 0) {
        const latest = new Date(dates[dates.length - 1]);
        maxDate = new Date(latest.getFullYear(), latest.getMonth() + 1, 0);
    } else {
        maxDate = new Date('2025-12-31');
    }
    const totalDays = Math.floor((maxDate - minDate) / (1000 * 60 * 60 * 24));

    rangeMin.max = totalDays;
    rangeMax.max = totalDays;
    rangeMin.value = 0;
    rangeMax.value = totalDays;

    // Generate tick marks
    function generateTicks() {
        let html = '';
        const endMonth = maxDate.getMonth() + (maxDate.getFullYear() - minDate.getFullYear()) * 12;
        for (let m = 0; m <= endMonth; m++) {
            const tickDate = new Date(2025, m, 1);
            if (tickDate > maxDate) continue;
            const daysSinceStart = Math.floor((tickDate - minDate) / (1000 * 60 * 60 * 24));
            const percent = daysSinceStart / totalDays;
            const position = `calc(10px + ${percent * 100}% - ${percent * 20}px)`;
            html += `<span class="timeline-tick" style="left: ${position}">${tickDate.getMonth() + 1}/1</span>`;
        }
        const endPosition = `calc(10px + 100% - 20px)`;
        const em = maxDate.getMonth() + 1;
        const ed = maxDate.getDate();
        html += `<span class="timeline-tick" style="left: ${endPosition}">${em}/${ed}</span>`;
        timelineTicks.innerHTML = html;
    }

    generateTicks();

    function valueToDate(value) {
        return new Date(minDate.getTime() + Math.floor(value) * 24 * 60 * 60 * 1000);
    }

    function formatDateStr(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function updateRangeSlider() {
        const minVal = parseInt(rangeMin.value);
        const maxVal = parseInt(rangeMax.value);
        const minPercent = (minVal / totalDays) * 100;
        const maxPercent = (maxVal / totalDays) * 100;

        rangeSelected.style.left = minPercent + '%';
        rangeSelected.style.width = (maxPercent - minPercent) + '%';

        const startDate = valueToDate(minVal);
        const endDate = valueToDate(maxVal);

        dateStartEl.textContent = formatDateStr(startDate);
        dateEndEl.textContent = formatDateStr(endDate);

        dateStartEl.style.left = minPercent + '%';
        dateStartEl.style.transform = 'translateX(-50%)';
        dateEndEl.style.left = maxPercent + '%';
        dateEndEl.style.right = 'auto';
        dateEndEl.style.transform = 'translateX(-50%)';

        tasksFilters.timeline = {
            type: 'range',
            startDate: startDate,
            endDate: endDate
        };

        tasksCurrentPage = 1;
        renderFullTasks();
    }

    rangeMin.addEventListener('input', function() {
        if (parseInt(rangeMin.value) > parseInt(rangeMax.value)) {
            rangeMin.value = rangeMax.value;
        }
        updateRangeSlider();
    });

    rangeMax.addEventListener('input', function() {
        if (parseInt(rangeMax.value) < parseInt(rangeMin.value)) {
            rangeMax.value = rangeMin.value;
        }
        updateRangeSlider();
    });

    // Initialize: full range selected
    updateRangeSlider();
}

// Initialize task filter listeners
let tasksFilterListenersInitialized = false;
function initTasksFilterListeners() {
    if (tasksFilterListenersInitialized) return;
    tasksFilterListenersInitialized = true;

    const difficultyFilter = document.getElementById('tasksDifficultyFilter');
    const tagFilter = document.getElementById('tasksTagFilter');
    const searchInput = document.getElementById('tasksSearchInput');

    difficultyFilter.addEventListener('change', function() {
        tasksFilters.difficulty = this.value;
        tasksCurrentPage = 1;
        renderFullTasks();
    });

    tagFilter.addEventListener('change', function() {
        tasksFilters.tag = this.value;
        tasksCurrentPage = 1;
        renderFullTasks();
    });

    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            tasksFilters.search = this.value.trim().toLowerCase();
            tasksCurrentPage = 1;
            renderFullTasks();
        }, 300);
    });
}

// Get filtered tasks based on all active filters
function getFilteredTasks() {
    return allTasksData.filter(task => {
        // Timeline filter
        if (tasksFilters.timeline.type === 'range' && task.date) {
            const taskDate = new Date(task.date);
            if (taskDate < tasksFilters.timeline.startDate || taskDate > tasksFilters.timeline.endDate) {
                return false;
            }
        }

        // Difficulty filter
        if (tasksFilters.difficulty !== 'all' && task.difficulty !== tasksFilters.difficulty) {
            return false;
        }

        // Tag filter
        if (tasksFilters.tag !== 'all' && !(task.tags || []).includes(tasksFilters.tag)) {
            return false;
        }

        // Search filter
        if (tasksFilters.search) {
            const query = tasksFilters.search;
            const matchesCveId = task.cve_id.toLowerCase().includes(query);
            const matchesInstruction = (task.instruction || '').toLowerCase().includes(query);
            if (!matchesCveId && !matchesInstruction) {
                return false;
            }
        }

        return true;
    });
}

// Render full tasks grid with pagination
function renderFullTasks() {
    const container = document.getElementById('fullTasksGrid');
    const countBadge = document.getElementById('tasksCountBadge');
    if (!container) return;

    const filtered = getFilteredTasks();
    const totalPages = Math.max(1, Math.ceil(filtered.length / TASKS_PER_PAGE));

    // Clamp page
    if (tasksCurrentPage > totalPages) tasksCurrentPage = totalPages;

    const startIdx = (tasksCurrentPage - 1) * TASKS_PER_PAGE;
    const pageTasks = filtered.slice(startIdx, startIdx + TASKS_PER_PAGE);

    // Update count badge
    if (countBadge) {
        countBadge.textContent = `${filtered.length} task${filtered.length !== 1 ? 's' : ''}`;
    }

    if (pageTasks.length === 0) {
        container.innerHTML = '<div class="task-loading">No tasks match the current filters</div>';
    } else {
        container.innerHTML = pageTasks.map(task => renderTaskCard(task)).join('');
    }

    renderTasksPagination(totalPages);
}

// Render pagination controls
function renderTasksPagination(totalPages) {
    const container = document.getElementById('tasksPagination');
    if (!container) return;

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '';

    // Prev button
    html += `<button class="pagination-btn" ${tasksCurrentPage === 1 ? 'disabled' : ''} data-page="${tasksCurrentPage - 1}">
        <i class="fas fa-chevron-left"></i>
    </button>`;

    // Page numbers with ellipsis
    const pages = getPaginationPages(tasksCurrentPage, totalPages);
    pages.forEach(p => {
        if (p === '...') {
            html += '<span class="pagination-ellipsis">...</span>';
        } else {
            html += `<button class="pagination-btn ${p === tasksCurrentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
        }
    });

    // Next button
    html += `<button class="pagination-btn" ${tasksCurrentPage === totalPages ? 'disabled' : ''} data-page="${tasksCurrentPage + 1}">
        <i class="fas fa-chevron-right"></i>
    </button>`;

    container.innerHTML = html;

    // Bind click events
    container.querySelectorAll('.pagination-btn:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = parseInt(this.dataset.page);
            if (page >= 1 && page <= totalPages) {
                tasksCurrentPage = page;
                renderFullTasks();
                document.getElementById('full-tasks').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Generate page numbers with ellipsis (e.g., 1 ... 4 5 6 ... 10)
function getPaginationPages(current, total) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = [];
    pages.push(1);

    if (current > 3) {
        pages.push('...');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < total - 2) {
        pages.push('...');
    }

    pages.push(total);
    return pages;
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Citation copy button
document.addEventListener('DOMContentLoaded', function() {
    const copyBtn = document.getElementById('copyCitationBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const code = copyBtn.closest('.citation-block').querySelector('code');
            navigator.clipboard.writeText(code.textContent).then(() => {
                const icon = copyBtn.querySelector('i');
                icon.className = 'fas fa-check';
                setTimeout(() => { icon.className = 'fas fa-copy'; }, 2000);
            });
        });
    }
});

