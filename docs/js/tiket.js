(function () {
  const user = window.NX.requireLogin();
  if (!user) return;

  const store = window.NX_STORE;
  const NX = window.NX;
  const order = store.getLastOrder();

  NX.paintChrome(user);

  if (!order || order.userId !== user.id) {
    window.location.href = 'pesanan.html';
    return;
  }

  function barcode(seed) {
    let n = 0;
    for (const ch of seed) n = (n * 31 + ch.charCodeAt(0)) >>> 0;
    const bars = [];
    for (let i = 0; i < 46; i++) {
      n = (n * 1103515245 + 12345) >>> 0;
      const bar = document.createElement('i');
      bar.style.height = `${18 + (n % 21)}px`;
      bars.push(bar);
    }
    document.getElementById('tiket-barcode').replaceChildren(...bars);
  }

  function paint(current) {
    const cancelled = current.status === 'cancelled';
    const discount = current.discount || 0;
    NX.fill('tiket-heading', cancelled ? 'Pesanan dibatalkan' : 'Pembayaran berhasil');
    NX.fill(
      'tiket-sub',
      cancelled
        ? `Tiket ${current.code} tidak berlaku lagi.`
        : `Tiket ${current.code} sudah tersimpan di Pesanan saya.`,
    );
    NX.fill('tiket-code', current.code);
    NX.fill('tiket-route', `${current.from} → ${current.to}`);
    NX.fill('tiket-class', `${current.classLabel || 'Ekonomi'} · ${current.layout || '3-2'}`);
    NX.fill('tiket-date', NX.longDate(current.date));
    NX.fill('tiket-time', current.time);
    NX.fill('tiket-name', current.passenger.name);
    NX.fill('tiket-seats', current.seats.join(', '));
    NX.fill('tiket-operator', current.operator);
    NX.fill('tiket-method', current.methodLabel);
    document.getElementById('tiket-discount-cell').hidden = discount <= 0;
    NX.fill('tiket-discount', `− ${NX.money(discount)}`);
    NX.fill('tiket-total', NX.money(current.total));
    NX.fill('tiket-stub-meta', `${current.from} · ${current.classLabel || 'Ekonomi'} · ${current.pax} kursi`);
    document.getElementById('tiket-cancelled').hidden = !cancelled;
    document.getElementById('btn-cancel').hidden = cancelled;
    barcode(current.code);
  }

  document.getElementById('btn-cancel').addEventListener('click', () => {
    const updated = store.updateOrder(order.id, user.id, { status: 'cancelled' });
    if (!updated) return;
    store.setLastOrder(updated);
    paint(updated);
    NX.fill('order-count', store.listOrders(user.id).filter((o) => o.status === 'paid').length);
    NX.toast('Pesanan dibatalkan.');
  });

  paint(order);
})();
