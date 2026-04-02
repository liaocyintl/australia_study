let jobs = [];
let visas = [];

const template = `
<section class="hero-small">
    <h1>留学打工指南</h1>
    <p>了解打工政策、常见岗位与收入预期</p>
</section>

<section class="section">
    <div class="container">
        <h2>收入计算器</h2>
        <p class="section-desc">学生签证（Subclass 500）开学期间每两周最多工作 48 小时，假期可全职</p>
        <div class="calculator">
            <div class="calc-inputs">
                <div class="calc-field">
                    <label for="calc-wage">时薪 (AUD)</label>
                    <input type="number" id="calc-wage" value="24.10" min="0" step="0.1">
                </div>
                <div class="calc-field">
                    <label for="calc-hours">每周工作时数</label>
                    <input type="number" id="calc-hours" value="24" min="0" max="48">
                    <span class="calc-hint">学期中上限 24h/周（=48h/两周）</span>
                </div>
                <div class="calc-field">
                    <label for="calc-weekend">含周末班？</label>
                    <select id="calc-weekend">
                        <option value="0">否（全部平日）</option>
                        <option value="8">周末约 8 小时</option>
                        <option value="16" selected>周末约 16 小时</option>
                    </select>
                </div>
            </div>
            <div class="calc-results">
                <div class="calc-result-item"><div class="calc-result-label">每周收入</div><div class="calc-result-value" id="result-weekly">-</div></div>
                <div class="calc-result-item"><div class="calc-result-label">每月收入</div><div class="calc-result-value" id="result-monthly">-</div></div>
                <div class="calc-result-item"><div class="calc-result-label">学期收入（20周）</div><div class="calc-result-value" id="result-semester">-</div></div>
                <div class="calc-result-item"><div class="calc-result-label">全年收入估算</div><div class="calc-result-value" id="result-yearly">-</div><div class="calc-result-note">含两个学期 + 约12周假期（假期按全职38h/周计算）</div></div>
            </div>
        </div>
    </div>
</section>

<section class="section section-alt">
    <div class="container-wide">
        <h2>常见打工岗位</h2>
        <div class="job-filter-bar">
            <button class="filter-btn active" data-cat="all">全部</button>
            <button class="filter-btn" data-cat="餐饮">餐饮</button>
            <button class="filter-btn" data-cat="零售">零售</button>
            <button class="filter-btn" data-cat="服务">服务</button>
            <button class="filter-btn" data-cat="专业">专业</button>
            <button class="filter-btn" data-cat="体力劳动">体力劳动</button>
        </div>
        <div id="job-list" class="job-list"></div>
    </div>
</section>

<section class="section">
    <div class="container">
        <h2>工作相关签证</h2>
        <p class="section-desc">不同签证类型的打工权利差异很大，选择适合自己的签证至关重要</p>
        <div id="visa-list" class="visa-list"></div>
    </div>
</section>

<section class="section section-alt">
    <div class="container">
        <h2>打工注意事项</h2>
        <div class="tips-grid">
            <div class="tip-card"><div class="tip-icon">⚖️</div><h3>了解最低工资</h3><p>澳洲法定最低时薪为 <strong>$24.10</strong>（2024年7月起）。Casual 员工另有 25% 加成。任何低于此标准的工作都属违法，可向 Fair Work 投诉。</p></div>
            <div class="tip-card"><div class="tip-icon">📋</div><h3>申请 TFN</h3><p>打工前需申请税号（Tax File Number），否则雇主将按最高税率扣税。到达澳洲后即可在线申请，通常 28 天内收到。</p></div>
            <div class="tip-card"><div class="tip-icon">🏦</div><h3>养老金 (Super)</h3><p>雇主需额外支付工资的 11.5% 作为养老金（Superannuation）。离开澳洲时可申请退回，通常能拿回扣税后的 60-65%。</p></div>
            <div class="tip-card"><div class="tip-icon">⏰</div><h3>严守工时限制</h3><p>学生签证开学期间每两周不超过 48 小时。超时打工可能导致签证取消，移民局会通过税务记录核查。</p></div>
            <div class="tip-card"><div class="tip-icon">🚫</div><h3>拒绝现金黑工</h3><p>部分华人餐馆以现金方式支付低于最低工资的薪酬，这属于违法行为。既损害自身权益，也无法积累合法工作经验。</p></div>
            <div class="tip-card"><div class="tip-icon">📱</div><h3>找工作渠道</h3><p>推荐使用 Seek、Indeed、Jora、LinkedIn 等平台。大学 Career Centre 也提供校内外兼职信息。避免仅依赖华人微信群。</p></div>
        </div>
    </div>
</section>
`;

function updateCalculator(container) {
    const wage = parseFloat(container.querySelector('#calc-wage').value) || 0;
    const hours = parseFloat(container.querySelector('#calc-hours').value) || 0;
    const weekendHours = parseInt(container.querySelector('#calc-weekend').value) || 0;
    const weekdayHours = Math.max(0, hours - weekendHours);
    const weeklyPay = weekdayHours * wage + weekendHours * wage * 1.5;
    const monthlyPay = weeklyPay * 4.33;
    const semesterPay = weeklyPay * 20;
    const holidayWeekly = 38 * wage * 0.7 + 38 * wage * 0.3 * 1.5;
    const yearlyPay = semesterPay * 2 + holidayWeekly * 12;
    container.querySelector('#result-weekly').textContent = '$' + weeklyPay.toFixed(0);
    container.querySelector('#result-monthly').textContent = '$' + monthlyPay.toFixed(0);
    container.querySelector('#result-semester').textContent = '$' + semesterPay.toFixed(0);
    container.querySelector('#result-yearly').textContent = '$' + yearlyPay.toFixed(0);
}

function renderJobs(data, container) {
    container.querySelector('#job-list').innerHTML = data.map(job => {
        const maxWeekly = job.hourly_max * 24;
        const maxWeeklyWeekend = job.hourly_max * 16 + job.hourly_max * job.weekend_rate * 8;
        const engClass = job.english_required === '高' ? 'job-tag-low' : job.english_required === '中' ? 'job-tag-mid' : 'job-tag-good';
        const flexClass = job.flexibility === '高' ? 'job-tag-good' : job.flexibility === '中' ? 'job-tag-mid' : 'job-tag-low';
        return `<div class="job-card">
            <div class="job-card-header">
                <h3>${job.job_zh}<span class="job-en">${job.job_en}</span></h3>
                <span class="cat-badge cat-${job.category}">${job.category}</span>
            </div>
            <div class="job-desc">${job.description_zh}</div>
            <div class="job-pay">
                <div class="job-pay-row"><span class="pay-label">基本时薪</span><span class="pay-value">$${job.hourly_min.toFixed(2)} - $${job.hourly_max.toFixed(2)}</span></div>
                <div class="job-pay-row"><span class="pay-label">周末/晚班加成</span><span class="pay-value">${job.weekend_rate}x / ${job.evening_rate}x</span></div>
                <div class="job-pay-row"><span class="pay-label">每周收入（24h上限）</span><span class="pay-highlight">≈ $${maxWeekly.toFixed(0)} - $${maxWeeklyWeekend.toFixed(0)}</span></div>
            </div>
            <div class="job-tags">
                <span class="job-tag ${engClass}">英语要求: ${job.english_required}</span>
                <span class="job-tag ${flexClass}">时间灵活度: ${job.flexibility}</span>
            </div>
        </div>`;
    }).join('');
}

function renderVisas(data, container) {
    container.querySelector('#visa-list').innerHTML = data.map(visa => `
        <div class="visa-card">
            <div class="visa-card-header">
                <h3>${visa.visa_name_zh}<span style="font-weight:400;font-size:0.85rem;margin-left:0.5rem;opacity:0.8;">${visa.visa_name_en}</span></h3>
                <span class="visa-subclass">Subclass ${visa.subclass}</span>
            </div>
            <div class="visa-card-body">
                <div class="visa-desc">${visa.description}</div>
                <div class="visa-info-grid">
                    <div class="visa-info-box"><div class="info-label">打工时间</div><div class="info-value">${visa.work_hours}</div></div>
                    <div class="visa-info-box"><div class="info-label">签证时长</div><div class="info-value">${visa.duration}</div></div>
                    <div class="visa-info-box"><div class="info-label">申请条件</div><div class="info-value">${visa.eligibility}</div></div>
                </div>
                <div class="visa-pros-cons">
                    <div class="visa-pros"><h4>✅ 优势</h4><ul>${visa.pros.map(p => `<li>${p}</li>`).join('')}</ul></div>
                    <div class="visa-cons"><h4>⚠️ 注意</h4><ul>${visa.cons.map(c => `<li>${c}</li>`).join('')}</ul></div>
                </div>
            </div>
        </div>
    `).join('');
}

export async function init(container, loadCSS) {
    loadCSS('css/work.css');
    container.innerHTML = template;

    // Calculator
    ['calc-wage', 'calc-hours', 'calc-weekend'].forEach(id => {
        container.querySelector('#' + id).addEventListener('input', () => updateCalculator(container));
    });
    updateCalculator(container);

    // Load data
    const [jobsRes, visasRes] = await Promise.all([
        fetch('data/jobs.json'), fetch('data/visas.json')
    ]);
    jobs = await jobsRes.json();
    visas = await visasRes.json();

    // Job filter
    container.querySelectorAll('.job-filter-bar .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.job-filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.cat;
            renderJobs(cat === 'all' ? jobs : jobs.filter(j => j.category === cat), container);
        });
    });

    renderJobs(jobs, container);
    renderVisas(visas, container);
}

export function destroy() {
    jobs = [];
    visas = [];
}
