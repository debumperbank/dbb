export const openingHours = [
  { label: "Maandag t/m donderdag", time: "08:00–15:00", note: "Na 15:00 alleen op afspraak" },
  { label: "Vrijdag", time: "08:00–12:00", note: "" },
  { label: "Zaterdag", time: "Alleen op afspraak", note: "" },
  { label: "Zondag", time: "Gesloten", note: "" },
];

export const openingHoursSpecification = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    opens: "08:00",
    closes: "15:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Friday",
    opens: "08:00",
    closes: "12:00",
  },
];
