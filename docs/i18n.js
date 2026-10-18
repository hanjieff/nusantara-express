// i18n.js -- tombol ganti bahasa ID/EN. Tidak mengubah file lain.
(function () {
  'use strict';

  const STORAGE_KEY = 'nx_bahasa';

  // Kunci = teks Indonesia PERHURUF (spasi dalam diabaikan), nilai = teks Inggris.
  // Hanya teks yang ada di sini yang diterjemahkan, jadi menambahkan kamus = menambahkan fitur.
  const DICT = {
    // --- topbar (index.html 27-35, rute.html 27-35) ---
    'Beranda': 'Home',
    'Pesanan saya': 'My orders',
    'Keluar': 'Log out',

    // --- index.html: hero + daftar rute ---
    'Perjalanan lokal, cerita yang tinggal': 'Local journeys, stories that stay',
    'Jelajahi pulau-pulau Indonesia dengan nyaman.': 'Explore the Indonesian islands in comfort.',
    'Pesan perjalanan antarkota yang hangat, sederhana, dan terpercaya.':
      'Book intercity trips that are warm, simple, and trustworthy.',
    'Dari': 'From',
    'Ke': 'To',
    'Tanggal perjalanan': 'Travel date',
    'Cari perjalanan': 'Search trips',
    'Tukar kota': 'Swap cities',
    'Rute pilihan': 'Featured routes',
    'Semua rute': 'All routes',
    'Pilih rute': 'Choose route',
    '/ orang': '/ person',
    'Tidak ada rute untuk filter ini.': 'No routes for this filter.',
    'NusantaraExpress 1.0.0 · Data pesanan tersimpan lokal di perangkat ini, tanpa database.':
      'NusantaraExpress 1.0.0 · Order data is stored locally on this device, with no database.',

    // --- login.html ---
    'Masuk': 'Log in',
    'Daftar': 'Sign up',
    'Selamat datang kembali': 'Welcome back',
    'Buat akun kamu': 'Create your account',
    'Masuk untuk melanjutkan perjalanan.': 'Log in to continue your trip.',
    'Isi datamu, akun tersimpan di perangkat ini saja.':
      'Fill in your details, the account is stored on this device only.',
    'Nama lengkap': 'Full name',
    'Nomor telepon': 'Phone number',
    'Nama kamu': 'Your name',
    'Minimal 6 karakter': 'At least 6 characters',
    'Daftar sekarang': 'Sign up now',
    'Belum punya akun?': 'No account yet?',
    'Sudah punya akun?': 'Already have an account?',
    'Daftar di sini': 'Sign up here',
    '4 rute Jawa · 3 rute Sumatra': '4 Java routes · 3 Sumatra routes',
    'Tiket digital dengan kode booking': 'Digital tickets with a booking code',
    'Pembayaran simulasi, tanpa biaya sungguhan': 'Simulated payment, no real charges',
    'Pesan tiket bus antarkota untuk 7 rute pilihan di Jawa dan Sumatra. Hangat, sederhana, terpercaya.':
      'Book intercity bus tickets for 7 featured routes across Java and Sumatra. Warm, simple, trustworthy.',
    'tidak memakai database': 'uses no database',

    // --- rute.html ---
    'Pilih kelas': 'Choose a class',
    'Pilih waktu keberangkatan': 'Choose a departure time',
    'Kapan kamu ingin berangkat?': 'When do you want to travel?',
    'Penumpang': 'Passengers',
    'penumpang · kursi': 'passengers · seats',
    'Maksimal 4 kursi untuk satu kali pemesanan.': 'Up to 4 seats per booking.',
    'Isi data penumpang': 'Fill in passenger data',
    'Ringkasan perjalanan': 'Trip summary',
    'Semua kelas sudah termasuk AC dan satu kelas kabin.':
      'All classes include air conditioning and one cabin class.',

    // --- judul tab browser ---
    'Beranda — NusantaraExpress': 'Home — NusantaraExpress',
    'Masuk — NusantaraExpress': 'Log in — NusantaraExpress',
    'Pilih perjalanan — NusantaraExpress': 'Choose a trip — NusantaraExpress',

        // --- stepper (rute/penumpang/bayar) ---
    'Perjalanan': 'Trip',
    'Pembayaran': 'Payment',

    // --- ringkasan perjalanan ---
    'Kelas': 'Class',
    'Keberangkatan': 'Departure',
    'Harga per kursi': 'Price per seat',
    'Subtotal': 'Subtotal',
    'Diskon rombongan (10%)': 'Group discount (10%)',
    'Operator': 'Operator',
    'Total': 'Total',
    '1 kursi': '1 seat', '2 kursi': '2 seats', '3 kursi': '3 seats', '4 kursi': '4 seats',
    '2 keberangkatan': '2 departures', '3 keberangkatan': '3 departures',
    '7 rute · 2 pulau': '7 routes · 2 islands',
    'dari': 'from',

    // --- bayar / tiket / pesanan ---
    'Pembayaran simulasi': 'Simulated payment',
    'Pembayaran demo saja. Tidak ada biaya sungguhan yang dibuat.':
      'Demo payment only. No real charge is ever created.',
    'Bayar & dapatkan tiket': 'Pay & get your ticket',
    'Pembayaran berhasil': 'Payment successful',
    'Pesanan dibatalkan': 'Order cancelled',
    'Metode pembayaran': 'Payment method',
    'Transfer bank': 'Bank transfer',
    'Lunas': 'Paid',
    'Dibatalkan': 'Cancelled',
    'Lihat tiket': 'View ticket',
    'Kembali': 'Back',
    'Belum ada pesanan.': 'No orders yet.',

    // --- pesan validasi store.js & penumpang.js ---
    'Nama lengkap masih kosong.': 'Full name is required.',
    'Format email belum benar.': 'That email address is not valid.',
    'Nomor telepon harus aktif, contoh 081234567890.':
      'The phone number must be valid, e.g. 081234567890.',
    'Password minimal 6 karakter.': 'Password needs at least 6 characters.',
    'Email ini sudah terdaftar. Silakan masuk.': 'This email is already registered. Please log in.',
    'Email belum terdaftar.': 'That email is not registered yet.',
    'Password salah.': 'Wrong password.',
    'Nama lengkap wajib diisi.': 'Full name is required.',
    'Email belum valid.': 'That email is not valid.',
    'Nomor telepon belum valid.': 'That phone number is not valid.',
    'Tanggal tidak boleh sebelum hari ini.': 'The date cannot be before today.',
    'Kota asal dan tujuan tidak boleh sama.': 'Origin and destination must differ.',
  };

  // Atribut yang ikut diterjemahkan. data-region sengaja TIDAK ikut,
  // karena filter rute membacanya untuk membandingkan, bukan untuk ditampilkan.
  const ATTRS = ['placeholder', 'title', 'aria-label'];

  const originalText = new WeakMap(); // node teks -> teks asli, supaya balik ke ID 100% sama
  const originalAttr = new WeakMap();  // elemen -> { placeholder: '...' }
  let lang = localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'id';
  let originalTitle = null;

  const norm = (value) => value.replace(/\s+/g, ' ').trim();

  // Tombol buatan sendiri tidak boleh ikut diterjemahkan.
  function isMine(node) {
    const host = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    return host === null || host.closest('.nx-lang') !== null;
  }

  function runText(node) {
    const raw = node.nodeValue;
    if (raw === null) return;
    if (lang === 'id') {
      if (!originalText.has(node)) return;
      const restored = originalText.get(node);
      originalText.delete(node);                 // <- ini yang menghilangkan loop
      if (node.nodeValue !== restored) node.nodeValue = restored;   // <- dan ini
      return;
    }
    if (norm(raw) === '') return;
    const parts = /^(\s*)([\s\S]*?)(\s*)$/.exec(raw);
    const english = DICT[norm(parts[2])];
    if (!english) return;
    const next = parts[1] + english + parts[3];
    if (node.nodeValue === next) return;
    originalText.set(node, raw);
    node.nodeValue = next;
  }

  function runAttrs(el) {
    if (lang === 'id') {
      const saved = originalAttr.get(el);
      if (!saved) return;
      originalAttr.delete(el);
      Object.keys(saved).forEach((attr) => {
        if (el.getAttribute(attr) !== saved[attr]) el.setAttribute(attr, saved[attr]);
      });
      return;
    }
    ATTRS.forEach((attr) => {
      const current = el.getAttribute(attr);
      if (current === null) return;
      const english = DICT[norm(current)];
      if (!english || current === english) return;
      const saved = originalAttr.get(el) || {};
      if (!(attr in saved)) {
        saved[attr] = current;
        originalAttr.set(el, saved);
      }
      el.setAttribute(attr, english);
    });
  }

  function runTitle() {
    const current = norm(document.title);
    if (lang === 'en') {
      const english = DICT[current];
      if (english) {
        originalTitle = document.title;
        document.title = english;
      }
      return;
    }
    if (originalTitle !== null) {
      document.title = originalTitle;
      originalTitle = null;
    }
  }

  function refresh() {
    observer.disconnect();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!isMine(node)) runText(node);
    }
    document.querySelectorAll('body *').forEach((el) => {
      if (!isMine(el)) runAttrs(el);
    });
    runTitle();
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'nx-lang';
  // Semua style ditulis inline supaya styles.css tidak perlu disentuh.
  button.style.cssText =
    'display:inline-flex;align-items:center;border:1px solid var(--line);background:var(--card);' +
    'color:var(--green);border-radius:999px;padding:7px 13px;font:600 12px var(--sans);' +
    'cursor:pointer;white-space:nowrap;';

  function paintButton() {
    button.textContent = lang === 'en' ? 'EN / ID' : 'ID / EN';
    button.title = lang === 'en' ? 'Kembali ke bahasa Indonesia' : 'Translate to English';
  }

  button.addEventListener('click', () => {
    lang = lang === 'en' ? 'id' : 'en';
    localStorage.setItem(STORAGE_KEY, lang);
    refresh();
    paintButton();
  });

  const chip = document.querySelector('.user-chip');
  if (chip) {
    chip.parentNode.insertBefore(button, chip);
  } else {
    // Halaman login tidak punya topbar: tempel di pojok kanan atas.
    button.style.position = 'fixed';
    button.style.top = '14px';
    button.style.right = '14px';
    button.style.boxShadow = 'var(--shadow)';
    document.body.appendChild(button);
  }

  // Teks yang ditulis JS setelah halaman tampil (kartu rute, toast, ringkasan) ikut diterjemahkan.
  const observer = new MutationObserver((records) => {
    let addedNode = false;
    records.forEach((record) => {
      if (record.type === 'characterData') {
        if (!isMine(record.target)) runText(record.target);
        return;
      }
      if (record.addedNodes.length > 0) addedNode = true;
    });
    if (addedNode) refresh();
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  // NX_I18N.missing() di DevTools -> daftar teks yang belum ada di kamus.
  window.NX_I18N = {
    lang: () => lang,
    dict: DICT,
    missing() {
      const out = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const key = norm(node.nodeValue);
        if (key.length > 1 && !DICT[key] && !originalText.has(node)) out.push(key);
      }
      return Array.from(new Set(out));
    }
  };

  paintButton();
  refresh();
})();