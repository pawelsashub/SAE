// Ten plik trafia na publiczny serwer, więc nie może zawierać prawdziwych danych z arkuszy.
// Prawdziwe wpisy aplikacja pobiera dopiero po połączeniu (adres + token w oknie „Połączenie”).

export const SHEETS = {
  me: {
    tab: "Wiedza",
    url: "https://docs.google.com/spreadsheets/d/1ISlLRkF1RDFsBdtlUslr2ft7eHF-DMn2DnG_BcDKe60/edit",
  },
  claude: {
    tab: "Claude to Learn",
    url: "https://docs.google.com/spreadsheets/d/1OLgb3EKNW3YdzWcE4P4qR0GKxTuGW1UoWZU9iNDKuPg/edit",
  },
};

export const DICT = {
  meStatus: ["Do zapoznania się", "W trakcie", "Zapoznane", "Do wdrożenia", "Wdrożone"],
  claudeStatus: [
    "Planowany priorytet",
    "W realizacji",
    "Planowany",
    "Do rozważenia",
    "Wdrożony",
    "Niemożliwe",
    "Rezygnacja",
  ],
  claudePriority: ["Wysoki", "Średni", "Niski"],
  claudeCategory: [
    "Konektor",
    "Wtyczka / aplikacja",
    "Skill",
    "Ustawienia / uprawnienia",
    "Ograniczenie modelu",
    "Inne",
  ],
};

// Przykładowe wpisy widoczne tylko bez połączenia z arkuszami.
export const ME_ITEMS = [
  {
    nr: 1,
    name: "Przykład: kurs o pisaniu promptów",
    desc: "Tak wygląda wpis na liście rzeczy, które chcesz przerobić. Po połączeniu z arkuszami zobaczysz tu swoje prawdziwe pozycje.",
    source: "Przykład",
    date: "10.11.2026",
    status: "Do zapoznania się",
    area: "prompty",
    materials: "https://example.com",
  },
];

export const CLAUDE_ITEMS = [
  {
    nr: 1,
    date: "10.11.2026",
    name: "Przykład: umiejętność, której system AI jeszcze nie ma",
    desc: "Tak wygląda wpis na liście umiejętności do wdrożenia. Po połączeniu z arkuszami zobaczysz tu swoje prawdziwe pozycje.",
    example: "Opis sytuacji, w której ta umiejętność byłaby potrzebna.",
    context: "Przykład",
    category: "Skill",
    priority: "Średni",
    status: "Do rozważenia",
  },
];
