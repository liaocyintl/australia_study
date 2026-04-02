const template = `
<section class="hero">
    <div class="hero-content">
        <h1>开启你的澳大利亚留学之旅</h1>
        <p>从申请到落地，一站式留学信息指南</p>
        <div class="hero-buttons">
            <a href="#/universities" class="cta-button">查看大学地图</a>
            <a href="#/cities" class="cta-button cta-outline">城市指南</a>
            <a href="#/work" class="cta-button cta-outline">打工指南</a>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <h2>为什么选择澳大利亚？</h2>
        <div class="card-grid">
            <div class="card">
                <h3>🎓 世界一流教育</h3>
                <p>拥有多所世界排名前100的大学，教育质量受国际认可。</p>
            </div>
            <div class="card">
                <h3>🌏 多元文化环境</h3>
                <p>来自世界各地的留学生汇聚于此，体验多元文化交融。</p>
            </div>
            <div class="card">
                <h3>💼 工作机会</h3>
                <p>留学期间可合法兼职，毕业后有机会申请工作签证。</p>
            </div>
            <div class="card">
                <h3>🏖️ 宜居生活</h3>
                <p>气候宜人、自然风光优美，多个城市位列全球最宜居城市。</p>
            </div>
        </div>
    </div>
</section>

<section class="section section-alt">
    <div class="container">
        <h2>快速导航</h2>
        <div class="card-grid nav-cards">
            <a href="#/universities" class="card nav-card">
                <h3>🗺️ 大学地图</h3>
                <p>37 所大学互动地图，含 QS 排名、学费、分组筛选</p>
            </a>
            <a href="#/cities" class="card nav-card">
                <h3>🏙️ 城市指南</h3>
                <p>15 座城市详情，人口、产业、收入与生活成本对比</p>
            </a>
            <a href="#/work" class="card nav-card">
                <h3>💰 打工指南</h3>
                <p>16 种岗位薪资、收入计算器、签证打工政策详解</p>
            </a>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <h2>签证流程</h2>
        <div class="timeline">
            <div class="timeline-item">
                <div class="timeline-number">1</div>
                <div class="timeline-content">
                    <h3>获得录取通知书 (Offer)</h3>
                    <p>向目标大学提交申请，获得有条件或无条件录取通知。</p>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-number">2</div>
                <div class="timeline-content">
                    <h3>获取 CoE</h3>
                    <p>接受录取并缴纳学费后，学校发放电子入学确认书 (Confirmation of Enrolment)。</p>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-number">3</div>
                <div class="timeline-content">
                    <h3>准备签证材料</h3>
                    <p>包括 CoE、资金证明、英语成绩、体检报告、保险 (OSHC) 等。</p>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-number">4</div>
                <div class="timeline-content">
                    <h3>在线申请学生签证 (Subclass 500)</h3>
                    <p>通过 ImmiAccount 在线递交签证申请。</p>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-number">5</div>
                <div class="timeline-content">
                    <h3>获批出发</h3>
                    <p>签证获批后，准备行李，开启留学之旅！</p>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="section section-alt">
    <div class="container">
        <h2>生活指南</h2>
        <div class="card-grid">
            <div class="card">
                <h3>🏠 住宿</h3>
                <p>校内宿舍、合租公寓、寄宿家庭等多种选择。建议提前预订。</p>
            </div>
            <div class="card">
                <h3>🚌 交通</h3>
                <p>各大城市公共交通发达，留学生可办理优惠交通卡。</p>
            </div>
            <div class="card">
                <h3>🍜 饮食</h3>
                <p>亚洲超市和餐馆丰富，自己做饭每周约 $80-$150 澳元。</p>
            </div>
            <div class="card">
                <h3>📱 通讯</h3>
                <p>Optus、Telstra、Vodafone 等运营商，月费约 $30-$50 澳元。</p>
            </div>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <h2>费用预算（每年）</h2>
        <table class="cost-table">
            <thead>
                <tr>
                    <th>项目</th>
                    <th>预估费用 (澳元)</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>学费（本科）</td><td>$20,000 - $45,000</td></tr>
                <tr><td>学费（硕士）</td><td>$22,000 - $50,000</td></tr>
                <tr><td>住宿</td><td>$8,000 - $18,000</td></tr>
                <tr><td>生活费</td><td>$10,000 - $15,000</td></tr>
                <tr><td>海外学生医疗保险 (OSHC)</td><td>$500 - $700</td></tr>
            </tbody>
        </table>
    </div>
</section>

<section class="section section-alt">
    <div class="container">
        <h2>常见问题</h2>
        <div class="faq-list">
            <details class="faq-item">
                <summary>需要什么英语成绩？</summary>
                <p>大多数大学要求雅思总分 6.5（单项不低于 6.0），部分专业要求更高。也接受托福、PTE 等成绩。</p>
            </details>
            <details class="faq-item">
                <summary>留学期间可以打工吗？</summary>
                <p>持学生签证可以每两周工作不超过 48 小时（课程期间），假期无限制。</p>
            </details>
            <details class="faq-item">
                <summary>毕业后可以留在澳洲吗？</summary>
                <p>可以申请毕业生工作签证（Subclass 485），根据学历不同可获得 2-4 年工作签证。</p>
            </details>
            <details class="faq-item">
                <summary>什么时候开始申请？</summary>
                <p>建议提前 1 年开始准备。澳洲大学一般每年 2 月和 7 月两次入学。</p>
            </details>
        </div>
    </div>
</section>
`;

export function init(container) {
    container.innerHTML = template;
}

export function destroy() {}
