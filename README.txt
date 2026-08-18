WEBSITE PDKT ROMANTIS

File:
- index.html
- style.css
- script.js

Cara memakai:
1. Ekstrak folder.
2. Buka index.html di Chrome.
3. Klik "+ Tambah foto" untuk memasukkan banyak foto dari komputer.
4. Foto dapat di-swipe kiri/kanan dan diklik untuk tampilan fullscreen.

Untuk memakai foto sendiri secara permanen:
- Buat folder "images".
- Masukkan foto ke sana.
- Ubah daftar defaultPhotos di script.js menjadi contoh:
  { src: "images/foto1.jpg", caption: "..." }

Untuk musik:
- Masukkan file musik sendiri, misalnya music.mp3.
- Pada index.html ubah:
  <audio id="music" loop>
  menjadi:
  <audio id="music" loop src="music.mp3">
