const { getStore } = require("@netlify/blobs");
const { checkAuth } = require("./_auth");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const denied = checkAuth(event);
  if (denied) return denied;

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { id } = data;
  if (!id) {
    return { statusCode: 400, body: "id fehlt" };
  }

  try {
    const store = getStore("anfragen");
    const raw = await store.get("list", { type: "json" });
    const list = Array.isArray(raw) ? raw : [];

    const entry = list.find((e) => e.id === id);
    if (!entry) {
      return { statusCode: 404, body: "Nicht gefunden" };
    }

    entry.status = entry.status === "offen" ? "erledigt" : "offen";
    await store.setJSON("list", list);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, status: entry.status }),
    };
  } catch (err) {
    console.error("Blob-Fehler:", err);
    return { statusCode: 500, body: "Fehler beim Speichern" };
  }
};
