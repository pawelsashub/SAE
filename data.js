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
  interviewStatus: ["Planowany", "W toku", "Przeprowadzony", "Opracowany", "Przesunięty", "Anulowany"],
  processStage: [
    "Sprzedaż i oferta",
    "Start projektu",
    "Planowanie i przygotowanie",
    "Realizacja",
    "Rozliczenie i zamknięcie",
    "Stałe i wspierające",
  ],
  processStatus: ["Szkic", "Do potwierdzenia", "Potwierdzony"],
  sourceType: [
    "Folder Google Drive",
    "Dokument Google",
    "Arkusz Google",
    "Prezentacja Google",
    "Asana",
    "E-mail",
    "Strona www",
    "Plik (PDF, Excel, inne)",
    "Inne",
  ],
  sourceStatus: ["Do przejrzenia", "Przejrzane", "Zmapowane"],
  scheduleStatus: ["Planowane", "W toku", "Zrobione", "Przesunięte", "Anulowane"],
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

export const INTERVIEW_ITEMS = [
  {
    nr: 1,
    date: "10.11.2026",
    name: "Przykład: Kowalska Anna",
    role: "Kierownik projektu",
    topic: "Tak wygląda wpis rozmowy z członkiem zespołu. Po połączeniu z arkuszami zobaczysz tu swoje rozmowy.",
    status: "Planowany",
  },
];

export const SOURCE_ITEMS = [
  {
    nr: 1,
    name: "Przykład: folder z ofertami",
    type: "Folder Google Drive",
    link: "https://example.com",
    desc: "Tak wygląda wpis źródła danych: miejsce, w którym firma trzyma informacje.",
    status: "Do przejrzenia",
  },
];

export const PROCESS_ITEMS = [
  {
    nr: 1,
    name: "Przykład: przygotowanie oferty",
    stage: "Sprzedaż i oferta",
    short: "Tak wygląda kafelek procesu na mapie.",
    desc: "Po kliknięciu widać pełny opis procesu, narzędzia, problemy i materiały.",
    tools: "Arkusze Google, e-mail",
    status: "Szkic",
  },
  {
    nr: 2,
    name: "Przykład: realizacja na miejscu",
    stage: "Realizacja",
    short: "Procesy układają się w kolumnach według etapu.",
    status: "Szkic",
  },
];

export const SCHEDULE_ITEMS = [
  {
    nr: "R1",
    name: "Przykład: rozmowa z kierownikiem projektu",
    type: "Rozmowa",
    week: "T1",
    from: "02.11.2026",
    to: "06.11.2026",
    desc: "Tak wygląda pozycja harmonogramu mapowania. Po połączeniu z arkuszami zobaczysz tu swój plan.",
    status: "Planowane",
  },
];
