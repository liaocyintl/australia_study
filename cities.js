let cities = [];

function formatPopulation(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + ' 百万';
    return (n / 10000).toFixed(0) + ' 万';
}

function formatMoney(n) {
    return '$' + n.toLocaleString();
}

function renderCityCards(data) {
    const container = document.getElementById('city-cards');
    container.innerHTML = data.map(city => `
        <div class="city-card">
            <div class="city-card-header">
                <h3>${city.name_zh}<span class="city-en">${city.name_en}</span></h3>
                <span class="state-badge">${city.state}</span>
            </div>
            <div class="city-card-body">
                <div class="city-description">${city.description}</div>
                <div class="city-stats">
                    <div class="city-stat">
                        <span class="stat-icon">👥</span>
                        <div class="stat-content">
                            <div class="stat-label">人口</div>
                            <div class="stat-value">${formatPopulation(city.population)}</div>
                        </div>
                    </div>
                    <div class="city-stat">
                        <span class="stat-icon">💰</span>
                        <div class="stat-content">
                            <div class="stat-label">家庭年收入中位数</div>
                            <div class="stat-value">${formatMoney(city.median_income)}</div>
                        </div>
                    </div>
                    <div class="city-stat">
                        <span class="stat-icon">🏠</span>
                        <div class="stat-content">
                            <div class="stat-label">周租金（一居室）</div>
                            <div class="stat-value">${formatMoney(city.rent_weekly)}/周</div>
                        </div>
                    </div>
                    <div class="city-stat">
                        <span class="stat-icon">🚌</span>
                        <div class="stat-content">
                            <div class="stat-label">月交通费</div>
                            <div class="stat-value">${formatMoney(city.monthly_transport)}/月</div>
                        </div>
                    </div>
                    <div class="city-stat">
                        <span class="stat-icon">🍽️</span>
                        <div class="stat-content">
                            <div class="stat-label">餐厅均价</div>
                            <div class="stat-value">${formatMoney(city.meal_avg)}/餐</div>
                        </div>
                    </div>
                    <div class="city-stat">
                        <span class="stat-icon">🎓</span>
                        <div class="stat-content">
                            <div class="stat-label">大学数量</div>
                            <div class="stat-value">${city.university_count} 所</div>
                        </div>
                    </div>
                </div>
                <div class="city-info-row">
                    <div class="city-info-item">
                        <strong>☀️ 气候：</strong>${city.climate}
                    </div>
                    <div class="city-info-item">
                        <strong>🏭 支柱产业：</strong>
                        <div class="industry-tags">
                            ${city.industries.map(i => `<span class="industry-tag">${i}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderCostTable(data) {
    const container = document.getElementById('cost-compare');
    const maxRent = Math.max(...data.map(c => c.rent_weekly));
    const maxTransport = Math.max(...data.map(c => c.monthly_transport));
    const maxMeal = Math.max(...data.map(c => c.meal_avg));
    const maxIncome = Math.max(...data.map(c => c.median_income));

    const sorted = [...data].sort((a, b) => {
        const costA = a.rent_weekly * 4 + a.monthly_transport + a.meal_avg * 30;
        const costB = b.rent_weekly * 4 + b.monthly_transport + b.meal_avg * 30;
        return costA - costB;
    });

    let html = `<table>
        <thead>
            <tr>
                <th>城市</th>
                <th>周租金</th>
                <th>月交通</th>
                <th>餐均价</th>
                <th>年收入中位数</th>
                <th>月生活成本估算</th>
            </tr>
        </thead>
        <tbody>`;

    sorted.forEach(city => {
        const monthlyCost = city.rent_weekly * 4 + city.monthly_transport + city.meal_avg * 60;
        html += `<tr>
            <td class="city-name-cell">${city.name_zh}</td>
            <td class="bar-cell">
                <div class="cost-bar-wrap">
                    <div class="cost-bar cost-bar-rent" style="width: ${(city.rent_weekly / maxRent) * 100}px"></div>
                    <span class="cost-bar-value">${formatMoney(city.rent_weekly)}/周</span>
                </div>
            </td>
            <td class="bar-cell">
                <div class="cost-bar-wrap">
                    <div class="cost-bar cost-bar-transport" style="width: ${(city.monthly_transport / maxTransport) * 100}px"></div>
                    <span class="cost-bar-value">${formatMoney(city.monthly_transport)}/月</span>
                </div>
            </td>
            <td class="bar-cell">
                <div class="cost-bar-wrap">
                    <div class="cost-bar cost-bar-meal" style="width: ${(city.meal_avg / maxMeal) * 100}px"></div>
                    <span class="cost-bar-value">${formatMoney(city.meal_avg)}/餐</span>
                </div>
            </td>
            <td class="bar-cell">
                <div class="cost-bar-wrap">
                    <div class="cost-bar cost-bar-income" style="width: ${(city.median_income / maxIncome) * 100}px"></div>
                    <span class="cost-bar-value">${formatMoney(city.median_income)}/年</span>
                </div>
            </td>
            <td class="cost-bar-value" style="font-weight:600; color:#1a3a5c;">≈ ${formatMoney(monthlyCost)}/月</td>
        </tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

const SORT_FNS = {
    population: (a, b) => b.population - a.population,
    rent: (a, b) => a.rent_weekly - b.rent_weekly,
    income: (a, b) => b.median_income - a.median_income,
    cost: (a, b) => {
        const ca = a.rent_weekly * 4 + a.monthly_transport + a.meal_avg * 60;
        const cb = b.rent_weekly * 4 + b.monthly_transport + b.meal_avg * 60;
        return ca - cb;
    }
};

function initSort() {
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const sorted = [...cities].sort(SORT_FNS[btn.dataset.sort]);
            renderCityCards(sorted);
        });
    });
}

async function init() {
    initSort();
    const res = await fetch('cities.json');
    cities = await res.json();
    const sorted = [...cities].sort(SORT_FNS.population);
    renderCityCards(sorted);
    renderCostTable(cities);
}

init();
