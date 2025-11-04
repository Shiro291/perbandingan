# Rencana: Web Gamifikasi untuk Mengajar Teks Prosedur

Topik: Teks Prosedur (menjelaskan langkah/urutan melakukan sesuatu)
Target: Siswa SD (kelas 3–5)
Tujuan penggunaan: Microteaching / pembelajaran kelas interaktif — durasi sesi 10–25 menit

## Ringkasan singkat
Aplikasi web sederhana yang memudahkan siswa memahami struktur teks prosedur lewat aktivitas interaktif dan gamified: memilih prosedur, mengisi bahan/alat, menyusun langkah (drag-and-drop), dan menilai sendiri. Guru dapat menambahkan prosedur/custom template. Tidak perlu server — sepenuhnya statis (HTML/CSS/JS) dengan penyimpanan lokal (localStorage) dan ekspor CSV.

## Tujuan Pembelajaran (SMART)
- Dalam 15 menit praktik, siswa dapat menyusun minimal 4 dari 5 langkah prosedur sederhana secara benar (80% akurasi).
- Siswa dapat menyebutkan alat dan bahan yang dibutuhkan untuk 3 prosedur berbeda setelah latihan singkat.
- Guru dapat membuat dan memuat 5 prosedur kustom untuk digunakan di kelas dalam 10 menit.

## Kontrak singkat (inputs/outputs, data shape)
- Input:
  - Pilihan prosedur (dropdown)
  - Drag-and-drop langkah (array of strings)
  - Form isian untuk alat/bahan (array of strings)
  - Pilihan tingkat kesulitan / visualisasi (ikon vs foto)
- Output:
  - Penilaian otomatis (benar/salah, nilai), feedback teks singkat, dan CSV ekspor berisi: `siswa,prosedur,timestamp,score,answers,timeSpent`.
- Error modes: input kosong, urutan parsial — sistem beri hint dan tidak crash.

## Mekanika gamifikasi (inti)
- Mode Siswa:
  1. Pilih prosedur dari daftar (atau minta guru memuat prosedur kustom).
  2. Tampilkan: nama prosedur, gambar/ikon, daftar bahan & alat (kartu campur acak), dan langkah (acak).
  3. Tugas utama:
     - Urutkan langkah dengan drag-and-drop.
     - Isi kolom singkat jika ada (mis. jumlah / suku kata penting).
     - Cocokkan alat-bahan ke langkah terkait (drag ke slot).
  4. Sistem memberikan nilai instan dan penjelasan singkat untuk tiap salah (hint: bandingkan pasangan yang cocok atau jelaskan mengapa urutan benar).
  5. Skor + combo: poin dasar + bonus untuk streak benar cepat.

- Mode Guru:
  - Tambah / edit / hapus prosedur (nama, deskripsi, gambar kecil, daftar bahan & alat, langkah, tipe soal: urut/isi/match).
  - Pilih mode kelas: random per siswa, satu soal demo di layar, atau tantangan waktu.

## Jenis interaksi (games)
- Urutkan Langkah (drag-and-drop): Langkah acak harus disusun jadi urutan logis.
- Isi Bagian Kosong (fill-in-the-blank): Teks prosedur dengan 1–2 bagian kosong yang siswa isi (mis. jumlah sendok, lama waktu).
- Cocokkan Alat-Bahan ke Langkah (matching): Seret alat ke langkah yang membutuhkannya.
- Tantangan Waktu: Susun sebanyak mungkin prosedur dalam 60 detik, dapat poin dan badge.

## Visualisasi yang menyenangkan
- Gunakan ikon bergaya komik/ilustrasi untuk alat & bahan (panci, wajan, sendok, kompor, bahan makanan).
- Gambar mini langkah (SVG) — mis. gambar penggorengan untuk langkah menumis.
- Animasi kecil saat benar: confetti, suara *ding* (opsional), bintang/emoji.
- Badge untuk pencapaian: "Chef Kecil" (3 urutan benar), "Cepat" (benar dalam <10s), "Detektif Alat" (semua matching benar).

## Contoh prosedur (bank awal — tidak hanya nasi goreng)
1. Membuat Teh Manis
   - Alat: teko, gelas, sendok
   - Bahan: air, teh celup, gula
   - Langkah (contoh): Rebus air → Masukkan teh → Tuang ke gelas → Tambahkan gula → Aduk
2. Membuat Telur Dadar
   - Alat: wajan, spatula, mangkuk
   - Bahan: telur, garam, minyak
   - Langkah: Kocok telur → Panaskan wajan → Tuang adonan → Balik → Angkat
3. Menyusun Pesawat Kertas
   - Alat: kertas A4
   - Bahan: (tidak ada)
   - Langkah: Lipat jadi setengah → Lipat sayap → Bentuk ekor → Terbangkan
4. Mencuci Tangan yang Benar
   - Alat: sabun, air
   - Bahan: (tidak ada)
   - Langkah: Basahi → Sabuni → Gosok 20 detik → Bilas → Keringkan
5. Menanam Biji Kecil
   - Alat: pot, sekop, air
   - Bahan: biji tanaman, tanah
   - Langkah: Masukkan tanah → Tanam biji → Tutup → Siram
6. Membuat Jus Buah
7. Menyetrika Baju (sederhana)
8. Membuat Roti Tawar/Mudah

Setiap prosedur dilengkapi versi teks (untuk fill-in) dan versi visual (kartu langkah + ikon).

## Penilaian & rubrik
- Urutkan: nilai 1 poin per langkah yang ditempatkan di posisi benar; skor normalisasi 0–100%.
- Fill-in: cocokan kata kunci (case-insensitive) atau perbandingan jarak edit (levenshtein) untuk toleransi ejaan kecil.
- Matching: 1 poin per pasangan benar.
- Bonus: streak benar cepat (+1 poin/level), challenge time multipliers.

## UI screens & wireframe singkat
- Home: judul, deskripsi singkat, tombol "Mode Guru" dan "Mulai".
- Pilih Prosedur: daftar prosedur (thumbnail), tombol "Buat Prosedur Baru" untuk guru.
- Mode Siswa (Gameplay): header (nama prosedur, timer, skor), area alat/bahan (kartu acak), area langkah (sortable list), slot jawaban/field untuk fill-in.
- Hasil Sementara: feedback per langkah, highlight langkah yang salah, penjelasan singkat.
- Ringkasan: skor akhir, badge, tombol ekspor hasil.
- Editor Guru: form untuk nama, kategori, gambar, bahan/alat (input berulang), langkah (urutan yang bisa diisi), tipe soal.

## Teknologi & struktur minimal (serverless)
- Stack: HTML, CSS, vanilla JS (ES6). CDN libs:
  - SortableJS (untuk drag-and-drop)
  - canvas-confetti (efek kemenangan)
  - optional: Fuse.js (pencarian teks), leven (string similarity) / small fuzzy lib
- Penyimpanan: localStorage untuk menyimpan prosedur kustom dan progress; ekspor CSV untuk hasil.
- Struktur file singkat:
  - index.html
  - styles.css
  - app.js
  - data/procedures.json (sample)
  - assets/ (ikon/svg)

## Lampiran: Spesifikasi MVP konkret (siap diimplementasi)

### Fitur MVP (minggu 1)
- Mode Urutkan Langkah: drag-and-drop susunan langkah agar sesuai urutan yang benar.
- Bank prosedur sederhana: 1–3 contoh bawaan + editor guru untuk menambah/ubah (localStorage).
- Umpan balik cepat: benar/salah per posisi, skor, dan confetti saat semua benar.
- Ringkasan hasil: skor sesi; (opsional) ekspor CSV.
- Offline-friendly: file statis + CDN. Tanpa backend.

### Dependensi (CDN-first)
- SortableJS (drag-and-drop urutan)
  - https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js
- canvas-confetti (celebration)
  - https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js
- Next (opsional):
  - Interact.js (dropzones matching)
  - Fuse.js (fuzzy search katalog)
  - Levenshtein kecil untuk isian toleransi (inline atau lib kecil yang cocok di browser)
  - Howler.js (audio), Tippy.js (tooltip), Workbox (PWA)

### Kontrak Data (MVP)
- Prosedur
  - id: string
  - title: string
  - steps: string[] (urutan benar)
  - tags?: string[] (opsional)s
- localStorage key: `prosedur.bank`

### Acceptance Criteria (MVP)
- Siswa dapat memilih prosedur dari dropdown, menyeret urutan langkah, dan menekan Cek untuk mendapatkan umpan balik yang jelas.
- Skor = jumlah posisi benar; 100% benar memicu confetti.
- Editor Guru memungkinkan menambah prosedur baru (judul + langkah per baris), menyimpan ke localStorage, muncul di dropdown.
- Ekspor/Impor JSON di Editor berfungsi. (CSV hasil percobaan opsional.)
- Semua berjalan tanpa server.

### Edge Cases
- Duplikasi langkah: validasi saat simpan; atau tampilkan penomoran sumber.
- Spasi/kapitalisasi: normalisasi saat cek.
- Minimum langkah: ≥ 3.
- localStorage kosong/bersih: fallback contoh bawaan.

### Rencana Teknis Singkat
- index.html: layar Home, Game, Editor; muat CDN SortableJS dan canvas-confetti.
- styles.css: gaya bersih, highlight benar/salah, handle drag.
- app.js:
  - State: procedures (builtin + local), selected, attempts log.
  - UI: renderHome, renderGame, renderEditor.
  - Logic: shuffle, checkOrder, save/load storage, export/import JSON, fireConfetti, optional exportCSV.

### Contoh Bawaan
- Memasak Nasi Goreng, Membuat Teh Manis, Menyikat Gigi.

## Kriteria aksesibilitas & praktikal
- Teks & tombol kontras tinggi, ukuran tombol besar.
- Interaksi utama bisa lewat keyboard (fokus elemen, enter untuk pilih) dan touch.
- Hindari audio wajib; buat opsi suara on/off.

## Timeline implementasi (prototype siap demo dalam 3–4 jam)
- 0.5 jam: Setup kerangka (index.html, styles, app.js), layout utama.
- 1 jam: Implement drag-and-drop urutkan + penilaian instan + 3 contoh prosedur.
- 0.5 jam: Editor guru sederhana (form) + simpan ke localStorage.
- 0.5 jam: Visual/ikon + confetti + badge sederhana.
- 0.5 jam: Export CSV + uji cepat dan perbaikan UI.

## Alur microteaching (10–20 menit contoh)
1. Perkenalan (1 menit): tujuan pelajaran dan apa itu teks prosedur.
2. Demo singkat (2 menit): tampilkan 1 prosedur (mis. membuat teh), tunjukkan langkah dan visual.
3. Praktik siswa (6–10 menit): siswa susun langkah lalu diskusi.
4. Penutup (2–3 menit): tampilkan badge/hasil dan ambil 1 soal untuk diskusi lebih mendalam.

## Edge cases dan handling
- Langkah hampir identik: gunakan indeks urutan asli untuk membedakan.
- Kosong/benda tidak relevan: tampilkan tombol "Lewati" dan beri penjelasan.
- Multi-bahasa: sediakan teks bahasa Indonesia terlebih dahulu; arsitektur mendukung terjemahan mudah.

## Extensi & ide gamifikasi lanjutan
- Mode kolaboratif (2 pemain bekerja bersama untuk menyusun langkah cepat).
- Tingkat kesulitan (jumlah langkah, fill-in yang lebih banyak).
- Mode tugas rumah: guru buat tugas, siswa kerjakan dan ekspor hasil untuk penilaian.
- PWA ringan untuk penggunaan offline penuh dan instalasi di perangkat siswa.

## Next steps (opsional saya kerjakan)
- Saya bisa buat prototype kecil (index.html + app.js + styles) yang mengimplementasikan: pilih prosedur, drag-and-drop urutkan, dan editor guru sederhana — dapat saya kerjakan dalam ~2 jam.
- Atau saya bisa langsung bikin kumpulan 8 prosedur lengkap (text + icons) untuk Anda gunakan besok.

---

Rencana ini ditujukan agar guru mudah menggunakannya dan siswa merasakan pengalaman "game" saat belajar teks prosedur — bukan sekadar klik, tapi ada pencapaian, visual menyenangkan, dan opsi untuk guru menyesuaikan materi.
