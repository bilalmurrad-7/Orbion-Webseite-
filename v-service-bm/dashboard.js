/* V-Service.bm — Dashboard */

const loginWrap = document.getElementById("login-wrap");
const loginForm = document.getElementById("login-form");
const passwordField = document.getElementById("password");
const passwordWrap = passwordField.closest(".field");
const loginBtn = document.getElementById("login-btn");

const dashWrap = document.getElementById("dash-wrap");
const listEl = document.getElementById("list");
const countEl = document.getElementById("count");
const refreshBtn = document.getElementById("refresh");
const filterBtns = document.querySelectorAll(".filter");

let sessionPassword = "";
let entries = [];
let activeFilter = "alle";

/* --------------------------------------------------------------------------
   Login
   -------------------------------------------------------------------------- */

passwordField.addEventListener("input", () => {
  passwordWrap.classList.remove("invalid");
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const pw = passwordField.value;
  loginBtn.classList.add("loading");
  loginBtn.disabled = true;
  passwordWrap.classList.remove("invalid");

  try {
    const list = await fetchList(pw);
    sessionPassword = pw;
    entries = list;

    loginWrap.hidden = true;
    dashWrap.hidden = false;
    render();
  } catch (err) {
    passwordWrap.classList.add("invalid");
    loginBtn.classList.remove("loading");
    loginBtn.disabled = false;
  }
});

async function fetchList(password) {
  const res = await fetch("/.netlify/functions/list", {
    headers: { "x-dashboard-password": password },
  });
  if (!res.ok) throw new Error(res.status === 401 ? "Falsches Passwort" : "Fehler beim Laden");
  return res.json();
}

/* --------------------------------------------------------------------------
   Filter & Refresh
   -------------------------------------------------------------------------- */

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    activeFilter = btn.dataset.filter;
    filterBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
    render();
  });
});

refreshBtn.addEventListener("click", async () => {
  refreshBtn.classList.add("is-busy");
  refreshBtn.disabled = true;
  try {
    entries = await fetchList(sessionPassword);
    render();
  } catch (err) {
    alert("Konnte nicht neu laden.");
  } finally {
    refreshBtn.classList.remove("is-busy");
    refreshBtn.disabled = false;
  }
});

/* --------------------------------------------------------------------------
   Rendern
   -------------------------------------------------------------------------- */

function render() {
  const offen = entries.filter((e) => e.status === "offen").length;
  countEl.textContent = entries.length
    ? `${entries.length} gesamt · ${offen} offen`
    : "";

  const visible =
    activeFilter === "alle"
      ? entries
      : entries.filter((e) => e.status === activeFilter);

  listEl.replaceChildren();

  if (!visible.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = entries.length
      ? "Hier ist gerade nichts."
      : "Noch keine Anfragen.";
    listEl.append(empty);
    return;
  }

  visible.forEach((entry) => listEl.append(buildItem(entry)));
}

/* Wird per DOM-API gebaut statt per innerHTML — Anfragen sind fremder Text
   und haben in einem HTML-String nichts verloren. */
function buildItem(entry) {
  const item = document.createElement("div");
  item.className = "item";
  if (entry.status === "erledigt") item.classList.add("is-erledigt");

  const main = document.createElement("div");
  main.className = "item-main";

  const betreff = document.createElement("p");
  betreff.className = "item-betreff";
  betreff.textContent = entry.betreff;
  main.append(betreff);

  const meta = document.createElement("div");
  meta.className = "item-meta";

  const zeit = document.createElement("span");
  zeit.textContent = formatDate(entry.createdAt);
  meta.append(zeit);

  if (entry.kontakt) {
    meta.append(separator(), buildKontakt(entry.kontakt));
  }

  if (entry.datum) {
    const datum = document.createElement("span");
    datum.className = "item-datum";
    datum.textContent = `Wunsch: ${entry.datum}`;
    meta.append(datum);
  }

  main.append(meta);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `status-btn ${entry.status}`;
  btn.textContent = entry.status === "offen" ? "Offen" : "Erledigt";
  btn.addEventListener("click", () => toggleStatus(entry, btn, item));

  item.append(main, btn);
  return item;
}

function separator() {
  const dot = document.createElement("span");
  dot.className = "dot";
  dot.textContent = "·";
  return dot;
}

/* E-Mail und Telefonnummer direkt anklickbar machen — spart einen Copy-Schritt */
function buildKontakt(value) {
  const trimmed = value.trim();
  const isMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  const isPhone = /^[+0][\d\s/()-]{5,}$/.test(trimmed);

  if (!isMail && !isPhone) {
    const span = document.createElement("span");
    span.textContent = trimmed;
    return span;
  }

  const link = document.createElement("a");
  link.className = "item-kontakt";
  link.textContent = trimmed;
  link.href = isMail ? `mailto:${trimmed}` : `tel:${trimmed.replace(/[\s/()-]/g, "")}`;
  return link;
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* --------------------------------------------------------------------------
   Status umschalten
   -------------------------------------------------------------------------- */

async function toggleStatus(entry, btn, item) {
  btn.disabled = true;
  try {
    const res = await fetch("/.netlify/functions/toggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-dashboard-password": sessionPassword,
      },
      body: JSON.stringify({ id: entry.id }),
    });
    if (!res.ok) throw new Error("Fehler");

    const data = await res.json();
    entry.status = data.status;

    btn.classList.remove("offen", "erledigt");
    btn.classList.add(entry.status);
    btn.textContent = entry.status === "offen" ? "Offen" : "Erledigt";
    item.classList.toggle("is-erledigt", entry.status === "erledigt");

    /* Zähler und ein aktiver Filter müssen mitziehen */
    if (activeFilter === "alle") {
      const offen = entries.filter((e) => e.status === "offen").length;
      countEl.textContent = `${entries.length} gesamt · ${offen} offen`;
    } else {
      render();
    }
  } catch (err) {
    alert("Konnte Status nicht ändern.");
  } finally {
    btn.disabled = false;
  }
}
