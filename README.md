# Pecahan Seru — Web Latihan Gamifikasi (Tanpa Server)

Sebuah web sederhana untuk microteaching topik: mengurutkan dan membandingkan pecahan. Berjalan **tanpa database, tanpa server** — cukup buka `index.html` di browser.

## Fitur Utama
- Mode Bandingkan (pilih pecahan yang lebih besar) dan Urutkan (drag-and-drop dari kecil ke besar)
- Visual batang pecahan otomatis (persentase)
- Skor, umpan balik instan, dan efek confetti saat benar
- Mode Guru: atur jumlah soal, tampilkan hint/visual, pilih mode (bandingkan/urutkan/campur)
- Ekspor hasil ke `.csv` (lokal) untuk bahan refleksi kelas — tanpa menyimpan ke internet
- Bahasa Indonesia, UI sederhana untuk guru dan siswa SD

## Cara Menjalankan
1. Unduh folder ini ke komputer.
2. Buka file `index.html` dengan klik dua kali (Chrome/Edge/Firefox).
3. Di halaman beranda:
   - Klik **Mulai Cepat** untuk campuran 10 soal.
   - Klik **Pilih Level** untuk memilih tipe soal.
   - Klik **Mode Guru** untuk mengatur parameter.

Tidak perlu instalasi. Bisa digunakan **offline** (setelah file terbuka sekali).

## Alur Microteaching (contoh 10–15 menit)
1. Perkenalan tujuan (1 menit).
2. Demo singkat 2 soal bandingkan + 1 soal urutkan (3 menit).
3. Siswa mencoba 5 soal (5–8 menit). Dukung diskusi strategi saat review jawaban.
4. Ringkasan skor dan 1–2 soal yang salah untuk refleksi (2–3 menit).

## Ekspor Hasil
- Setelah selesai, tekan tombol **Unduh Hasil (.csv)**.
- File berisi kolom: `index, tipe, item, jawaban_benar, jawaban_siswa, benar, waktu_ms`.
- Dapat dibuka di Excel/Google Sheets.

## Kustomisasi Cepat
- Tambah bank soal di `app.js` pada konstanta `BANK`.
- Ganti warna/ukuran UI di `styles.css`.
- Ganti teks instruksi di `index.html`.

## Ketergantungan (via CDN, aman untuk offline setelah cache)
- [SortableJS](https://github.com/SortableJS/Sortable) — drag & drop list.
- [canvas-confetti](https://github.com/catdad/canvas-confetti) — efek confetti.

Keduanya di-load dari CDN jsDelivr. Jika koneksi terbatas, buka sekali untuk cache; setelah itu dapat bekerja offline (tergantung kebijakan cache browser).

## Catatan Teknis
- Tidak ada penyimpanan online. Data hasil hanya diunduh sebagai CSV.
- Perbandingan pecahan memakai perbandingan numerik sederhana yang aman untuk denominátor kecil (SD). Untuk topik lebih lanjut, bisa ditingkatkan ke representasi rasional presisi tinggi.

## Ide Pengembangan Lanjutan (opsional)
- Tambahkan mode **number line** (seret pecahan ke posisi di garis bilangan).
- Tambahkan **penjelasan langkah** otomatis (contoh menyamakan penyebut).
- Tambahkan **PWA** ringan agar bisa terpasang seperti aplikasi dan offline penuh.

Selamat mengajar! 🎉
