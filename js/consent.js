document.addEventListener("DOMContentLoaded", function () {
  const CONSENT_KEY = "rb_cookie_consent";

  // Prevent double-loading analytics
  function markAnalyticsLoaded() {
    window.__rbAnalyticsLoaded = true;
  }
  function analyticsAlreadyLoaded() {
    return !!window.__rbAnalyticsLoaded;
  }

  function decodeHtmlEntities(str) {
    // Converts "&lt;script&gt;" back to "<script>"
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }

  // Preferred: GA4 load via Measurement ID (window.GA_MEASUREMENT_ID)
  function loadGA4ById() {
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

  // Fallback: load analytics from GA_SNIPPET (HTML snippet string)
  function loadAnalyticsFromSnippet() {
    if (analyticsAlreadyLoaded()) return;
    if (!window.GA_SNIPPET) return;

    // If snippet was escaped in Liquid (e.g. &lt;script&gt;), decode it first
    const snippet = decodeHtmlEntities(window.GA_SNIPPET);

    const temp = document.createElement("div");
    temp.innerHTML = snippet;

    Array.from(temp.querySelectorAll("script")).forEach((node) => {
      const script = document.createElement("script");

      if (node.src) {
        script.src = node.src;
        script.async = node.async || true;
      }

      if (node.textContent && node.textContent.trim().length > 0) {
        script.textContent = node.textContent;
      }

      document.head.appendChild(script);
    });

    markAnalyticsLoaded();
  }

  function loadAnalytics() {
    // Try the robust GA4 measurement ID method first
    loadGA4ById();

    // If not configured, fallback to snippet-based injection
    if (!analyticsAlreadyLoaded()) {
      loadAnalyticsFromSnippet();
    }
  }

  function createBanner() {
    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.innerHTML = `
      <div class="cookie-banner__inner">
        <p>This site uses cookies for analytics. Allow Google Analytics?</p>
        <button id="cookie-accept" type="button">Accept</button>
        <button id="cookie-decline" type="button">Decline</button>
      </div>
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

  const consent = localStorage.getItem(CONSENT_KEY);

  if (consent === "accepted") {
    loadAnalytics();
  } else if (consent === "declined") {
    // Do nothing
  } else {
    createBanner();
  }
});
