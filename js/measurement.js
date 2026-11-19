window.mamangavaTrack = function (event, parameters = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...parameters });
};

document.addEventListener("click", event => {
  const link = event.target.closest("a[href]");
  if (!link) return;

  const url = new URL(link.href);
  const location = link.closest("#calculator") ? "calculator"
    : link.closest("header") ? "header"
    : link.closest("footer") ? "footer"
    : link.closest(".hero") ? "hero" : "content";

  if (url.hostname === "wa.me" && url.pathname === "/5511965970387") {
    const parameters = { contact_location: location };
    if (link.dataset.projectType) parameters.project_type = link.dataset.projectType;
    window.mamangavaTrack("whatsapp_click", parameters);
    return;
  }

  if (url.origin === window.location.origin && url.hash === "#orcamento") {
    window.mamangavaTrack("quote_cta_click", { contact_location: location });
  }
});
