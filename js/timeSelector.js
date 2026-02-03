// Generate year options (from 2025 to current year)
function generateYearOptions() {
    const startYear = 2025;
    const currentYear = new Date().getFullYear();
    let options = '';
    
    // Only show options from 2025 to current year
    const endYear = Math.max(currentYear, startYear);
    for (let year = startYear; year <= endYear; year++) {
        options += `<option value="${year}">${year}</option>`;
    }
    
    return options;
}

// Generate month options
function generateMonthOptions() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 0-based to 1-based
    const selectedYear = parseInt(document.getElementById('yearSelect')?.value || currentYear);
    
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    // If selected year is current year, only show to current month
    // If selected year is 2025, only show from March
    const endMonth = selectedYear === currentYear ? currentMonth : 12;
    const startMonth = selectedYear === 2025 ? 3 : 1;
    
    return months
        .slice(startMonth - 1, endMonth)
        .map((month, index) => 
            `<option value="${index + startMonth}">${month}</option>`
        ).join('');
}

// Initialize time selector
async function initializeTimeSelector() {
    try {
        const header = document.querySelector('header');
        if (!header) {
            throw new Error('Header element not found');
        }

        const container = document.createElement('div');
        container.className = 'time-selector';
        container.innerHTML = `
            <div class="selector-container">
                <div class="selector-group">
                    <label for="yearSelect">Year:</label>
                    <select id="yearSelect">
                        ${generateYearOptions()}
                    </select>
                </div>
                <div class="selector-group">
                    <label for="monthSelect">Month:</label>
                    <select id="monthSelect">
                        ${generateMonthOptions()}
                    </select>
                </div>
                <div class="selector-controls">
                    <button onclick="navigateToPrevious()" class="nav-button">Previous</button>
                    <button onclick="navigateToNext()" class="nav-button">Next</button>
                    <button onclick="navigateToCurrent()" class="current-button">Current</button>
                </div>
            </div>
            <div id="period-display"></div>
        `;
        
        // Insert after header
        header.parentNode.insertBefore(container, header.nextSibling);
        
        // Add event listeners
        const yearSelect = document.getElementById('yearSelect');
        const monthSelect = document.getElementById('monthSelect');
        
        if (!yearSelect || !monthSelect) {
            throw new Error('Time selector elements not found');
        }

        yearSelect.addEventListener('change', () => {
            updateMonthOptions();
            loadRankingData();
        });
        monthSelect.addEventListener('change', () => loadRankingData());
        
        // Set default values
        setDefaultMonth();
        updatePeriodDisplay();
    } catch (error) {
        console.error('Error initializing time selector:', error);
        throw error;
    }
}

// Update month options when year changes
function updateMonthOptions() {
    const monthSelect = document.getElementById('monthSelect');
    if (monthSelect) {
        monthSelect.innerHTML = generateMonthOptions();
        setDefaultMonth();
        updatePeriodDisplay();
    }
}

// Set to default month
function setDefaultMonth() {
    const currentDate = new Date();
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    
    if (yearSelect && monthSelect) {
        yearSelect.value = currentDate.getFullYear();
        monthSelect.value = currentDate.getMonth() + 1;
    }
}

// Update period display
function updatePeriodDisplay() {
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    const display = document.getElementById('period-display');
    
    if (yearSelect && monthSelect && display) {
        const year = yearSelect.value;
        const monthName = monthSelect.options[monthSelect.selectedIndex].text;
        display.textContent = `Currently showing: Rankings for ${monthName} ${year}`;
        display.style.color = 'grey';
        display.style.marginTop = '10px';
        display.style.fontSize = '16px';
    }
}

// Switch to previous month
function navigateToPrevious() {
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    
    if (monthSelect && yearSelect) {
        let month = parseInt(monthSelect.value);
        let year = parseInt(yearSelect.value);
        
        month--;
        if (month < 1) {
            month = 12;
            year--;
        }
        
        monthSelect.value = month;
        yearSelect.value = year;
        loadRankingData();
    }
}

// Switch to next month
function navigateToNext() {
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    
    if (monthSelect && yearSelect) {
        let month = parseInt(monthSelect.value);
        let year = parseInt(yearSelect.value);
        
        month++;
        if (month > 12) {
            month = 1;
            year++;
        }
        
        monthSelect.value = month;
        yearSelect.value = year;
        loadRankingData();
    }
}

// Return to current month
function navigateToCurrent() {
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    
    if (monthSelect && yearSelect) {
        const now = new Date();
        monthSelect.value = now.getMonth() + 1;
        yearSelect.value = now.getFullYear();
        loadRankingData();
    }
}

// Get region from URL
function getRegionFromUrl() {
    const path = window.location.pathname;
    // Support both new and old URL formats
    const match = path.match(/top-(?:dev-tools|productivity-apps|eor|payroll)-(?:services-)?in-(.+)$/);
    return match ? match[1] : '';
}

// Get service type from URL
function getServiceTypeFromUrl() {
    const path = window.location.pathname;
    // Support both new and old URL formats, convert to database format
    let match = path.match(/top-(dev-tools|productivity-apps)-in-/);
    if (match) {
        // Convert URL format to database format
        return match[1] === 'dev-tools' ? 'devTools' : 'productivityApps';
    }
    // Backward compatibility for old format
    match = path.match(/top-(eor|payroll)-services-in-/);
    return match ? match[1] : '';
}

// Load ranking data
async function loadRankingData() {
    const loading = document.getElementById('loading');
    const tbody = document.querySelector('#rankingsTableBody');
    const lastUpdated = document.querySelector('#last-updated span');
    
    try {
        if (loading) loading.style.display = 'block';
        
        const region = getRegionFromUrl();
        const serviceType = getServiceTypeFromUrl();
        const yearSelect = document.getElementById('yearSelect');
        const monthSelect = document.getElementById('monthSelect');
        
        if (!yearSelect || !monthSelect) {
            await initializeTimeSelector();
            yearSelect = document.getElementById('yearSelect');
            monthSelect = document.getElementById('monthSelect');
            if (!yearSelect || !monthSelect) {
                throw new Error('Time selector not initialized');
            }
        }
        
        const year = yearSelect.value;
        const month = monthSelect.value;
        
        // Call backend API
        const response = await fetch(`/api/rankings/${region}/${serviceType}/${year}/${month}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rankings = await response.json();
        
        if (!rankings || !Array.isArray(rankings) || rankings.length === 0) {
            throw new Error('No rankings data available for the selected period');
        }
        
        // Update table
        if (tbody) {
            tbody.innerHTML = '';
            rankings.forEach((item, index) => {
                const row = document.createElement('tr');
                let strengths = [];
                try {
                    strengths = Array.isArray(item.strengths) ? item.strengths : JSON.parse(item.strengths || '[]');
                } catch (e) {
                    console.error('Error parsing strengths:', e);
                    strengths = [];
                }
                
                row.innerHTML = `
                    <td class="rank"><span>${index + 1}</span></td>
                    <td>${item.tool_name || item.company_name || 'N/A'}</td>
                    <td>${item.tool_description || item.description || item.company_description || 'No description available'}</td>
                    <td class="strengths"><ul>${strengths.map(s => `<li>${s}</li>`).join('')}</ul></td>
                    <td><a href="${item.website_link || item.website || '#'}" target="_blank" class="button">Visit Site</a></td>
                `;
                tbody.appendChild(row);
            });
        }
        
        // Update last updated time
        if (lastUpdated) {
            const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            lastUpdated.textContent = `${months[parseInt(month) - 1]} ${year}`;
        }
        
    } catch (error) {
        console.error('Error loading rankings:', error);
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="error-message">
                        Error loading rankings: ${error.message}
                    </td>
                </tr>
            `;
        }
    } finally {
        if (loading) loading.style.display = 'none';
    }
} 