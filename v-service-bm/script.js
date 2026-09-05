/* V-Service.bm — Landingpage */

/* --------------------------------------------------------------------------
   Navigation: Hintergrund erst einblenden, wenn wirklich gescrollt wurde
   -------------------------------------------------------------------------- */

const nav = document.getElementById("nav");

function syncNav() {
  nav.classList.toggle("is-stuck", window.scrollY > 8);
}

syncNav();
window.addEventListener("scroll", syncNav, { passive: true });

/* --------------------------------------------------------------------------
   Scroll-Reveal
   Einmalig pro Element — wiederholtes Ein-/Ausblenden beim Hoch-Scrollen
   wäre Bewegung ohne Aussage.
   -------------------------------------------------------------------------- */

const revealTargets = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -40px 0px", threshold: 0.1 }
  );

  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("is-in"));
}

/* --------------------------------------------------------------------------
   Jahreszahl im Footer
   -------------------------------------------------------------------------- */

document.getElementById("year").textContent = new Date().getFullYear();

/* --------------------------------------------------------------------------
   Anfrage-Formular
   -------------------------------------------------------------------------- */

const form = document.getElementById("form");
const betreffField = document.getElementById("betreff");
const kontaktField = document.getElementById("kontakt");
const datumField = document.getElementById("datum");
const btn = document.getElementById("submit-btn");
const success = document.getElementById("success");
const formError = document.getElementById("form-error");

/* Fehler verschwindet, sobald der Nutzer nachbessert — nicht erst beim Absenden */
[betreffField, kontaktField].forEach((field) => {
  field.addEventListener("input", () => {
    if (field.value.trim()) {
      field.closest(".field").classList.remove("invalid");
    }
  });
});

function markInvalid(field) {
  field.closest(".field").classList.add("invalid");
  field.focus();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const betreff = betreffField.value.trim();
  const kontakt = kontaktField.value.trim();

  if (!betreff) return markInvalid(betreffField);
  if (!kontakt) return markInvalid(kontaktField);

  const datum = datumField.value;

  formError.classList.remove("is-visible");
  btn.classList.add("loading");
  btn.disabled = true;

  try {
    const res = await fetch("/.netlify/functions/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ betreff, kontakt, datum }),
    });

    if (!res.ok) throw new Error("Fehler beim Senden");

    form.style.display = "none";
    success.style.display = "block";
    requestAnimationFrame(() => {
      success.classList.add("is-visible");
    });
  } catch (err) {
    btn.classList.remove("loading");
    btn.disabled = false;
    formError.classList.add("is-visible");
  }
});
