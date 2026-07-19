document.addEventListener("DOMContentLoaded", function () {
  const CONSENT_KEY = "rb_cookie_consent";

  // Prevent double-loading analytics
  function markAnalyticsLoaded() {
    window.__rbAnalyticsLoaded = true;
  }
  function analyticsAlreadyLoaded() {
    return !!window.__rbAnalyticsLoaded;
  }

  // GA4 load via Measurement ID (window.GA_MEASUREMENT_ID, set in the layout)
  function loadAnalytics() {
    if (analyticsAlreadyLoaded()) return;

    const measurementId = window.GA_MEASUREMENT_ID;
    if (!measurementId) return;

    // Load gtag.js
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    document.head.appendChild(s);

    // Init gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", measurementId);

    markAnalyticsLoaded();
  }

  function createBanner() {
    // Don't stack banners
    const existing = document.getElementById("cookie-banner");
    if (existing) existing.remove();

    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.innerHTML = `
      <p>This site uses cookies for analytics. Allow Google Analytics?</p>
      <button id="cookie-accept" type="button" class="button">Accept</button>
      <button id="cookie-decline" type="button" class="button">Decline</button>
    `;
    document.body.appendChild(banner);

    document.getElementById("cookie-accept").onclick = () => {
      localStorage.setItem(CONSENT_KEY, "accepted");
      banner.remove();
      loadAnalytics();
    };

    document.getElementById("cookie-decline").onclick = () => {
      localStorage.setItem(CONSENT_KEY, "declined");
      banner.remove();
    };
  }

  // "Cookie settings" button in the footer re-opens the banner
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest("[data-cookie-settings]")) {
      localStorage.removeItem(CONSENT_KEY);
      createBanner();
    }
  });

  const consent = localStorage.getItem(CONSENT_KEY);

  if (consent === "accepted") {
    loadAnalytics();
  } else if (consent === "declined") {
    // Do nothing
  } else {
    createBanner();
  }
});
