let data = {};

const template = `
<section class="hero-small">
    <h1>澳洲生活</h1>
    <p>了解澳大利亚人的一周日常、饮食文化、兴趣爱好与生活开销</p>
</section>

<section class="section">
    <div class="container">
        <h2>一周生活节奏</h2>
        <div class="week-tabs" id="week-tabs"></div>
        <div class="day-detail" id="day-detail"></div>
    </div>
</section>

<section class="section section-alt">
    <div class="container">
        <h2>饮食文化</h2>
        <div id="food-section"></div>
    </div>
</section>

<section class="section">
    <div class="container-wide">
        <h2>休闲与爱好</h2>
        <div id="hobbies-list" class="hobbies-grid"></div>
    </div>
</section>

<section class="section section-alt">
    <div class="container">
        <h2>每月开销预算</h2>
        <p class="section-desc">国际留学生每月典型花费（澳元）</p>
        <div id="budget-section"></div>
    </div>
</section>

<section class="section">
    <div class="container">
        <h2>出行方式</h2>
        <div id="transport-section"></div>
    </div>
</section>

<section class="section section-alt">
    <div class="container-wide">
        <h2>文化差异小贴士</h2>
        <div id="culture-tips" class="culture-grid"></div>
    </div>
</section>

<section class="section">
    <div class="container">
        <h2>公共假日</h2>
        <p class="section-desc">澳洲主要公共假日一览，公共假日打工通常有2-2.5倍工资</p>
        <div id="holidays-section"></div>
    </div>
</section>

<section class="section section-alt">
    <div class="container">
        <h2>购物指南</h2>
        <div id="shopping-section"></div>
    </div>
</section>
`;

function renderWeek(container) {
    const tabs = container.querySelector('#week-tabs');
    const detail = container.querySelector('#day-detail');
    const week = data.weekly_schedule;

    tabs.innerHTML = week.map((d, i) =>
        `<button class="day-tab ${i === 0 ? 'active' : ''}" data-day="${i}">${d.day_zh.slice(2)}</button>`
    ).join('');

    function showDay(idx) {
        const d = week[idx];
        detail.innerHTML = `
            <div class="day-header">
                <h3>${d.day_zh} <span class="day-en">${d.day_en}</span></h3>
                <p class="day-note">${d.notes_zh}</p>
            </div>
            <div class="timeline-compact">
                ${d.typical_schedule.map(s => `
                    <div class="tl-item">
                        <span class="tl-time">${s.time}</span>
                        <span class="tl-dot"></span>
                        <span class="tl-text">${s.activity_zh}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    tabs.querySelectorAll('.day-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            tabs.querySelectorAll('.day-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showDay(parseInt(btn.dataset.day));
        });
    });

    showDay(0);
}

function renderFood(container) {
    const f = data.food_culture;
    const meals = [
        { key: 'breakfast', icon: '🌅', label: '早餐', data: f.breakfast },
        { key: 'lunch', icon: '☀️', label: '午餐', data: f.lunch },
        { key: 'dinner', icon: '🌙', label: '晚餐', data: f.dinner }
    ];

    container.querySelector('#food-section').innerHTML = `
        <div class="meal-cards">
            ${meals.map(m => `
                <div class="meal-card">
                    <div class="meal-header">${m.icon} ${m.label} <span class="meal-cost">≈ $${m.data.avg_cost}/餐</span></div>
                    <p class="meal-desc">${m.data.description_zh}</p>
                    <div class="meal-items">${m.data.common_items_zh.map(i => `<span class="meal-tag">${i}</span>`).join('')}</div>
                </div>
            `).join('')}
        </div>
        <div class="food-extra">
            <div class="food-card">
                <h3>☕ 咖啡文化</h3>
                <p>${f.coffee_culture_zh}</p>
            </div>
            <div class="food-card">
                <h3>🥢 亚洲美食</h3>
                <p>${f.asian_food_zh}</p>
            </div>
        </div>
        <div class="cuisine-grid">
            ${f.popular_cuisines.map(c => `<div class="cuisine-item"><strong>${c.name_zh}</strong><p>${c.description_zh}</p></div>`).join('')}
        </div>
        <div class="dining-tips">
            <h3>🍽️ 外出就餐小贴士</h3>
            <ul>${f.dining_out_tips_zh.map(t => `<li>${t}</li>`).join('')}</ul>
        </div>
    `;
}

function renderHobbies(container) {
    container.querySelector('#hobbies-list').innerHTML = data.hobbies.map(h => {
        const costClass = h.cost_level === '免费' ? 'cost-free' : h.cost_level === '低' ? 'cost-low' : 'cost-mid';
        return `<div class="hobby-card">
            <div class="hobby-header">
                <h3>${h.name_zh}</h3>
                <span class="hobby-en">${h.name_en}</span>
            </div>
            <p class="hobby-desc">${h.description_zh}</p>
            <div class="hobby-tags">
                <span class="hobby-tag">${h.popularity}</span>
                <span class="hobby-tag ${costClass}">${h.cost_level === '免费' ? '🆓 免费' : '💰 ' + h.cost_level}</span>
            </div>
        </div>`;
    }).join('');
}

function renderBudget(container) {
    const b = data.monthly_budget;
    const maxVal = Math.max(...b.categories.map(c => c.max));
    container.querySelector('#budget-section').innerHTML = `
        <div class="budget-chart">
            ${b.categories.map(c => `
                <div class="budget-row">
                    <div class="budget-label">${c.category_zh}</div>
                    <div class="budget-bar-wrap">
                        <div class="budget-bar" style="width:${(c.max / maxVal) * 100}%">
                            <div class="budget-bar-min" style="width:${(c.min / c.max) * 100}%"></div>
                        </div>
                        <span class="budget-value">$${c.min} - $${c.max}</span>
                    </div>
                    <div class="budget-tip">${c.tips_zh}</div>
                </div>
            `).join('')}
        </div>
        <div class="budget-total">
            <div class="budget-total-box">
                <div class="budget-total-label">每月总计</div>
                <div class="budget-total-value">$${b.total_min.toLocaleString()} - $${b.total_max.toLocaleString()}</div>
            </div>
        </div>
        <div class="saving-tips">
            <h3>💡 省钱技巧</h3>
            <ul>${b.saving_tips_zh.map(t => `<li>${t}</li>`).join('')}</ul>
        </div>
    `;
}

function renderTransport(container) {
    const t = data.transport;
    container.querySelector('#transport-section').innerHTML = `
        <div class="transport-modes">
            ${t.modes.map(m => `
                <div class="transport-card">
                    <h3>${m.name_zh}</h3>
                    <p>${m.description_zh}</p>
                    <div class="transport-discount">🎓 ${m.student_discount_zh}</div>
                </div>
            `).join('')}
        </div>
        <div class="transport-extra">
            <div class="food-card"><h3>🚗 自驾</h3><p>${t.driving_zh}</p></div>
            <div class="food-card"><h3>🚲 骑行</h3><p>${t.cycling_zh}</p></div>
            <div class="food-card"><h3>📱 网约车</h3><p>${t.rideshare_zh}</p></div>
        </div>
    `;
}

function renderCulture(container) {
    container.querySelector('#culture-tips').innerHTML = data.cultural_tips.map(c => {
        const badge = c.importance === '必知' ? 'imp-must' : c.importance === '重要' ? 'imp-important' : 'imp-know';
        return `<div class="culture-card">
            <div class="culture-card-top">
                <h3>${c.title_zh}</h3>
                <span class="imp-badge ${badge}">${c.importance}</span>
            </div>
            <p>${c.description_zh}</p>
        </div>`;
    }).join('');
}

function renderHolidays(container) {
    container.querySelector('#holidays-section').innerHTML = `
        <div class="holiday-list">
            ${data.public_holidays.map(h => `
                <div class="holiday-item">
                    <div class="holiday-date">${h.date_zh}</div>
                    <div class="holiday-info">
                        <h3>${h.name_zh} <span class="holiday-en">${h.name_en}</span></h3>
                        <p>${h.description_zh}</p>
                        <div class="holiday-impact">🎓 ${h.student_impact_zh}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderShopping(container) {
    const s = data.shopping;
    container.querySelector('#shopping-section').innerHTML = `
        <h3>🛒 超市</h3>
        <div class="shop-grid">
            ${s.supermarkets.map(m => `<div class="shop-card"><strong>${m.name}</strong><p>${m.description_zh}</p></div>`).join('')}
        </div>
        <div class="food-card" style="margin:1.5rem 0"><h3>🥢 亚洲超市</h3><p>${s.asian_groceries_zh}</p></div>
        <h3>🛍️ 网上购物</h3>
        <div class="shop-grid">
            ${s.online_shopping.map(m => `<div class="shop-card"><strong>${m.name}</strong><p>${m.description_zh}</p></div>`).join('')}
        </div>
        <div class="food-card" style="margin:1.5rem 0"><h3>💰 小费文化</h3><p>${s.tipping_zh}</p></div>
        <h3>🏷️ 打折季</h3>
        <div class="sales-list">
            ${s.sales_events.map(e => `<div class="sale-item"><div class="sale-when">${e.when_zh}</div><div class="sale-info"><strong>${e.name_zh}</strong><p>${e.description_zh}</p></div></div>`).join('')}
        </div>
    `;
}

export async function init(container, loadCSS) {
    loadCSS('css/lifestyle.css');
    container.innerHTML = template;

    const res = await fetch('data/lifestyle.json');
    data = await res.json();

    renderWeek(container);
    renderFood(container);
    renderHobbies(container);
    renderBudget(container);
    renderTransport(container);
    renderCulture(container);
    renderHolidays(container);
    renderShopping(container);
}

export function destroy() {
    data = {};
}
