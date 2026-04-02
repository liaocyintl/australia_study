let jobs = [];
let visas = [];

/* ── Calculator ── */
function updateCalculator() {
    const wage = parseFloat(document.getElementById('calc-wage').value) || 0;
    const hours = parseFloat(document.getElementById('calc-hours').value) || 0;
    const weekendHours = parseInt(document.getElementById('calc-weekend').value) || 0;
    const weekdayHours = Math.max(0, hours - weekendHours);

    const weeklyPay = weekdayHours * wage + weekendHours * wage * 1.5;
    const monthlyPay = weeklyPay * 4.33;
    const semesterPay = weeklyPay * 20;
    // 2 semesters (20 weeks each) at student hours + 12 weeks holiday at 38h/week
    const holidayWeekly = 38 * wage * 0.7 + 38 * wage * 0.3 * 1.5; // assume 30% weekend
    const yearlyPay = semesterPay * 2 + holidayWeekly * 12;

    document.getElementById('result-weekly').textContent = '$' + weeklyPay.toFixed(0);
    document.getElementById('result-monthly').textContent = '$' + monthlyPay.toFixed(0);
    document.getElementById('result-semester').textContent = '$' + semesterPay.toFixed(0);
    document.getElementById('result-yearly').textContent = '$' + yearlyPay.toFixed(0);
}

function initCalculator() {
    ['calc-wage', 'calc-hours', 'calc-weekend'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateCalculator);
    });
    updateCalculator();
}

/* ── Job cards ── */
function renderJobs(data) {
    const container = document.getElementById('job-list');
    container.innerHTML = data.map(job => {
        const maxWeekly = job.hourly_max * 24;
        const maxWeeklyWeekend = job.hourly_max * 16 + job.hourly_max * job.weekend_rate * 8;
        const engClass = job.english_required === '高' ? 'job-tag-low' :
                         job.english_required === '中' ? 'job-tag-mid' : 'job-tag-good';
        const flexClass = job.flexibility === '高' ? 'job-tag-good' :
                          job.flexibility === '中' ? 'job-tag-mid' : 'job-tag-low';

        return `<div class="job-card">
            <div class="job-card-header">
                <h3>${job.job_zh}<span class="job-en">${job.job_en}</span></h3>
                <span class="cat-badge cat-${job.category}">${job.category}</span>
            </div>
            <div class="job-desc">${job.description_zh}</div>
            <div class="job-pay">
                <div class="job-pay-row">
                    <span class="pay-label">基本时薪</span>
                    <span class="pay-value">$${job.hourly_min.toFixed(2)} - $${job.hourly_max.toFixed(2)}</span>
                </div>
                <div class="job-pay-row">
                    <span class="pay-label">周末/晚班加成</span>
                    <span class="pay-value">${job.weekend_rate}x / ${job.evening_rate}x</span>
                </div>
                <div class="job-pay-row">
                    <span class="pay-label">每周收入（24h上限）</span>
                    <span class="pay-highlight">≈ $${maxWeekly.toFixed(0)} - $${maxWeeklyWeekend.toFixed(0)}</span>
                </div>
            </div>
            <div class="job-tags">
                <span class="job-tag ${engClass}">英语要求: ${job.english_required}</span>
                <span class="job-tag ${flexClass}">时间灵活度: ${job.flexibility}</span>
            </div>
        </div>`;
    }).join('');
}

function initJobFilter() {
    document.querySelectorAll('.job-filter-bar .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.job-filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.cat;
            const filtered = cat === 'all' ? jobs : jobs.filter(j => j.category === cat);
            renderJobs(filtered);
        });
    });
}

/* ── Visa cards ── */
function renderVisas(data) {
    const container = document.getElementById('visa-list');
    container.innerHTML = data.map(visa => `
        <div class="visa-card">
            <div class="visa-card-header">
                <h3>${visa.visa_name_zh}<span style="font-weight:400; font-size:0.85rem; margin-left:0.5rem; opacity:0.8;">${visa.visa_name_en}</span></h3>
                <span class="visa-subclass">Subclass ${visa.subclass}</span>
            </div>
            <div class="visa-card-body">
                <div class="visa-desc">${visa.description}</div>
                <div class="visa-info-grid">
                    <div class="visa-info-box">
                        <div class="info-label">打工时间</div>
                        <div class="info-value">${visa.work_hours}</div>
                    </div>
                    <div class="visa-info-box">
                        <div class="info-label">签证时长</div>
                        <div class="info-value">${visa.duration}</div>
                    </div>
                    <div class="visa-info-box">
                        <div class="info-label">申请条件</div>
                        <div class="info-value">${visa.eligibility}</div>
                    </div>
                </div>
                <div class="visa-pros-cons">
                    <div class="visa-pros">
                        <h4>✅ 优势</h4>
                        <ul>${visa.pros.map(p => `<li>${p}</li>`).join('')}</ul>
                    </div>
                    <div class="visa-cons">
                        <h4>⚠️ 注意</h4>
                        <ul>${visa.cons.map(c => `<li>${c}</li>`).join('')}</ul>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/* ── Init ── */
async function init() {
    initCalculator();
    initJobFilter();

    const [jobsRes, visasRes] = await Promise.all([
        fetch('jobs.json'),
        fetch('visas.json')
    ]);
    jobs = await jobsRes.json();
    visas = await visasRes.json();

    renderJobs(jobs);
    renderVisas(visas);
}

init();
