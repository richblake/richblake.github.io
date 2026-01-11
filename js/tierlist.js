(function() {

  /* ===========================================================
     NEW: Capture original Markdown order as soon as JS runs
     =========================================================== */
  var backlog      = document.getElementById("tier-backlog-items");
  var nextBtn      = document.getElementById("tier-next-button");
  var prevBtn      = document.getElementById("tier-prev-button");
  var controls     = document.getElementById("controls-panel");
  var recordBtn    = document.getElementById("record-mode-toggle");

  var moves        = [];

  // NEW: store original order
  var orderedCards = [];
  var currentIndex = 0;

  if (backlog) {
    orderedCards = Array.from(backlog.querySelectorAll(".tier-card"));
  }

  function announceStatus(message) {
    var region = document.getElementById("tier-status");
    if (region) region.textContent = message;
  }

  function updateButtons() {
    if (!nextBtn || !prevBtn) return;

    // Next is disabled when we've exhausted the original ordered list
    nextBtn.disabled = currentIndex >= orderedCards.length;

    // Undo disabled when no moves exist
    prevBtn.disabled = moves.length === 0;
  }

  /* ===========================================================
     UPDATED: Place next item using original MD order
     =========================================================== */
  function placeNext() {
    if (!backlog) return;

    // Select card based on the original Markdown order
    var card = orderedCards[currentIndex];
    if (!card) return;

    currentIndex++;

    var itemName = card.querySelector(".tier-card__title")?.textContent || "Item";
    var tierId = card.getAttribute("data-tier");
    var target = document.querySelector('[data-tier-target="' + tierId + '"]');

    card.classList.add("tier-card--fade-out");

    setTimeout(function() {

      // Remove from backlog if still present
      if (card.parentNode === backlog) {
        backlog.removeChild(card);
      }

      card.classList.remove("tier-card--fade-out");
      card.classList.add("tier-card--enter");

      target.appendChild(card);

      requestAnimationFrame(function() {
        card.classList.add("tier-card--enter-active");
      });

      card.addEventListener("transitionend", function handler() {
        card.classList.remove("tier-card--enter", "tier-card--enter-active");
        card.removeEventListener("transitionend", handler);
      });

      moves.push({ card: card, tier: tierId });
      updateButtons();

      announceStatus(itemName + " moved to tier " + tierId + ".");

    }, 260);
  }

  /* ===========================================================
     UNDO remains unchanged
     =========================================================== */
  function undo() {
    if (!moves.length) return;

    var last = moves.pop();
    var card = last.card;
    var tierId = last.tier;
    var itemName = card.querySelector(".tier-card__title")?.textContent || "Item";
    var target = document.querySelector('#tier-' + tierId + ' .tier-items');

    card.classList.add("tier-card--fade-out");

    setTimeout(function() {

      if (card.parentNode === target) {
        target.removeChild(card);
      }

      card.classList.remove("tier-card--fade-out");
      card.classList.add("tier-card--fade-in");

      // Insert back at top of backlog visually,
      // but do NOT change original order list.
      backlog.insertBefore(card, backlog.firstChild);

      requestAnimationFrame(function() {
        card.classList.add("tier-card--fade-in-active");
      });

      card.addEventListener("transitionend", function handler() {
        card.classList.remove("tier-card--fade-in", "tier-card--fade-in-active");
        card.removeEventListener("transitionend", handler);
      });

      updateButtons();

      announceStatus("Undo: " + itemName + " returned to backlog.");

    }, 260);
  }

  /* Buttons */
  if (nextBtn) nextBtn.onclick = placeNext;
  if (prevBtn) prevBtn.onclick = undo;

  /* Keyboard shortcuts */
  document.addEventListener("keydown", function(e) {
    if (["input","textarea","select"].includes(e.target.tagName?.toLowerCase())) return;

    if (e.code === "Space" || e.key === " ") {
      e.preventDefault();
      placeNext();
    }
    if (e.key === "ArrowRight") placeNext();
    if (e.key === "ArrowLeft") undo();
  });

  /* Record Mode */
  if (recordBtn) {
    recordBtn.onclick = function() {
      document.body.classList.add("recording-hide-chrome");
      controls.style.display = "none";
      recordBtn.style.display = "none";

      announceStatus("Record mode activated. Page chrome hidden.");
    };
  }

  updateButtons();
})();
