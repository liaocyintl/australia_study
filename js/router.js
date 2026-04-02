const routes = {
    '':             () => import('./home.js'),
    'universities': () => import('./universities.js'),
    'cities':       () => import('./cities.js'),
    'work':         () => import('./work.js'),
};

let currentModule = null;
const content = document.getElementById('page-content');

function loadCSS(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

function updateActiveNav(route) {
    document.querySelectorAll('nav a[data-route]').forEach(a => {
        a.classList.toggle('active', a.dataset.route === route);
    });
}

async function navigate() {
    const hash = location.hash.slice(2) || ''; // "#/cities" -> "cities"
    const route = hash.split('/')[0]; // handle "#/work/something"
    const loader = routes[route];

    if (!loader) {
        // Unknown route - go home
        location.hash = '#/';
        return;
    }

    if (currentModule?.destroy) currentModule.destroy();

    content.innerHTML = '<div class="loading">加载中...</div>';
    updateActiveNav(route);

    const mod = await loader();
    currentModule = mod;
    await mod.init(content, loadCSS);

    // Scroll to top on page change
    window.scrollTo(0, 0);
}

window.addEventListener('hashchange', navigate);

// Initial load
if (!location.hash || location.hash === '#') {
    location.hash = '#/';
} else {
    navigate();
}

// Handle the case where hash is already #/ on load
window.addEventListener('DOMContentLoaded', () => {
    if (location.hash === '#/') navigate();
});

// If script runs after DOMContentLoaded
if (document.readyState !== 'loading') {
    navigate();
}
