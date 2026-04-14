import { state } from "../../state.js";
import { hexToRgba } from "./drawUtils.js";

// ===== HAZARD TYPES (under entities) =====
export function drawHazards(ctx) {
  state.hazards.forEach((h) => {
    ctx.save();
    if (h.type === "fire") {
      ctx.globalCompositeOperation = "lighter";

      const pulse = (Math.sin(state.frameCount * 0.2) + 1) * 0.5;
      const grad = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, h.radius);
      grad.addColorStop(0, `rgba(255, 255, 100, ${0.8 + pulse * 0.2})`);
      grad.addColorStop(0.5, "rgba(255, 60, 0, 0.6)");
      grad.addColorStop(1, "rgba(255, 0, 0, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";
    } else if (h.type === "fire_ring") {
      const lifeRatio = Math.max(0, h.life / h.maxLife);
      const pulse = (Math.sin(state.frameCount * 0.2) + 1) * 0.5;

      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);

      ctx.lineWidth = 15 + pulse * 5;
      ctx.strokeStyle = `rgba(255, 60, 0, ${lifeRatio})`;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#ff0000";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.lineWidth = 4;
      ctx.strokeStyle = `rgba(255, 255, 150, ${lifeRatio})`;
      ctx.shadowBlur = 5;
      ctx.shadowColor = "#ffffff";
      ctx.stroke();
    } else if (h.type === "rock") {
      const alpha = h.active ? 1.0 : 0.4;
      ctx.fillStyle = `rgba(139, 69, 19, ${alpha})`;
      ctx.strokeStyle = `rgba(200, 150, 100, ${alpha * 0.8})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const r = h.radius * (0.9 + Math.random() * 0.3);
        const px = h.x + Math.cos(a) * r;
        const py = h.y + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (h.type === "frost") {
      const alpha = Math.min(0.4, h.life / 60);
      ctx.fillStyle = `rgba(0, 200, 255, ${alpha})`;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(
          h.x + (Math.random() - 0.5) * 70,
          h.y + (Math.random() - 0.5) * 70,
        );
        ctx.lineTo(
          h.x + (Math.random() - 0.5) * 70,
          h.y + (Math.random() - 0.5) * 70,
        );
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.stroke();
      }
    } else if (h.type === "static") {
      const pulse = state.frameCount % 10 < 5 ? 1 : 0.5;
      ctx.strokeStyle = `rgba(255, 255, 0, ${pulse * (h.life / 60)})`;
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.moveTo(h.x, h.y);
        ctx.lineTo(
          h.x + (Math.random() - 0.5) * h.radius * 2,
          h.y + (Math.random() - 0.5) * h.radius * 2,
        );
        ctx.stroke();
      }
    } else if (h.type === "vortex") {
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(state.frameCount * 0.3);
      ctx.strokeStyle = `rgba(180, 255, 255, ${0.4 + Math.random() * 0.3})`;
      ctx.lineWidth = 6;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00ffff";
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(
          0,
          0,
          (h.radius / 5) * (i + 1),
          0,
          Math.PI * (1 + Math.random() * 0.5),
        );
        ctx.stroke();
      }
      ctx.restore();
    } else if (h.type === "void_crush") {
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(-state.frameCount * 0.05);
      let pulse = Math.sin(state.frameCount * 0.2) * 20;

      let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, h.radius);
      grad.addColorStop(0, "#000000");
      grad.addColorStop(0.8, "rgba(70,0,150, 0.8)");
      grad.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, h.radius + pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(180, 0, 255, 0.5)";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    } else if (h.type === "void_devourer" || h.type === "void_rift") {
      ctx.save();
      ctx.fillStyle = "#0a001a";
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#aa00ff";
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#cc00ff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(
        h.x,
        h.y,
        h.radius * 1.2,
        h.radius * 0.3,
        state.frameCount * 0.1,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.restore();
    } else if (h.type === "glitch_zone") {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle =
        state.frameCount % 10 < 5
          ? "rgba(0,255,255,0.2)"
          : "rgba(255,0,255,0.2)";
      ctx.fillRect(h.x - h.radius, h.y - h.radius, h.radius * 2, h.radius * 2);

      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.lineDashOffset = -state.frameCount;
      ctx.strokeRect(
        h.x - h.radius,
        h.y - h.radius,
        h.radius * 2,
        h.radius * 2,
      );

      ctx.fillStyle = "#00ff00";
      ctx.font = "20px monospace";
      ctx.fillText("01001", h.x, h.y);
      ctx.restore();
    } else if (h.type === "error_box") {
      ctx.save();
      ctx.fillStyle = "rgba(200,0,0,0.5)";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "red";
      ctx.fillRect(h.x - h.radius, h.y - h.radius, h.radius * 2, h.radius * 2);

      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.fillText("FATAL", h.x, h.y);
      ctx.restore();
    } else if (h.type === "pixel_wall") {
      ctx.save();
      let isCyan = Math.random() > 0.5;
      ctx.fillStyle = isCyan
        ? "rgba(0, 255, 255, 0.4)"
        : "rgba(255, 0, 255, 0.4)";
      for (let i = -h.radius; i < h.radius; i += 20) {
        if (Math.random() > 0.2) {
          ctx.fillRect(h.x + i, h.y - 20, 18, 40);
        }
      }
      ctx.strokeStyle = "#ffffff";
      ctx.strokeRect(h.x - h.radius, h.y - 20, h.radius * 2, 40);
      ctx.restore();
    } else if (h.type === "binary_rain") {
      ctx.save();
      ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#00ff00";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      for (let i = 0; i < 8; i++) {
        let px = h.x + (Math.random() - 0.5) * h.radius * 1.5;
        let py =
          h.y +
          (Math.random() - 0.5) * h.radius * 1.5 +
          (state.frameCount % 20) * 2;
        ctx.fillText(Math.random() > 0.5 ? "0" : "1", px, py);
      }
      ctx.restore();
    } else if (h.type === "corrupt_laser") {
      ctx.save();
      ctx.strokeStyle =
        state.frameCount % 6 < 3
          ? "rgba(255, 0, 0, 0.8)"
          : "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 10 + Math.random() * 5;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#ff0000";

      ctx.beginPath();
      ctx.moveTo(h.x - h.radius, h.y);
      ctx.lineTo(h.x + h.radius, h.y);
      ctx.stroke();

      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(h.x - h.radius, h.y);
      for (let i = -h.radius; i < h.radius; i += 30) {
        ctx.lineTo(h.x + i, h.y + (Math.random() - 0.5) * 40);
      }
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  });
}

// ===== ELEMENTAL ZONE VFX =====
export function drawElementalZones(ctx) {
  if (!state.elementalZones) return;
  state.elementalZones.forEach((z) => {
    drawElementalZoneVFX(ctx, z);
  });
}

function drawElementalZoneVFX(ctx, z) {
  const lifeRatio = Math.max(0, z.life / z.maxLife);
  const t = state.frameCount * 0.05 + z.pulseSeed;
  const pulse = 0.85 + Math.sin(t * 2) * 0.15;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const glow = ctx.createRadialGradient(z.x, z.y, 0, z.x, z.y, z.radius * 1.35);
  glow.addColorStop(0, hexToRgba(z.color, 0.35 * lifeRatio));
  glow.addColorStop(0.35, hexToRgba(z.color, 0.18 * lifeRatio));
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(z.x, z.y, z.radius * pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = hexToRgba(z.color, 0.08 + 0.06 * lifeRatio);
  ctx.beginPath();
  ctx.arc(z.x, z.y, z.radius * 0.72, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = hexToRgba(z.color, 0.6 * lifeRatio);
  ctx.lineWidth = z.isMerged ? 4 : 2.5;
  ctx.setLineDash(z.isMerged ? [12, 8] : [8, 10]);
  ctx.lineDashOffset = -state.frameCount * (z.isMerged ? 1.6 : 0.9);
  ctx.beginPath();
  ctx.arc(z.x, z.y, z.radius * 0.98, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  const sparkCount = z.isMerged ? 14 : 8;
  for (let i = 0; i < sparkCount; i++) {
    const a = t * (z.isMerged ? 1.8 : 1.2) + (i / sparkCount) * Math.PI * 2;
    const r = z.radius * (0.35 + (i % 2) * 0.25);
    const sx = z.x + Math.cos(a) * r;
    const sy = z.y + Math.sin(a) * r;

    ctx.fillStyle = hexToRgba(z.color, 0.8 - i / (sparkCount * 1.2));
    ctx.beginPath();
    ctx.arc(sx, sy, z.isMerged ? 2.2 : 1.6, 0, Math.PI * 2);
    ctx.fill();
  }

  if (z.isMerged) {
    ctx.globalAlpha = 0.75 * lifeRatio;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.2;
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.strokeText(z.element.toUpperCase(), z.x, z.y - z.radius - 10);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(z.element.toUpperCase(), z.x, z.y - z.radius - 10);
  }

  ctx.restore();
}

// ===== GLOBAL HAZARD OVERLAY (fire/electric/ice/wind) =====
export function drawGlobalHazard(ctx, canvas) {
  if (!state.globalHazard.active) return;

  ctx.save();
  if (state.globalHazard.type === "fire") {
    if (state.frameCount % 2 === 0) {
      state.particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 2,
        vy: -2 - Math.random() * 3,
        life: 60,
        color: Math.random() > 0.5 ? "#ffaa00" : "#ff4400",
        size: 2 + Math.random() * 3,
        screenSpace: true,
      });
    }
  } else if (state.globalHazard.type === "electric") {
    if (state.frameCount % 10 === 0 && Math.random() < 0.4) {
      ctx.fillStyle = "rgba(200, 255, 255, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (state.frameCount % 8 === 0) {
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 2 + Math.random() * 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#00ffff";

      let startX = Math.random() * canvas.width;
      let curY = 0;
      ctx.beginPath();
      ctx.moveTo(startX, 0);

      while (curY < canvas.height) {
        startX += (Math.random() - 0.5) * 80;
        curY += 30 + Math.random() * 40;
        ctx.lineTo(startX, curY);
      }
      ctx.stroke();
      ctx.restore();
    }
  } else if (state.globalHazard.type === "ice") {
    ctx.fillStyle = "rgba(0, 200, 255, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (state.frameCount % 2 === 0) {
      state.particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        life: 240,
        color: "#ffffff",
        size: 2 + Math.random() * 3,
        screenSpace: true,
      });
    }
  } else if (state.globalHazard.type === "wind") {
    ctx.fillStyle = "rgba(200, 255, 255, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (state.frameCount % 1 === 0) {
      state.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.cos(state.frameCount * 0.05) * 20,
        vy: Math.sin(state.frameCount * 0.05) * 20,
        life: 20,
        color: "#ccffff",
        size: 1 + Math.random() * 3,
        screenSpace: true,
      });
    }
  }
  ctx.restore();
}

// ===== SAFE ZONES =====
export function drawSafeZones(ctx) {
  state.safeZones.forEach((sz) => {
    ctx.save();
    const pulse = 0.8 + Math.sin(state.frameCount * 0.1) * 0.2;
    const gradient = ctx.createRadialGradient(
      sz.x,
      sz.y,
      0,
      sz.x,
      sz.y,
      sz.radius,
    );
    gradient.addColorStop(0, "rgba(0, 255, 255, 0.4)");
    gradient.addColorStop(1, "rgba(0, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(sz.x, sz.y, sz.radius * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  });
}

// ===== ENVIRONMENTAL HAZARDS (secondary pass) =====
export function drawEnvironmentalHazards(ctx) {
  if (!state.hazards) return;
  state.hazards.forEach((h) => {
    ctx.save();
    if (h.type === "fire") {
      const pulse = (Math.sin(state.frameCount * 0.1) + 1) * 0.5;
      const grad = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, h.radius);
      grad.addColorStop(0, `rgba(255, 255, 0, ${0.5 + pulse * 0.2})`);
      grad.addColorStop(0.5, "rgba(255, 68, 0, 0.4)");
      grad.addColorStop(1, "rgba(255, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    if (h.type === "frost") {
      ctx.fillStyle = "rgba(0, 255, 255, 0.1)";
      ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  });
}
