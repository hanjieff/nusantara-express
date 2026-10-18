# NusantaraExpress

Aplikasi desktop pembelian tiket bus antarkota untuk **7 rute tetap** di Jawa dan
Sumatra. Dibangun dengan Electron dan JavaScript murni — **tanpa database, tanpa
server, tanpa API key**. Seluruh data akun, sesi, dan pesanan hidup di penyimpanan
lokal perangkat tempat aplikasi dipasang.

Repo: https://github.com/hanjieff/nusantara-express

## Fitur

| Layar | Berkas | Isi |
|---|---|---|
| Masuk / Daftar | `login.html` | dua tab dalam satu kartu, validasi email + nomor Indonesia, password di-hash |
| Beranda | `index.html` | form cari (asal, tujuan, tanggal), tukar kota, filter region, 7 kartu rute |
| Pilih perjalanan | `rute.html` | kelas, tanggal, jam keberangkatan, jumlah kursi, ringkasan harga + diskon |
| Data penumpang | `penumpang.html` | nama, email, telepon; salah isi ditandai merah dan tidak lanjut |
| Pembayaran | `bayar.html` | QRIS / transfer bank / e-wallet, semuanya simulasi |
| Tiket | `tiket.html` | kode booking, barcode hasil render, pembatalan |
| Pesanan saya | `pesanan.html` | riwayat milik akun yang sedang masuk, buka ulang tiket, batalkan |

## Cara menjalankan

```bash
git clone https://github.com/hanjieff/nusantara-express.git
cd nusantara-express
npm install
npm start
```

Butuh Node.js 20 ke atas. `node_modules/` sengaja tidak ikut di-repo karena bisa
dibangun ulang lewat `npm install`.

| Perintah | Hasil |
|---|---|
| `npm start` | menjalankan aplikasi |
| `npm run preview` | menjalankan sambil membuka DevTools terpisah |
| `npm run dist` | menghasilkan `.exe` portable + installer NSIS di folder `dist/` |
| `npm run dist:dir` | paket tanpa installer, cepat untuk cek apakah ikon dan berkas masuk |

## Teknologi

| Bagian | Pilihan | Alasan |
|---|---|---|
| Shell desktop | Electron 33 | satu basis kode HTML/CSS/JS, tetap jadi aplikasi `.exe` |
| Bahasa | JavaScript murni, tanpa framework | alurnya pendek, tidak perlu build step |
| Data | `localStorage` | aturan tugas: tidak memakai database |
| Sandi | Web Crypto `SHA-256` + salt acak per akun | sandi tidak pernah ditulis apa adanya |
| Bundling | electron-builder 25 | target `portable` dan `nsis` untuk Windows x64 |

## Struktur folder

```
.
├── build/icon.png        ikon untuk .exe dan installer
├── src
│   ├── main
│   │   ├── main.js        jendela, kunci instance tunggal, pembuka link luar
│   │   ├── navigation.js  daftar 7 halaman yang boleh dituju
│   │   └── preload.js     jembatan contextBridge ke renderer
│   └── renderer
│       ├── data.js        7 rute, 3 kelas, 3 metode bayar, aturan diskon
│       ├── store.js       akun, sesi, pesanan, draft (semua localStorage)
│       ├── common.js      format uang/tanggal, guard login, ringkasan harga
│       ├── i18n.js        tombol ganti bahasa ID/EN
│       ├── styles.css     palet hijau-krem, tata letak semua layar
│       ├── *.html         satu berkas per layar
│       └── js/*.js        logika milik satu halaman
├── .gitattributes         akhiran baris LF, berkas gambar tidak diganggu
├── .gitignore             node_modules, dist, dan sampah lokal
└── package.json           skrip npm + konfigurasi electron-builder
```

## Arsitektur

Aplikasinya **multi-halaman**, bukan satu halaman tunggal. Setiap layar adalah
berkas `.html` sungguhan yang dimuat lewat `win.loadFile()`, jadi perpindahan
layar terlihat sebagai navigasi asli dan DevTools bisa dipakai untuk memeriksa
satu layar saja.

Alur pemesanan melewati empat halaman, sementara JavaScript mati setiap kali
pindah halaman. Karena itu pesanan yang sedang dikerjakan disimpan sebagai
*draft* dan dibaca ulang di tiap layar:

```
index.html  --pilih rute-->  draft  -->  rute.html  -->  penumpang.html  -->  bayar.html
                                                                          |
                                                        saveOrder() + hapus draft
                                                                          |
                                                                     tiket.html
```

Harga hanya dihitung di satu tempat, `priceFor()` di `common.js`, lalu dipakai
layar rute, penumpang, pembayaran, tiket, dan riwayat. Angka tidak mungkin
berbeda antar layar.

## Aturan bisnis

- **7 rute tetap**, 4 di Jawa dan 3 di Sumatra. Tidak ada rute yang bisa ditambah.
- **3 kelas**: Ekonomi 3-2, Bisnis 2-2, Eksekutif 2-1. Tiap rute punya harga sendiri.
- **Diskon rombongan 10%** otomatis saat pemesanan berisi 3 kursi atau lebih.
- **Maksimal 4 kursi** untuk satu kali pemesanan.
- **Tanggal tidak boleh sebelum hari ini**; asal dan tujuan tidak boleh sama.
- Pembayaran hanya simulasi, tidak ada biaya sungguhan yang dibuat.

## Penyimpanan data

| Kunci | Isi |
|---|---|
| `nx.users` | daftar akun: nama, email, telepon, salt, hash |
| `nx.session` | id akun yang sedang masuk |
| `nx.orders` | seluruh pesanan |
| `nx.draft` | pesanan yang sedang dikerjakan |
| `nx.lastOrder` | pesanan terakhir, dipakai layar tiket |
| `nx_bahasa` | pilihan bahasa antarmuka |

Hapus lewat DevTools → Application → Local Storage kalau ingin mulai dari nol.

## Keamanan

- `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`.
- Renderer hanya menerima tiga nilai dari sistem lewat `contextBridge`.
- `will-navigate` menolak semua tujuan di luar 7 berkas halaman.
- `setWindowOpenHandler` menutup jendela baru dan mengirim tautan luar ke browser.
- `requestSingleInstanceLock()` mencegah dua jendela saling menimpa data.
- Sandi disimpan sebagai SHA-256 dengan salt acak per akun, bukan teks asli.

## Antarmuka dua bahasa

`i18n.js` menambahkan tombol **ID / EN** di kanan atas. Terjemahan bekerja dengan
mencocokkan teks yang tampil ke sebuah kamus, dan teks aslinya disimpan di
memori, jadi pindah bolak-balik tidak mengubah berkas sumber apa pun. Teks yang
mengandung angka hasil perhitungan (misalnya `3 kursi`) sengaja dibiarkan dalam
bahasa Indonesia karena tidak cocok dengan kamus.

## Keterbatasan yang disengaja

- Tidak ada server, jadi akun tidak bisa dipindah antar perangkat.
- Nomor kursi diturunkan dari id rute, jadi pemesanan ulang rute yang sama bisa
  memunculkan kursi dengan kode yang sama.
- Semua transaksi simulasi; tidak ada pembayaran, email, atau tiket sungguhan.

## Lisensi

MIT — bebas dipakai dan dimodifikasi untuk keperluan tugas sekolah.