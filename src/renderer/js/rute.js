(function () {
  const ctx = window.NX.requireDraft();
  if (!ctx) return;

  const store = window.NX_STORE;
  const NX = window.NX;
  const { draft, route } = ctx;
  const chips = document.getElementById('time-chips');
  const chipTpl = document.getElementById('tpl-time');
  const kelasList = document.getElementById('kelas-list');
  const kelasTpl = document.getElementById('tpl-kelas');
  const dateInput = document.getElementById('trip-date');

  NX.paintChrome(ctx.user);
  NX.fill('head-from', route.from);
  NX.fill('head-to', route.to);
  NX.fill('head-sub', `${route.duration} · ${route.region} · ${route.operator}`);

  function save() {
    store.setDraft(draft);
    NX.paintSummary(route, draft);
  }

  function paintPax() {
    NX.fill('pax-label', draft.pax);
    NX.fill('pax-value', draft.pax);
    document.getElementById('pax-minus').disabled = draft.pax <= 1;
    document.getElementById('pax-plus').disabled = draft.pax >= 4;
    paintDiscountNote();
  }

  function paintDiscountNote() {
    const rule = window.NX_GROUP_DISCOUNT;
    const price = NX.priceFor(route, draft);
    NX.fill(
      'disc-note-text',
      price.discounted
        ? `Diskon ${Math.round(rule.rate * 100)}% aktif untuk ${draft.pax} kursi. Hemat ${NX.money(price.saved)}.`
        : `Pesan ${rule.minPax} kursi atau lebih dalam satu pemesanan dan dapat diskon ${Math.round(rule.rate * 100)}%.`,
    );
  }

  function paintKelas() {
    kelasList.querySelectorAll('.kelas-opt').forEach((option) => {
      option.classList.toggle('active', option.dataset.classId === draft.classId);
    });
  }

  function paintDayname() {
    NX.fill('trip-dayname', NX.longDate(draft.date));
  }

  kelasList.replaceChildren(
    ...window.NX_CLASSES.map((kelas) => {
      const option = kelasTpl.content.cloneNode(true).querySelector('.kelas-opt');
      option.dataset.classId = kelas.id;
      option.querySelector('[data-field="label"]').textContent = `${kelas.label} · ${kelas.layout}`;
      option.querySelector('[data-field="perks"]').textContent = kelas.perks;
      option.querySelector('[data-field="price"]').textContent = NX.money(route.kelas[kelas.id]);
      option.addEventListener('click', () => {
        draft.classId = kelas.id;
        paintKelas();
        paintDiscountNote();
        save();
      });
      return option;
    }),
  );

  chips.replaceChildren(
    ...route.times.map((time) => {
      const chip = chipTpl.content.cloneNode(true).querySelector('.chip');
      chip.dataset.time = time;
      chip.querySelector('[data-field="time"]').textContent = time;
      chip.classList.toggle('active', time === draft.time);
      chip.addEventListener('click', () => {
        draft.time = time;
        chips.querySelectorAll('.chip').forEach((el) => el.classList.toggle('active', el === chip));
        save();
      });
      return chip;
    }),
  );

  dateInput.min = NX.todayISO();
  dateInput.value = draft.date;
  dateInput.addEventListener('change', () => {
    if (!dateInput.value) return;
    if (dateInput.value < NX.todayISO()) {
      dateInput.value = draft.date;
      return NX.toast('Tanggal tidak boleh sebelum hari ini.');
    }
    draft.date = dateInput.value;
    paintDayname();
    save();
  });

  document.getElementById('pax-minus').addEventListener('click', () => {
    draft.pax = Math.max(1, draft.pax - 1);
    paintPax();
    save();
  });

  document.getElementById('pax-plus').addEventListener('click', () => {
    draft.pax = Math.min(4, draft.pax + 1);
    paintPax();
    save();
  });

  document.getElementById('btn-continue').addEventListener('click', () => {
    save();
    window.location.href = 'penumpang.html';
  });

  paintKelas();
  paintDayname();
  paintPax();
  NX.paintSummary(route, draft);
})();
