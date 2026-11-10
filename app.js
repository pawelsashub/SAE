import { SHEETS, DICT, ME_ITEMS, CLAUDE_ITEMS, INTERVIEW_ITEMS, SOURCE_ITEMS, PROCESS_ITEMS, SCHEDULE_ITEMS } from "./data.js";

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
    title: "Business Mapping · Ewesa",
    sub: "Rozmowy z zespołem, źródła danych, mapa procesów i harmonogram mapowania.",
    tabs: ["interviews", "sources", "processes", "schedule"],
    icon: '<rect x="3" y="4" width="6" height="5" rx="1"/><rect x="15" y="4" width="6" height="5" rx="1"/><rect x="9" y="15" width="6" height="5" rx="1"/><path d="M6 9v3h12V9M12 12v3"/>',
  },
};

// Opis zakładek: przykładowe dane, pola na karcie, w szczegółach i w formularzu.
const TABS = {
  me: {
    label: "Me to Learn",
    seed: ME_ITEMS,
    newestFirst: true,
    statuses: DICT.meStatus,
    defaults: { status: "Do zapoznania się" },
    excerpt: "desc",
    meta: (it) => [it.source, it.area, it.date],
    detail: [
      ["Opis", "desc"], ["Źródło", "source"], ["Obszar wdrożenia AI", "area"],
      ["Materiały", "materials"], ["Uwagi", "notes"], ["Data wpisu", "date"],
    ],
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
    label: "Claude to Learn",
    seed: CLAUDE_ITEMS,
    statuses: DICT.claudeStatus,
    defaults: { status: "Do rozważenia", priority: "Średni" },
    excerpt: "desc",
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
  interviews: {
    label: "Wywiady",
    seed: INTERVIEW_ITEMS,
    newestFirst: true,
    statuses: DICT.interviewStatus,
    defaults: { status: "Planowany" },
    excerpt: "topic",
    meta: (it) => [it.role, it.date],
    detail: [
      ["Stanowisko", "role"], ["Data", "date"], ["Temat rozmowy", "topic"], ["Podsumowanie", "summary"],
      ["Procesy z rozmowy", "processes"], ["Uwagi", "notes"],
    ],
    form: [
      { key: "name", label: "Osoba (nazwisko i imię)", required: true, placeholder: "Falkiewicz Adrianna" },
      { key: "role", label: "Stanowisko" },
      { key: "date", label: "Data rozmowy", type: "date", required: true },
      { key: "topic", label: "Temat rozmowy", type: "textarea" },
      { key: "status", label: "Status", options: DICT.interviewStatus },
    ],
    formHint: "Zapis doda wiersz w arkuszu i założy folder rozmowy z dokumentem na transkrypcję.",
  },
  sources: {
    label: "Źródła danych",
    seed: SOURCE_ITEMS,
    statuses: DICT.sourceStatus,
    defaults: { status: "Do przejrzenia", type: "Folder Google Drive" },
    excerpt: "desc",
    meta: (it) => [it.type, it.owner, it.date],
    detail: [
      ["Typ", "type"], ["Link", "link"], ["Co zawiera", "desc"], ["Właściciel", "owner"],
      ["Powiązane procesy", "processes"], ["Źródło informacji", "source"], ["Data dodania", "date"], ["Uwagi", "notes"],
    ],
    form: [
      { key: "name", label: "Nazwa", required: true },
      { key: "link", label: "Link", placeholder: "https://…" },
      { key: "type", label: "Typ", options: DICT.sourceType },
      { key: "desc", label: "Co zawiera", type: "textarea" },
      { key: "owner", label: "Właściciel" },
      { key: "source", label: "Źródło informacji", placeholder: "Kto o tym powiedział" },
      { key: "status", label: "Status", options: DICT.sourceStatus },
    ],
  },
  processes: {
    label: "Mapa procesów",
    seed: PROCESS_ITEMS,
    view: "map",
    statuses: DICT.processStatus,
    defaults: { status: "Szkic", stage: DICT.processStage[0] },
    excerpt: "short",
    meta: (it) => [it.who, it.tools],
    detail: [
      ["Etap", "stage"], ["Krótki opis", "short"], ["Opis szczegółowy", "desc"], ["Kto wykonuje", "who"],
      ["Narzędzia", "tools"], ["Problemy i wąskie gardła", "problems"], ["Pomysły na AI", "ideas"],
      ["Materiały", "materials"], ["Źródło informacji", "source"], ["Proces AOP", "aop"], ["Uwagi", "notes"],
    ],
    form: [
      { key: "name", label: "Proces", required: true },
      { key: "stage", label: "Etap", options: DICT.processStage },
      { key: "short", label: "Krótki opis (na kafelek)" },
      { key: "desc", label: "Opis szczegółowy", type: "textarea" },
      { key: "who", label: "Kto wykonuje" },
      { key: "tools", label: "Narzędzia" },
      { key: "problems", label: "Problemy i wąskie gardła", type: "textarea" },
      { key: "materials", label: "Materiały (linki)", type: "textarea" },
      { key: "source", label: "Źródło informacji", placeholder: "Kto o tym powiedział" },
      { key: "status", label: "Status", options: DICT.processStatus },
    ],
  },
  schedule: {
    label: "Harmonogram",
    seed: SCHEDULE_ITEMS,
    statuses: DICT.scheduleStatus,
    excerpt: "desc",
    meta: (it) => [it.nr, it.type, it.week, it.from && it.to ? `${it.from} – ${it.to}` : "", it.owner],
    detail: [
      ["Kod", "nr"], ["Typ", "type"], ["Tydzień", "week"], ["Od", "from"], ["Do", "to"], ["Zakres / po co", "desc"],
      ["Odpowiedzialny / dostarcza", "owner"], ["Procesy AOP", "aop"], ["Priorytet", "priority"],
      ["Data wykonania", "done"], ["Link / wynik", "link"], ["Uwagi", "notes"],
    ],
    // bez formularza: pozycje harmonogramu dodaje się w arkuszu
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
  query: "",
  status: "",
  conn: readStore(CONN_KEY, null),   // { url, token } albo null
  live: null,                        // { zakładka: [wiersze] } z arkuszy
  sheetUrls: {},                     // adresy zakładek podane przez skrypt
  loading: false,
  error: "",
  notice: "",
  local: readStore(LOCAL_KEY, {}),
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

// Pobiera wszystkie zakładki. Starsza wersja skryptu zna tylko AI Academy, wtedy bierzemy to, co potrafi.
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
  const seed = TABS[tab].seed.map((it) => ({ ...it, id: tab + it.nr }));
  return [...(state.local[tab] || []), ...seed];
}

function visibleItems() {
  const q = state.query.trim().toLowerCase();
  return itemsOf(state.tab).filter((it) => {
    if (state.status && it.status !== state.status) return false;
    return !q || Object.values(it).filter((v) => typeof v !== "object").join(" ").toLowerCase().includes(q);
  });
}

// ---- Widok ----

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
    html = `<strong>Ten moduł wymaga nowszej wersji skryptu.</strong> Zaktualizuj skrypt w Apps Script, żeby zobaczyć tu dane z arkusza. Poniżej przykładowe dane. <button type="button" data-refresh>Odśwież</button>`;
  } else if (state.live) {
    html = `<strong>Połączono z arkuszami.</strong> Nowe pozycje trafiają prosto do arkusza. <button type="button" data-refresh>Odśwież</button>`;
  } else {
    html = `<strong>Brak połączenia.</strong> Poniżej przykładowe dane. Twoje wpisy pojawią się po połączeniu z arkuszami. <button type="button" data-conn>Połącz z arkuszami</button>`;
  }
  if (state.notice) html += `<p class="toast">${esc(state.notice)}</p>`;
  b.innerHTML = html;
}

function card(it, cfg, tag = "h2") {
  const meta = cfg.meta(it).filter(Boolean).map((m) => `<span>${esc(m)}</span>`).join("");
  const prio = it.priority ? `<span class="${it.priority === "Wysoki" ? "high" : ""}">Priorytet: ${esc(it.priority)}</span>` : "";
  const mark = it.local ? `<span class="local">Tylko w tej przeglądarce</span>` : "";
  const text = it[cfg.excerpt];
  return `<button class="item" type="button" data-id="${esc(it.id)}">
    <div class="item-top"><${tag}>${esc(it.name)}</${tag}>${it.status ? `<span class="pill ${TONE[it.status] || "off"}">${esc(it.status)}</span>` : ""}</div>
    ${text ? `<p>${esc(text)}</p>` : ""}
    <div class="meta">${prio}${meta}${mark}</div>
  </button>`;
}

function renderMap(items, cfg) {
  const stages = [...DICT.processStage];
  items.forEach((it) => { if (it.stage && !stages.includes(it.stage)) stages.push(it.stage); });
  const noStage = items.filter((it) => !it.stage);
  const column = (title, list) => `<section class="stage">
    <h2><span>${esc(title)}</span><span>${list.length}</span></h2>
    ${list.map((it) => card(it, cfg, "h3")).join("") || `<p class="stage-empty">Brak procesów</p>`}
  </section>`;
  return stages.map((s) => column(s, items.filter((it) => it.stage === s))).join("") +
    (noStage.length ? column("Bez etapu", noStage) : "");
}

function render() {
  const mod = MODULES[state.module];
  const cfg = TABS[state.tab];
  writeStore(VIEW_KEY, { module: state.module, tab: state.tab });
  renderBanner();

  $("modules").innerHTML = `<p class="nav-label">Moduły</p>` + Object.entries(MODULES).map(([key, m]) =>
    `<a class="module${key === state.module ? " is-active" : ""}" data-module="${key}" role="button" tabindex="0">
      <svg viewBox="0 0 24 24" aria-hidden="true">${m.icon}</svg>${esc(m.label)}</a>`).join("");
  $("title").textContent = mod.title;
  $("sub").textContent = mod.sub;
  $("tabs").innerHTML = mod.tabs.map((key) =>
    `<button role="tab" class="tab" data-tab="${key}" type="button" aria-selected="${key === state.tab}">${esc(TABS[key].label)} <span class="count">${itemsOf(key).length}</span></button>`).join("");

  $("statusFilter").innerHTML = `<option value="">Wszystkie statusy</option>` +
    cfg.statuses.map((s) => `<option${s === state.status ? " selected" : ""}>${esc(s)}</option>`).join("");

  const url = state.sheetUrls[state.tab] || SHEETS[state.tab]?.url;
  $("sheetLink").hidden = !url;
  if (url) $("sheetLink").href = url;

  $("addBtn").hidden = !cfg.form;

  const items = visibleItems();
  const isMap = cfg.view === "map";
  $("list").hidden = isMap;
  $("map").hidden = !isMap;
  $("empty").hidden = isMap || items.length > 0;
  if (isMap) $("map").innerHTML = renderMap(items, cfg);
  else $("list").innerHTML = items.map((it) => `<li>${card(it, cfg)}</li>`).join("");
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
- Prowadź rozmowę po polsku. Zadawaj jedno pytanie naraz i idź po kolei, od początku procesu do końca.
- Dopytuj o konkrety: kto to robi, w jakim narzędziu, skąd bierze dane, co dzieje się dalej, co się psuje, co zabiera najwięcej czasu.
- Gdy pada link do Google Workspace albo Asany, otwórz go, opisz w dwóch zdaniach, co zawiera, i poproś o potwierdzenie.
- Niczego nie zgaduj. Rzeczy niepewne oznacz jako „do potwierdzenia”.

Gdzie zapisywać
1. Transkrypcja i notatki: dokument ${it.transcript || "w folderze rozmowy"}
   Dopisuj na bieżąco w sekcji „Transkrypcja”, a linki w sekcji „Linki i materiały”.
2. Procesy: zakładka „Procesy” w arkuszu ${sheet}
   Jeden wiersz na proces: Proces, Etap, Krótki opis (jedno zdanie), Opis szczegółowy, Kto wykonuje, Narzędzia, Problemy i wąskie gardła, Pomysły na AI, Materiały, Źródło informacji (${it.name}), Status „Szkic”.
3. Źródła danych: zakładka „Źródła danych” w tym samym arkuszu
   Jeden wiersz na każdy link lub miejsce z danymi: Nazwa, Typ, Link (pełny adres), Co zawiera, Właściciel, Źródło informacji (${it.name}), Data dodania, Status „Do przejrzenia”.
4. Po rozmowie: zakładka „Team members interviews”, wiersz Nr ${it.nr ?? "tej rozmowy"}
   Uzupełnij Podsumowanie, Procesy z rozmowy (numery z zakładki „Procesy”) i zmień Status na „Przeprowadzony”.

Zasady arkusza
- Nagłówki są w wierszu 4, dane od wiersza 5. Nowy wiersz dostaje Nr o jeden większy od najwyższego.
- Wartości pól Etap, Typ i Status bierz z zakładki „Słowniki”.
- Zanim zapiszesz większą porcję, pokaż krótkie podsumowanie do akceptacji.
${it.folder ? `\nFolder rozmowy: ${it.folder}\n` : ""}
Zacznij od krótkiego przedstawienia celu rozmowy i pierwszego pytania.`;
}

function detailActions(it) {
  if (state.tab !== "interviews" || it.local) return "";
  const link = (url, label) => isWebUrl(url) ? `<a class="btn" href="${esc(url)}" target="_blank" rel="noopener">${label} ↗</a>` : "";
  return `<div class="detail-actions">
    <button class="btn primary" type="button" data-copy-prompt="${esc(it.id)}">Kopiuj instrukcję dla Claude</button>
    <a class="btn" href="https://claude.ai/new" target="_blank" rel="noopener">Otwórz Claude ↗</a>
    ${link(it.folder, "Folder")}${link(it.transcript, "Transkrypcja")}
  </div><p class="toast" id="copyNote" hidden></p>`;
}

function openDetail(id) {
  const cfg = TABS[state.tab];
  const it = itemsOf(state.tab).find((x) => x.id === id);
  if (!it) return;
  const rows = cfg.detail.filter(([, k]) => it[k])
    .map(([label, k]) => `<div><dt>${esc(label)}</dt><dd>${fieldValue(it, k)}</dd></div>`).join("");
  const url = state.sheetUrls[state.tab] || SHEETS[state.tab]?.url;
  const more = it.local
    ? "Ta pozycja jest zapisana tylko w tej przeglądarce."
    : url ? `Edycja wpisu w arkuszu: <a href="${esc(url)}" target="_blank" rel="noopener">otwórz zakładkę ↗</a>` : "";
  $("detail").innerHTML = `<div class="dialog-body">
    <div class="dialog-head">
      <div>${it.status ? `<span class="pill ${TONE[it.status] || "off"}">${esc(it.status)}</span>` : ""}<h2 style="margin-top:8px">${esc(it.name)}</h2></div>
      <button class="close" type="button" data-close aria-label="Zamknij">×</button>
    </div>
    <dl class="fields">${rows}</dl>
    ${detailActions(it)}
    ${more ? `<p class="more">${more}</p>` : ""}
    ${it.local ? `<div class="actions"><button class="btn" type="button" data-remove="${esc(it.id)}">Usuń</button></div>` : ""}
  </div>`;
  $("detail").showModal();
}

function isoToday() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
const plDate = (iso) => iso.split("-").reverse().join(".");

function openForm() {
  const cfg = TABS[state.tab];
  const fields = cfg.form.map((f) => {
    const req = f.required ? " required" : "";
    let control;
    if (f.options) {
      control = `<select name="${f.key}">${f.options.map((o) => `<option${o === cfg.defaults[f.key] ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
    } else if (f.type === "textarea") {
      control = `<textarea name="${f.key}"${req}></textarea>`;
    } else if (f.type === "date") {
      control = `<input name="${f.key}" type="date" value="${isoToday()}"${req}>`;
    } else {
      control = `<input name="${f.key}" placeholder="${esc(f.placeholder || "")}"${req}>`;
    }
    return `<label>${esc(f.label)}${control}</label>`;
  }).join("");
  const live = tabIsLive(state.tab);
  $("form").innerHTML = `<form class="dialog-body" id="addForm">
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
    withBusy(form, "addError", async () => {
      state.notice = "";
      state.status = "";
      if (tabIsLive(state.tab)) {
        const res = await api({ action: "add", tab: state.tab, item: data });
        state.notice = res.warning || "";
        await refresh();
      } else {
        const item = { ...data, id: "l" + Date.now(), local: true };
        item.date = plDate(data.date || isoToday());
        (state.local[state.tab] ||= []).unshift(item);
        writeStore(LOCAL_KEY, state.local);
        render();
      }
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
  const it = itemsOf("interviews").find((x) => x.id === id);
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

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-module], [data-tab], [data-id], [data-close], [data-remove], [data-refresh], [data-conn], [data-disconnect], [data-copy-prompt], #addBtn, #connBtn");
  if (!t) return;
  const d = t.dataset;
  if (d.module) {
    Object.assign(state, { module: d.module, tab: MODULES[d.module].tabs[0], status: "", query: "", notice: "" });
    $("search").value = "";
    render();
  }
  else if (d.tab) { state.tab = d.tab; state.status = ""; render(); }
  else if (d.id) openDetail(d.id);
  else if (d.copyPrompt) copyPrompt(d.copyPrompt);
  else if (d.remove) {
    state.local[state.tab] = (state.local[state.tab] || []).filter((x) => x.id !== d.remove);
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
  else if (t.id === "addBtn") openForm();
  else if (t.id === "connBtn" || "conn" in d) openConn();
});

// Moduły w menu działają też z klawiatury.
$("modules").addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.dataset.module) { e.preventDefault(); e.target.click(); }
});

// Kliknięcie w tło zamyka okno.
document.querySelectorAll("dialog").forEach((dlg) => dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }));

$("search").addEventListener("input", (e) => { state.query = e.target.value; render(); });
$("statusFilter").addEventListener("change", (e) => { state.status = e.target.value; render(); });

render();
refresh();
