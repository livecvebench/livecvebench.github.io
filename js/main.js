// LiveCVEBench Leaderboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navbar burger
    initNavbarBurger();

    // Load leaderboard data
    loadLeaderboard();

    // Initialize filters
    initFilters();

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
let leaderboardData = [];
let currentSort = { field: 'average', direction: 'desc' };
let currentFilters = { task: 'all', modelType: 'all' };

// Load leaderboard data from JSON
async function loadLeaderboard() {
    try {
        const response = await fetch('data/leaderboard.json');
        const data = await response.json();

        leaderboardData = data.models;

        // Update metadata
        document.getElementById('lastUpdated').textContent = data.metadata.lastUpdated;
        document.getElementById('totalCVEs').textContent = data.metadata.totalCVEs;

        // Render table
        renderLeaderboard();
    } catch (error) {
        console.error('Failed to load leaderboard data:', error);
        document.getElementById('leaderboardBody').innerHTML = `
            <tr>
                <td colspan="7" class="has-text-centered has-text-grey">
                    <i class="fas fa-exclamation-circle"></i> Failed to load leaderboard data
                </td>
            </tr>
        `;
    }
}

// Calculate average score
function calculateAverage(scores) {
    const values = Object.values(scores);
    return values.reduce((a, b) => a + b, 0) / values.length;
}

// Get score class based on value
function getScoreClass(score) {
    if (score >= 70) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
}

// Get rank badge class
function getRankBadgeClass(rank) {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return 'rank-default';
}

// Render leaderboard table
function renderLeaderboard() {
    const tbody = document.getElementById('leaderboardBody');

    // Filter data
    let filteredData = leaderboardData.filter(model => {
        if (currentFilters.modelType !== 'all' && model.type !== currentFilters.modelType) {
            return false;
        }
        return true;
    });

    // Add average score to each model
    filteredData = filteredData.map(model => ({
        ...model,
        average: calculateAverage(model.scores)
    }));

    // Sort data
    filteredData.sort((a, b) => {
        let aVal, bVal;

        if (currentSort.field === 'average') {
            aVal = a.average;
            bVal = b.average;
        } else {
            aVal = a.scores[currentSort.field];
            bVal = b.scores[currentSort.field];
        }

        return currentSort.direction === 'desc' ? bVal - aVal : aVal - bVal;
    });

    // Generate HTML
    const html = filteredData.map((model, index) => {
        const rank = index + 1;
        const average = model.average;

        return `
            <tr>
                <td class="has-text-centered">
                    <span class="rank-badge ${getRankBadgeClass(rank)}">${rank}</span>
                </td>
                <td>
                    <div class="model-name">${model.name}</div>
                    <div class="model-org">${model.org}</div>
                </td>
                <td class="has-text-centered">
                    <span class="type-badge type-${model.type}">
                        ${model.type === 'open' ? 'Open' : 'Closed'}
                    </span>
                </td>
                <td class="has-text-centered score-cell ${getScoreClass(model.scores.detection)}">
                    ${model.scores.detection.toFixed(1)}
                </td>
                <td class="has-text-centered score-cell ${getScoreClass(model.scores.localization)}">
                    ${model.scores.localization.toFixed(1)}
                </td>
                <td class="has-text-centered score-cell ${getScoreClass(model.scores.patching)}">
                    ${model.scores.patching.toFixed(1)}
                </td>
                <td class="has-text-centered score-cell ${getScoreClass(average)}">
                    <strong>${average.toFixed(1)}</strong>
                </td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = html || `
        <tr>
            <td colspan="7" class="has-text-centered has-text-grey">
                No models found matching the filters
            </td>
        </tr>
    `;
}

// Initialize filters
function initFilters() {
    const taskFilter = document.getElementById('taskFilter');
    const modelTypeFilter = document.getElementById('modelTypeFilter');

    taskFilter.addEventListener('change', function() {
        currentFilters.task = this.value;
        renderLeaderboard();
    });

    modelTypeFilter.addEventListener('change', function() {
        currentFilters.modelType = this.value;
        renderLeaderboard();
    });
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
