(() => {
  const siteRoot = new URL("../", document.currentScript.src);
  const storageKey = "mamangava.cookie-preferences";
  const version = 1;
  const measurementId = "G-KRF0HGMZNZ";
  const duration = 180 * 24 * 60 * 60 * 1000;
  let tagLoaded = false;
  let appliedAnalytics = null;
  let expiryTimer;
  let returnFocus;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });
  window.gtag("set", "ads_data_redaction", true);
  window.gtag("set", "allow_google_signals", false);
  window.gtag("set", "allow_ad_personalization_signals", false);

  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved?.version === version && typeof saved.analytics === "boolean"
        && Number.isFinite(saved.expires) && Number.isFinite(saved.savedAt)
        && saved.savedAt <= Date.now() && saved.expires > Date.now()
        && saved.expires - saved.savedAt === duration) return saved;
    } catch {
      // Navigation and privacy choices also work when storage is unavailable.
    }
    return null;
  }

  let choice = readChoice();

  function allowsAnalytics() {
    return choice?.analytics === true && choice.expires > Date.now();
  }

  function clearAnalyticsCookies() {
    let cookies;
    try {
      cookies = document.cookie;
    } catch {
      return;
    }
    const domains = ["", location.hostname, "." + location.hostname];
    if (location.hostname.endsWith(".mamangava.com.br")) {
      domains.push("mamangava.com.br", ".mamangava.com.br");
    }
    const paths = new Set(["/"]);
    const parts = location.pathname.split("/");
    for (let end = 1; end < parts.length; end++) {
      paths.add(parts.slice(0, end).join("/") + "/");
    }
    for (const cookie of cookies.split(";")) {
      const name = cookie.trim().split("=")[0];
      if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$)|_gac_|_gcl_|AMP_TOKEN$)/.test(name)) continue;
      for (const path of paths) {
        for (const domain of domains) {
          document.cookie = name + "=; Max-Age=0; Path=" + path
            + (domain ? "; Domain=" + domain : "") + "; SameSite=Lax";
        }
      }
    }
  }

  function loadTagManager() {
    if (tagLoaded || !allowsAnalytics()) return;
    tagLoaded = true;
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=GTM-MXQGZHDH";
    document.head.append(script);
  }

  const banner = document.createElement("section");
  banner.className = "cookie-banner";
  banner.setAttribute("aria-labelledby", "cookie-title");
  banner.innerHTML = `
    <div class="cookie-heading">
      <img src="${new URL("assets/simbolo-cobre.svg", siteRoot)}" alt="" width="35" height="35">
      <h2 id="cookie-title">Você escolhe os cookies.</h2>
    </div>
    <p>Podemos usar cookies de medição para entender quais páginas ajudam quem procura um site. Você decide se quer permitir.</p>
    <div class="cookie-actions">
      <button type="button" data-cookie-reject>Recusar opcionais</button>
      <button type="button" data-cookie-accept>Aceitar medição</button>
    </div>
    <div class="cookie-links">
      <button type="button" data-cookie-manage>Escolher preferências</button>
      <a href="${new URL("privacidade/", siteRoot)}">Privacidade e cookies</a>
    </div>`;
  banner.hidden = Boolean(choice);

  const dialog = document.createElement("dialog");
  dialog.className = "cookie-dialog";
  dialog.setAttribute("aria-labelledby", "cookie-dialog-title");
  dialog.innerHTML = `
    <div class="cookie-dialog-heading">
      <h2 id="cookie-dialog-title">O que você permite.</h2>
      <button class="cookie-close" type="button" aria-label="Fechar preferências" autofocus>×</button>
    </div>
    <p>Escolha se quer permitir a medição de acesso. Você pode voltar aqui pelo rodapé a qualquer momento.</p>
    <div class="cookie-category">
      <div><h3>Preferência de privacidade</h3><p>Guarda sua escolha neste navegador por até 180 dias.</p></div>
      <span class="cookie-required">Sempre ativa</span>
    </div>
    <label class="cookie-category cookie-option" for="cookie-analytics">
      <span><strong>Medição de acesso</strong><span class="cookie-category-description">Permite o Google Analytics para medir visitas e ações como simular um orçamento ou clicar no WhatsApp.</span></span>
      <input type="checkbox" id="cookie-analytics">
    </label>
    <a class="cookie-policy" href="${new URL("privacidade/", siteRoot)}">Ler sobre privacidade e cookies ↗</a>
    <div class="cookie-actions">
      <button type="button" data-cookie-reject>Recusar opcionais</button>
      <button type="button" data-cookie-save>Salvar escolhas</button>
    </div>`;
  const analyticsOption = dialog.querySelector("#cookie-analytics");
  analyticsOption.checked = allowsAnalytics();
  const notice = document.createElement("p");
  notice.className = "cookie-notice";
  notice.setAttribute("role", "status");
  notice.setAttribute("aria-live", "polite");
  document.body.append(banner, dialog, notice);
  for (const button of document.querySelectorAll("[data-cookie-preferences]")) button.hidden = false;

  function openPreferences() {
    returnFocus = document.activeElement;
    analyticsOption.checked = allowsAnalytics();
    dialog.showModal();
  }

  window.mamangavaConsent = { allowsAnalytics, openPreferences };

  function scheduleExpiry() {
    clearTimeout(expiryTimer);
    if (!choice) return;
    expiryTimer = setTimeout(syncChoice, Math.min(choice.expires - Date.now(), 2147483647));
  }

  function applyChoice(reloadTags = true) {
    const allowed = allowsAnalytics();
    const changed = appliedAnalytics !== allowed;
    appliedAnalytics = allowed;
    window["ga-disable-" + measurementId] = !allowed;
    window.gtag("consent", "update", { analytics_storage: allowed ? "granted" : "denied" });
    if (allowed) loadTagManager();
    else {
      clearAnalyticsCookies();
      if (tagLoaded && reloadTags) {
        location.reload();
        return;
      }
    }
    banner.hidden = Boolean(choice);
    scheduleExpiry();
    if (changed) window.dispatchEvent(new CustomEvent("mamangava:consent", { detail: { analytics: allowed } }));
  }

  function saveChoice(analytics) {
    const savedAt = Date.now();
    choice = { version, analytics, savedAt, expires: savedAt + duration };
    let stored = true;
    try {
      localStorage.setItem(storageKey, JSON.stringify(choice));
    } catch {
      stored = false;
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // Keep the new choice in memory if the browser blocks all storage writes.
      }
    }
    dialog.close();
    applyChoice(stored);
    notice.textContent = stored
      ? "Preferência salva. Você pode alterá-la em Preferências de cookies, no rodapé."
      : "Escolha aplicada nesta página. Seu navegador não permitiu salvá-la para as próximas visitas.";
  }

  function syncChoice() {
    choice = readChoice();
    applyChoice();
    if (!dialog.open) analyticsOption.checked = allowsAnalytics();
  }

  for (const scope of [banner, dialog]) {
    scope.querySelector("[data-cookie-reject]").addEventListener("click", () => saveChoice(false));
  }
  banner.querySelector("[data-cookie-accept]").addEventListener("click", () => saveChoice(true));
  banner.querySelector("[data-cookie-manage]").addEventListener("click", openPreferences);
  dialog.querySelector("[data-cookie-save]").addEventListener("click", () => saveChoice(analyticsOption.checked));
  dialog.querySelector(".cookie-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  });
  document.addEventListener("click", event => {
    if (!event.target.closest("[data-cookie-preferences]")) return;
    openPreferences();
  });
  window.addEventListener("storage", event => {
    if (event.key === storageKey || event.key === null) syncChoice();
  });
  window.addEventListener("pageshow", event => {
    if (event.persisted) syncChoice();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && choice?.expires <= Date.now()) syncChoice();
  });
  applyChoice();
})();
