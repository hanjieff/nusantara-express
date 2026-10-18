(function () {
    const user = window.NX.requireLogin();
    if (!user) return;
    window.NX.paintChrome(user);

    const store = window.NX_STORE;
    const ROUTES = window.NX_ROUTES;
    const grid = document.getElementById('route-grid');
    const template = document.getElementById('tpl-route');
    const searchFrom = document.getElementById('search-from');
    const searchTo = document.getElementById('search-to');
    const searchDate = document.getElementById('search-date');

    window.NX_CITIES.forEach((city) => {
        searchFrom.append(new Option(city, city));
        searchTo.append(new Option(city, city));
    });
    searchFrom.value = 'Jakarta';
    searchTo.value = 'Bandung';
    searchDate.min = window.NX.todayISO();
    searchDate.value = window.NX.todayISO();

    document.getElementById('count-all').textContent = String(ROUTES.length).padStart(2, '0');
    document.getElementById('count-jawa').textContent = String(ROUTES.filter((r) => r.region === 'Jawa').length).padStart(2, '0');
    document.getElementById('count-sumatra').textContent = String(ROUTES.filter((r) => r.region === 'Sumatra').length).padStart(2, '0');
    document.getElementById('hero-meta').textContent = `${ROUTES.length} routes · 2 islands`;

    function cardFor(route) {
        const node = template.content.cloneNode(true).querySelector('article');
        const set = (field, value) => node.querySelector(`[data-field="${field}"]`).textContent = value;
        set('region', route.region);
        set('from', route.from);
        set('to', route.to);
        set('duration', route.duration);
        set('departures', `${route.times.length} keberangkatan`);
        set('note', `${route.note} · ${route.operator}`);
        set('price', window.NX.money(route.price));
        node.querySelector('.route-art').style.setProperty('--art-a', route.region === 'Jawa' ? '#8FAE8A' : '#6E9169');
        node.querySelector('.route-art').style.setProperty('--art-b', '#D9C9A8');
        node.querySelector('[data-field="choose"]').addEventListener('click', () => openRoute(route));
        return node;
    }

    function openRoute(route) {
        window.NX.newDraft(route, user);
        window.location.href = 'rute.html';
    }

    function renderGrid(region) {
        const visible = ROUTES.filter((r) => region === 'Semua' || r.region === region);
        grid.replaceChildren(...visible.map(cardFor));
        document.getElementById('route-empty').hidden = visible.length > 0;
    }

    document.querySelectorAll('#filter-tabs .tab').forEach((tab) => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('#filter-tabs .tab').forEach((t) => t.classList.toggle('active', t === tab));
            renderGrid(tab.dataset.region);
        });
    });

    document.getElementById('btn-swap').addEventListener('click', () => {
        const from = searchFrom.value;
        searchFrom.value = searchTo.value;
        searchTo.value = from;
    });

    document.getElementById('form-search').addEventListener('submit', (event) => {
        event.preventDefault();
        const from = searchFrom.value;
        const to = searchTo.value;
        if (from === to) return window.NX.toast('Kota asal dan tujuan tidak boleh sama.');

        const match = ROUTES.find((r) => r.from === from && r.to === to);
        if (!match) return window.NX.toast('Belum ada rute langsung ${from} ke ${to}.');

        const draft = window.NX.newDraft(match, user);
        if (searchDate.value && searchDate.value >= window.NX.todayISO()) draft.date = searchDate.value;
        store.setDraft(draft);
        window.location.href = 'rute.html';
    });

    renderGrid('Semua');
})();