/**
 * CONTENT — Product Education
 *  - Copy facts EXACTLY from your product label / official product info.
 *  - Values in [square brackets] are placeholders — replace them.
 *  - No claims that a product treats, cures or prevents any condition,
 *    and no promises of weight loss.
 */
import type { ProductProps } from "../templates/ProductEducation";
import { defaultAudio } from "./shared";

export const productEducationContent: ProductProps = {
  theme: "light",
  product: {
    name: "[Product name]",
    category: "Protein shake",
    imageSrc: "", // e.g. "images/product.png"
  },
  intro: {
    kicker: "Product 101",
    title: "How I use a **protein shake** in a busy day",
    durationInSeconds: 4,
  },
  whatItIs: {
    title: "What is it?",
    body: "A **convenient** way to add protein to your day. It works best as one part of a balanced eating pattern — alongside real meals, water and movement.",
    durationInSeconds: 7,
  },
  howToUse: {
    title: "Simple **3 steps**",
    steps: [
      "Use the **serving size** on the label",
      "Mix with water or milk, as directed",
      "Pair with fruit for **extra fibre**",
    ],
    durationInSeconds: 8,
  },
  labelFacts: {
    title: "Check **these** on the pack",
    facts: [
      { label: "Protein per serving", value: "[from label]" },
      { label: "Calories per serving", value: "[from label]" },
      { label: "Sugar per serving", value: "[from label]" },
      { label: "Halal certification", value: "[check pack]" },
    ],
    note: "Always copy values exactly from your own product label.",
    durationInSeconds: 7,
  },
  goodToKnow: {
    title: "Good to **know**",
    items: [
      "It's not a magic solution — your **overall habits** matter most.",
      "Pregnant, breastfeeding or have a medical condition? **Ask your doctor** first.",
      "Check the ingredients if you have any **allergies**.",
    ],
    durationInSeconds: 8,
  },
  cta: {
    title: "Questions about this **product**?",
    subtitle: "Send me a message and I'll walk you through the label.",
    buttonText: "DM @coachilyani",
    durationInSeconds: 5,
  },
  disclaimer:
    "For education only. This product is not intended to diagnose, treat, cure or prevent any disease. Individual needs vary.",
  audio: defaultAudio,
};
