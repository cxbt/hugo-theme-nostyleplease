(function () {
  const THRESHOLD_PX = 120;

  function init() {
    const links = Array.from(document.querySelectorAll("[data-toc-top]"));
    if (!links.length) return;

    function update() {
      const show = window.scrollY > THRESHOLD_PX;
      for (const el of links) el.hidden = !show;
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    }

    for (const el of links) {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (_) {
          window.scrollTo(0, 0);
        }
      });
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

