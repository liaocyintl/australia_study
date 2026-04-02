const GROUP_COLORS = {
    Go8: '#6b21a8', ATN: '#0369a1', IRU: '#15803d', RUN: '#c2410c', '': '#64748b'
};
const GROUP_LABELS = {
    Go8: '八大名校', ATN: '科技联盟', IRU: '创新研究', RUN: '区域联盟'
};

let map = null;
let markers = [];
let universities = [];

const template = `
<section class="hero-small">
    <h1>澳洲大学地图</h1>
    <p>涵盖八大名校、科技联盟、创新研究等 37 所大学，互动地图一览全貌</p>
</section>
<section class="section">
    <div class="container-wide">
        <div class="filter-bar">
            <button class="filter-btn active" data-group="all">全部</button>
            <button class="filter-btn" data-group="Go8">八大名校 (Go8)</button>
            <button class="filter-btn" data-group="ATN">科技联盟 (ATN)</button>
            <button class="filter-btn" data-group="IRU">创新研究 (IRU)</button>
            <button class="filter-btn" data-group="RUN">区域联盟 (RUN)</button>
            <button class="filter-btn" data-group="other">其他大学</button>
        </div>
        <div class="map-layout">
            <div id="map"></div>
            <div id="uni-list" class="uni-list"></div>
        </div>
    </div>
</section>
<section class="section section-alt">
    <div class="container">
        <h2>各分组费用概览</h2>
        <div id="cost-summary"></div>
    </div>
</section>
`;

async function loadLeaflet() {
    if (window.L) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

function formatRank(rank) {
    if (!rank) return '-';
    if (rank >= 800) return '800+';
    if (rank >= 600) return '601-800';
    return '#' + rank;
}

function formatTuition(min, max) {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
}

function markerOptions(group) {
    return {
        radius: 8,
        fillColor: GROUP_COLORS[group] || GROUP_COLORS[''],
        color: '#fff', weight: 2, opacity: 1, fillOpacity: 0.9
    };
}

function createPopupContent(uni) {
    const tag = uni.group ? `<span class="uni-group-tag group-${uni.group}">${GROUP_LABELS[uni.group]}</span>` : '';
    return `<div class="uni-popup">
        <h3>${uni.name_zh} ${tag}</h3>
        <div class="popup-en">${uni.name_en}</div>
        <div class="popup-info">📍 ${uni.city}, ${uni.state} &nbsp; 🏛️ 创立于 ${uni.founded} 年</div>
        <div class="popup-info">🏆 QS排名: ${formatRank(uni.qs_rank)} &nbsp; 💰 学费: ${formatTuition(uni.tuition_min, uni.tuition_max)}/年</div>
        <a href="${uni.website}" target="_blank" rel="noopener">访问官网 →</a>
    </div>`;
}

function renderMarkers(data, container) {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    data.forEach((uni, index) => {
        const marker = L.circleMarker([uni.lat, uni.lng], markerOptions(uni.group)).addTo(map);
        marker.bindPopup(createPopupContent(uni));
        marker.on('click', () => highlightListItem(index, container));
        markers.push(marker);
    });
}

function renderList(data, container) {
    const list = container.querySelector('#uni-list');
    list.innerHTML = data.map((uni, i) => {
        const tag = uni.group ? `<span class="uni-group-tag group-${uni.group}">${GROUP_LABELS[uni.group]}</span>` : '';
        return `<div class="uni-item" data-index="${i}">
            <div class="uni-name-zh">${uni.name_zh} ${tag}</div>
            <div class="uni-name-en">${uni.name_en}</div>
            <div class="uni-meta">📍 ${uni.city}, ${uni.state} · QS ${formatRank(uni.qs_rank)}</div>
            <div class="uni-meta">💰 ${formatTuition(uni.tuition_min, uni.tuition_max)}/年</div>
        </div>`;
    }).join('');
    list.querySelectorAll('.uni-item').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.index);
            map.setView([data[idx].lat, data[idx].lng], 10);
            markers[idx].openPopup();
            highlightListItem(idx, container);
        });
    });
}

function highlightListItem(index, container) {
    container.querySelectorAll('.uni-item').forEach(el => el.classList.remove('highlight'));
    const target = container.querySelector(`.uni-item[data-index="${index}"]`);
    if (target) {
        target.classList.add('highlight');
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function applyFilter(group, container) {
    let filtered;
    if (group === 'all') filtered = universities;
    else if (group === 'other') filtered = universities.filter(u => !u.group);
    else filtered = universities.filter(u => u.group === group);
    renderMarkers(filtered, container);
    renderList(filtered, container);
    if (filtered.length > 0) {
        const bounds = L.latLngBounds(filtered.map(u => [u.lat, u.lng]));
        map.fitBounds(bounds, { padding: [30, 30] });
    }
}

function renderCostSummary(container) {
    const el = container.querySelector('#cost-summary');
    if (!el) return;
    const groups = [
        { key: 'Go8', label: '八大名校 (Go8)' },
        { key: 'ATN', label: '科技联盟 (ATN)' },
        { key: 'IRU', label: '创新研究 (IRU)' },
        { key: 'RUN', label: '区域联盟 (RUN)' },
        { key: '', label: '其他大学' }
    ];
    let html = '<table class="cost-summary-table"><thead><tr><th>大学分组</th><th>QS排名范围</th><th>学费范围 (澳元/年)</th><th>大学数量</th></tr></thead><tbody>';
    groups.forEach(g => {
        const unis = universities.filter(u => u.group === g.key);
        if (!unis.length) return;
        const ranks = unis.map(u => u.qs_rank).filter(r => r);
        const minR = Math.min(...ranks), maxR = Math.max(...ranks);
        const minT = Math.min(...unis.map(u => u.tuition_min));
        const maxT = Math.max(...unis.map(u => u.tuition_max));
        const rankStr = maxR >= 800 ? `${formatRank(minR)} ~ 800+` : `${formatRank(minR)} ~ ${formatRank(maxR)}`;
        html += `<tr>
            <td><span class="uni-group-tag group-${g.key || 'other'}">${g.label}</span></td>
            <td class="rank-cell">${rankStr}</td>
            <td class="tuition-cell">$${minT.toLocaleString()} - $${maxT.toLocaleString()}</td>
            <td>${unis.length} 所</td>
        </tr>`;
    });
    html += '</tbody></table><p class="cost-note">* 学费为国际本科生年均费用参考，实际费用因专业不同而异。QS排名为2025年数据。</p>';
    el.innerHTML = html;
}

export async function init(container, loadCSS) {
    loadCSS('css/universities.css');
    container.innerHTML = template;
    await loadLeaflet();

    map = L.map('map').setView([-25.5, 134], 4);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19, subdomains: 'abcd'
    }).addTo(map);

    const res = await fetch('data/universities.json');
    universities = await res.json();

    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilter(btn.dataset.group, container);
        });
    });

    applyFilter('all', container);
    renderCostSummary(container);
}

export function destroy() {
    if (map) {
        map.remove();
        map = null;
    }
    markers = [];
    universities = [];
}
