# Teks Prosedur — MVP (Urutkan Langkah)

Serverless, statis, dan offline-friendly. Cocok untuk microteaching.

## Cara pakai
- Buka `index.html` di browser (klik dua kali atau lewat Live Server/preview).
- Beranda: pilih Mode (Urutkan, Matching, Isian), pilih Prosedur, lalu klik "Mulai".
- Urutkan: seret langkah-langkah agar urut. Klik "Cek" untuk nilai. Semua benar → confetti.
- Matching: seret chip alat/bahan ke langkah yang tepat, lalu "Cek".
- Isian: isi bagian kosong pada teks, nilai toleran ejaan kecil, lalu "Cek".
- Mode Guru: tambah prosedur (judul + langkah per baris), simpan ke localStorage.
- Import/Export JSON: simpan/ambil bank prosedur.
- Export CSV Hasil: unduh ringkasan percobaan (timestamp, prosedur, total, benar).

## Struktur
- `index.html` — Halaman utama + 3 tampilan (Beranda, Game, Editor Guru) + Mode selector.
- `styles.css` — Gaya UI ringan, aksesibel.
- `app.js` — Logika permainan (Urutkan/Matching/Isian), penyimpanan lokal, editor, ekspor.
- `plan_prosedur_teks.md` — Rencana lengkap (MVP+Next) dan dependensi.

## Dependensi (CDN)
- SortableJS — drag-and-drop urutan
- Interact.js — dropzone (Matching)
- canvas-confetti — efek kemenangan

Opsional untuk tahap berikutnya: Fuse.js (pencarian), Howler.js (audio), Tippy.js (tooltip), Workbox (PWA).

## Catatan Offline
Aplikasi tidak memerlukan server. Untuk akses file langsung, sebagian browser membatasi fitur tertentu jika dibuka via `file://`. Jika ada isu, gunakan ekstensi Live Server atau jalankan HTTP sederhana.

## Lisensi
Materi pembelajaran buatan sendiri. Perpustakaan pihak ketiga mengikuti lisensi masing-masing.
