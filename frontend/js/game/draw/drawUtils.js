import { state } from "../../state.js";

// ===== SCREEN SHAKE =====
export const SCREEN_SHAKE_TYPES = {
  earth: () => ({
    x: 0,
    y: (Math.random() - 0.5) * state.screenShake.intensity,
  }),
  wind: () => ({
    x: (Math.random() - 0.5) * state.screenShake.intensity * 0.5,
    y: (Math.random() - 0.5) * state.screenShake.intensity * 0.5,
  }),
  thunder: () => {
    return {
      x: (Math.random() - 0.5) * state.screenShake.intensity * 1.5,
      y: (Math.random() - 0.5) * state.screenShake.intensity * 1.5,
    };
  },
};

export function getShakeOffset() {
  if (!state.screenShake || state.screenShake.timer <= 0) return { x: 0, y: 0 };
  const type = state.screenShake.type || "earth";
  return (SCREEN_SHAKE_TYPES[type] || SCREEN_SHAKE_TYPES.earth)();
}

// ===== COLOR UTILS =====
export function hexToRgba(hex, alpha) {
  const v = hex.replace("#", "");
  const n = parseInt(v, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const bl = n & 255;
  return `rgba(${r}, ${g}, ${bl}, ${alpha})`;
}

export function lerpColor(a, b, t) {
  const ah = parseInt(a.replace("#", ""), 16);
  const bh = parseInt(b.replace("#", ""), 16);
  const ar = (ah >> 16) & 255,
    ag = (ah >> 8) & 255,
    ab = ah & 255;
  const br = (bh >> 16) & 255,
    bg = (bh >> 8) & 255,
    bb = bh & 255;
  return `rgb(${(ar + t * (br - ar)) | 0},${(ag + t * (bg - ag)) | 0},${(ab + t * (bb - ab)) | 0})`;
}

// ===== PRE-RENDERED FIRE TEXTURE =====
export const fireCanvas = document.createElement("canvas");
const fireCtx = fireCanvas.getContext("2d");
fireCanvas.width = 100 * 10;
fireCanvas.height = 100;

(function preRenderFire() {
  for (let i = 0; i < 10; i++) {
    const x = i * 100 + 50;
    const y = 50;
    const grad = fireCtx.createRadialGradient(x, y, 0, x, y, 50);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.2, "rgba(255, 255, 0, 0.9)");
    grad.addColorStop(0.6, "rgba(255, 60, 0, 0.7)");
    grad.addColorStop(1, "rgba(200, 0, 0, 0)");
    fireCtx.fillStyle = grad;
    fireCtx.beginPath();
    fireCtx.arc(x, y, 50, 0, Math.PI * 2);
    fireCtx.fill();
  }
})();
