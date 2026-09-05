const { getStore } = require("@netlify/blobs");

/* Der Webhook ist ein Geheimnis und gehört nicht in den Code.
   In Netlify unter Site settings → Environment variables setzen. */
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

const MAX_BETREFF = 2000;
const MAX_KONTAKT = 200;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const betreff = String(data.betreff || "").trim().slice(0, MAX_BETREFF);
  const kontakt = String(data.kontakt || "").trim().slice(0, MAX_KONTAKT);
  const datum = String(data.datum || "").trim();

  if (!betreff) {
    return { statusCode: 400, body: "Betreff fehlt" };
  }
  if (!kontakt) {
    return { statusCode: 400, body: "Kontakt fehlt" };
  }

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    betreff,
    kontakt,
    datum: /^\d{4}-\d{2}-\d{2}$/.test(datum) ? datum : null,
    status: "offen",
    createdAt: new Date().toISOString(),
  };

  /* Speichern hat Vorrang: schlägt es fehl, ist die Anfrage weg — also 500.
     Die Discord-Nachricht darunter ist Komfort und darf scheitern. */
  try {
    const store = getStore("anfragen");
    const raw = await store.get("list", { type: "json" });
    const list = Array.isArray(raw) ? raw : [];
    list.unshift(entry);
    await store.setJSON("list", list);
  } catch (err) {
    console.error("Blob-Speicherfehler:", err);
    return { statusCode: 500, body: "Konnte nicht gespeichert werden" };
  }

  if (DISCORD_WEBHOOK_URL) {
    try {
      const fields = [
        { name: "Betreff", value: betreff.slice(0, 1024), inline: false },
        { name: "Kontakt", value: kontakt, inline: true },
      ];
      if (entry.datum) {
        fields.push({ name: "Wunschtermin", value: entry.datum, inline: true });
      }

      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: "Neue Anfrage",
              color: 0x7c6cff,
              fields,
              timestamp: entry.createdAt,
            },
          ],
        }),
      });
    } catch (err) {
      console.error("Discord-Fehler:", err);
    }
  } else {
    console.warn("DISCORD_WEBHOOK_URL ist nicht gesetzt — keine Benachrichtigung verschickt.");
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true }),
  };
};
