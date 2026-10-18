(function () {
  const ctx = window.NX.requireDraft();
  if (!ctx) return;

  const store = window.NX_STORE;
  const NX = window.NX;
  const { draft, route } = ctx;
  const form = document.getElementById('form-penumpang');
  const errorBox = document.getElementById('pax-error');
  const fields = {
    name: document.getElementById('pax-name'),
    email: document.getElementById('pax-email'),
    phone: document.getElementById('pax-phone'),
  };

  NX.paintChrome(ctx.user);
  NX.fill('head-from', route.from);
  NX.fill('head-to', route.to);
  NX.fill('head-sub', `${route.duration} · ${route.region}`);

  Object.entries(fields).forEach(([key, input]) => {
    input.value = draft[key];
    input.addEventListener('input', () => {
      draft[key] = input.value;
      input.classList.remove('invalid');
      errorBox.hidden = true;
    });
  });

  document.getElementById('pax-note').textContent =
    `Data ini dipakai untuk identitas tiket${draft.pax > 1 ? ` dan berlaku untuk ${draft.pax} kursi` : ''}.`;

  function validate() {
    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const phone = fields.phone.value.trim();
    const errors = {};
    if (!name) errors.name = 'Nama lengkap wajib diisi.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Email belum valid.';
    if (!/^(\+62|62|0)8[1-9][0-9\s-]{6,}$/.test(phone)) errors.phone = 'Nomor telepon belum valid.';
    return errors;
  }

  function goPayment() {
    draft.name = fields.name.value.trim();
    draft.email = fields.email.value.trim();
    draft.phone = fields.phone.value.trim();
    store.setDraft(draft);
    window.location.href = 'bayar.html';
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const errors = validate();
    const first = Object.keys(errors)[0];
    Object.entries(fields).forEach(([key, input]) => input.classList.toggle('invalid', Boolean(errors[key])));
    if (first) {
      errorBox.textContent = errors[first];
      errorBox.hidden = false;
      fields[first].focus();
      return;
    }
    goPayment();
  });

  document.getElementById('btn-back').addEventListener('click', () => {
    window.location.href = 'rute.html';
  });

  document.getElementById('btn-continue').addEventListener('click', () => {
    form.dispatchEvent(new Event('submit', { cancelable: true }));
  });

  NX.paintSummary(route, draft);
})();
