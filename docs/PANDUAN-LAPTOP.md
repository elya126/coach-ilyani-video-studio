# Panduan Laptop untuk Coach (Beginner)

Panduan ini terangkan cara guna **Coach Ilyani Video Studio** di laptop, langkah demi langkah. Tak perlu tahu coding.

> **Apa itu "studio" ni?** Bayangkan "kilang video". Coach masukkan video bercakap dan klip B-roll. Studio tambah sendiri sari kata gold, tulisan besar, kad terbang, bar komen INFO, logo @coachilyani dan muzik. Hasilnya fail MP4 siap post.

---

## BAHAGIAN A · Setup (buat SEKALI sahaja, ±30 minit)

### Langkah 1 · Pasang Node.js (enjin yang jalankan studio)
1. Buka **https://nodejs.org**
2. Tekan butang **LTS** (versi stabil), muat turun dan pasang macam pasang app biasa: Next → Next → Install
3. Siap. Tak perlu buka apa-apa.

### Langkah 2 · Pasang Visual Studio Code (tempat edit tulisan)
1. Buka **https://code.visualstudio.com**
2. Muat turun dan pasang
3. App ni macam "Microsoft Word" untuk fail projek

### Langkah 3 · Muat turun projek dari GitHub
1. Buka **https://github.com/elya126/coach-ilyani-video-studio** dan log masuk
2. Di kiri atas, tekan butang tertulis **main** dan pilih **claude/beautiful-hopper-843rpr**
3. Tekan butang hijau **Code** → **Download ZIP**
4. Buka fail ZIP itu (double-click). Pindahkan folder yang keluar ke **Documents**

### Langkah 4 · Buka projek dalam VS Code
1. Buka **VS Code** → menu **File** → **Open Folder...** → pilih folder projek dalam Documents
2. Kalau keluar soalan "Do you trust the authors?", tekan **Yes, I trust**
3. Menu **Terminal** → **New Terminal**. Satu kotak hitam/putih keluar di bawah. Di sinilah Coach taip arahan.

### Langkah 5 · Pasang bahan studio
Dalam Terminal, taip arahan ini dan tekan **Enter**:
```
npm install
```
Tunggu 2–5 minit sampai berhenti bergerak. Sekali sahaja.

### Langkah 6 · Buka studio
```
npm start
```
Browser akan terbuka dengan **Remotion Studio**. Di sebelah kiri ada senarai video. Pilih **Reel01-ProgramCoaching** dan tekan ▶ play.

🎉 Setup siap! Untuk tutup studio: klik dalam Terminal, tekan **Ctrl + C**.

---

## BAHAGIAN B · Buat setiap reel (±20–30 minit)

### Langkah 1 · Rakam di iPhone
Ikut senarai shot dalam pelan reel (contoh `docs/reels/01-program-coaching-busy-mom.md`).

### Langkah 2 · Potong bahagian silap (CapCut)
1. Dalam CapCut, buang bahagian tersalah cakap dan jeda panjang
2. **Jangan** tambah sari kata, teks atau muzik. Studio akan buat semua itu.
3. Export: **1080p, 30fps**

### Langkah 3 · Pindah video ke laptop
- **MacBook:** AirDrop
- **Windows:** Google Drive, atau kabel USB
- ⚠️ Jangan hantar guna WhatsApp, sebab kualiti video akan jatuh

### Langkah 4 · Letak fail dalam folder yang betul
| Fail | Namakan | Letak dalam folder |
|---|---|---|
| Video bercakap | `reel01.mp4` | `public/videos/` |
| Klip B-roll | contoh `kasut-anak.mp4` | `public/broll/` |

### Langkah 5 · Sambung video dengan template
Dalam VS Code, buka fail `src/content/reels/reel01-program-coaching.ts` dan ubah:

1. **Video bercakap:**
   ```
   videoSrc: "videos/reel01.mp4",
   ```
2. **Panjang video** dalam saat (contoh video 43 saat):
   ```
   durationInSeconds: 43,
   ```
3. **B-roll:** isi `src` untuk setiap klip. Kalau tiada klip, biarkan `""`.
   ```
   { src: "broll/kasut-anak.mp4", start: 3.2, end: 5.8, label: "..." },
   ```
4. Tekan **Ctrl + S** (Mac: **Cmd + S**) untuk simpan

### Langkah 6 · Betulkan masa
1. Jalankan `npm start` dan tekan ▶ play
2. Tengok **nombor masa** di bawah video
3. Bila Coach mula sebut "Pagi kejar anak", catat saatnya (contoh 3.4)
4. Dalam fail, tukar `start` dan `end` untuk sari kata, grafik (`beats`) dan B-roll supaya sama dengan masa sebenar
5. Simpan. Preview akan berubah serta-merta.

💡 **Tip:** kalau CapCut boleh export sari kata sebagai fail **.srt**, taip arahan ini:
```
npm run captions:srt -- reel01.srt
```
Masa sari kata akan disusun automatik.

### Langkah 7 · Export video MP4
```
npm run render:reel01
```
Tunggu 1–3 minit. Video siap ada dalam folder **out** → `reel01-program-coaching.mp4`

### Langkah 8 · Hantar ke iPhone & post
AirDrop atau Google Drive ke iPhone, kemudian post di Instagram dan TikTok bersama caption dari pelan reel.

---

## BAHAGIAN C · Minta Claude buat untuk Coach

Coach tak perlu ubah fail sendiri. Beritahu Claude dalam bahasa biasa, contohnya:
- *"Video reel01 saya 43 saat. Hook habis saat 2.8, 'pagi kejar anak' mula saat 3.4..."*
- *"Tukar tulisan TAK SEMPAT MAKAN jadi PENAT SETIAP PETANG?"*
- *"Buat reel 2 tentang boleh ke makan nasi."*

Claude akan ubah fail. Coach cuma muat turun versi terbaru dan render.

---

## Masalah biasa

| Masalah | Penyelesaian |
|---|---|
| `npm` tak dikenali | Node.js belum dipasang. Ulang Langkah A1, kemudian tutup dan buka semula VS Code |
| Ralat merah "file not found" | Semak nama fail dan folder. Huruf besar dan kecil mesti sama. Jangan tulis `public/` dalam path |
| Tulisan tak sama dengan suara | Betulkan `start`/`end` sari kata (Langkah B6) |
| Render lambat | Biasa untuk kali pertama. Tutup app lain |
| Video terlalu pendek atau panjang | Tukar `durationInSeconds` |
