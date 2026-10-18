(function () {
  const user = window.NX.requireLogin();
  if (!user) return;

  const store = window.NX_STORE;
  const NX = window.NX;
  const list = document.getElementById('order-list');
  const template = document.getElementById('tpl-order');

  NX.paintChrome(user);

  function rowFor(order) {
    const node = template.content.cloneNode(true).querySelector('article');
    const set = (field, value) => {
      node.querySelector(`[data-field="${field}"]`).textContent = value;
    };
    const cancelled = order.status === 'cancelled';

    set('from', order.from);
    set('to', order.to);
    set('code', order.code);
    set('when', `${NX.prettyDate(order.date)} · ${order.time}`);
    set('kelas', `${order.classLabel || 'Ekonomi'} · ${order.layout || '3-2'}`);
    set('pax', `${order.pax} penumpang · ${order.seats.join(', ')}`);
    set('method', order.methodLabel);
    set('total', NX.money(order.total));

    const status = node.querySelector('[data-field="status"]');
    status.textContent = cancelled ? 'Dibatalkan' : 'Lunas';
    status.classList.add(cancelled ? 'cancelled' : 'paid');

    node.querySelector('[data-field="ticket"]').addEventListener('click', () => {
      store.setLastOrder(order);
      window.location.href = 'tiket.html';
    });

    const cancel = node.querySelector('[data-field="cancel"]');
    if (cancelled) {
      cancel.remove();
    } else {
      cancel.addEventListener('click', () => {
        const updated = store.updateOrder(order.id, user.id, { status: 'cancelled' });
        if (!updated) return;
        render();
        NX.toast(`Pesanan ${order.code} dibatalkan.`);
      });
    }
    return node;
  }

  function render() {
    const orders = store.listOrders(user.id);
    list.replaceChildren(...orders.map(rowFor));
    document.getElementById('order-empty').hidden = orders.length > 0;
    NX.fill('order-count', orders.filter((o) => o.status === 'paid').length);
  }

  render();
})();
