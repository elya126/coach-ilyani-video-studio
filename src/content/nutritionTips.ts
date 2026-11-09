/**
 * CONTENT — Nutrition Tips (sample in Bahasa Melayu)
 * Each tip = "Daripada" (instead of) → "Cuba" (try this).
 * Keep reasons simple and factual — no medical or weight-loss promises.
 */
import type { NutritionProps } from "../templates/NutritionTips";
import { defaultAudio } from "./shared";

export const nutritionTipsContent: NutritionProps = {
  theme: "light",
  hook: {
    kicker: "Tips pemakanan sihat",
    title: "5 tukar **mudah** untuk hari-hari",
    subtitle: "Tak perlu ubah semua sekali gus.",
    durationInSeconds: 4,
  },
  labels: { tip: "Tukar mudah", instead: "Daripada", tryThis: "Cuba" },
  tips: [
    {
      title: "Minuman petang",
      instead: "Teh tarik manis",
      tryThis: "Teh O kurang manis",
      why: "Cara mudah untuk **kurangkan gula** tambahan dalam minuman harian.",
      durationInSeconds: 6,
    },
    {
      title: "Isi pinggan",
      instead: "Pinggan penuh nasi",
      tryThis: "Suku-suku separuh",
      why: "Konsep **Pinggan Sihat Malaysia**: separuh sayur & buah, suku protein, suku nasi.",
      durationInSeconds: 6,
    },
    {
      title: "Snek petang",
      instead: "Kerepek bergoreng",
      tryThis: "Buah + segenggam kacang",
      why: "Pilihan snek yang memberi **serat** dan lebih mengenyangkan.",
      durationInSeconds: 6,
    },
    {
      title: "Bila dahaga",
      instead: "Minuman bergas",
      tryThis: "Air kosong + hirisan lemon",
      why: "**Air kosong** — pilihan tanpa gula untuk hidrasi harian.",
      durationInSeconds: 6,
    },
    {
      title: "Cara masak",
      instead: "Goreng setiap hari",
      tryThis: "Kukus, bakar atau rebus",
      why: "Variasikan cara masak untuk **kurangkan minyak** dalam menu.",
      durationInSeconds: 6,
    },
  ],
  cta: {
    title: "Simpan & **kongsi**",
    subtitle: "Pilih satu tukar minggu ini. Follow untuk tips seterusnya.",
    buttonText: "Follow @coachilyani",
    durationInSeconds: 5,
  },
  disclaimer: "Info umum kesihatan, bukan nasihat perubatan. Rujuk doktor untuk keperluan peribadi.",
  audio: defaultAudio,
};
