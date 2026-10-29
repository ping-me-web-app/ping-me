export const SITE_CONFIG = {
  name: "Ping Me",
  tagline: "Anoniem bereikbaar voor je voertuig",
  description: "Krijg direct een WhatsApp, SMS of e-mail wanneer er iets is met je auto, zonder je 06-nummer achter te laten.",
  url: "https://pingme.app",
  pricing: {
    annualPlan: {
      amount: 10,
      currency: "€",
      interval: "jaar",
      name: "Jaarabonnement",
      description: "Inclusief je eerste slimme QR-sticker gratis thuisbezorgd via PostNL brievenbuspost.",
    },
    replacementSticker: {
      amount: 5,
      currency: "€",
      name: "Vervangende Sticker",
      description: "Nieuwe auto of sticker beschadigd? Bestel op elk gewenst moment een extra sticker voor €5.",
    },
  },
  channels: [
    {
      id: "whatsapp" as const,
      name: "WhatsApp",
      badge: "Populair & Snelst",
      description: "Ontvang direct een WhatsApp bericht van onze geverifieerde bot.",
      icon: "MessageSquare",
    },
    {
      id: "sms" as const,
      name: "SMS",
      badge: "Altijd Bereikbaar",
      description: "Directe SMS notificatie op je mobiele telefoon.",
      icon: "Smartphone",
    },
    {
      id: "email" as const,
      name: "E-mail",
      badge: "Basis",
      description: "Melding via e-mail met voertuigdetails.",
      icon: "Mail",
    },
  ],
  quickAlertPresets: [
    "Parkeerhulp / Sta in de weg",
    "Autolampen branden nog",
    "Raam staat open",
    "Alarm gaat af",
    "Kleine schade / Tikje",
    "Sleutel vergeten / Noodgeval",
    "Anders / Overig",
  ],
};

export const ALERT_PRESETS = [
  { key: "p1", id: "presets.p1" },
  { key: "p2", id: "presets.p2" },
  { key: "p3", id: "presets.p3" },
  { key: "p4", id: "presets.p4" },
  { key: "p5", id: "presets.p5" },
  { key: "p6", id: "presets.p6" },
  { key: "p7", id: "presets.p7" },
] as const;
