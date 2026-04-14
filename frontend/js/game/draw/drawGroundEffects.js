import { state } from "../../state.js";

// ===== GROUND WARNINGS =====
export function drawGroundWarnings(ctx) {
  if (!state.groundWarnings) return;

  state.groundWarnings.forEach((w) => {
    const progress = Math.max(0, 1 - w.timer / (w.maxTimer || 60));

    if (isNaN(w.x) || isNaN(w.y)) return;

    ctx.save();

    if (w.type === "meteor") {
      ctx.fillStyle = `rgba(15, 0, 0, ${progress * 0.6})`;
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.radius * progress, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(255, 50, 0, ${0.5 + progress * 0.5})`;
      ctx.lineWidth = 3;
      ctx.setLineDash([15, 15]);
      ctx.lineDashOffset = -state.frameCount * 5;
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = `rgba(255, 0, 0, ${0.8})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w.x - 15, w.y);
      ctx.lineTo(w.x + 15, w.y);
      ctx.moveTo(w.x, w.y - 15);
      ctx.lineTo(w.x, w.y + 15);
      ctx.stroke();
    } else if (w.type === "geyser") {
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 60, 0, ${0.1 + progress * 0.3})`;
      ctx.fill();

      ctx.strokeStyle = `rgba(255, 100, 0, 0.8)`;
      ctx.lineWidth = 4 + Math.sin(state.frameCount * 0.5) * 3;
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.radius * (0.4 + progress * 0.6), 0, Math.PI * 2);
      ctx.stroke();

      if (progress > 0.5 && state.frameCount % 3 === 0) {
        state.particles.push({
          x: w.x + (Math.random() - 0.5) * w.radius,
          y: w.y + (Math.random() - 0.5) * w.radius,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -1 - Math.random(),
          life: 20,
          color: "#ffaa00",
          size: 2 + Math.random() * 3,
        });
      }
    } else if (w.type === "spike") {
      const alpha = 0.2 + progress * 0.6;
      ctx.beginPath();
      ctx.arc(
        w.x + (Math.random() - 0.5) * 3,
        w.y + (Math.random() - 0.5) * 3,
        w.radius,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = `rgba(100, 50, 20, ${alpha * 0.3})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(139, 69, 19, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.strokeStyle = `rgba(50, 20, 0, ${alpha})`;
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        let a = (i * Math.PI * 2) / 3 + progress;
        ctx.beginPath();
        ctx.moveTo(w.x, w.y);
        ctx.lineTo(
          w.x + Math.cos(a) * w.radius * 0.8,
          w.y + Math.sin(a) * w.radius * 0.8,
        );
        ctx.stroke();
      }

      if (progress > 0.7 && state.frameCount % 2 === 0) {
        state.particles.push({
          x: w.x + (Math.random() - 0.5) * w.radius,
          y: w.y + (Math.random() - 0.5) * w.radius,
          vx: Math.random() - 0.5,
          vy: -1 - Math.random(),
          life: 20,
          color: "#8b4513",
          size: 2 + Math.random() * 3,
        });
      }
    } else {
      // Default: column laser
      ctx.fillStyle = `rgba(255, 0, 0, ${0.05 + progress * 0.15})`;
      ctx.fillRect(w.x - w.radius, 0, w.radius * 2, w.y);

      ctx.beginPath();
      ctx.moveTo(w.x, 0);
      ctx.lineTo(w.x, w.y);
      ctx.strokeStyle = "rgba(255, 50, 0, 0.3)";
      ctx.lineWidth = w.radius * 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(w.x, 0);
      ctx.lineTo(w.x, w.y);
      ctx.setLineDash([10, 20]);
      ctx.lineDashOffset = -state.frameCount * 30;
      ctx.strokeStyle = "rgba(255, 200, 0, 0.9)";
      ctx.lineWidth = 6;
      ctx.stroke();

      const bloomSize = Math.max(0.1, 40 + progress * 100);
      const grad = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, bloomSize);
      grad.addColorStop(0, `rgba(255, 255, 255, ${0.5 * progress})`);
      grad.addColorStop(0.3, `rgba(255, 50, 0, ${0.5 * progress})`);
      grad.addColorStop(1, "rgba(255, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(w.x, w.y, bloomSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 50, 0, ${0.5 + progress * 0.5})`;
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    ctx.restore();
  });
}

// ===== STORM LIGHTNINGS =====
export function drawStormLightnings(ctx) {
  if (!state.stormLightnings) return;
  state.stormLightnings = state.stormLightnings.filter((l) => {
    l.life--;

    ctx.strokeStyle = "#ffff66";
    ctx.lineWidth = 3;
    ctx.beginPath();

    let x = l.x;
    let y = l.y;
    ctx.moveTo(x, y - 80);

    for (let i = 0; i < 5; i++) {
      let offsetX = (Math.random() - 0.5) * 20;
      let offsetY = i * 20;
      ctx.lineTo(x + offsetX, y - 80 + offsetY);
    }
    ctx.stroke();

    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ffff00";

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,150,0.6)";
    ctx.fill();

    ctx.shadowBlur = 0;

    return l.life > 0;
  });
}

// ===== WIND PARTICLES & TORNADOES =====
export function drawWindEffects(ctx) {
  if (state.windParticles) {
    state.windParticles = state.windParticles.filter((p) => {
      p.life--;
      p.angle += 0.2;
      p.radius *= 0.97;

      let x = state.player.x + Math.cos(p.angle) * p.radius;
      let y = state.player.y + Math.sin(p.angle) * p.radius;

      ctx.fillStyle = "rgba(180,255,255,0.6)";
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();

      return p.life > 0;
    });
  }

  if (state.windTornadoes) {
    state.windTornadoes.forEach((t) => {
      ctx.strokeStyle = "rgba(180,255,255,0.6)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 5; i++) {
        let angle = (state.frameCount * 0.1 + i) % (Math.PI * 2);
        let r = t.radius * (i / 5);

        let x = t.x + Math.cos(angle) * r;
        let y = t.y + Math.sin(angle) * r;

        ctx.fillStyle = "rgba(200,255,255,0.7)";
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
}

// ===== ICICLES =====
export function drawIcicles(ctx) {
  if (!state.icicles) return;
  state.icicles.forEach((ic) => {
    ctx.save();

    ctx.fillStyle = "#aeefff";
    ctx.beginPath();
    ctx.moveTo(ic.x, ic.y - ic.radius);
    ctx.lineTo(ic.x - ic.radius / 2, ic.y + ic.radius);
    ctx.lineTo(ic.x + ic.radius / 2, ic.y + ic.radius);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 15;
    ctx.shadowColor = "#66ccff";

    ctx.restore();
  });
}

// ===== FIRE VIGNETTE (player on fire) =====
export function drawFireVignette(ctx, canvas) {
  const pulse = (Math.sin(Date.now() / 100) + 1) * 0.5;
  const grad = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    200,
    canvas.width / 2,
    canvas.height / 2,
    500,
  );
  grad.addColorStop(0, "rgba(255, 0, 0, 0)");
  grad.addColorStop(1, `rgba(255, 50, 0, ${0.1 + pulse * 0.2})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ===== MAIN ENTRY =====
export function drawGroundEffects(ctx, canvas) {
  drawGroundWarnings(ctx);
  drawStormLightnings(ctx);
  drawWindEffects(ctx);
  drawIcicles(ctx);
}
