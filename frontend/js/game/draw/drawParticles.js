import { state } from "../../state.js";

// ===== EXPLOSIONS =====
export function drawExplosions(ctx) {
  if (!state.explosions) return;
  for (let i = state.explosions.length - 1; i >= 0; i--) {
    let exp = state.explosions[i];
    ctx.beginPath();
    ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
    ctx.fillStyle = exp.color;
    ctx.globalAlpha = exp.life / 15;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    exp.life--;
    if (exp.life <= 0) state.explosions.splice(i, 1);
  }
}

// ===== WORLD-SPACE PARTICLES (drawn inside camera transform) =====
export function drawWorldParticles(ctx) {
  if (!state.particles) return;
  state.particles.forEach((p) => {
    if (p.screenSpace) return;
    p.x += p.vx || 0;
    p.y += p.vy || 0;
    p.life--;
    if (p.life <= 0) return;
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size || 2, 0, Math.PI * 2);
    ctx.fillStyle = p.color || "white";
    ctx.globalAlpha = Math.max(0, p.life / 30);
    ctx.fill();
    ctx.restore();
  });
}

// ===== SCREEN-SPACE PARTICLES (drawn after camera restore) =====
export function drawScreenParticles(ctx) {
  if (!state.particles) return;
  state.particles = state.particles.filter((p) => {
    if (!p.screenSpace) return p.life > 0;
    p.x += p.vx || 0;
    p.y += p.vy || 0;
    p.life--;
    if (p.life <= 0) return false;
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size || 2, 0, Math.PI * 2);
    ctx.fillStyle = p.color || "white";
    ctx.globalAlpha = Math.max(0, p.life / 30);
    ctx.fill();
    ctx.restore();
    return true;
  });
}
