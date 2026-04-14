import { state } from "../../state.js";
import { lerpColor } from "./drawUtils.js";

// ===== BOSS BEAMS (Lightning) =====
export function drawBossBeams(ctx) {
  state.bossBeams.forEach((beam) => {
    ctx.save();
    if (beam.state === "charge") {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.moveTo(beam.x1, beam.y1);
      ctx.lineTo(beam.x2, beam.y2);
      ctx.stroke();
    } else {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 8 + Math.random() * 4;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#00ffff";
      ctx.beginPath();
      ctx.moveTo(beam.x1, beam.y1);
      ctx.lineTo(beam.x2, beam.y2);
      ctx.stroke();

      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    }
    ctx.restore();
  });
}

// ===== BOSS ENTITY PHASE (survive mode) =====
export function drawBossEntityPhase(ctx, canvas, boss) {
  if (!boss || !boss.entityPhase) return;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(boss.x - 25, boss.y - 25, 50, 50);

  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(boss.x, boss.y, 12, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.font = "20px monospace";
  ctx.fillText("SURVIVE: " + Math.ceil(boss.entityTimer / 60), 20, 40);
}

// ===== BOSS MAIN DRAW =====
export function drawBoss(ctx) {
  const boss = state.boss;
  if (!boss || boss.entityPhase) return;

  let phase;
  const ratio = boss.hp / boss.maxHp;
  if (boss.phaseCount === 3) {
    phase = ratio > 0.66 ? 0 : ratio > 0.33 ? 1 : 2;
  } else {
    phase = ratio > 0.5 ? 0 : 1;
  }
  const phaseColor = boss.phaseColors?.[phase] || {
    start: boss.color,
    end: boss.color,
  };

  const t = (Math.sin(state.frameCount * 0.05) + 1) / 2;
  const color = lerpColor(phaseColor.start, phaseColor.end, t);

  ctx.save();
  ctx.translate(boss.x, boss.y);
  ctx.rotate(state.frameCount * 0.01);

  ctx.beginPath();

  // VOID boss
  if (boss.id === "void" || boss.bossType === "void") {
    ctx.arc(0, 0, boss.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#050011";
    ctx.fill();

    ctx.rotate(-state.frameCount * 0.05);
    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      boss.radius * 2.2,
      boss.radius * 0.6,
      Math.PI / 4,
      0,
      Math.PI * 2,
    );
    ctx.strokeStyle = "rgba(180, 0, 255, 0.8)";
    ctx.lineWidth = 6;
    ctx.stroke();
  }
  // GLITCH boss
  else if (boss.id === "glitch" || boss.bossType === "glitch") {
    if (boss.ultimatePhase) {
      ctx.save();
      const pulse = Math.sin(state.frameCount * 0.1) * 10;

      ctx.shadowBlur = 40 + pulse;
      ctx.shadowColor = "#ffffff";

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, boss.radius * 0.8 + pulse * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 20;

      ctx.shadowColor = "#00ffff";
      ctx.rotate(state.frameCount * 0.05);
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 4;
      ctx.strokeRect(
        -boss.radius,
        -boss.radius,
        boss.radius * 2,
        boss.radius * 2,
      );

      ctx.shadowColor = "#ff00ff";
      ctx.rotate(-state.frameCount * 0.1);
      ctx.strokeStyle = "#ff00ff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -boss.radius * 1.5);
      ctx.lineTo(boss.radius * 1.5, 0);
      ctx.lineTo(0, boss.radius * 1.5);
      ctx.lineTo(-boss.radius * 1.5, 0);
      ctx.closePath();
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        boss.radius * 0.2,
        boss.radius * 0.5,
        state.frameCount * 0.2,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      ctx.restore();
    } else {
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      const offset = (Math.random() - 0.5) * 10;
      ctx.fillStyle = "#00ffff";
      ctx.fillRect(
        -boss.radius + offset,
        -boss.radius,
        boss.radius * 2,
        boss.radius * 2,
      );

      ctx.fillStyle = "#ff00ff";
      ctx.fillRect(
        -boss.radius - offset,
        -boss.radius,
        boss.radius * 2,
        boss.radius * 2,
      );

      ctx.fillStyle = "#111111";
      ctx.fillRect(
        -boss.radius,
        -boss.radius,
        boss.radius * 2,
        boss.radius * 2,
      );

      ctx.fillStyle = "#00ff00";
      ctx.font = "bold 16px monospace";
      ctx.fillText(Math.random() > 0.5 ? "010" : "101", -12, 5);
      ctx.restore();
    }
  }

  // SHAPES
  switch (boss.shape) {
    case "triangle":
      for (let i = 0; i < 3; i++) {
        let a = i * ((Math.PI * 2) / 3) - Math.PI / 2;
        let x = Math.cos(a) * boss.radius;
        let y = Math.sin(a) * boss.radius;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      break;
    case "square":
      ctx.rect(-boss.radius, -boss.radius, boss.radius * 2, boss.radius * 2);
      break;
    case "hexagon":
      for (let i = 0; i < 6; i++) {
        let a = i * ((Math.PI * 2) / 6);
        let x = Math.cos(a) * boss.radius;
        let y = Math.sin(a) * boss.radius;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      break;
    case "star":
      for (let i = 0; i < 10; i++) {
        let r = i % 2 === 0 ? boss.radius : boss.radius / 2;
        let a = i * (Math.PI / 5);
        let x = Math.cos(a) * r;
        let y = Math.sin(a) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      break;
    default:
      ctx.arc(0, 0, boss.radius, 0, Math.PI * 2);
  }

  ctx.fillStyle = "#111";
  ctx.fill();

  const isRage = boss.hp < boss.maxHp * 0.5;
  ctx.lineWidth = isRage ? 8 : 4;
  ctx.strokeStyle = color;
  ctx.shadowBlur = isRage ? 40 : 25;
  ctx.shadowColor = color;
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = color;
  ctx.fillRect(-8, -8, 16, 16);
  ctx.restore();
}

// ===== SUCTION PARTICLES (boss ultimate phase) =====
export function drawSuctionParticles(ctx) {
  if (!state.cinematicEffects.suctionParticles) {
    state.cinematicEffects.suctionParticles = [];
    for (let i = 0; i < 30; i++) {
      state.cinematicEffects.suctionParticles.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        speed: 2 + Math.random() * 5,
      });
    }
  }

  ctx.fillStyle = state.boss.elementColor || "#fff";
  state.cinematicEffects.suctionParticles.forEach((p) => {
    const dx = state.boss.x - p.x;
    const dy = state.boss.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 10) {
      p.x = Math.random() * 800;
      p.y = Math.random() * 600;
    } else {
      p.x += (dx / dist) * p.speed;
      p.y += (dy / dist) * p.speed;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
}
