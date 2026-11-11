// Draws confetti pieces from samples.js (real plugin output) as SVG, the way Figma
// renders them:
// - x/y is the node's top-left before rotation, and it rotates around that point;
//   Figma's positive rotation is counter-clockwise, so SVG gets rotate(-rotation)
// - polygons and stars are regular shapes stretched to fill their w×h box, with
//   the first point at the top; stars use Figma's default inner radius (38.2%)

(function () {
  const STAR_INNER_RADIUS = 0.382;

  function regularPoints(count, inner) {
    const pts = [];
    const steps = inner ? count * 2 : count;
    for (let i = 0; i < steps; i++) {
      const r = inner && i % 2 ? inner : 1;
      const a = -Math.PI / 2 + (2 * Math.PI * i) / steps;
      pts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
    return pts;
  }

  // Stretch points to fill a w×h box, as Figma does
  function fitToBox(pts, w, h) {
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const [minX, maxX, minY, maxY] = [
      Math.min(...xs),
      Math.max(...xs),
      Math.min(...ys),
      Math.max(...ys),
    ];
    return pts
      .map(
        ([x, y]) =>
          `${(((x - minX) / (maxX - minX)) * w).toFixed(2)},${(((y - minY) / (maxY - minY)) * h).toFixed(2)}`,
      )
      .join(" ");
  }

  function pieceSvg(p) {
    const fill = `fill="${p.color}" fill-opacity="${p.opacity}"`;
    let shape;
    if (p.type === "ELLIPSE") {
      shape = `<ellipse cx="${p.w / 2}" cy="${p.h / 2}" rx="${p.w / 2}" ry="${p.h / 2}" ${fill} />`;
    } else if (p.type === "POLYGON") {
      shape = `<polygon points="${fitToBox(regularPoints(p.points || 3), p.w, p.h)}" ${fill} />`;
    } else if (p.type === "STAR") {
      shape = `<polygon points="${fitToBox(regularPoints(p.points || 5, STAR_INNER_RADIUS), p.w, p.h)}" ${fill} />`;
    } else {
      shape = `<rect width="${p.w}" height="${p.h}" ${fill} />`;
    }
    return `<g transform="translate(${p.x} ${p.y}) rotate(${-p.rotation})">${shape}</g>`;
  }

  /** An <svg> of the given pieces over a width × height area (pieces may overflow). */
  window.confettiSvg = function (pieces, width, height) {
    return (
      `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" overflow="visible" xmlns="http://www.w3.org/2000/svg">` +
      pieces.map(pieceSvg).join("") +
      "</svg>"
    );
  };
})();
