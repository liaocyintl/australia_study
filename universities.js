const GROUP_COLORS = {
    Go8: '#6b21a8',
    ATN: '#0369a1',
    IRU: '#15803d',
    RUN: '#c2410c',
    '': '#64748b'
};

const GROUP_LABELS = {
    Go8: '八大名校',
    ATN: '科技联盟',
    IRU: '创新研究',
    RUN: '区域联盟'
};

let map;
let markers = [];
let universities = [];
let currentFilter = 'all';

function initMap() {
    map = L.map('map').setView([-25.5, 134], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18
    }).addTo(map);
}

function createMarkerIcon(group) {
    const color = GROUP_COLORS[group] || GROUP_COLORS[''];
    return L.divIcon({
        className: 'custom-marker',
        html: `<svg width="24" height="36" viewBox="0 0 24 36">
            <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${color}"/>
            <circle cx="12" cy="12" r="5" fill="white"/>
        </svg>`,
        iconSize: [24, 36],
        iconAnchor: [12, 36],
        popupAnchor: [0, -36]
    });
}

function createPopupContent(uni) {
    const groupTag = uni.group
        ? `<span class="uni-group-tag group-${uni.group}">${GROUP_LABELS[uni.group]}</span>`
        : '';
    return `<div class="uni-popup">
        <h3>${uni.name_zh} ${groupTag}</h3>
        <div class="popup-en">${uni.name_en}</div>
        <div class="popup-info">📍 ${uni.city}, ${uni.state} &nbsp; 🏛️ 创立于 ${uni.founded} 年</div>
        <a href="${uni.website}" target="_blank" rel="noopener">访问官网 →</a>
    </div>`;
}

function renderMarkers(data) {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    data.forEach((uni, index) => {
        const marker = L.marker([uni.lat, uni.lng], {
            icon: createMarkerIcon(uni.group)
        }).addTo(map);

        marker.bindPopup(createPopupContent(uni));
        marker.on('click', () => highlightListItem(index));
        markers.push(marker);
    });
}

function renderList(data) {
    const list = document.getElementById('uni-list');
    list.innerHTML = data.map((uni, index) => {
        const groupTag = uni.group
            ? `<span class="uni-group-tag group-${uni.group}">${GROUP_LABELS[uni.group]}</span>`
            : '';
        return `<div class="uni-item" data-index="${index}">
            <div class="uni-name-zh">${uni.name_zh} ${groupTag}</div>
            <div class="uni-name-en">${uni.name_en}</div>
            <div class="uni-meta">📍 ${uni.city}, ${uni.state} · 创立于 ${uni.founded} 年</div>
        </div>`;
    }).join('');

    list.querySelectorAll('.uni-item').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.index);
            map.setView([data[idx].lat, data[idx].lng], 10);
            markers[idx].openPopup();
            highlightListItem(idx);
        });
    });
}

function highlightListItem(index) {
    document.querySelectorAll('.uni-item').forEach(el => el.classList.remove('highlight'));
    const target = document.querySelector(`.uni-item[data-index="${index}"]`);
    if (target) {
        target.classList.add('highlight');
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function filterUniversities(group) {
    if (group === 'all') return universities;
    if (group === 'other') return universities.filter(u => !u.group);
    return universities.filter(u => u.group === group);
}

function applyFilter(group) {
    currentFilter = group;
    const filtered = filterUniversities(group);
    renderMarkers(filtered);
    renderList(filtered);

    if (filtered.length > 0) {
        const bounds = L.latLngBounds(filtered.map(u => [u.lat, u.lng]));
        map.fitBounds(bounds, { padding: [30, 30] });
    }
}

function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilter(btn.dataset.group);
        });
    });
}

async function init() {
    initMap();
    initFilters();

    const response = await fetch('universities.json');
    universities = await response.json();

    applyFilter('all');
}

init();
