window.NX_CLASSES = [
  { id: 'ekonomi', label: 'Ekonomi', layout: '3-2', perks: 'AC, kursi tegak' },
  { id: 'bisnis', label: 'Bisnis', layout: '2-2', perks: 'Recliner, bantal & selimut' },
  { id: 'eksekutif', label: 'Eksekutif', layout: '2-1', perks: 'Legas seat, snack, port USB' },
];

// More than two seats in one booking, so three or more, is priced 10% lower.
window.NX_GROUP_DISCOUNT = { minPax: 3, rate: 0.1 };

window.NX_ROUTES = [
  {
    id: 'jkt-bd',
    region: 'Jawa',
    from: 'Jakarta',
    to: 'Bandung',
    duration: '3h 30m',
    kelas: { ekonomi: 125000, bisnis: 165000, eksekutif: 210000 },
    times: ['07:00', '13:30', '19:00'],
    operator: 'Budiyono Transex',
    note: 'Tol Cipularang, kursi recliner',
  },
  {
    id: 'bd-pgr',
    region: 'Jawa',
    from: 'Bandung',
    to: 'Pangandaran',
    duration: '6h 00m',
    kelas: { ekonomi: 160000, bisnis: 210000, eksekutif: 265000 },
    times: ['06:00', '21:00'],
    operator: 'Pahala Kencana',
    note: 'Lewat Tasikmalaya, ada rest area',
  },
  {
    id: 'yk-wsb',
    region: 'Jawa',
    from: 'Yogyakarta',
    to: 'Wonosobo',
    duration: '2h 45m',
    kelas: { ekonomi: 95000, bisnis: 125000, eksekutif: 160000 },
    times: ['08:15', '14:00', '17:30'],
    operator: 'Mitra Mayasari',
    note: 'Jalur pegunungan, dekat Dieng',
  },
  {
    id: 'sby-mlg',
    region: 'Jawa',
    from: 'Surabaya',
    to: 'Malang',
    duration: '2h 15m',
    kelas: { ekonomi: 85000, bisnis: 110000, eksekutif: 145000 },
    times: ['06:30', '12:00', '16:45'],
    operator: 'Sri Padmali',
    note: 'Via tol Pandaan, paling sering',
  },
  {
    id: 'mdn-brt',
    region: 'Sumatra',
    from: 'Medan',
    to: 'Berastagi',
    duration: '2h 30m',
    kelas: { ekonomi: 90000, bisnis: 120000, eksekutif: 155000 },
    times: ['07:00', '13:00'],
    operator: 'Rudyansyah',
    note: 'Naik ke dataran tinggi, bawa jaket',
  },
  {
    id: 'pd-bkt',
    region: 'Sumatra',
    from: 'Padang',
    to: 'Bukittinggi',
    duration: '2h 45m',
    kelas: { ekonomi: 55000, bisnis: 75000, eksekutif: 95000 },
    times: ['08:00', '15:00'],
    operator: 'NTS Transport',
    note: 'Lewat Lembah Anai',
  },
  {
    id: 'plm-pgm',
    region: 'Sumatra',
    from: 'Palembang',
    to: 'Pagaralam',
    duration: '6h 30m',
    kelas: { ekonomi: 160000, bisnis: 205000, eksekutif: 260000 },
    times: ['07:00', '20:00'],
    operator: 'New Balap Karo',
    note: 'Jauh, tersedia snack di perjalanan',
  },
];

// Ekonomi is the cheapest class, so it doubles as the "mulai dari" price on the cards.
window.NX_ROUTES.forEach((route) => {
  route.price = route.kelas.ekonomi;
});

window.NX_REGIONS = ['Jawa', 'Sumatra'];

window.NX_CITIES = [...new Set(window.NX_ROUTES.flatMap((r) => [r.from, r.to]))];

window.NX_PAYMENTS = [
  { id: 'qris', label: 'QRIS', hint: 'Scan dengan aplikasi apa pun', icon: 'card' },
  { id: 'bank', label: 'Transfer bank', hint: 'BCA, Mandiri, BNI, BRI', icon: 'bank' },
  { id: 'ewallet', label: 'E-wallet', hint: 'GoPay, OVO, DANA, ShopeePay', icon: 'wallet' },
];
