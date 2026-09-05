/* Passwort-Prüfung für die geschützten Endpunkte.
   Kein Fallback im Code: ohne gesetztes DASHBOARD_PASSWORD ist das
   Dashboard zu, statt mit einem öffentlich bekannten Standard offen. */

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD;

/* Vergleich in konstanter Zeit, damit die Antwortdauer das Passwort
   nicht Zeichen für Zeichen verrät. */
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/* Gibt null zurück, wenn alles passt — sonst die fertige Fehlerantwort. */
function checkAuth(event) {
  if (!DASHBOARD_PASSWORD) {
    console.error("DASHBOARD_PASSWORD ist nicht gesetzt.");
    return { statusCode: 500, body: "Dashboard ist nicht konfiguriert" };
  }

  const password = event.headers["x-dashboard-password"] || "";
  if (!safeEqual(password, DASHBOARD_PASSWORD)) {
    return { statusCode: 401, body: "Falsches Passwort" };
  }

  return null;
}

module.exports = { checkAuth };
