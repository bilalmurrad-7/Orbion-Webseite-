const { getStore } = require("@netlify/blobs");
const { checkAuth } = require("./_auth");

exports.handler = async (event) => {
  const denied = checkAuth(event);
  if (denied) return denied;

  try {
    const store = getStore("anfragen");
    const raw = await store.get("list", { type: "json" });
    const list = Array.isArray(raw) ? raw : [];
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list),
    };
  } catch (err) {
    console.error("Blob-Lesefehler:", err);
    return { statusCode: 500, body: "Fehler beim Laden" };
  }
};
