document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".spoiler-toggle").forEach(button => {

    button.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        button.click();
      }
    });

    button.addEventListener("click", () => {
      const block = button.closest(".spoiler-block");
      const content = block.querySelector(".spoiler-content");

      const isOpen = block.classList.toggle("spoiler-open");

      button.setAttribute("aria-expanded", isOpen);

      if (isOpen) {
        content.hidden = false;
        const height = content.scrollHeight;
        content.style.maxHeight = height + "px";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        requestAnimationFrame(() => {
          content.style.maxHeight = "0px";
        });

        setTimeout(() => {
          content.hidden = true;
          button.focus(); 
        }, 300);
      }
    });
  });
});
