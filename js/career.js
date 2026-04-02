let industries = [];
let companies = [];

const template = `
<section class="hero-small">
    <h1>就业指南</h1>
    <p>全职工作行业薪酬、就业前景与知名雇主一览</p>
</section>

<section class="section">
    <div class="container-wide">
        <h2>各行业薪酬与就业概况</h2>
        <div class="ind-sort-bar">
            <span class="sort-label">排序：</span>
            <button class="sort-btn active" data-sort="salary">薪资</button>
            <button class="sort-btn" data-sort="growth">增长率</button>
            <button class="sort-btn" data-sort="employed">就业人数</button>
        </div>
        <div id="industry-list" class="industry-list"></div>
    </div>
</section>

<section class="section section-alt">
    <div class="container-wide">
        <h2>行业薪资对比</h2>
        <div id="salary-chart" class="salary-chart"></div>
    </div>
</section>

<section class="section">
    <div class="container-wide">
        <h2>知名雇主</h2>
        <p class="section-desc">这些公司每年招收大量毕业生，提供结构化培训和职业发展通道</p>
        <div class="company-filter-bar">
            <button class="filter-btn active" data-ind="all">全部</button>
            <button class="filter-btn" data-ind="金融与银行业">金融</button>
            <button class="filter-btn" data-ind="信息技术与软件开发">IT/科技</button>
            <button class="filter-btn" data-ind="采矿与资源">矿业/能源</button>
            <button class="filter-btn" data-ind="管理咨询">咨询</button>
            <button class="filter-btn" data-ind="其他">其他</button>
        </div>
        <div id="company-list" class="company-list"></div>
    </div>
</section>

<section class="section section-alt">
    <div class="container">
        <h2>求职建议</h2>
        <div class="tips-grid">
            <div class="tip-card"><div class="tip-icon">📝</div><h3>提前准备 Graduate Program</h3><p>澳洲大公司的毕业生项目通常在毕业前一年的3-5月开放申请，竞争激烈，建议尽早关注公司官网和 GradConnection 平台。</p></div>
            <div class="tip-card"><div class="tip-icon">🤝</div><h3>积累本地经验</h3><p>澳洲雇主非常看重本地工作经验，留学期间的实习、兼职和志愿者经历都是求职加分项。利用大学 Career Centre 寻找机会。</p></div>
            <div class="tip-card"><div class="tip-icon">🔗</div><h3>善用 LinkedIn</h3><p>在澳洲求职，LinkedIn 是最重要的职业社交平台。完善个人档案、主动连接行业人士、参加线下 Networking 活动。</p></div>
            <div class="tip-card"><div class="tip-icon">📋</div><h3>了解技能评估</h3><p>部分职业（工程师、会计、护士等）需要通过专业机构的技能评估才能获得签证担保，建议在读期间就开始准备相关材料。</p></div>
            <div class="tip-card"><div class="tip-icon">🎯</div><h3>关注技能短缺清单</h3><p>澳洲政府定期更新技能短缺职业清单（Skills Priority List），清单上的职业获得签证担保的机会更大，选专业和求职时可重点参考。</p></div>
            <div class="tip-card"><div class="tip-icon">💡</div><h3>突出双语优势</h3><p>中英双语能力在金融、咨询、贸易和市场营销等领域是显著竞争优势，求职时主动展示跨文化沟通能力。</p></div>
        </div>
    </div>
</section>
`;

function fmtSalary(n) { return '$' + (n / 1000).toFixed(0) + 'k'; }
function fmtNum(n) { return n >= 10000 ? (n / 10000).toFixed(0) + '万' : n.toLocaleString(); }

function renderIndustries(data, container) {
    container.querySelector('#industry-list').innerHTML = data.map(ind => {
        const demandClass = ind.demand_level === '高' ? 'tag-high' : ind.demand_level === '中' ? 'tag-mid' : 'tag-low';
        return `<div class="ind-card">
            <div class="ind-card-left">
                <div class="ind-icon">${ind.icon}</div>
                <div class="ind-info">
                    <h3>${ind.industry_zh}</h3>
                    <div class="ind-en">${ind.industry_en}</div>
                    <div class="ind-desc">${ind.description_zh}</div>
                    <div class="ind-skills">${ind.skills_zh.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>
                </div>
            </div>
            <div class="ind-card-right">
                <div class="ind-stat-grid">
                    <div class="ind-stat"><div class="ind-stat-label">平均年薪</div><div class="ind-stat-value salary-value">${fmtSalary(ind.avg_salary)}</div></div>
                    <div class="ind-stat"><div class="ind-stat-label">薪资范围</div><div class="ind-stat-value">${fmtSalary(ind.salary_range_min)} - ${fmtSalary(ind.salary_range_max)}</div></div>
                    <div class="ind-stat"><div class="ind-stat-label">周工时</div><div class="ind-stat-value">${ind.weekly_hours}h</div></div>
                    <div class="ind-stat"><div class="ind-stat-label">就业人数</div><div class="ind-stat-value">${fmtNum(ind.employed)}</div></div>
                    <div class="ind-stat"><div class="ind-stat-label">年增长率</div><div class="ind-stat-value growth-value">${ind.growth_rate > 0 ? '+' : ''}${ind.growth_rate}%</div></div>
                    <div class="ind-stat"><div class="ind-stat-label">人才需求</div><div class="ind-stat-value"><span class="demand-tag ${demandClass}">${ind.demand_level}</span></div></div>
                </div>
                <div class="ind-badges">
                    ${ind.visa_friendly ? '<span class="visa-badge">✅ 签证友好</span>' : '<span class="visa-badge visa-badge-no">签证担保较少</span>'}
                </div>
            </div>
        </div>`;
    }).join('');
}

function renderSalaryChart(data, container) {
    const sorted = [...data].sort((a, b) => b.avg_salary - a.avg_salary);
    const maxSalary = sorted[0].avg_salary;
    container.querySelector('#salary-chart').innerHTML = `<div class="chart-bars">
        ${sorted.map(ind => `<div class="chart-row">
            <div class="chart-label">${ind.icon} ${ind.industry_zh}</div>
            <div class="chart-bar-wrap">
                <div class="chart-bar-bg">
                    <div class="chart-bar-range" style="left:${(ind.salary_range_min / maxSalary) * 100}%;width:${((ind.salary_range_max - ind.salary_range_min) / maxSalary) * 100}%"></div>
                    <div class="chart-bar-avg" style="left:${(ind.avg_salary / maxSalary) * 100}%"></div>
                </div>
                <span class="chart-value">${fmtSalary(ind.avg_salary)}</span>
            </div>
        </div>`).join('')}
        <div class="chart-legend">
            <span class="legend-item"><span class="legend-bar"></span> 薪资范围（入门→资深）</span>
            <span class="legend-item"><span class="legend-dot"></span> 平均年薪</span>
        </div>
    </div>`;
}

const COMPANY_GROUPS = ['金融与银行业', '信息技术与软件开发', '采矿与资源', '管理咨询'];

function renderCompanies(data, container) {
    container.querySelector('#company-list').innerHTML = data.map(co => `
        <div class="co-card">
            <div class="co-card-header">
                <div>
                    <h3>${co.name}</h3>
                    <div class="co-name-zh">${co.name_zh}</div>
                </div>
                <div class="co-header-right">
                    <span class="co-industry-tag">${co.industry_zh}</span>
                </div>
            </div>
            <div class="co-card-body">
                <div class="co-desc">${co.description_zh}</div>
                <div class="co-meta-grid">
                    <div class="co-meta"><span class="co-meta-icon">📍</span><span>${co.headquarters}</span></div>
                    <div class="co-meta"><span class="co-meta-icon">👥</span><span>${co.employees_au >= 10000 ? (co.employees_au / 10000).toFixed(1) + '万' : co.employees_au.toLocaleString()} 人</span></div>
                    <div class="co-meta"><span class="co-meta-icon">💰</span><span>毕业生起薪 $${(co.avg_graduate_salary / 1000).toFixed(0)}k</span></div>
                    <div class="co-meta"><span class="co-meta-icon">⭐</span><span>Glassdoor ${co.glassdoor_rating}</span></div>
                </div>
                <div class="co-roles">
                    <div class="co-roles-label">常招岗位：</div>
                    <div class="co-roles-tags">${co.hiring_roles_zh.map(r => `<span class="role-tag">${r}</span>`).join('')}</div>
                </div>
                <div class="co-footer">
                    ${co.visa_sponsor ? '<span class="visa-badge">✅ 提供签证担保</span>' : '<span class="visa-badge visa-badge-no">一般不担保签证</span>'}
                    <a href="${co.website}" target="_blank" rel="noopener" class="co-link">官网 →</a>
                </div>
            </div>
        </div>
    `).join('');
}

const IND_SORT = {
    salary: (a, b) => b.avg_salary - a.avg_salary,
    growth: (a, b) => b.growth_rate - a.growth_rate,
    employed: (a, b) => b.employed - a.employed,
};

export async function init(container, loadCSS) {
    loadCSS('css/career.css');
    container.innerHTML = template;

    const [indRes, coRes] = await Promise.all([
        fetch('data/industries.json'), fetch('data/companies.json')
    ]);
    industries = await indRes.json();
    companies = await coRes.json();

    // Industry sort
    container.querySelectorAll('.ind-sort-bar .sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.ind-sort-bar .sort-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderIndustries([...industries].sort(IND_SORT[btn.dataset.sort]), container);
        });
    });

    // Company filter
    container.querySelectorAll('.company-filter-bar .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.company-filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const ind = btn.dataset.ind;
            let filtered;
            if (ind === 'all') filtered = companies;
            else if (ind === '其他') filtered = companies.filter(c => !COMPANY_GROUPS.includes(c.industry_zh));
            else filtered = companies.filter(c => c.industry_zh === ind);
            renderCompanies(filtered, container);
        });
    });

    renderIndustries([...industries].sort(IND_SORT.salary), container);
    renderSalaryChart(industries, container);
    renderCompanies(companies, container);
}

export function destroy() {
    industries = [];
    companies = [];
}
