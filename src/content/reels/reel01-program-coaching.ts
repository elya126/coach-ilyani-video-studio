/**
 * REEL 01 · "Meal plan ikut jadual you"  (cari client · Komen INFO)
 * Pelan penuh: docs/reels/01-program-coaching-busy-mom.md
 *
 * CARA GUNA (ringkas):
 *  1. Letak video bercakap Coach (dah dipotong) di: public/videos/reel01.mp4
 *  2. Letak klip B-roll di public/broll/ ikut nama di bawah
 *  3. Tukar `durationInSeconds` ikut panjang video Coach
 *  4. Betulkan masa (start/end, dalam SAAT) ikut bila Coach sebenarnya cakap.
 *     Tip: tekan play dalam `npm start`, tengok nombor saat di bawah preview.
 *  5. **dua bintang** = kata kunci (besar & tebal). Angka WAJIB ditanda.
 *
 * Masa di bawah ialah ANGGARAN untuk video 45 saat.
 */
import type { CoachReelProps } from "../../templates/CoachReel";

export const reel01Content: CoachReelProps = {
  videoSrc: "", // contoh: "videos/reel01.mp4"
  durationInSeconds: 45,

  // Zoom kamera (maksimum 1.08). smooth: false = potong terus, true = tolak masuk perlahan
  zooms: [
    { start: 0, end: 3, scale: 1.04, smooth: false },
    { start: 12, end: 18, scale: 1.04, smooth: false },
    { start: 33, end: 36, scale: 1.07, smooth: true }, // "Start where you are"
  ],

  // B-roll bingkai penuh (suara Coach terus berjalan di bawah)
  broll: [
    { src: "", start: 3.2, end: 5.8, label: "broll/kasut-anak.mp4 · pagi kejar anak" },
    { src: "", start: 6.0, end: 8.8, label: "broll/kopi-laptop.mp4 · lunch skip, meeting" },
    { src: "", start: 9.0, end: 10.8, label: "broll/makan-malam.mp4 · makan apa yang ada" },
    { src: "", start: 15.6, end: 17.8, label: "broll/tulis-meal-plan.mp4 · meal plan" },
    { src: "", start: 29.0, end: 31.0, label: "broll/makan-family.mp4 · makan dengan family" },
  ],

  // Grafik atas skrin
  beats: [
    { type: "headline", start: 0, end: 3, text: "Tak sempat makan?", label: "untuk ibu bekerja" },
    { type: "compare", start: 12.5, end: 15.5, left: "Jadual diet", right: "Jadual you" },
    { type: "cards", start: 18, end: 24, items: ["Meal plan", "Check-in", "Group coaching"] },
    { type: "bigNumber", start: 24, end: 27, number: "13", label: "tahun · Ahli Bebas Herbalife" },
    {
      type: "checklist",
      start: 27,
      end: 33,
      items: [
        { text: "Nak start kecil", ok: true },
        { text: "Makan dengan family", ok: true },
        { text: "Cari cara cepat", ok: false },
      ],
    },
    { type: "proof", start: 36, end: 40, chip: "Pengalaman sebenar · dengan izin", note: "Hasil setiap orang berbeza" },
    { type: "comment", start: 41, end: 45, keyword: "INFO", placeholder: "Tulis komen..." },
  ],

  // Sari kata — taip sama macam Coach cakap. Ayat panjang dipotong 3–4 patah automatik.
  captions: [
    { start: 0.2, end: 2.9, text: "**Busy mom** yang tak sempat makan proper ni untuk you" },
    { start: 3.0, end: 5.9, text: "Pagi kejar **anak** pergi sekolah" },
    { start: 5.9, end: 8.9, text: "lunch **skip** sebab meeting" },
    { start: 8.9, end: 11.8, text: "malam makan apa yang ada lepas tu rasa **bersalah**" },
    { start: 12.0, end: 15.4, text: "Okay so macam ni dalam coaching I **meal plan** ikut **jadual you**" },
    { start: 15.4, end: 17.9, text: "Bukan you yang kena kejar **jadual diet**" },
    { start: 18.0, end: 23.9, text: "You dapat meal plan **personal** check-in dalam **WhatsApp** dengan group coaching **setiap bulan**" },
    { start: 24.0, end: 27.0, text: "I dah **13 tahun** sebagai Ahli Bebas Herbalife dan mak kepada **4** orang anak" },
    { start: 27.0, end: 30.0, text: "Program ni sesuai kalau you nak **start kecil** dan makan dengan **family**" },
    { start: 30.0, end: 32.9, text: "Tak sesuai kalau you cari cara **cepat**" },
    { start: 33.0, end: 35.8, text: "**Start** where you are" },
    { start: 36.0, end: 38.2, text: "Ada client I dulu selalu makan **goreng** dan **manis**" },
    { start: 38.2, end: 40.8, text: "sekarang dia lebih **selesa** bergerak even masa duduk **solat**" },
    { start: 41.0, end: 44.8, text: "Nak tahu macam mana boleh fit dengan jadual you Komen **INFO** takde **paksaan**" },
  ],

  disclaimer: "",
  audio: {
    music: { src: "music/calm-ambient.mp3" }, // muzik diperlahankan automatik bawah suara
    transitionSound: "",
    soundEffects: [
      { src: "sfx/pop.mp3", atSecond: 0.3 },
      { src: "sfx/whoosh.mp3", atSecond: 3.1 },
      { src: "sfx/whoosh.mp3", atSecond: 12.4 },
      { src: "sfx/pop.mp3", atSecond: 18.2 },
      { src: "sfx/pop.mp3", atSecond: 19.6 },
      { src: "sfx/pop.mp3", atSecond: 21.0 },
      { src: "sfx/pop.mp3", atSecond: 24.1 },
      { src: "sfx/chime.mp3", atSecond: 42.5 },
    ],
  },
};
