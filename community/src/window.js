// A plugin window: a title bar plus the REAL plugin UI from dist/ui.html in an iframe.
// Run `npm run build` at the repo root first so dist/ui.html is current.
//
// The plugin UI asks its parent (normally Figma) for the saved theme ("load-theme") and
// settings ("load-settings"). This page answers in Figma's place, so the same real UI
// shows in light or dark with the settings we choose.

(function () {
  const UI_URL = "../../dist/ui.html";
  const UI_WIDTH = 270;
  const UI_HEIGHT = 540;
  const configFor = new Map(); // iframe window -> { theme, settings }

  function reply(target, config, type) {
    if (type === "load-theme") {
      target.postMessage(
        { pluginMessage: { type: "theme", theme: config.theme } },
        "*",
      );
    } else if (type === "load-settings") {
      target.postMessage(
        { pluginMessage: { type: "settings", settings: config.settings } },
        "*",
      );
    }
  }

  window.addEventListener("message", (event) => {
    const msg = event.data && event.data.pluginMessage;
    const config = configFor.get(event.source);
    if (msg && config) reply(event.source, config, msg.type);
  });

  /**
   * @param {{ theme?: "light"|"dark", icon?: number, scale?: number, settings?: object }} opts
   */
  window.pluginWindow = function (opts) {
    const config = {
      theme: opts.theme || "light",
      settings: opts.settings || null,
    };
    const scale = opts.scale || 1;

    const win = document.createElement("div");
    win.className = "pw pw-" + config.theme;
    win.style.width = UI_WIDTH * scale + "px";

    const bar = document.createElement("div");
    bar.className = "pw-bar";
    bar.style.height = 40 * scale + "px";
    bar.style.fontSize = 13 * scale + "px";
    bar.style.padding = "0 " + 12 * scale + "px";
    bar.appendChild(
      window.renderIcon(opts.icon || 1, 18 * scale, { rounded: true }),
    );
    const title = document.createElement("span");
    title.textContent = "Confetti Genie";
    bar.appendChild(title);
    const close = document.createElement("span");
    close.className = "pw-close";
    close.textContent = "✕";
    bar.appendChild(close);
    win.appendChild(bar);

    const body = document.createElement("div");
    body.className = "pw-body";
    body.style.width = UI_WIDTH * scale + "px";
    body.style.height = UI_HEIGHT * scale + "px";
    const frame = document.createElement("iframe");
    frame.src = UI_URL;
    frame.width = UI_WIDTH;
    frame.height = UI_HEIGHT;
    frame.style.transform = "scale(" + scale + ")";
    // Register early, in case the UI asks before "load" fires, then answer again on
    // load in case it asked before we knew this window.
    setTimeout(
      () => frame.contentWindow && configFor.set(frame.contentWindow, config),
      0,
    );
    frame.addEventListener("load", () => {
      configFor.set(frame.contentWindow, config);
      reply(frame.contentWindow, config, "load-theme");
      reply(frame.contentWindow, config, "load-settings");
    });
    body.appendChild(frame);
    win.appendChild(body);
    return win;
  };
})();
