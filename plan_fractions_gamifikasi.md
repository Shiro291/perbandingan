# Rencana: Gamifikasi Pembelajaran

Topik: Mengurutkan dan membandingkan beragam jenis pecahan
Target: Siswa SD (kelas 4–5)
Waktu untuk microteaching: 10–15 menit demonstrasi + 15–20 menit praktik (prototype sederhana)

## Ringkasan singkat
Sebuah web mini yang gamified bertujuan membuat latihan membandingkan dan mengurutkan pecahan menjadi menyenangkan. Pemain menyelesaikan level yang menampilkan pecahan dalam bentuk visual (potongan pizza / batang pecahan) dan/atau angka; mereka memilih mana lebih besar, atau menyeret urutan ke posisi yang benar.

## Tujuan pembelajaran (SMART)
- Siswa dapat menentukan pecahan mana yang lebih besar atau lebih kecil untuk pasangan pecahan sederhana (mis. 1/4 vs 1/3) 8/10 kali setelah 6 latihan.
- Siswa dapat mengurutkan 3–4 pecahan dari yang terkecil ke terbesar pada level menengah.
- Siswa menunjukkan pemahaman hubungan pembilang/penyebut (mis. jika penyebut sama -> pembilang lebih besar = nilai lebih besar).

## Kontrak singkat (inputs/outputs, error modes)
- Input: klik/tap atau drag-and-drop jawaban pada layar.
- Output: kotak konfirmasi benar/salah, poin/visual feedback, dan penjelasan singkat untuk jawaban salah.
- Error modes: jawaban tidak valid, klik ganda — cukup ignore input sampai animasi selesai.

## Mekanika inti & loop permainan
1. Pemain memilih level (mudah → sedang → sulit).
2. Muncul sebuah soal: 2–4 pecahan ditampilkan (angka + visual). Tugas: pilih yang terbesar / urutkan dari kecil ke besar.
3. Pemain menjawab dengan klik atau drag.
4. Feedback instan: benar -> confetti kecil + +10 poin; salah -> sorot jawaban yang benar dan berikan hint (+ penjelasan 1–2 kalimat).
5. Setelah 5 soal per level, tunjukkan ringkasan: skor, waktu, dan satu tip belajar.

## Level & contoh soal (6 level contoh)
- Level 1 (very easy): Common denominators
  - Contoh: 2/5 vs 3/5 — tugas: pilih yang lebih besar
- Level 2 (easy visual): Unit fractions visual (1/2, 1/3, 1/4)
  - Contoh: 1/3 vs 1/4 (visual pizza)
- Level 3 (medium): Different denominators (small numbers)
  - Contoh: 2/3 vs 3/4
- Level 4 (ordering): Urutkan 3 pecahan
  - Contoh: 1/2, 2/5, 3/4
- Level 5 (mixed numbers): Menangani bilangan campuran (1 1/3 vs 4/3)
- Level 6 (challenge): Campuran pecahan biasa dan desimal (optional)

Sertakan bank soal kecil (contoh 20 soal) untuk microteaching.

## UI screens (wireframe singkat)
- Home: Judul, tombol "Mulai", tombol "Level", tombol "Petunjuk"
- Level select: 3 level cepat (mudah/sedang/sulit) + progress
- Gameplay:
  - Area visual pecahan (kiri)
  - Pilihan/slot urutan (kanan)
  - Tombol "CEK" dan "Hint"
  - Score & lives di header
- Result: skor, ringkasan, tombol ulang/lanjut

## Assets & sumber daya sederhana
- Bentuk visual: batang pecahan (horizontal) dan potongan pizza—bisa dibuat memakai CSS + SVG.
- Ikon/efek: confetti (CSS/Canvas), bunyi singkat (opsional).
- Warna: gunakan palet cerah, kontras tinggi untuk anak.

## Teknis — stack minimal (untuk prototype cepat)
- HTML + CSS + JavaScript (ES6)
- Opsional: small library seperti Hammer.js untuk sentuhan, atau a tiny game lib seperti Phaser for rapid prototyping (tidak diperlukan untuk 1-day)
- Struktur file sederhana:
  - index.html
  - styles.css
  - app.js
  - assets/ (svg/png/ogg)

## Alur kerja & timeline (untuk selesai besok)
- 0.5 jam: Siapkan file dasar (index.html, styles.css, app.js) dan wireframe
- 1 jam: Implementasi 2 mode soal (pilih yang lebih besar & urutkan) + visual basic (CSS/SVG)
- 0.5 jam: Tambah scoring, feedback, dan 10 soal
- 0.5 jam: Uji cepat & perbaikaan UI
- 0.5 jam: Siapkan materi microteaching (slide 5–6) dan catatan guru
Total: ~3–3.5 jam (prototype paling dasar)

## Penilaian & data yang dikumpulkan
- Skor per siswa, waktu per soal, dan jumlah hint yang dipakai.
- Untuk microteaching, tampilkan skor dan dua contoh soal yang salah untuk diskusi.

## Catatan guru untuk microteaching (script pendek)
1. Perkenalan 1 menit: tujuan belajar hari ini.
2. Demo 3 menit: mainkan 2 soal mudah, tunjukkan visual dan penjelasan ketika jawaban salah.
3. Praktik 10 menit: minta beberapa siswa mencoba (atau demo di layar jika tidak ada perangkat untuk semua).
4. Diskusi 4–5 menit: tanya strategi (bandingkan penyebut sama, konversi ke desimal cepat, visualisasi).

## Aksesibilitas & Keterjangkauan
- Gunakan tombol besar dan teks kontras.
- Hindari audio wajib (buat opsional).
- Pastikan ukuran target klik cukup besar untuk siswa.

## Next steps (opsional yang bisa saya bantu sekarang)
- Saya bisa membuat kerangka `index.html` + `app.js` minimal agar Anda bisa demo langsung.
- Atau saya bisa membuat 10 contoh soal dan file CSV untuk import ke game.

---

Semoga rencana ini cukup ringkas untuk Anda pakai besok. Kalau mau, saya bisa langsung buat prototype minimal (HTML/CSS/JS) dalam 1–2 jam berikutnya.
