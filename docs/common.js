(function () {
  const store = window.NX_STORE;

  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function money(value) {
    return `Rp ${value.toLocaleString('id-ID')}`;
  }

  function prettyDate(iso) {
    if (!iso) return '-';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  function longDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return `${DAY_NAMES[new Date(y, m - 1, d).getDay()]}, ${d} ${MONTH_NAMES[m - 1]} ${y}`;
  }

  function fill(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function toast(message) {
    const el = document.getElementById('toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  function requireLogin() {
    const user = store.currentUser();
    if (!user) {
      window.location.replace('login.html');
      return null;
    }
    return user;
  }

  // Shared header/footer live as real markup in every page; this only fills the
  // parts that depend on who is logged in and how many orders they have.
  function paintChrome(user) {
    fill('user-name', user.name.split(' ')[0]);
    const avatar = document.getElementById('user-avatar');
    if (avatar) avatar.textContent = user.name.charAt(0).toUpperCase();
    fill('order-count', store.listOrders(user.id).filter((o) => o.status === 'paid').length);

    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-btn').forEach((link) => {
      if (link.getAttribute('href') === page) link.classList.add('active');
    });

    const logout = document.getElementById('btn-logout');
    if (logout) {
      logout.addEventListener('click', () => {
        store.logout();
        window.location.href = 'login.html';
      });
    }
  }

  function routeById(id) {
    return window.NX_ROUTES.find((r) => r.id === id);
  }

  function kelasOf(id) {
    return window.NX_CLASSES.find((c) => c.id === id) || window.NX_CLASSES[0];
  }

  // One place computes money so the trip, passenger, payment and ticket pages
  // can never disagree about what the booking costs.
  function priceFor(route, draft) {
    const kelas = kelasOf(draft.classId);
    const unit = route.kelas[kelas.id];
    const subtotal = unit * draft.pax;
    const rule = window.NX_GROUP_DISCOUNT;
    const discounted = draft.pax >= rule.minPax;
    const total = discounted ? Math.round(subtotal * (1 - rule.rate)) : subtotal;
    return { kelas, unit, subtotal, discounted, saved: subtotal - total, total };
  }

  function newDraft(route, user) {
    const existing = store.getDraft();
    return store.setDraft({
        routeId: route.id,
        date: existing && existing.routeId === route.id && existing.date >= todayISO() ? existing.date : todayISO(),
        time: route.times[0],
        classId: window.NX_CLASSES[0].id,
        pax: 1,
        name: user.name,
        email: user.email,
        phone: user.phone,
        method: window.NX_PAYMENTS[0].id,
    });
  }

  // Every booking page needs the same guard: a draft that still matches a real route.
  function requireDraft() {
    const user = requireLogin();
    if (!user) return null;
    const draft = store.getDraft();
    const route = draft && routeById(draft.routeId);
    if (!route) {
        window.location.href = 'index.html';
        return null;
    }
    return { user, draft, route };
  }

  function paintSummary(route, draft) {
    const price = priceFor(route, draft);
    fill('sum-from', route.from);
    fill('sum-to', route.to);
    fill('sum-duration', route.duration);
    fill('sum-class', `${price.kelas.label} · ${price.kelas.layout}`);
    fill('sum-date', draft.date);
    fill('sum-time', draft.time);
    fill('sum-unit', `${money(price.unit)} / kursi`);
    fill('sum-pax', `${draft.pax} kursi`);
    fill('sum-subtotal', money(price.subtotal));
    fill('sum-operator', route.operator);
    fill('sum-total', money(price.total));

    const row = document.getElementById('row-discount');
    if (row) {
        row.hidden = !price.discounted;
        fill('sum-discount', `- ${money(price.saved)}`);
    }
  }

  window.NX = {
    todayISO,
    money,
    prettyDate,
    longDate,
    fill,
    toast,
    kelasOf,
    priceFor,
    requireLogin,
    requireDraft,
    paintChrome,
    paintSummary,
    routeById,
    newDraft,
  };
})();