document.addEventListener("DOMContentLoaded", function () {

  const CONSENT_KEY = "rb_cookie_consent";

  function loadAnalytics() {
    if (!window.GA_SNIPPET) return;

    const temp = document.createElement("div");
    temp.innerHTML = window.GA_SNIPPET;

    Array.from(temp.childNodes).forEach(node => {
      if (node.tagName === "SCRIPT") {
        const script = document.createElement("script");

        if (node.src) {
          script.src = node.src;
          script.async = node.async || false;
        }

        if (node.innerHTML) {
          script.innerHTML = node.innerHTML;
        }

        document.head.appendChild(script);
      }
    });
  }

  function createBanner() {
    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.innerHTML = `
      <div class="cookie-banner__inner">
        <p>This site uses cookies for analytics. Allow Google Analytics?</p>
        <button id="cookie-accept">Accept</button>
        <button id="cookie-decline">Decline</button>
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
  } else {
    createBanner();
  }

});