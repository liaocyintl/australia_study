const routes = {
    '':             () => import('./universities.js'),
    'cities':       () => import('./cities.js'),
    'work':         () => import('./work.js'),
    'career':       () => import('./career.js'),
    'lifestyle':    () => import('./lifestyle.js'),
};

let currentModule = null;
let navigating = false;
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
    if (navigating) return;
    navigating = true;

    try {
        const hash = location.hash.slice(2) || '';
        const route = hash.split('/')[0];
        const loader = routes[route];

        if (!loader) {
            location.hash = '#/';
            return;
        }

        if (currentModule?.destroy) currentModule.destroy();
        currentModule = null;

        content.innerHTML = '<div class="loading">加载中...</div>';
        updateActiveNav(route);

        const mod = await loader();
        currentModule = mod;
        await mod.init(content, loadCSS);

        window.scrollTo(0, 0);
    } finally {
        navigating = false;
    }
}

window.addEventListener('hashchange', navigate);

// Single entry point for initial load
if (!location.hash || location.hash === '#') {
    location.hash = '#/';
} else {
    navigate();
}
