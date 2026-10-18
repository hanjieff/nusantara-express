(function () {
  const ctx = window.NX.requireDraft();
  if (!ctx) return;

  const store = window.NX_STORE;
  const NX = window.NX;
  const { draft, route } = ctx;
  const options = Array.from(document.querySelectorAll('#pay-list .pay-opt'));

  NX.paintChrome(ctx.user);
  NX.fill('head-from', route.from);
  NX.fill('head-to', route.to);
  NX.fill('head-sub', `${route.duration} · ${route.region}`);

  function paintMethods() {
    options.forEach((button) => {
      button.classList.toggle('active', button.dataset.method === draft.method);
    });
  }

  options.forEach((button) => {
    button.addEventListener('click', () => {
      draft.method = button.dataset.method;
      store.setDraft(draft);
      paintMethods();
    });
  });

  document.getElementById('btn-back').addEventListener('click', () => {
    window.location.href = 'penumpang.html';
  });

  document.getElementById('btn-pay').addEventListener('click', () => {
    const method = window.NX_PAYMENTS.find((p) => p.id === draft.method);
    const price = NX.priceFor(route, draft);
    const order = {
      id: store.randomId(),
      code: `NX-${store.randomId()}`,
      userId: ctx.user.id,
      routeId: route.id,
      from: route.from,
      to: route.to,
      duration: route.duration,
      region: route.region,
      operator: route.operator,
      date: draft.date,
      time: draft.time,
      pax: draft.pax,
      classId: price.kelas.id,
      classLabel: price.kelas.label,
      layout: price.kelas.layout,
      seats: Array.from({ length: draft.pax }, (_, i) => `${'ABCD'[i]}${1 + (route.id.charCodeAt(0) % 20)}`),
      price: price.unit,
      subtotal: price.subtotal,
      discount: price.saved,
      total: price.total,
      passenger: { name: draft.name, email: draft.email, phone: draft.phone },
      method: method.id,
      methodLabel: method.label,
      status: 'paid',
      createdAt: new Date().toISOString(),
    };

    store.saveOrder(order);
    store.setLastOrder(order);
    store.setDraft(null);
    window.location.href = 'tiket.html';
  });

  paintMethods();
  NX.paintSummary(route, draft);
})();
