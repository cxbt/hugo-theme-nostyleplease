(function () {
  const KEY = "nostyleplease-appearance";

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function getBodyThemeAttr() {
    return (document.body && document.body.getAttribute("a")) || "auto";
  }

  function getCurrentTheme() {
    const attr = getBodyThemeAttr();
    if (attr === "dark" || attr === "light") return attr;
    return getSystemTheme();
  }

  function setTheme(theme) {
    if (!document.body) return;
    document.body.setAttribute("a", theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch (_) {}
  }

  function init() {
    const button = document.querySelector("[data-theme-toggle]");
    if (!button) return;

    const label = button.querySelector(".theme-toggle__label");
    let transitionTimer = null;

    function updateUi() {
      const current = getCurrentTheme();
      const next = current === "dark" ? "light" : "dark";

      // Show the target theme icon: 🌙 (dark) / ☀️ (light).
      if (label) label.textContent = next === "dark" ? "🌙" : "☀️";
      button.setAttribute("aria-label", `Switch to ${next} mode`);
      button.title = `Switch to ${next} mode`;
    }

    button.addEventListener("click", () => {
      const current = getCurrentTheme();
      const next = current === "dark" ? "light" : "dark";

      // Apply color transitions only during explicit toggles.
      if (document.body) {
        document.body.classList.add("theme-transition");
        if (transitionTimer) window.clearTimeout(transitionTimer);
        transitionTimer = window.setTimeout(() => {
          document.body && document.body.classList.remove("theme-transition");
        }, 400);
      }

      if (label) label.classList.add("theme-toggle__label--fading");
      window.setTimeout(() => {
        setTheme(next);
        updateUi();
        if (label) label.classList.remove("theme-toggle__label--fading");
      }, 120);
    });

    // If the site is in auto mode and the user didn't override it, keep the
    // button label in sync with system preference changes.
    try {
      const saved = localStorage.getItem(KEY);
      const mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
      if (!saved && mq && typeof mq.addEventListener === "function") {
        mq.addEventListener("change", updateUi);
      }
    } catch (_) {}

    updateUi();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
