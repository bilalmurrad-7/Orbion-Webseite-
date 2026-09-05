# V-Service.bm

Webseite mit Anfrage-Formular und passwortgeschütztem Dashboard.
Statisches HTML/CSS/JS, Backend über Netlify Functions.

## Aufbau

| Datei | Zweck |
|---|---|
| `index.html` / `style.css` / `script.js` | Landingpage mit Anfrage-Formular |
| `dashboard.html` / `dashboard.css` / `dashboard.js` | Anfragen ansehen, Status umschalten |
| `netlify/functions/submit.js` | Anfrage speichern + Discord benachrichtigen |
| `netlify/functions/list.js` | Anfragen laden (Passwort nötig) |
| `netlify/functions/toggle.js` | Offen ↔ Erledigt (Passwort nötig) |
| `netlify/functions/_auth.js` | Passwort-Prüfung für die geschützten Endpunkte |

Gespeichert wird in **Netlify Blobs** unter dem Store `anfragen`, Key `list`.

## Einrichten

1. `npm install`
2. In Netlify unter **Site settings → Environment variables** setzen:

   | Variable | Pflicht | Bedeutung |
   |---|---|---|
   | `DASHBOARD_PASSWORD` | ja | Passwort für das Dashboard |
   | `DISCORD_WEBHOOK_URL` | nein | Webhook für die Benachrichtigung bei neuen Anfragen |

   Ohne `DASHBOARD_PASSWORD` antwortet das Dashboard mit 500 — das ist Absicht.
   Ein fest eingebautes Standardpasswort wäre öffentlich bekannt.

3. Lokal testen: `.env.example` nach `.env` kopieren, ausfüllen, `npm run dev`
   (braucht die [Netlify CLI](https://docs.netlify.com/cli/get-started/)).

## Gut zu wissen

- **Das Passwort schützt vor Neugierigen, nicht vor Angreifern.** Es geht bei
  jedem Aufruf im Klartext als Header mit und liegt unverschlüsselt in der
  Env-Variable. Für ein privates Anfragen-Board reicht das; sobald dort
  sensible Daten landen, gehört echte Authentifizierung (z. B. Netlify
  Identity) hin.
- **Alle Anfragen liegen in einem einzigen Blob.** Kommen zwei Anfragen in
  derselben Sekunde rein, kann die spätere die frühere überschreiben. Bei
  normalem Aufkommen kein Thema — bei viel Verkehr sollte jede Anfrage einen
  eigenen Blob-Key bekommen.
