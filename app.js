import { SHEETS, DICT, ME_ITEMS, CLAUDE_ITEMS } from "./data.js";

// Opis obu zakładek: jakie pola pokazać i o co pytać w formularzu.
const TABS = {
  me: {
    label: "Me to Learn",
    statuses: DICT.meStatus,
    defaults: { status: "Do zapoznania się" },
    meta: (it) => [it.source, it.area, it.date],
    detail: [
      ["Opis", "desc"],
      ["Źródło", "source"],
      ["Obszar wdrożenia AI", "area"],
      ["Materiały", "materials"],
      ["Uwagi", "notes"],
      ["Data wpisu", "date"],
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
    statuses: DICT.claudeStatus,
    defaults: { status: "Do rozważenia", priority: "Średni" },
    meta: (it) => [it.category, it.context, it.date],
    detail: [
      ["Opis umiejętności", "desc"],
      ["Przykładowa sytuacja", "example"],
      ["Kontekst / projekt", "context"],
      ["Kategoria", "category"],
      ["Priorytet", "priority"],
      ["Plan / rozwiązanie", "plan"],
      ["Instrukcja wdrożenia", "instruction"],
      ["Uwagi", "notes"],
      ["Data dodania", "date"],
      ["Data zamknięcia", "closed"],
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
};

const TONE = {
  "Do zapoznania się": "todo", "W trakcie": "prog", "Zapoznane": "done", "Do wdrożenia": "idea", "Wdrożone": "done",
  "Planowany priorytet": "todo", "W realizacji": "prog", "Planowany": "idea", "Do rozważenia": "off",
  "Wdrożony": "done", "Niemożliwe": "off", "Rezygnacja": "off",
};

const LOCAL_KEY = "sae.localItems.v1";
const CONN_KEY = "sae.connection.v1";

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function readStore(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}
function writeStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* tryb prywatny: dane znikną po odświeżeniu */ }
}

const state = {
  tab: "me",
  query: "",
  status: "",
  conn: readStore(CONN_KEY, null),      // { url, token } albo null
  live: null,                           // { me: [...], claude: [...] } z arkuszy
  loading: false,
  error: "",
  local: readStore(LOCAL_KEY, { me: [], claude: [] }),
};

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

async function refresh() {
  if (!state.conn) return;
  state.loading = true; state.error = ""; render();
  try {
    const data = await api({ action: "list" });
    state.live = { me: data.me, claude: data.claude };
  } catch (err) {
    state.error = err.message;
  }
  state.loading = false; render();
}

// Na żywo: wiersze z arkusza. Bez połączenia: przykłady z data.js i pozycje zapisane w przeglądarce.
function itemsOf(tab) {
  if (state.live) {
    const rows = state.live[tab].map((it) => ({ ...it, id: "s" + it.nr }));
    // „Wiedza” rośnie w dół, więc najnowsze pokazujemy u góry; „Claude to Learn” ma własną kolejność w arkuszu.
    return tab === "me" ? rows.reverse() : rows;
  }
  const seed = (tab === "me" ? ME_ITEMS : CLAUDE_ITEMS).map((it) => ({ ...it, id: "s" + it.nr }));
  return [...state.local[tab], ...seed];
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
  const dot = $("connDot");
  b.hidden = false;
  b.classList.toggle("err", Boolean(state.error));
  dot.className = "dot" + (state.error ? " err" : state.live ? " on" : "");
  if (state.loading) {
    b.innerHTML = "Wczytuję dane z arkuszy…";
  } else if (state.error) {
    b.innerHTML = `<strong>Brak połączenia z arkuszami.</strong> ${esc(state.error)} ${state.live ? "" : "Poniżej przykładowe dane. "}<button type="button" data-refresh>Spróbuj ponownie</button>`;
  } else if (state.live) {
    b.innerHTML = `<strong>Połączono z arkuszami.</strong> Nowe pozycje trafiają prosto do arkusza. <button type="button" data-refresh>Odśwież</button>`;
  } else {
    b.innerHTML = `<strong>Brak połączenia.</strong> Poniżej przykładowe dane. Twoje wpisy pojawią się po połączeniu z arkuszami. <button type="button" data-conn>Połącz z arkuszami</button>`;
  }
}

function render() {
  const cfg = TABS[state.tab];
  renderBanner();
  document.querySelectorAll(".tab").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === state.tab)));
  $("countMe").textContent = itemsOf("me").length;
  $("countClaude").textContent = itemsOf("claude").length;

  $("statusFilter").innerHTML = `<option value="">Wszystkie statusy</option>` +
    cfg.statuses.map((s) => `<option${s === state.status ? " selected" : ""}>${esc(s)}</option>`).join("");

  const sheet = SHEETS[state.tab];
  $("sheetLink").href = sheet.url;
  $("sheetLink").title = `Zakładka „${sheet.tab}”`;

  const items = visibleItems();
  $("empty").hidden = items.length > 0;
  $("list").innerHTML = items.map((it) => {
    const meta = cfg.meta(it).filter(Boolean).map((m) => `<span>${esc(m)}</span>`).join("");
    const prio = it.priority ? `<span class="${it.priority === "Wysoki" ? "high" : ""}">Priorytet: ${esc(it.priority)}</span>` : "";
    const mark = it.local ? `<span class="local">Tylko w tej przeglądarce</span>` : "";
    return `<li><button class="item" type="button" data-id="${esc(it.id)}">
      <div class="item-top"><h2>${esc(it.name)}</h2><span class="pill ${TONE[it.status] || "off"}">${esc(it.status)}</span></div>
      ${it.desc ? `<p>${esc(it.desc)}</p>` : ""}
      <div class="meta">${prio}${meta}${mark}</div>
    </button></li>`;
  }).join("");
}

const isWebUrl = (u) => /^https?:\/\//i.test(String(u));

function fieldValue(it, key) {
  // Materiały: jeśli arkusz podał adresy linków, pokaż je jako klikalne.
  if (key === "materials" && it.links?.length) {
    return it.links.filter((l) => isWebUrl(l.url))
      .map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.text)} ↗</a>`).join("<br>");
  }
  const text = String(it[key]).trim();
  if (key === "materials" && isWebUrl(text) && !/\s/.test(text)) {
    return `<a href="${esc(text)}" target="_blank" rel="noopener">${esc(text)}</a>`;
  }
  return esc(text);
}

function openDetail(id) {
  const cfg = TABS[state.tab];
  const it = itemsOf(state.tab).find((x) => x.id === id);
  if (!it) return;
  const rows = cfg.detail.filter(([, k]) => it[k])
    .map(([label, k]) => `<div><dt>${esc(label)}</dt><dd>${fieldValue(it, k)}</dd></div>`).join("");
  const sheet = SHEETS[state.tab];
  const more = it.local
    ? "Ta pozycja jest zapisana tylko w tej przeglądarce."
    : `${state.live ? "Edycja wpisu" : "Pełny wpis (plan, instrukcja, linki)"} w arkuszu: <a href="${esc(sheet.url)}" target="_blank" rel="noopener">${esc(sheet.tab)} ↗</a>`;
  $("detail").innerHTML = `<div class="dialog-body">
    <div class="dialog-head">
      <div><span class="pill ${TONE[it.status] || "off"}">${esc(it.status)}</span><h2 style="margin-top:8px">${esc(it.name)}</h2></div>
      <button class="close" type="button" data-close aria-label="Zamknij">×</button>
    </div>
    <dl class="fields">${rows}</dl>
    <p class="more">${more}</p>
    ${it.local ? `<div class="actions"><button class="btn" type="button" data-remove="${esc(it.id)}">Usuń</button></div>` : ""}
  </div>`;
  $("detail").showModal();
}

function openForm() {
  const cfg = TABS[state.tab];
  const fields = cfg.form.map((f) => {
    const req = f.required ? " required" : "";
    let control;
    if (f.options) {
      control = `<select name="${f.key}">${f.options.map((o) => `<option${o === cfg.defaults[f.key] ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
    } else if (f.type === "textarea") {
      control = `<textarea name="${f.key}"${req}></textarea>`;
    } else {
      control = `<input name="${f.key}" placeholder="${esc(f.placeholder || "")}"${req}>`;
    }
    return `<label>${esc(f.label)}${control}</label>`;
  }).join("");
  $("form").innerHTML = `<form class="dialog-body" id="addForm">
    <div class="dialog-head"><h2>Nowa pozycja: ${esc(cfg.label)}</h2>
      <button class="close" type="button" data-close aria-label="Zamknij">×</button></div>
    ${fields}
    <p class="hint">${state.live ? "Zapis doda nowy wiersz w arkuszu." : "Bez połączenia pozycja zostanie tylko w tej przeglądarce."}</p>
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

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
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
      if (state.live) {
        await api({ action: "add", tab: state.tab, item: data });
        state.status = "";
        await refresh();
      } else {
        state.local[state.tab].unshift({ ...data, id: "l" + Date.now(), date: today(), local: true });
        writeStore(LOCAL_KEY, state.local);
        state.status = "";
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
      const res = await api({ action: "list" }, conn); // zapisujemy dopiero, gdy połączenie działa
      state.conn = conn; state.live = { me: res.me, claude: res.claude }; state.error = "";
      writeStore(CONN_KEY, conn);
      render();
    });
  }
});

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-tab], [data-id], [data-close], [data-remove], [data-refresh], [data-conn], [data-disconnect], #addBtn, #connBtn");
  if (!t) return;
  const d = t.dataset;
  if (d.tab) { state.tab = d.tab; state.status = ""; render(); }
  else if (d.id) openDetail(d.id);
  else if (d.remove) {
    state.local[state.tab] = state.local[state.tab].filter((x) => x.id !== d.remove);
    writeStore(LOCAL_KEY, state.local);
    t.closest("dialog").close();
    render();
  }
  else if ("refresh" in d) refresh();
  else if ("disconnect" in d) {
    state.conn = null; state.live = null; state.error = "";
    try { localStorage.removeItem(CONN_KEY); } catch { /* brak dostępu do pamięci przeglądarki */ }
    t.closest("dialog").close();
    render();
  }
  else if ("close" in d) t.closest("dialog").close();
  else if (t.id === "addBtn") openForm();
  else if (t.id === "connBtn" || "conn" in d) openConn();
});

// Kliknięcie w tło zamyka okno.
document.querySelectorAll("dialog").forEach((dlg) => dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }));

$("search").addEventListener("input", (e) => { state.query = e.target.value; render(); });
$("statusFilter").addEventListener("change", (e) => { state.status = e.target.value; render(); });

render();
refresh();
