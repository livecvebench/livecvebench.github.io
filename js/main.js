// LiveCVEBench Leaderboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navbar burger
    initNavbarBurger();

    // Load leaderboard data (this will init timeline after data is loaded)
    loadLeaderboard();

    // Initialize sorting
    initSorting();
});

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

// Load leaderboard data from JSON
async function loadLeaderboard() {
    try {
        const response = await fetch('data/leaderboard.json');
        const data = await response.json();

        // Store all results by instruction type
        allResultsData = data.results;
        allCveData = data.cves || [];

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

        // Update metadata
        document.getElementById('lastUpdated').textContent = data.metadata.lastUpdated;
        document.getElementById('totalCVEs').textContent = cveData.length;

        // Initialize tabs
        initTabs();

        // Populate filter dropdowns
        populateFilters();

        // Initialize filters after populating
        initFilters();

        // Initialize timeline (after data is loaded)
        initTimeline();

        // Render table
        renderLeaderboard();
    } catch (error) {
        console.error('Failed to load leaderboard data:', error);
        document.getElementById('leaderboardBody').innerHTML = `
            <tr>
                <td colspan="9" class="has-text-centered has-text-grey">
                    <i class="fas fa-exclamation-circle"></i> Failed to load leaderboard data
                </td>
            </tr>
        `;
    }
}

// Initialize instruction type tabs
function initTabs() {
    const tabs = document.querySelectorAll('.tabs li[data-tab]');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active state
            tabs.forEach(t => t.classList.remove('is-active'));
            this.classList.add('is-active');

            // Switch data source
            currentInstructionType = this.dataset.tab;
            leaderboardData = allResultsData[currentInstructionType] || [];
            cveData = cveDataByType[currentInstructionType] || [];

            // Update total CVE count
            document.getElementById('totalCVEs').textContent = cveData.length;

            // Re-populate filters for new data
            repopulateFilters();

            // Update timeline CVE count
            updateTimelineCVECount();

            // Re-render
            renderLeaderboard();
        });
    });
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
    const models = [...new Set(leaderboardData.map(item => item.model))].sort();
    const agents = [...new Set(leaderboardData.map(item => item.agent))].sort();

    const modelFilter = document.getElementById('modelFilter');
    const agentFilter = document.getElementById('agentFilter');

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

    // Get filtered CVE IDs
    const filteredCVEIds = getFilteredCVEIds();
    document.getElementById('filteredCVEs').textContent = filteredCVEIds.length;
    document.getElementById('totalCVEsHeader').textContent = `/ ${filteredCVEIds.length}`;

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
        return a.success.tokens - b.success.tokens;
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
        return compareValues(aVal, bVal, currentSort.direction);
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
    const timelineButtons = document.querySelectorAll('.timeline-btn');
    const rangeMin = document.getElementById('rangeMin');
    const rangeMax = document.getElementById('rangeMax');
    const rangeSelected = document.getElementById('rangeSelected');
    const dateStartEl = document.getElementById('dateStart');
    const dateEndEl = document.getElementById('dateEnd');
    const timelineTicks = document.getElementById('timelineTicks');

    // 2025 only timeline
    const minDate = new Date('2025-01-01');
    const maxDate = new Date('2025-12-31');
    const totalDays = Math.floor((maxDate - minDate) / (1000 * 60 * 60 * 24));

    // Generate tick marks for 2025 months
    function generateTicks() {
        let html = '';
        for (let month = 0; month < 12; month++) {
            const position = (month / 11) * 100;
            html += `<span class="timeline-tick" style="left: ${position}%">${month + 1}/1</span>`;
        }
        timelineTicks.innerHTML = html;
    }

    generateTicks();

    // Convert slider value (0-100) to date
    function valueToDate(value) {
        const days = Math.floor((value / 100) * totalDays);
        const date = new Date(minDate.getTime() + days * 24 * 60 * 60 * 1000);
        return date;
    }

    // Format date as YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Update range slider visual and filter
    function updateRangeSlider() {
        const minVal = parseInt(rangeMin.value);
        const maxVal = parseInt(rangeMax.value);

        // Calculate percentage positions
        rangeSelected.style.left = minVal + '%';
        rangeSelected.style.width = (maxVal - minVal) + '%';

        // Update date labels position and text
        const startDate = valueToDate(minVal);
        const endDate = valueToDate(maxVal);

        dateStartEl.textContent = formatDate(startDate);
        dateEndEl.textContent = formatDate(endDate);

        // Position labels above the slider thumbs
        dateStartEl.style.left = minVal + '%';
        dateStartEl.style.transform = 'translateX(-50%)';
        dateEndEl.style.left = maxVal + '%';
        dateEndEl.style.right = 'auto';
        dateEndEl.style.transform = 'translateX(-50%)';

        // Update filter
        currentFilters.timeline = {
            type: 'range',
            startDate: startDate,
            endDate: endDate
        };

        updateTimelineCVECount();
        renderLeaderboard();
    }

    // Get the slider container
    const dateRangeSlider = document.querySelector('.date-range-slider');

    // Button clicks
    timelineButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const year = this.dataset.year;

            // Update button states
            timelineButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            if (year === '2025') {
                // Show slider for 2025
                dateRangeSlider.style.display = 'block';

                // Set slider to full 2025 range
                rangeMin.value = 0;
                rangeMax.value = 100;

                updateRangeSlider();
            } else {
                // Hide slider for All/2023/2024
                dateRangeSlider.style.display = 'none';

                // Update filter directly
                if (year === 'all') {
                    currentFilters.timeline = { type: 'all' };
                } else {
                    currentFilters.timeline = { type: 'year', year: parseInt(year) };
                }

                updateTimelineCVECount();
                renderLeaderboard();
            }
        });
    });

    // Range slider events
    rangeMin.addEventListener('input', function() {
        const minVal = parseInt(rangeMin.value);
        const maxVal = parseInt(rangeMax.value);

        if (minVal > maxVal) {
            rangeMin.value = maxVal;
        }

        // Deselect year buttons when manually adjusting
        timelineButtons.forEach(b => b.classList.remove('active'));

        updateRangeSlider();
    });

    rangeMax.addEventListener('input', function() {
        const minVal = parseInt(rangeMin.value);
        const maxVal = parseInt(rangeMax.value);

        if (maxVal < minVal) {
            rangeMax.value = minVal;
        }

        // Deselect year buttons when manually adjusting
        timelineButtons.forEach(b => b.classList.remove('active'));

        updateRangeSlider();
    });

    // Initialize with "All" (not 2025 range)
    currentFilters.timeline = { type: 'all' };
    updateTimelineCVECount();
}

// Initialize sorting
function initSorting() {
    const sortableHeaders = document.querySelectorAll('.sortable');

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

