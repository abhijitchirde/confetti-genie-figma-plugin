// Icon options for Confetti Genie. Each is an SVG on a 100×100 grid.
// renderIcon(option, sizePx, { rounded }) returns an element.
//
// Confetti colors come from the plugin's random palette (src/plugin/generate.ts).

(function () {
  // Small helpers so the confetti pieces read like the plugin's shapes
  const rect = (x, y, w, h, rot, fill) =>
    `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${Math.min(w, h) * 0.18}" fill="${fill}" transform="translate(${x} ${y}) rotate(${rot})" />`;
  const dot = (x, y, r, fill) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" />`;
  const tri = (x, y, s, rot, fill) => {
    const h = s * 0.866;
    return `<path d="M0 ${-h * 0.62} L${s / 2} ${h * 0.38} L${-s / 2} ${h * 0.38} Z" fill="${fill}" stroke="${fill}" stroke-width="${s * 0.12}" stroke-linejoin="round" transform="translate(${x} ${y}) rotate(${rot})" />`;
  };
  const star = (x, y, r, rot, fill, points = 5, inner = 0.45) => {
    const pts = [];
    for (let i = 0; i < points * 2; i++) {
      const rad = i % 2 ? r * inner : r;
      const a = (Math.PI / points) * i - Math.PI / 2;
      pts.push(
        `${(Math.cos(a) * rad).toFixed(2)},${(Math.sin(a) * rad).toFixed(2)}`,
      );
    }
    return `<polygon points="${pts.join(" ")}" fill="${fill}" stroke="${fill}" stroke-width="${r * 0.14}" stroke-linejoin="round" transform="translate(${x} ${y}) rotate(${rot})" />`;
  };
  // Four-point sparkle
  const sparkle = (x, y, r, fill) =>
    `<path d="M0 ${-r} C${r * 0.12} ${-r * 0.12} ${r * 0.12} ${-r * 0.12} ${r} 0 C${r * 0.12} ${r * 0.12} ${r * 0.12} ${r * 0.12} 0 ${r} C${-r * 0.12} ${r * 0.12} ${-r * 0.12} ${r * 0.12} ${-r} 0 C${-r * 0.12} ${-r * 0.12} ${-r * 0.12} ${-r * 0.12} 0 ${-r} Z" fill="${fill}" transform="translate(${x} ${y})" />`;

  const C = {
    pink: "#ff4f8b",
    coral: "#ff5f6d",
    gold: "#ffc145",
    yellow: "#ffe14d",
    orange: "#ff9a1f",
    lime: "#a3e635",
    mint: "#4ade80",
    sky: "#38bdf8",
    blue: "#0d99ff",
    cyan: "#7de8f5",
    violet: "#8b5cf6",
    lilac: "#d8b4fe",
    magenta: "#f43fd6",
  };

  window.ICON_OPTIONS = [
    {
      id: 1,
      slug: "burst",
      name: "Burst",
      note: "A shower of confetti on deep violet. Bold and celebratory; still a bright splash at 16 px.",
      svg: `
        <defs>
          <linearGradient id="ic1-bg" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stop-color="#2b1a6e" /><stop offset="1" stop-color="#6d3df0" />
          </linearGradient>
          <radialGradient id="ic1-glow" cx="0.16" cy="0.84" r="0.75">
            <stop offset="0" stop-color="#ffffff" stop-opacity="0.32" /><stop offset="1" stop-color="#ffffff" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#ic1-bg)" />
        <rect width="100" height="100" fill="url(#ic1-glow)" />
        ${rect(30, 66, 13, 6, -35, C.gold)}
        ${dot(42, 74, 3.6, C.cyan)}
        ${tri(26, 52, 9, 15, C.pink)}
        ${rect(48, 56, 15, 6.5, -55, C.mint)}
        ${star(40, 40, 7.5, 12, C.yellow)}
        ${dot(60, 70, 4.2, C.coral)}
        ${rect(62, 42, 16, 7, 28, C.sky)}
        ${tri(52, 26, 10, -20, C.lime)}
        ${dot(24, 32, 3.2, C.lilac)}
        ${rect(78, 58, 13, 6, -15, C.magenta)}
        ${star(76, 26, 6.5, -8, C.orange)}
        ${dot(84, 42, 3, C.yellow)}
        ${rect(36, 18, 10, 5, 60, C.coral)}
        ${dot(70, 14, 2.6, C.mint)}
        ${sparkle(88, 80, 5, "#ffffff")}
      `,
    },
    {
      id: 2,
      slug: "genie-lamp",
      name: "Genie lamp",
      note: "A golden lamp puffing confetti from its spout: the genie in the name, granting a confetti wish.",
      svg: `
        <defs>
          <linearGradient id="ic2-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#2a1b5c" /><stop offset="1" stop-color="#140d33" />
          </linearGradient>
          <radialGradient id="ic2-glow" cx="0.72" cy="0.3" r="0.6">
            <stop offset="0" stop-color="#8b5cf6" stop-opacity="0.55" /><stop offset="1" stop-color="#8b5cf6" stop-opacity="0" />
          </radialGradient>
          <linearGradient id="ic2-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#ffd76a" /><stop offset="1" stop-color="#f59e0b" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#ic2-bg)" />
        <rect width="100" height="100" fill="url(#ic2-glow)" />
        <!-- confetti puff rising from the spout -->
        ${dot(79, 40, 3.2, C.cyan)}
        ${rect(70, 33, 11, 5, -30, C.pink)}
        ${star(85, 27, 6, 10, C.yellow)}
        ${tri(62, 22, 8.5, 18, C.mint)}
        ${rect(77, 15, 10, 4.6, 40, C.sky)}
        ${dot(52, 30, 2.8, C.lilac)}
        ${dot(91, 14, 2.6, C.coral)}
        ${rect(52, 12, 8, 4, -55, C.orange)}
        ${sparkle(30, 26, 5.5, "#ffffff")}
        <!-- lamp -->
        <g fill="url(#ic2-gold)">
          <path d="M80 62 C86 56 88 49 87 45 C90 46 91 50 89 55 C86 63 79 70 69 72 Z" />
          <path d="M16 62 H74 C74 74 62 82 45 82 C28 82 16 74 16 62 Z" />
          <path d="M28 62 C28 53 62 53 62 62 Z" />
          <circle cx="45" cy="52" r="3.6" />
          <rect x="35" y="81" width="20" height="5" rx="2" />
          <rect x="29" y="85" width="32" height="5" rx="2.5" />
        </g>
        <path d="M17 65 C6 64 7 77 19 75" fill="none" stroke="url(#ic2-gold)" stroke-width="4.5" stroke-linecap="round" />
        <path d="M24 66 C30 71 42 73 54 71" fill="none" stroke="#fff4c7" stroke-opacity="0.65" stroke-width="2.4" stroke-linecap="round" />
      `,
    },
    {
      id: 3,
      slug: "selected-frame",
      name: "Selected frame",
      note: "A selected Figma frame filling up with confetti. Says exactly what the plugin does, but fades at 16 px.",
      svg: `
        <rect width="100" height="100" fill="#fbfaf7" />
        <!-- frame content: confetti inside, a few pieces spilling over the edge -->
        <rect x="18" y="18" width="64" height="64" rx="3" fill="#ffffff" />
        ${rect(31, 32, 12, 5.5, 25, C.coral)}
        ${dot(52, 28, 3.6, C.blue)}
        ${star(68, 36, 6.5, 8, C.gold)}
        ${tri(40, 50, 9, -18, C.violet)}
        ${rect(60, 56, 13, 5.5, -40, C.mint)}
        ${dot(28, 66, 3.2, C.magenta)}
        ${rect(46, 70, 11, 5, 65, C.sky)}
        ${dot(72, 72, 3, C.orange)}
        ${tri(80, 18, 7, 25, C.pink)}
        <!-- selection border and handles -->
        <rect x="18" y="18" width="64" height="64" rx="3" fill="none" stroke="#0d99ff" stroke-width="2.6" />
        <g fill="#ffffff" stroke="#0d99ff" stroke-width="2">
          <rect x="14" y="14" width="8" height="8" rx="1.5" />
          <rect x="78" y="14" width="8" height="8" rx="1.5" />
          <rect x="14" y="78" width="8" height="8" rx="1.5" />
          <rect x="78" y="78" width="8" height="8" rx="1.5" />
        </g>
      `,
    },
    {
      id: 4,
      slug: "shape-set",
      name: "Shape set",
      note: "The plugin's four confetti shapes (rectangle, ellipse, polygon, star) tossed on a dark tile. Clearest at small sizes.",
      svg: `
        <defs>
          <linearGradient id="ic4-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#231c3d" /><stop offset="1" stop-color="#110d22" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#ic4-bg)" />
        ${rect(31, 32, 30, 15, -24, C.coral)}
        ${dot(70, 31, 13.5, C.sky)}
        ${tri(31, 70, 27, 14, C.gold)}
        ${star(70, 70, 16, -10, C.mint)}
        ${dot(50, 50, 2.6, C.lilac)}
        ${dot(88, 50, 2.2, C.yellow)}
        ${dot(12, 50, 2.2, C.pink)}
      `,
    },
  ];

  window.renderIcon = function (option, size, opts) {
    const def =
      window.ICON_OPTIONS.find((o) => o.id === Number(option)) ||
      window.ICON_OPTIONS[0];
    const wrap = document.createElement("div");
    wrap.className = "icon-wrap" + (opts && opts.rounded ? " rounded" : "");
    wrap.style.width = size + "px";
    wrap.style.height = size + "px";
    // Unique gradient ids per instance, since one page shows the same icon many times
    const uid = "u" + Math.random().toString(36).slice(2, 8);
    const svg = def.svg.replace(/(id="|url\(#)(ic\d-[a-z]+)/g, `$1$2-${uid}`);
    wrap.innerHTML = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${svg}</svg>`;
    return wrap;
  };
})();
