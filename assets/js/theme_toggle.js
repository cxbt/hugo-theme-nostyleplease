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

    function updateUi() {
      const current = getCurrentTheme();
      const next = current === "dark" ? "light" : "dark";

      // Show the target theme as a single-letter label: L or D.
      if (label) label.textContent = next === "dark" ? "D" : "L";
      button.setAttribute("aria-label", `Switch to ${next} mode`);
      button.title = `Switch to ${next} mode`;
    }

    button.addEventListener("click", () => {
      const current = getCurrentTheme();
      const next = current === "dark" ? "light" : "dark";
      setTheme(next);
      updateUi();
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

