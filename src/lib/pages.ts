import { SITE } from "./site";

/**
 * Client care and legal copy. Plain content objects so this can later be
 * served from Shopify pages or a CMS. Legal texts are starting points and
 * must be reviewed before launch.
 */
export interface InfoPage {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
}

export const CLIENT_CARE: Record<string, InfoPage> = {
  contact: {
    title: "Contact",
    intro: "Our client care team is here to help with orders, sizing and gifting.",
    sections: [
      { heading: "Email", body: `Write to ${SITE.email}. We reply within one working day.` },
      { heading: "Hours", body: "Monday to Friday, 9:00–18:00 CET." },
    ],
  },
  shipping: {
    title: "Shipping",
    intro: "Every order is dispatched in the VELORA keepsake box, tracked and insured.",
    sections: [
      { heading: "Europe", body: "Complimentary tracked delivery in 3–6 working days." },
      { heading: "Dispatch", body: "Orders placed before 14:00 CET on working days are dispatched within 2 working days." },
      { heading: "International", body: "Rates and delivery times are shown at checkout." },
    ],
  },
  returns: {
    title: "Returns",
    intro: "If your piece is not quite right, you may return it within 30 days.",
    sections: [
      { heading: "Conditions", body: "Pieces must be unworn, in their original condition and packaging." },
      { heading: "How to return", body: `Contact ${SITE.email} with your order number and we will send return instructions.` },
      { heading: "Refunds", body: "Refunds are issued to the original payment method within 10 working days of receipt." },
    ],
  },
  faq: {
    title: "FAQ",
    intro: "Answers to the questions we are asked most often.",
    sections: [
      { heading: "Will the cuff fit me?", body: "VELORA cuffs are open and gently adjustable. Ease the cuff open or closed slightly with both hands — never at a single point." },
      { heading: "Is each piece identical?", body: "No. Each piece is finished by hand, so small variations in stones and patina are part of its character." },
      { heading: "How should I care for my piece?", body: "Keep it dry, away from perfume and lotions, and store it in the VELORA pouch. Wipe with a soft dry cloth." },
    ],
  },
};

export const LEGAL: Record<string, InfoPage> = {
  privacy: {
    title: "Privacy",
    intro: "How VELORA collects, uses and protects your personal data.",
    sections: [
      { heading: "Data we collect", body: "Information you provide when ordering or subscribing — such as name, email and delivery address — and limited technical data needed to operate the site." },
      { heading: "How we use it", body: "To fulfil orders, provide client care and, with your consent, send Private Access communications. We never sell your data." },
      { heading: "Your rights", body: `Under the GDPR you may access, correct or delete your data at any time. Contact ${SITE.email}.` },
    ],
  },
  terms: {
    title: "Terms",
    intro: "The terms that apply to purchases made on this website.",
    sections: [
      { heading: "Orders", body: "An order is accepted once we confirm dispatch. Prices include VAT where applicable." },
      { heading: "Right of withdrawal", body: "EU customers may withdraw from a purchase within 14 days of delivery, in addition to our 30-day returns policy." },
      { heading: "Liability", body: "Nothing in these terms limits your statutory rights as a consumer." },
    ],
  },
};
