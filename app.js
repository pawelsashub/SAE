// Numer wersji w adresie zmieniaj razem z index.html, żeby przeglądarki pobrały nowe pliki.
import {
  SHEETS, DICT, ME_ITEMS, CLAUDE_ITEMS, INTERVIEW_ITEMS, SOURCE_ITEMS, PROCESS_ITEMS, SCHEDULE_ITEMS,
  STEP_ITEMS, PEOPLE_ITEMS, TOOL_ITEMS, HANDOFF_ITEMS, NOTE_ITEMS, BACKLOG_ITEMS,
} from "./data.js?v=13";

// Firmy w module Business Mapping. Każda kolejna firma dostanie własny arkusz.
const COMPANIES = [{ id: "ewesa", name: "Ewesa" }];

// Moduły aplikacji i ich zakładki.
const MODULES = {
  academy: {
    label: "AI Academy",
    title: "AI Academy",
    sub: "Co chcę przerobić ja i czego ma się nauczyć mój system AI.",
    tabs: ["me", "claude"],
    icon: '<path d="M12 4 2.5 9 12 14l9.5-5L12 4Z"/><path d="M6.5 11.5V16c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-4.5"/>',
  },
  mapping: {
    label: "Business Mapping",
    title: "Business Mapping",
    sub: "Mapa firmy z różnych stron: procesy, kroki, osoby, narzędzia, przekazania pracy i źródła danych.",
    tabs: ["processes", "steps", "people", "tools", "handoffs", "sources", "interviews", "schedule", "notes"],
    icon: '<rect x="3" y="4" width="6" height="5" rx="1"/><rect x="15" y="4" width="6" height="5" rx="1"/><rect x="9" y="15" width="6" height="5" rx="1"/><path d="M6 9v3h12V9M12 12v3"/>',
  },
  // Sprawy porządkowe aplikacji. Kolejne ustawienia (np. kolory) dojdą tu jako następne zakładki.
  admin: {
    label: "Administracja",
    title: "Administracja",
    sub: "Lista rzeczy do wdrożenia. Z czasem dojdą tu ustawienia aplikacji.",
    tabs: ["backlog"],
    icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  },
};

// Opis zakładek: przykładowe dane, pola na karcie, w szczegółach i w formularzu.
// `noteAs` to nazwa typu elementu w zakładce „Notatki”; zakładki z tym polem mają notatki i przycisk dodawania.
const TABS = {
  me: {
    label: "Me to Learn", seed: ME_ITEMS, newestFirst: true, statuses: DICT.meStatus,
    defaults: { status: "Do zapoznania się" }, excerpt: "desc",
    meta: (it) => [it.source, it.area, it.date],
    detail: [["Opis", "desc"], ["Źródło", "source"], ["Obszar wdrożenia AI", "area"], ["Materiały", "materials"], ["Uwagi", "notes"], ["Data wpisu", "date"]],
    form: [
      { key: "name", label: "Nazwa", required: true },
      { key: "materials", label: "Link lub materiał", placeholder: "https://…" },
      { key: "desc", label: "Opis", type: "textarea" },
      { key: "source", label: "Źródło", placeholder: "Skąd to mam" },
      { key: "area", label: "Obszar wdrożenia AI" },
      { key: "status", label: "Status", options: DICT.meStatus },
    ],
  },
  claude: {
    label: "Claude to Learn", seed: CLAUDE_ITEMS, statuses: DICT.claudeStatus,
    defaults: { status: "Do rozważenia", priority: "Średni" }, excerpt: "desc",
    meta: (it) => [it.category, it.context, it.date],
    detail: [
      ["Opis umiejętności", "desc"], ["Przykładowa sytuacja", "example"], ["Kontekst / projekt", "context"],
      ["Kategoria", "category"], ["Priorytet", "priority"], ["Plan / rozwiązanie", "plan"],
      ["Instrukcja wdrożenia", "instruction"], ["Uwagi", "notes"], ["Data dodania", "date"], ["Data zamknięcia", "closed"],
    ],
    form: [
      { key: "name", label: "Umiejętność", required: true },
      { key: "desc", label: "Opis umiejętności", type: "textarea" },
      { key: "example", label: "Przykładowa sytuacja", type: "textarea" },
      { key: "context", label: "Kontekst / projekt" },
      { key: "category", label: "Kategoria", options: DICT.claudeCategory },
      { key: "priority", label: "Priorytet", options: DICT.claudePriority },
      { key: "status", label: "Status", options: DICT.claudeStatus },
    ],
  },
  processes: {
    label: "Aktualna mapa procesów", seed: PROCESS_ITEMS, view: "map", statuses: DICT.processStatus, noteAs: "Proces",
    groupings: [
      {
        key: "type", label: "Układ: mapa firmy", groups: DICT.processType, none: "Bez typu", bands: true,
        titles: {
          "Zarządczy": "Zarządzanie: nadaje kierunek i kontroluje",
          "Główny": "Łańcuch główny: to, za co płaci klient",
          "Wspierający": "Wsparcie: dostarcza zasoby łańcuchowi głównemu",
        },
      },
      { key: "area", label: "Układ: obszary", groups: DICT.processArea, none: "Bez obszaru" },
    ],
    defaults: { status: "Szkic", area: DICT.processArea[1], type: "Główny", state: "Aktualny" }, excerpt: "short",
    meta: (it) => [
      ownSteps(it).length ? `Schemat, kroki: ${ownSteps(it).length}` : countLabel(stepsOfProcess(it).length, "powiązane kroki"),
      phasesOf(it).join(" → "),
      it.who,
    ],
    detail: [
      ["Stan", "state"], ["Obszar", "area"], ["Typ", "type"], ["Krótki opis", "short"], ["Opis szczegółowy", "desc"], ["Kto wykonuje", "who"],
      ["Narzędzia", "tools"], ["Problemy i wąskie gardła", "problems"], ["Pomysły na AI", "ideas"], ["Materiały", "materials"],
      ["Źródło informacji", "source"], ["Proces AOP", "aop"], ["Kategoria APQC", "apqc"], ["Uwagi", "notes"],
    ],
    form: [
      { key: "name", label: "Proces", required: true },
      { key: "area", label: "Obszar", options: DICT.processArea },
      { key: "type", label: "Typ", options: DICT.processType },
      { key: "state", label: "Stan (mapa aktualna czy docelowa)", options: DICT.processState },
      { key: "short", label: "Krótki opis (na kafelek)" },
      { key: "desc", label: "Opis szczegółowy", type: "textarea" },
      { key: "who", label: "Kto wykonuje" },
      { key: "source", label: "Źródło informacji" },
      { key: "status", label: "Status", options: DICT.processStatus },
    ],
  },
  steps: {
    label: "Realny workflow", seed: STEP_ITEMS, view: "map", statuses: DICT.processStatus, noteAs: "Krok",
    groupings: [{ key: "stage", label: "Układ: etapy", groups: DICT.processStage, none: "Bez etapu" }],
    excerpt: "short",
    meta: (it) => [it.nr, it.people],
    detail: [
      ["Kod", "nr"], ["Etap", "stage"], ["Rodzaj", "kind"], ["Następny krok", "next"],
      ["Krótki opis", "short"], ["Opis szczegółowy", "desc"], ["Osoby i role", "people"],
      ["Narzędzia", "tools"], ["Problemy i wąskie gardła", "problems"], ["Pomysły na AI", "ideas"], ["Materiały", "materials"],
      ["Projekt przykładowy", "project"], ["Źródło informacji", "source"], ["Uwagi", "notes"],
      ["Godziny miesięcznie", "hours"], ["Rodzaj wejścia", "input"], ["Reguły czy ocena (1–5)", "rules"],
      ["Wyjątki i warianty", "exceptions"], ["Ekspozycja AI", "exposure"], ["Tryb", "mode"],
      ["Wartość (0–3)", "value"], ["Wykonalność (0–3)", "feasibility"], ["Ryzyko (0–3)", "risk"],
    ],
  },
  people: {
    label: "Osoby", seed: PEOPLE_ITEMS, statuses: DICT.personStatus, noteAs: "Osoba",
    defaults: { status: "Do potwierdzenia", form: "Zespół" }, excerpt: "role",
    meta: (it) => [it.form, countLabel(stepsOfPerson(it).length, "kroki"), countLabel(processesOfPerson(it).length, "procesy")],
    detail: [["Stanowisko / rola", "role"], ["Forma", "form"], ["Źródło informacji", "source"], ["Uwagi", "notes"]],
    form: [
      { key: "name", label: "Osoba (imię i nazwisko)", required: true },
      { key: "alias", label: "Inne formy imienia, po średniku", placeholder: "Ola; Olą" },
      { key: "role", label: "Stanowisko / rola" },
      { key: "form", label: "Forma", options: DICT.personForm },
      { key: "status", label: "Status", options: DICT.personStatus },
      { key: "notes", label: "Uwagi", type: "textarea" },
    ],
  },
  tools: {
    label: "Narzędzia", seed: TOOL_ITEMS, view: "map", statuses: DICT.toolStatus, noteAs: "Narzędzie",
    groupings: [{ key: "category", label: "Układ: kategorie", groups: DICT.toolCategory, none: "Bez kategorii", hideEmpty: true }],
    defaults: { status: "W użyciu", category: DICT.toolCategory[0] }, excerpt: "desc",
    meta: (it) => [countLabel(stepsOfTool(it).length, "kroki"), countLabel(peopleOfTool(it).length, "osoby")],
    detail: [["Kategoria", "category"], ["Do czego służy", "desc"], ["Źródło informacji", "source"], ["Uwagi", "notes"]],
    form: [
      { key: "name", label: "Narzędzie", required: true },
      { key: "alias", label: "Inne nazwy, po średniku" },
      { key: "category", label: "Kategoria", options: DICT.toolCategory },
      { key: "desc", label: "Do czego służy", type: "textarea" },
      { key: "status", label: "Status", options: DICT.toolStatus },
      { key: "notes", label: "Uwagi", type: "textarea" },
    ],
  },
  handoffs: {
    label: "Przekazania", seed: HANDOFF_ITEMS, statuses: DICT.processStatus,
    defaults: { status: "Szkic" }, excerpt: "name",
    title: (it) => `${it.from || "?"} → ${it.to || "?"}`,
    meta: (it) => [it.step, it.channel, it.problem ? `Problem: ${it.problem}` : ""],
    detail: [["Co jest przekazywane", "name"], ["Od", "from"], ["Do", "to"], ["Kanał", "channel"], ["Krok", "step"], ["Problem", "problem"], ["Źródło informacji", "source"]],
    form: [
      { key: "from", label: "Od (osoba)", required: true },
      { key: "to", label: "Do (osoba)", required: true },
      { key: "name", label: "Co jest przekazywane", type: "textarea", required: true },
      { key: "channel", label: "Kanał", placeholder: "Gmail, rozmowa, Asana…" },
      { key: "step", label: "Krok (kod)", placeholder: "K6" },
      { key: "problem", label: "Problem" },
      { key: "status", label: "Status", options: DICT.processStatus },
    ],
  },
  sources: {
    label: "Źródła danych", seed: SOURCE_ITEMS, statuses: DICT.sourceStatus, noteAs: "Źródło danych",
    defaults: { status: "Do przejrzenia", type: "Folder Google Drive" }, excerpt: "desc",
    meta: (it) => [it.type, it.owner, it.processes],
    detail: [
      ["Typ", "type"], ["Link", "link"], ["Co zawiera", "desc"], ["Właściciel", "owner"],
      ["Powiązane procesy i kroki", "processes"], ["Źródło informacji", "source"], ["Data dodania", "date"], ["Uwagi", "notes"],
    ],
    form: [
      { key: "name", label: "Nazwa", required: true },
      { key: "link", label: "Link", placeholder: "https://…" },
      { key: "type", label: "Typ", options: DICT.sourceType },
      { key: "desc", label: "Co zawiera", type: "textarea" },
      { key: "owner", label: "Właściciel" },
      { key: "processes", label: "Powiązane kroki lub procesy", placeholder: "K4, K12" },
      { key: "source", label: "Źródło informacji", placeholder: "Kto o tym powiedział" },
      { key: "status", label: "Status", options: DICT.sourceStatus },
    ],
  },
  interviews: {
    label: "Wywiady", seed: INTERVIEW_ITEMS, newestFirst: true, statuses: DICT.interviewStatus, noteAs: "Wywiad",
    defaults: { status: "Planowany" }, excerpt: "topic",
    meta: (it) => [it.role, it.date],
    detail: [["Stanowisko", "role"], ["Data", "date"], ["Temat rozmowy", "topic"], ["Podsumowanie", "summary"], ["Kroki z rozmowy", "processes"], ["Uwagi", "notes"]],
    form: [
      { key: "name", label: "Osoba (nazwisko i imię)", required: true, placeholder: "Falkiewicz Adrianna" },
      { key: "role", label: "Stanowisko" },
      { key: "date", label: "Data rozmowy", type: "date", required: true },
      { key: "topic", label: "Temat rozmowy", type: "textarea" },
      { key: "status", label: "Status", options: DICT.interviewStatus },
    ],
    formHint: "Zapis doda wiersz w arkuszu i założy folder rozmowy z dokumentem na transkrypcję.",
  },
  schedule: {
    label: "Harmonogram", seed: SCHEDULE_ITEMS, statuses: DICT.scheduleStatus, excerpt: "desc", view: "table",
    // Kolumny jak w arkuszu: [nagłówek, pole, szerokość w pikselach].
    columns: [
      ["Kod", "nr", 60], ["Pozycja", "name", 260], ["Typ", "type", 130], ["Tydzień", "week", 80], ["Od", "from", 95], ["Do", "to", 95],
      ["Zakres / po co", "desc", 380], ["Odpowiedzialny / dostarcza", "owner", 180], ["Procesy AOP", "aop", 110],
      ["Priorytet", "priority", 100], ["Status", "status", 120], ["Data wykonania", "done", 110], ["Link / wynik", "link", 160], ["Uwagi", "notes", 280],
    ],
    meta: (it) => [it.nr, it.type, it.week, it.from && it.to ? `${it.from} – ${it.to}` : "", it.owner],
    detail: [
      ["Kod", "nr"], ["Typ", "type"], ["Tydzień", "week"], ["Od", "from"], ["Do", "to"], ["Zakres / po co", "desc"],
      ["Odpowiedzialny / dostarcza", "owner"], ["Procesy AOP", "aop"], ["Priorytet", "priority"],
      ["Data wykonania", "done"], ["Link / wynik", "link"], ["Uwagi", "notes"],
    ],
  },
  notes: {
    label: "Notatki", seed: NOTE_ITEMS, newestFirst: true, statuses: [], excerpt: "name",
    title: (it) => it.element || it.target || "Notatka",
    defaults: { target: "Ogólna" },
    meta: (it) => [it.target, it.date, it.author],
    detail: [["Notatka", "name"], ["Dotyczy", "target"], ["Element", "element"], ["Data", "date"], ["Autor", "author"]],
    form: [
      { key: "target", label: "Dotyczy", options: DICT.noteTarget },
      { key: "element", label: "Element (nazwa albo kod)", placeholder: "K4, Saldeo, Adrianna Falkiewicz…" },
      { key: "name", label: "Notatka", type: "textarea", required: true },
      { key: "author", label: "Autor" },
    ],
  },
  backlog: {
    label: "Do wdrożenia", seed: BACKLOG_ITEMS, newestFirst: true, statuses: DICT.backlogStatus,
    defaults: { status: "Nowy" }, excerpt: "desc",
    meta: (it) => [it.date, it.links ? "ma linki" : ""],
    detail: [["Opis", "desc"], ["Źródła i linki", "links"], ["Data", "date"]],
    form: [
      { key: "name", label: "Nazwa", required: true },
      { key: "desc", label: "Opis", type: "textarea" },
      { key: "links", label: "Źródła i linki (każdy w osobnej linii)", type: "textarea" },
      { key: "status", label: "Status", options: DICT.backlogStatus },
    ],
  },
};

const ALL_TABS = Object.keys(TABS);

const TONE = {
  "Do zapoznania się": "todo", "W trakcie": "prog", "Zapoznane": "done", "Do wdrożenia": "idea", "Wdrożone": "done",
  "Planowany priorytet": "todo", "W realizacji": "prog", "Planowany": "idea", "Do rozważenia": "off",
  "Wdrożony": "done", "Niemożliwe": "off", "Rezygnacja": "off",
  "W toku": "prog", "Przeprowadzony": "todo", "Opracowany": "done", "Przesunięty": "off", "Anulowany": "off",
  "Szkic": "off", "Do potwierdzenia": "todo", "Potwierdzony": "done",
  "Do przejrzenia": "todo", "Przejrzane": "prog", "Zmapowane": "done",
  "Planowane": "idea", "Zrobione": "done", "Przesunięte": "off", "Anulowane": "off",
  "Pracuje": "done", "Nie pracuje": "off", "W użyciu": "done",
  "Nowy": "todo", "Odłożony": "off",
};

const LOCAL_KEY = "sae.localItems.v1";
const CONN_KEY = "sae.connection.v1";
const VIEW_KEY = "sae.view.v1";

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function readStore(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}
function writeStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* tryb prywatny: dane znikną po odświeżeniu */ }
}

const saved = readStore(VIEW_KEY, {});
const state = {
  module: MODULES[saved.module] ? saved.module : "academy",
  tab: "me",
  company: COMPANIES[0].id,
  query: "",
  status: "",
  grouping: {},                      // wybrany układ mapy dla zakładki
  conn: readStore(CONN_KEY, null),   // { url, token } albo null
  live: null,                        // { zakładka: [wiersze] } z arkuszy
  sheetUrls: {},                     // adresy zakładek podane przez skrypt
  loading: false,
  error: "",
  notice: "",
  local: readStore(LOCAL_KEY, {}),
  trail: [],                         // ścieżka w oknie szczegółów: [{ tab, id }]
  flowLayout: "phases",              // układ schematu procesu: phases | wide | lanes
  mapState: "current",               // która mapa procesów: current | target | both
};
state.tab = MODULES[state.module].tabs.includes(saved.tab) ? saved.tab : MODULES[state.module].tabs[0];

// ---- Połączenie z arkuszami (Google Apps Script) ----

async function api(payload, conn = state.conn) {
  // Zwykły tekst w treści: przeglądarka nie wysyła wtedy zapytania wstępnego, którego Apps Script nie obsługuje.
  const res = await fetch(conn.url, { method: "POST", body: JSON.stringify({ ...payload, token: conn.token }) });
  if (!res.ok) throw new Error(`Serwer odpowiedział kodem ${res.status}.`);
  let data;
  try { data = await res.json(); }
  catch { throw new Error("Nieoczekiwana odpowiedź. Sprawdź adres i ustawienie dostępu „Każdy” we wdrożeniu."); }
  if (!data.ok) throw new Error(data.error || "Nieznany błąd.");
  return data;
}

// Pobiera wszystkie zakładki. Starsza wersja skryptu zna mniej zakładek, wtedy bierzemy to, co potrafi.
async function fetchAll(conn) {
  try {
    const res = await api({ action: "load", tabs: ALL_TABS }, conn);
    return { live: res.data, sheetUrls: res.sheets || {} };
  } catch (err) {
    if (err.message !== "Nieznana akcja.") throw err;
    const res = await api({ action: "list" }, conn);
    return { live: { me: res.me, claude: res.claude }, sheetUrls: {} };
  }
}

async function refresh() {
  if (!state.conn) return;
  state.loading = true; state.error = ""; render();
  try {
    Object.assign(state, await fetchAll(state.conn));
  } catch (err) {
    state.error = err.message;
  }
  state.loading = false; render();
}

const tabIsLive = (tab) => Boolean(state.live && state.live[tab]);

// Na żywo: wiersze z arkusza. Bez połączenia: przykłady z data.js i pozycje zapisane w przeglądarce.
function itemsOf(tab) {
  if (tabIsLive(tab)) {
    const rows = state.live[tab].map((it) => ({ ...it, id: tab + it.nr }));
    return TABS[tab].newestFirst ? rows.reverse() : rows;
  }
  // Po połączeniu nie mieszamy przykładów z prawdziwymi danymi: zakładka, której skrypt jeszcze nie zna, jest pusta.
  if (state.live) return [];
  const seed = TABS[tab].seed.map((it) => ({ ...it, id: tab + it.nr }));
  return [...(state.local[tab] || []), ...seed];
}

// Proces bez wpisanego stanu traktujemy jako aktualny.
const isTarget = (p) => String(p.state || "").trim() === "Docelowy";
const MAP_LABEL = { current: "Aktualna mapa procesów", target: "Docelowa mapa procesów", both: "Mapa procesów: aktualna i docelowa" };
const inMapState = (p) => state.mapState === "both" || isTarget(p) === (state.mapState === "target");

function visibleItems() {
  const q = state.query.trim().toLowerCase();
  return itemsOf(state.tab).filter((it) => {
    if (state.tab === "processes" && !inMapState(it)) return false;
    if (state.status && it.status !== state.status) return false;
    return !q || Object.values(it).filter((v) => typeof v !== "object").join(" ").toLowerCase().includes(q);
  });
}

// ---- Powiązania między elementami mapy ----
// Arkusz trzyma nazwy w zwykłym tekście („Adrianna Falkiewicz, Patryk Hensel”), więc łączymy po nazwie lub aliasie.

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Czy tekst zawiera nazwę jako osobne słowo (żeby „Ola” nie pasowała do „szkolenia”).
function mentions(text, names) {
  const hay = String(text || "");
  return names.some((n) => new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRe(n)}($|[^\\p{L}\\p{N}])`, "iu").test(hay));
}
const namesOf = (it) => [it.name, ...String(it.alias || "").split(";")].map((s) => s.trim()).filter((s) => s.length >= 3);
const countLabel = (n, word) => (n ? `${word}: ${n}` : "");

// Kody kroków z tekstu, także zakresy: „K4, K12” albo „K1–K12”.
function stepCodes(text) {
  const out = new Set();
  const s = String(text || "");
  for (const m of s.matchAll(/K(\d+)\s*[–-]\s*K(\d+)/g)) {
    for (let i = Number(m[1]); i <= Number(m[2]) && i - Number(m[1]) < 200; i++) out.add("K" + i);
  }
  for (const m of s.matchAll(/K\d+/g)) out.add(m[0]);
  return out;
}
const processNumbers = (text) => new Set(String(text || "").match(/\d+/g) || []);

const byOrder = (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0);

// Kroki należące do procesu (kolumna „Proces”) w kolejności wykonywania i ich fazy.
const ownSteps = (p) => itemsOf("steps").filter((s) => String(s.process ?? "").trim() === String(p.nr)).sort(byOrder);
const phasesOf = (p) => [...new Set(ownSteps(p).map((s) => s.stage).filter(Boolean))];
// Kroki innych procesów, które tylko wskazują ten proces w kolumnie „Powiązane procesy”.
const linkedSteps = (p) => itemsOf("steps").filter((s) => String(s.process ?? "").trim() !== String(p.nr) && processNumbers(s.related).has(String(p.nr)));
const stepsOfProcess = (p) => [...ownSteps(p), ...linkedSteps(p)];
const processesOfStep = (s) => itemsOf("processes").filter((p) =>
  String(s.process ?? "").trim() === String(p.nr) || processNumbers(s.related).has(String(p.nr)));
const stepsOfPerson = (person) => itemsOf("steps").filter((s) => mentions(s.people, namesOf(person)));
const processesOfPerson = (person) => itemsOf("processes").filter((p) => mentions(p.who, namesOf(person)));
const peopleOfText = (text) => itemsOf("people").filter((person) => mentions(text, namesOf(person)));
const stepsOfTool = (tool) => itemsOf("steps").filter((s) => mentions(s.tools, namesOf(tool)));
const toolsOfText = (text) => itemsOf("tools").filter((tool) => mentions(text, namesOf(tool)));
const peopleOfTool = (tool) => uniq(stepsOfTool(tool).flatMap((s) => peopleOfText(s.people)));
const sourcesOfStep = (s) => itemsOf("sources").filter((src) => stepCodes(src.processes).has(String(s.nr)));
const handoffsOfStep = (s) => itemsOf("handoffs").filter((h) => stepCodes(h.step).has(String(s.nr)));

function uniq(items) {
  const seen = new Set();
  return items.filter((it) => !seen.has(it.id) && seen.add(it.id));
}

// Notatki do elementu: po nazwie albo kodzie w kolumnie „Element”.
function notesOf(tab, it) {
  const kind = TABS[tab].noteAs;
  if (!kind) return [];
  const keys = [it.name, String(it.nr)].map((s) => String(s).trim().toLowerCase());
  return itemsOf("notes").filter((n) => n.target === kind && keys.includes(String(n.element || "").trim().toLowerCase()));
}

// Sekcje powiązań w oknie szczegółów: [nagłówek, zakładka, elementy].
function relationsOf(tab, it) {
  if (tab === "processes") {
    const steps = stepsOfProcess(it);
    return [
      ["Kroki tego procesu", "steps", ownSteps(it)],
      ["Kroki innych procesów, które go dotyczą", "steps", linkedSteps(it)],
      ["Osoby", "people", uniq([...peopleOfText(it.who), ...steps.flatMap((s) => peopleOfText(s.people))])],
      ["Narzędzia", "tools", uniq(steps.flatMap((s) => toolsOfText(s.tools)))],
      ["Źródła danych", "sources", uniq(steps.flatMap(sourcesOfStep))],
    ];
  }
  if (tab === "steps") {
    return [
      ["Procesy firmy", "processes", processesOfStep(it)],
      ["Osoby", "people", peopleOfText(it.people)],
      ["Narzędzia", "tools", toolsOfText(it.tools)],
      ["Przekazania pracy", "handoffs", handoffsOfStep(it)],
      ["Źródła danych", "sources", sourcesOfStep(it)],
    ];
  }
  if (tab === "people") {
    const steps = stepsOfPerson(it);
    const names = namesOf(it);
    return [
      ["Procesy według AOP", "processes", processesOfPerson(it)],
      ["Kroki, w których bierze udział", "steps", steps],
      ["Narzędzia w tych krokach", "tools", uniq(steps.flatMap((s) => toolsOfText(s.tools)))],
      ["Przekazuje pracę", "handoffs", itemsOf("handoffs").filter((h) => mentions(h.from, names))],
      ["Otrzymuje pracę", "handoffs", itemsOf("handoffs").filter((h) => mentions(h.to, names))],
      ["Źródła danych, których jest właścicielem", "sources", itemsOf("sources").filter((s) => mentions(s.owner, names))],
    ];
  }
  if (tab === "tools") {
    const steps = stepsOfTool(it);
    return [
      ["Kroki, w których jest używane", "steps", steps],
      ["Osoby", "people", peopleOfTool(it)],
      ["Procesy firmy", "processes", uniq(steps.flatMap(processesOfStep))],
    ];
  }
  if (tab === "handoffs") {
    return [
      ["Od", "people", peopleOfText(it.from)],
      ["Do", "people", peopleOfText(it.to)],
      ["Krok", "steps", itemsOf("steps").filter((s) => stepCodes(it.step).has(String(s.nr)))],
    ];
  }
  if (tab === "sources") {
    return [
      ["Kroki", "steps", itemsOf("steps").filter((s) => stepCodes(it.processes).has(String(s.nr)))],
      ["Właściciel", "people", peopleOfText(it.owner)],
    ];
  }
  return [];
}

// ---- Widok ----

const titleOf = (tab, it) => (TABS[tab].title ? TABS[tab].title(it) : it.name);

function renderBanner() {
  const b = $("banner");
  $("connDot").className = "dot" + (state.error ? " err" : state.live ? " on" : "");
  b.classList.toggle("err", Boolean(state.error));
  let html;
  if (state.loading) {
    html = "Wczytuję dane z arkuszy…";
  } else if (state.error) {
    html = `<strong>Brak połączenia z arkuszami.</strong> ${esc(state.error)} ${state.live ? "" : "Poniżej przykładowe dane. "}<button type="button" data-refresh>Spróbuj ponownie</button>`;
  } else if (state.live && !tabIsLive(state.tab)) {
    html = `<strong>Ta zakładka wymaga nowszej wersji skryptu.</strong> Zaktualizuj skrypt w Apps Script, żeby zobaczyć tu dane z arkusza. <button type="button" data-refresh>Odśwież</button>`;
  } else if (state.live) {
    html = `<strong>Połączono z arkuszami.</strong> Nowe pozycje trafiają prosto do arkusza. <button type="button" data-refresh>Odśwież</button>`;
  } else {
    html = `<strong>Brak połączenia.</strong> Poniżej przykładowe dane. Twoje wpisy pojawią się po połączeniu z arkuszami. <button type="button" data-conn>Połącz z arkuszami</button>`;
  }
  if (state.notice) html += `<p class="toast">${esc(state.notice)}</p>`;
  b.innerHTML = html;
}

function card(tab, it, tag = "h2") {
  const cfg = TABS[tab];
  const meta = cfg.meta(it).filter(Boolean).map((m) => `<span>${esc(m)}</span>`).join("");
  const prio = it.priority ? `<span class="${it.priority === "Wysoki" ? "high" : ""}">Priorytet: ${esc(it.priority)}</span>` : "";
  const mark = it.local ? `<span class="local">Tylko w tej przeglądarce</span>` : "";
  const text = it[cfg.excerpt];
  return `<button class="item" type="button" data-open="${esc(tab)}|${esc(it.id)}">
    <div class="item-top"><${tag}>${esc(titleOf(tab, it))}</${tag}>${it.status ? `<span class="pill ${TONE[it.status] || "off"}">${esc(it.status)}</span>` : ""}</div>
    ${text ? `<p>${esc(text)}</p>` : ""}
    <div class="meta">${prio}${meta}${mark}</div>
  </button>`;
}

function currentGrouping(tab) {
  const list = TABS[tab].groupings || [];
  const chosen = list.find((g) => g.key === state.grouping[tab]);
  if (chosen) return chosen;
  // Układ domyślny ma sens tylko wtedy, gdy dane mają pole, po którym grupuje (np. starszy skrypt nie zwraca typu).
  return list.find((g) => itemsOf(tab).some((it) => it[g.key])) || list[0];
}

function renderMap(tab, items) {
  const g = currentGrouping(tab);
  const groups = [...g.groups];
  items.forEach((it) => { if (it[g.key] && !groups.includes(it[g.key])) groups.push(it[g.key]); });
  const rest = items.filter((it) => !it[g.key]);
  if (g.bands) {
    // Mapa firmy: pasy jeden pod drugim, w każdym kafelki procesów.
    const band = (name, list) => `<section class="band band-${groups.indexOf(name)}">
      <h2>${esc(g.titles?.[name] || name)} <span>${list.length}</span></h2>
      <div class="band-grid">${list.map((it) => card(tab, it, "h3")).join("") || `<p class="stage-empty">Brak pozycji</p>`}</div>
    </section>`;
    return groups.map((name) => band(name, items.filter((it) => it[g.key] === name))).join("") +
      (rest.length ? band(g.none, rest) : "");
  }
  const column = (title, list) => (g.hideEmpty && !list.length ? "" : `<section class="stage">
    <h2><span>${esc(title)}</span><span>${list.length}</span></h2>
    ${list.sort(byOrder).map((it) => card(tab, it, "h3")).join("") || `<p class="stage-empty">Brak pozycji</p>`}
  </section>`);
  return groups.map((name) => column(name, items.filter((it) => it[g.key] === name))).join("") +
    (rest.length ? column(g.none, rest) : "");
}

function render() {
  const mod = MODULES[state.module];
  const cfg = TABS[state.tab];
  writeStore(VIEW_KEY, { module: state.module, tab: state.tab });
  renderBanner();

  $("modules").innerHTML = `<p class="nav-label">Moduły</p>` + Object.entries(MODULES).map(([key, m]) =>
    `<a class="module${key === state.module ? " is-active" : ""}" data-module="${key}" role="button" tabindex="0">
      <svg viewBox="0 0 24 24" aria-hidden="true">${m.icon}</svg>${esc(m.label)}</a>`).join("");
  const company = COMPANIES.find((c) => c.id === state.company);
  $("title").textContent = state.module === "mapping" ? `${mod.title} · ${company.name}` : mod.title;
  $("sub").textContent = mod.sub;
  $("companyBar").hidden = state.module !== "mapping";
  $("company").innerHTML = COMPANIES.map((c) => `<option value="${esc(c.id)}"${c.id === state.company ? " selected" : ""}>${esc(c.name)}</option>`).join("");
  $("tabs").innerHTML = mod.tabs.map((key) =>
    `<button role="tab" class="tab" data-tab="${key}" type="button" aria-selected="${key === state.tab}">${esc(key === "processes" ? MAP_LABEL[state.mapState] : TABS[key].label)} <span class="count">${(key === "processes" ? itemsOf(key).filter(inMapState) : itemsOf(key)).length}</span></button>`).join("");
  $("mapStateBox").hidden = state.tab !== "processes";
  $("mapState").value = state.mapState;

  $("statusFilter").hidden = !cfg.statuses.length;
  $("statusFilter").innerHTML = `<option value="">Wszystkie statusy</option>` +
    cfg.statuses.map((s) => `<option${s === state.status ? " selected" : ""}>${esc(s)}</option>`).join("");

  const groupings = cfg.groupings || [];
  $("groupBy").hidden = groupings.length < 2;
  $("groupBy").innerHTML = groupings.map((g) => `<option value="${g.key}"${g === currentGrouping(state.tab) ? " selected" : ""}>${esc(g.label)}</option>`).join("");

  const url = state.sheetUrls[state.tab] || SHEETS[state.tab]?.url;
  $("sheetLink").hidden = !url;
  if (url) $("sheetLink").href = url;
  $("addBtn").hidden = !cfg.form;

  const items = visibleItems();
  const isMap = cfg.view === "map";
  const isTable = cfg.view === "table";
  $("table").hidden = !isTable;
  $("table").innerHTML = isTable && items.length ? renderTable(state.tab, items) : "";
  $("list").hidden = isMap || isTable;
  $("map").hidden = !isMap;
  const twoMaps = state.tab === "processes" && state.mapState === "both";
  $("empty").hidden = items.length > 0 || twoMaps;
  $("empty").textContent = state.tab === "processes" && state.mapState === "target"
    ? "Mapa docelowa jest jeszcze pusta. Dodaj proces ze stanem „Docelowy”."
    : "Brak pozycji dla tych filtrów.";
  $("map").classList.toggle("bands", isMap && !twoMaps && Boolean(currentGrouping(state.tab).bands));
  $("map").classList.toggle("two", twoMaps);
  if (twoMaps) {
    // Dwie mapy obok siebie: po lewej stan aktualny, po prawej docelowy.
    const side = (title, list) => `<div class="side-map"><h2>${title} <span>${list.length}</span></h2>
      <div class="map${currentGrouping("processes").bands ? " bands" : ""}">${list.length ? renderMap("processes", list) : `<p class="stage-empty">Brak procesów w tym stanie.</p>`}</div></div>`;
    $("map").innerHTML = side("Aktualna", items.filter((p) => !isTarget(p))) + side("Docelowa", items.filter(isTarget));
  } else if (isMap) $("map").innerHTML = items.length ? renderMap(state.tab, items) : "";
  else $("list").innerHTML = isTable ? "" : items.map((it) => `<li>${card(state.tab, it)}</li>`).join("");
}

// Widok tabeli: te same kolumny i kolejność co w arkuszu; kliknięcie wiersza otwiera szczegóły.
function renderTable(tab, items) {
  const cols = TABS[tab].columns;
  const cell = (it, key) => (key === "status" && it.status
    ? `<span class="pill ${TONE[it.status] || "off"}">${esc(it.status)}</span>`
    : rich(it[key] ?? ""));
  return `<table class="grid">
    <colgroup>${cols.map(([, , w]) => `<col style="width:${w}px">`).join("")}</colgroup>
    <thead><tr>${cols.map(([label]) => `<th scope="col">${esc(label)}</th>`).join("")}</tr></thead>
    <tbody>${items.map((it) => `<tr data-open="${esc(tab)}|${esc(it.id)}" tabindex="0">${
      cols.map(([, key], i) => `<td${i < 2 ? ' class="lead"' : ""}>${cell(it, key)}</td>`).join("")}</tr>`).join("")}</tbody>
  </table>`;
}

const isWebUrl = (u) => /^https?:\/\/\S+$/i.test(String(u));

// Tekst z arkusza z klikalnymi adresami.
function rich(text) {
  return String(text).trim().split(/(\s+)/).map((part) =>
    isWebUrl(part) ? `<a href="${esc(part)}" target="_blank" rel="noopener">${esc(part)}</a>` : esc(part)).join("");
}

function fieldValue(it, key) {
  if (key === "materials" && it.links?.length) {
    return it.links.filter((l) => isWebUrl(l.url))
      .map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.text)} ↗</a>`).join("<br>");
  }
  return rich(it[key]);
}

// Instrukcja, którą wkleja się na początku rozmowy z Claude prowadzącej wywiad.
function interviewPrompt(it) {
  const sheet = (state.sheetUrls.interviews || "").split("#")[0] || "„Ewesa - Business Mapping Database”";
  return `Prowadzimy rozmowę w ramach mapowania procesów firmy Ewesa (stan obecny, AS IS).

Rozmówca: ${it.name}${it.role ? `, ${it.role}` : ""}
Data: ${it.date || "dziś"}
Temat: ${it.topic || "jak wygląda praca rozmówcy od początku do końca"}

Twoja rola
- Prowadź rozmowę po polsku. Zadawaj jedno pytanie naraz i idź po kolei, od tego, co uruchamia pracę, do jej wyniku.
- Dopytuj o konkrety: kto to robi, w jakim narzędziu, skąd bierze dane, komu przekazuje pracę dalej, co się psuje, ile to trwa i jak często się zdarza.
- Proś o pokazanie ostatniego prawdziwego przykładu zamiast opisu ogólnego.
- Gdy pada link do Google Workspace albo Asany, otwórz go, opisz w dwóch zdaniach, co zawiera, i poproś o potwierdzenie.
- Niczego nie zgaduj. Rzeczy niepewne oznacz jako „do potwierdzenia”.

Arkusz: ${sheet}
Zanim cokolwiek zapiszesz, odczytaj nagłówki z wiersza 4 danej zakładki i wpisuj wartości według nazw kolumn, nie według ich kolejności. Dane zaczynają się w wierszu 5. Nie nadpisuj istniejących wierszy: nowe dopisuj pod ostatnim.

Gdzie zapisywać
1. Transkrypcja i notatki: dokument ${it.transcript || "w folderze rozmowy"}
   Dopisuj na bieżąco w sekcji „Transkrypcja”, a linki w sekcji „Linki i materiały”.
2. Zakładka „Kroki”: jeden wiersz na każdy krok pracy opisany przez rozmówcę.
   Kod (K i kolejny wolny numer), Krok, Kolejność, Proces (numer procesu z zakładki „Procesy”, do którego krok należy), Następny krok (kody kroków po średniku; powód przejścia w nawiasie, np. „K5; K4 (poprawki klienta)”), Rodzaj (Czynność albo Decyzja), Etap, Krótki opis (jedno zdanie), Opis szczegółowy, Osoby i role (imię i nazwisko tak jak w zakładce „Osoby”), Narzędzia (nazwy tak jak w zakładce „Narzędzia”), Problemy i wąskie gardła, Pomysły na AI, Materiały, Źródło informacji (${it.name}), Powiązane procesy (numery z zakładki „Procesy”), Projekt przykładowy, Status „Szkic”.
   Jeśli rozmówca potrafi to oszacować, wypełnij też: Godziny miesięcznie, Rodzaj wejścia (cyfrowe ustrukturyzowane, cyfrowe nieustrukturyzowane, niecyfrowe), Reguły czy ocena (1–5), Wyjątki i warianty (mało, średnio, dużo).
3. Zakładka „Przekazania”: jeden wiersz za każdym razem, gdy praca przechodzi od jednej osoby do drugiej: Od, Do, Co jest przekazywane, Kanał, Krok (kod), Problem, Źródło informacji, Status „Szkic”.
4. Zakładka „Źródła danych”: jeden wiersz na każdy link lub miejsce z danymi: Nazwa, Typ, Link (pełny adres), Co zawiera, Właściciel, Powiązane procesy (kody kroków, np. K4, K12), Źródło informacji (${it.name}), Data dodania, Status „Do przejrzenia”.
5. Zakładki „Osoby” i „Narzędzia”: dopisz osobę albo narzędzie, jeśli pojawia się w rozmowie, a nie ma go na liście.
6. Zakładki „Procesy” nie zmieniaj. To lista procesów firmy; kroki łączą się z nią przez numery w kolumnie „Powiązane procesy”.
7. Po rozmowie: zakładka „Team members interviews”, wiersz Nr ${it.nr ?? "tej rozmowy"}.
   Uzupełnij Stanowisko, Podsumowanie, Procesy z rozmowy (kody kroków) i zmień Status na „Przeprowadzony”.

Zasady
- Wartości pól Etap, Typ, Forma, Kategoria i Status bierz z zakładki „Słowniki”.
- Listy numerów i kodów wpisuj jako tekst, żeby arkusz nie zamienił ich na daty.
- Zanim zapiszesz większą porcję, pokaż krótkie podsumowanie do akceptacji.
${it.folder ? `\nFolder rozmowy: ${it.folder}\n` : ""}
Zacznij od krótkiego przedstawienia celu rozmowy i pierwszego pytania.`;
}

function detailActions(tab, it) {
  if (it.local) return "";
  const buttons = [];
  if (TABS[tab].noteAs && TABS.notes.form) {
    buttons.push(`<button class="btn" type="button" data-note="${esc(tab)}|${esc(it.id)}">+ Notatka</button>`);
  }
  if (tab === "interviews") {
    const link = (url, label) => isWebUrl(url) ? `<a class="btn" href="${esc(url)}" target="_blank" rel="noopener">${label} ↗</a>` : "";
    buttons.unshift(
      `<button class="btn primary" type="button" data-copy-prompt="${esc(it.id)}">Kopiuj instrukcję dla Claude</button>`,
      `<a class="btn" href="https://claude.ai/new" target="_blank" rel="noopener">Otwórz Claude ↗</a>`,
      link(it.folder, "Folder"), link(it.transcript, "Transkrypcja"));
  }
  return buttons.length ? `<div class="detail-actions">${buttons.join("")}</div><p class="toast" id="copyNote" hidden></p>` : "";
}

const findItem = (tab, id) => itemsOf(tab).find((x) => x.id === id);

function renderDetail() {
  const here = state.trail[state.trail.length - 1];
  const it = here && findItem(here.tab, here.id);
  if (!it) { $("detail").close(); return; }
  const tab = here.tab;
  const cfg = TABS[tab];
  const rows = cfg.detail.filter(([, k]) => it[k])
    .map(([label, k]) => `<div><dt>${esc(label)}</dt><dd>${fieldValue(it, k)}</dd></div>`).join("");

  const relations = relationsOf(tab, it).filter(([, , list]) => list.length).map(([label, toTab, list]) =>
    `<section class="rel"><h3>${esc(label)} (${list.length})</h3><ul>${list.map((x) =>
      `<li><button class="chip" type="button" data-go="${esc(toTab)}|${esc(x.id)}">${toTab === "steps" || toTab === "processes" ? `<small>${esc(x.nr)}</small> ` : ""}${esc(titleOf(toTab, x))}</button></li>`).join("")}</ul></section>`).join("");

  const notes = notesOf(tab, it);
  const notesHtml = notes.length ? `<section class="rel"><h3>Notatki (${notes.length})</h3><ul class="rel-notes">${notes.map((n) =>
    `<li>${esc(n.name)}<small>${esc([n.date, n.author].filter(Boolean).join(" · "))}</small></li>`).join("")}</ul></section>` : "";

  const url = state.sheetUrls[tab] || SHEETS[tab]?.url;
  const more = it.local
    ? "Ta pozycja jest zapisana tylko w tej przeglądarce."
    : url ? `Edycja wpisu w arkuszu: <a href="${esc(url)}" target="_blank" rel="noopener">otwórz zakładkę ↗</a>` : "";
  const back = state.trail.length > 1 ? `<button class="back" type="button" data-back>← Wróć</button>` : "";

  const hasFlow = tab === "processes" && ownSteps(it).length > 0;
  const flow = hasFlow ? `<section class="flow">
      <div class="flow-head"><h3>Schemat procesu</h3>
        <select id="flowLayout" aria-label="Układ schematu">
          ${[["phases", "Fazy z góry na dół"], ["wide", "Fazy od lewej do prawej"], ["lanes", "Tory osób"]].map(([v, l]) =>
            `<option value="${v}"${v === state.flowLayout ? " selected" : ""}>${l}</option>`).join("")}
        </select></div>
      <div class="flow-box" id="flowBox">Rysuję schemat…</div>
      <p class="flow-legend"><i></i>krok z innego procesu, do którego prowadzi albo z którego przychodzi strzałka. Kliknij krok, żeby zobaczyć szczegóły.</p>
    </section>` : "";

  $("detail").classList.toggle("wide", Boolean(relations) && !hasFlow);
  $("detail").classList.toggle("xwide", hasFlow);
  $("detail").innerHTML = `<div class="dialog-body">
    ${back}
    <div class="dialog-head">
      <div><span class="pill off">${esc(cfg.label)}</span> ${it.status ? `<span class="pill ${TONE[it.status] || "off"}">${esc(it.status)}</span>` : ""}<h2 style="margin-top:8px">${esc(titleOf(tab, it))}</h2></div>
      <button class="close" type="button" data-close aria-label="Zamknij">×</button>
    </div>
    ${flow}
    <dl class="fields">${rows}</dl>
    ${relations}
    ${notesHtml}
    ${detailActions(tab, it)}
    ${more ? `<p class="more">${more}</p>` : ""}
    ${it.local ? `<div class="actions"><button class="btn" type="button" data-remove="${esc(tab)}|${esc(it.id)}">Usuń</button></div>` : ""}
  </div>`;
  if (!$("detail").open) $("detail").showModal();
  $("detail").scrollTop = 0;
  if (hasFlow) drawFlow(it);
}

// ---- Schemat procesu (biblioteka Mermaid, pobierana przy pierwszym użyciu) ----

let mermaidLoading;
function loadMermaid() {
  return (mermaidLoading ||= import("https://cdn.jsdelivr.net/npm/mermaid@11.4.0/dist/mermaid.esm.min.mjs").then((m) => {
    const dark = matchMedia("(prefers-color-scheme: dark)").matches;
    m.default.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: dark ? "dark" : "neutral",
      themeVariables: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: "14px" },
      flowchart: { useMaxWidth: false, htmlLabels: true, curve: "basis" },
    });
    return m.default;
  }));
}

// Tekst z arkusza nie może zmienić składni schematu, więc znaki specjalne zamieniamy na kody.
const mmText = (s) => String(s ?? "").replace(/[^\p{L}\p{N} .,:;!?%+\/–-]/gu, (c) => `#${c.codePointAt(0)};`);
const shorten = (s, n) => (String(s || "").length > n ? String(s).slice(0, n - 1).trimEnd() + "…" : String(s || ""));

// Następne kroki z kolumny „Następny krok”: „K5; K4 (kolejna wersja)”.
function nextOf(step) {
  return [...String(step.next || "").matchAll(/(K\d+)\s*(?:\(([^)]*)\))?/g)].map((m) => ({ code: m[1], label: m[2] || "" }));
}

function flowText(proc, layout) {
  const steps = ownSteps(proc);
  const all = itemsOf("steps");
  const own = new Set(steps.map((s) => String(s.nr)));
  const anyNext = steps.some((s) => nextOf(s).length);
  // Strzałki: z kolumny „Następny krok”, a gdy jest pusta w całym procesie, po kolei.
  const targetsOf = (s, i) => (anyNext ? nextOf(s) : steps[i + 1] ? [{ code: String(steps[i + 1].nr), label: "" }] : []);

  // Kroki innych procesów, do których ten proces przekazuje pracę albo od których ją dostaje.
  const outside = new Map();
  steps.forEach((s, i) => targetsOf(s, i).forEach((t) => {
    const step = !own.has(t.code) && all.find((x) => String(x.nr) === t.code);
    if (step) outside.set(t.code, step);
  }));
  all.filter((x) => !own.has(String(x.nr)) && nextOf(x).some((t) => own.has(t.code)))
    .forEach((x) => outside.set(String(x.nr), x));

  const ids = new Map();
  steps.forEach((s, i) => ids.set(String(s.nr), "S" + i));
  [...outside.keys()].forEach((code, i) => ids.set(code, "X" + i));

  // Tor kroku to osoba wymieniona w nim jako pierwsza.
  const firstPerson = (s) => {
    const text = String(s.people || "").toLowerCase();
    const at = (person) => Math.min(...namesOf(person).map((n) => text.indexOf(n.toLowerCase())).filter((k) => k >= 0));
    return peopleOfText(s.people).sort((a, b) => at(a) - at(b))[0];
  };
  const laneOf = (s) => (layout === "lanes" ? (firstPerson(s)?.name || "Pozostali") : (s.stage || "Bez etapu"));
  const groups = [];
  steps.forEach((s) => {
    const name = laneOf(s);
    (groups.find((g) => g.name === name) || groups[groups.push({ name, steps: [] }) - 1]).steps.push(s);
  });

  const node = (s) => {
    const who = shorten(s.people, 44);
    const label = `${mmText(s.nr)} · ${mmText(shorten(s.name, 48))}${who ? `<br/>${mmText(who)}` : ""}`;
    const id = ids.get(String(s.nr));
    if (s.kind === "Decyzja") return `${id}{"${label}"}`;
    if (s.kind === "Start" || s.kind === "Koniec") return `${id}(["${label}"])`;
    return `${id}["${label}"]`;
  };
  const outsideNode = (s) => {
    const parent = itemsOf("processes").find((p) => String(p.nr) === String(s.process ?? "").trim());
    const where = parent ? `proces ${parent.nr}: ${shorten(parent.name, 40)}` : "inny proces";
    return `${ids.get(String(s.nr))}(["${mmText(s.nr)} · ${mmText(shorten(s.name, 44))}<br/>${mmText(where)}"])`;
  };

  const lines = [`flowchart ${layout === "wide" ? "LR" : "TB"}`];
  groups.forEach((g, i) => {
    lines.push(`subgraph G${i}["${mmText(g.name)}"]`, ...g.steps.map(node), "end");
  });
  outside.forEach((s) => lines.push(outsideNode(s)));

  const arrow = (from, t) => lines.push(`${ids.get(from)} -->${t.label ? `|${mmText(t.label)}|` : ""} ${ids.get(t.code)}`);
  steps.forEach((s, i) => targetsOf(s, i).filter((t) => ids.has(t.code)).forEach((t) => arrow(String(s.nr), t)));
  outside.forEach((s, code) => nextOf(s).filter((t) => own.has(t.code)).forEach((t) => arrow(code, t)));

  lines.push("classDef ext fill:#ffffff,stroke:#5d6b68,stroke-dasharray:5 4,color:#12211f;");
  if (outside.size) lines.push(`class ${[...outside.keys()].map((c) => ids.get(c)).join(",")} ext;`);
  return { text: lines.join("\n"), ids };
}

async function drawFlow(proc) {
  const box = $("flowBox");
  if (!box) return;
  const { text, ids } = flowText(proc, state.flowLayout);
  try {
    const mermaid = await loadMermaid();
    const { svg } = await mermaid.render("flow" + Date.now(), text);
    if (!box.isConnected) return; // okno pokazuje już coś innego
    box.innerHTML = svg;
    // Schemat niewiele szerszy od okna dopasowujemy do szerokości; bardzo szeroki zostaje czytelny i przewija się.
    const drawing = box.querySelector("svg");
    const width = drawing.getBoundingClientRect().width;
    if (width <= box.clientWidth * 1.5) { drawing.style.maxWidth = "100%"; drawing.style.height = "auto"; }
    else box.scrollLeft = (width - box.clientWidth) / 2;
    const byId = new Map([...ids].map(([code, id]) => [id, code]));
    box.querySelectorAll("g.node").forEach((n) => {
      const code = byId.get((n.id.match(/^flowchart-(.+)-\d+$/) || [])[1]);
      const step = code && itemsOf("steps").find((s) => String(s.nr) === code);
      if (!step) return;
      n.style.cursor = "pointer";
      n.setAttribute("tabindex", "0");
      n.setAttribute("role", "button");
      const open = () => openDetail("steps", step.id, true);
      n.addEventListener("click", open);
      n.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });
    });
  } catch (err) {
    if (!box.isConnected) return;
    // Bez biblioteki (np. brak internetu) pokazujemy kroki jako listę.
    box.innerHTML = `<p class="hint">Nie udało się narysować schematu (${esc(err.message || err)}). Kroki po kolei:</p><ol>${
      ownSteps(proc).map((s) => `<li>${esc(s.nr)} · ${esc(s.name)}</li>`).join("")}</ol>`;
  }
}

function openDetail(tab, id, keepTrail = false) {
  state.trail = keepTrail ? [...state.trail, { tab, id }] : [{ tab, id }];
  renderDetail();
}

function isoToday() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
const plDate = (iso) => iso.split("-").reverse().join(".");

// Formularz dodawania. `preset` wypełnia pola z góry (np. notatka do konkretnego elementu).
function openForm(tab = state.tab, preset = {}) {
  const cfg = TABS[tab];
  if (!cfg.form) return;
  const defaults = { ...(cfg.defaults || {}), ...preset };
  const fields = cfg.form.map((f) => {
    const req = f.required ? " required" : "";
    const val = defaults[f.key] ?? "";
    let control;
    if (f.options) {
      control = `<select name="${f.key}">${f.options.map((o) => `<option${o === val ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
    } else if (f.type === "textarea") {
      control = `<textarea name="${f.key}"${req}>${esc(val)}</textarea>`;
    } else if (f.type === "date") {
      control = `<input name="${f.key}" type="date" value="${isoToday()}"${req}>`;
    } else {
      control = `<input name="${f.key}" value="${esc(val)}" placeholder="${esc(f.placeholder || "")}"${req}>`;
    }
    return `<label>${esc(f.label)}${control}</label>`;
  }).join("");
  const live = tabIsLive(tab);
  $("form").innerHTML = `<form class="dialog-body" id="addForm" data-tab="${esc(tab)}">
    <div class="dialog-head"><h2>Nowa pozycja: ${esc(cfg.label)}</h2>
      <button class="close" type="button" data-close aria-label="Zamknij">×</button></div>
    ${fields}
    <p class="hint">${live ? esc(cfg.formHint || "Zapis doda nowy wiersz w arkuszu.") : "Bez połączenia pozycja zostanie tylko w tej przeglądarce."}</p>
    <p class="error" id="addError" hidden></p>
    <div class="actions">
      <button class="btn" type="button" data-close>Anuluj</button>
      <button class="btn primary" type="submit">Zapisz</button>
    </div>
  </form>`;
  $("form").showModal();
}

function openConn() {
  const c = state.conn || { url: "", token: "" };
  $("conn").innerHTML = `<form class="dialog-body" id="connForm">
    <div class="dialog-head"><h2>Połączenie z arkuszami</h2>
      <button class="close" type="button" data-close aria-label="Zamknij">×</button></div>
    <p class="hint">Wklej adres aplikacji internetowej z Google Apps Script i token z funkcji „setup”. Dane zostają w tej przeglądarce.</p>
    <label>Adres (kończy się na /exec)<input name="url" type="url" required value="${esc(c.url)}" placeholder="https://script.google.com/macros/s/…/exec"></label>
    <label>Token<input name="token" type="password" required value="${esc(c.token)}" autocomplete="off"></label>
    <p class="error" id="connError" hidden></p>
    <div class="actions">
      ${state.conn ? `<button class="btn" type="button" data-disconnect>Rozłącz</button>` : ""}
      <button class="btn" type="button" data-close>Anuluj</button>
      <button class="btn primary" type="submit">Połącz</button>
    </div>
  </form>`;
  $("conn").showModal();
}

async function withBusy(form, errorId, work) {
  const submit = form.querySelector("[type=submit]");
  const label = submit.textContent;
  const error = $(errorId);
  submit.disabled = true; submit.textContent = "Chwila…"; error.hidden = true;
  try {
    await work();
    form.closest("dialog").close();
  } catch (err) {
    error.textContent = err.message; error.hidden = false;
  }
  submit.disabled = false; submit.textContent = label;
}

document.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));

  if (form.id === "addForm") {
    const tab = form.dataset.tab;
    withBusy(form, "addError", async () => {
      state.notice = "";
      if (tab === state.tab) state.status = "";
      if (tabIsLive(tab)) {
        const res = await api({ action: "add", tab, item: data });
        state.notice = res.warning || "";
        await refresh();
      } else {
        const item = { ...data, id: "l" + Date.now(), local: true };
        item.date = plDate(data.date || isoToday());
        (state.local[tab] ||= []).unshift(item);
        writeStore(LOCAL_KEY, state.local);
        render();
      }
      if ($("detail").open) renderDetail();
    });
  }

  if (form.id === "connForm") {
    withBusy(form, "connError", async () => {
      const conn = { url: data.url.trim(), token: data.token.trim() };
      if (!/^https:\/\/script\.google\.com\/.+\/exec$/.test(conn.url)) {
        throw new Error("Adres powinien zaczynać się od https://script.google.com/ i kończyć na /exec.");
      }
      const loaded = await fetchAll(conn); // zapisujemy dopiero, gdy połączenie działa
      Object.assign(state, loaded, { conn, error: "" });
      writeStore(CONN_KEY, conn);
      render();
    });
  }
});

async function copyPrompt(id) {
  const it = findItem("interviews", id);
  const note = $("copyNote");
  if (!it || !note) return;
  try {
    await navigator.clipboard.writeText(interviewPrompt(it));
    note.textContent = "Skopiowano. Otwórz Claude i wklej instrukcję jako pierwszą wiadomość.";
  } catch {
    note.textContent = "Nie udało się skopiować. Spróbuj w innej przeglądarce.";
  }
  note.hidden = false;
}

const split = (value) => { const i = value.indexOf("|"); return [value.slice(0, i), value.slice(i + 1)]; };

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-module], [data-tab], [data-open], [data-go], [data-back], [data-note], [data-close], [data-remove], [data-refresh], [data-conn], [data-disconnect], [data-copy-prompt], #addBtn, #connBtn");
  if (!t) return;
  const d = t.dataset;
  if (d.module) {
    Object.assign(state, { module: d.module, tab: MODULES[d.module].tabs[0], status: "", query: "", notice: "" });
    $("search").value = "";
    render();
  }
  else if (d.tab) { state.tab = d.tab; state.status = ""; render(); }
  else if (d.open) openDetail(...split(d.open));
  else if (d.go) openDetail(...split(d.go), true);
  else if ("back" in d) { state.trail.pop(); renderDetail(); }
  else if (d.note) {
    const [tab, id] = split(d.note);
    const it = findItem(tab, id);
    if (it) openForm("notes", { target: TABS[tab].noteAs, element: tab === "steps" ? String(it.nr) : it.name });
  }
  else if (d.copyPrompt) copyPrompt(d.copyPrompt);
  else if (d.remove) {
    const [tab, id] = split(d.remove);
    state.local[tab] = (state.local[tab] || []).filter((x) => x.id !== id);
    writeStore(LOCAL_KEY, state.local);
    t.closest("dialog").close();
    render();
  }
  else if ("refresh" in d) refresh();
  else if ("disconnect" in d) {
    Object.assign(state, { conn: null, live: null, sheetUrls: {}, error: "" });
    try { localStorage.removeItem(CONN_KEY); } catch { /* brak dostępu do pamięci przeglądarki */ }
    t.closest("dialog").close();
    render();
  }
  else if ("close" in d) t.closest("dialog").close();
  else if (t.id === "addBtn") openForm(state.tab, state.tab === "processes" && state.mapState === "target" ? { state: "Docelowy" } : {});
  else if (t.id === "connBtn" || "conn" in d) openConn();
});

// Moduły w menu działają też z klawiatury.
$("modules").addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.dataset.module) { e.preventDefault(); e.target.click(); }
});

// Wiersze tabeli otwierają się też klawiszem Enter.
$("table").addEventListener("keydown", (e) => {
  const row = e.key === "Enter" && e.target.closest("tr[data-open]");
  if (row) openDetail(...split(row.dataset.open));
});

// Kliknięcie w tło zamyka okno.
document.querySelectorAll("dialog").forEach((dlg) => dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }));

$("search").addEventListener("input", (e) => { state.query = e.target.value; render(); });
$("statusFilter").addEventListener("change", (e) => { state.status = e.target.value; render(); });
$("groupBy").addEventListener("change", (e) => { state.grouping[state.tab] = e.target.value; render(); });
$("company").addEventListener("change", (e) => { state.company = e.target.value; render(); });
$("mapState").addEventListener("change", (e) => { state.mapState = e.target.value; render(); });
$("detail").addEventListener("change", (e) => {
  if (e.target.id === "flowLayout") { state.flowLayout = e.target.value; renderDetail(); }
});

render();
refresh();
