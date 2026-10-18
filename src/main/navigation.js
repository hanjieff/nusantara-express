const PAGES = new Set([
    'login.html',
    'index.html',
    'rute.html',
    'penumpang.html',
    'bayar.html',
    'tiket.html',
    'pesanan.html',
]);

// The app is multi-page, so in-app navigation must pass while anything pointing
// outside the renderer folder is refused.
function isInternalNavigation(url) {
    try {
        const target = new URL(url);
        if (target.protocol !== 'file:') return false;
        return PAGES.has(decodeURIComponent(target.pathname).split('/').pop());
    } catch {
        return false;
    }
}

module.exports = { PAGES, isInternalNavigation };