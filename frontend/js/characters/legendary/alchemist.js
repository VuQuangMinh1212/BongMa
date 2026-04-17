import { dist } from "../../utils.js";
import { FPS } from "../../config.js";
import { spawnBullet } from "../../entities/helpers.js";
import { updateHealthUI } from "../../ui.js";

const ALCHEMY = {
  ink: "#101018",
  coat: "#23202d",
  glass: "#bfffea",
  emerald: "#00ff9d",
  acid: "#b8ff2c",
  gold: "#ffd76a",
  amber: "#ff9f2e",
  mercury: "#d7fff4",
  violet: "#b875ff",
};

function ensureAlchemistList(state, key) {
  if (!state[key]) state[key] = [];
  return state[key];
}

function pushAlchemistBurst(state, type, x, y, radius, life, angle = 0) {
  ensureAlchemistList(state, "alchemistBursts").push({
    type,
    x,
    y,
    radius,
    life,
    maxLife: life,
    angle,
    seed: Math.random() * Math.PI * 2,
  });
}

function pushAlchemistSpark(state, x, y, angle, speed, life, size, color = ALCHEMY.emerald) {
  ensureAlchemistList(state, "alchemistSparks").push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    angle,
    spin: (Math.random() - 0.5) * 0.15,
    life,
    maxLife: life,
    size,
    color,
  });
}

function updateAlchemistVfx(state) {
  if (state.alchemistBursts) {
    for (let i = state.alchemistBursts.length - 1; i >= 0; i--) {
      state.alchemistBursts[i].life--;
      if (state.alchemistBursts[i].life <= 0) state.alchemistBursts.splice(i, 1);
    }
  }

  if (state.alchemistSparks) {
    for (let i = state.alchemistSparks.length - 1; i >= 0; i--) {
      const p = state.alchemistSparks[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.angle += p.spin;
      p.life--;
      if (p.life <= 0) state.alchemistSparks.splice(i, 1);
    }
  }
}

function drawAlchemyCircle(ctx, radius, frameCount, alpha = 1, primary = ALCHEMY.gold, secondary = ALCHEMY.emerald) {
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.rotate(frameCount * 0.018);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.shadowBlur = 16;
  ctx.shadowColor = primary;
  ctx.strokeStyle = primary;
  ctx.lineWidth = 2;
  ctx.setLineDash([9, 7]);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = secondary;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + i * (Math.PI * 2 / 3);
    const x = Math.cos(a) * radius * 0.82;
    const y = Math.sin(a) * radius * 0.82;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  ctx.rotate(-frameCount * 0.036);
  ctx.strokeStyle = "rgba(215, 255, 244, 0.58)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.56, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 6; i++) {
    const a = i * (Math.PI * 2 / 6);
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(2.5, radius * 0.045), 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? primary : secondary;
    ctx.fill();
  }

  ctx.restore();
}

function drawPotion(ctx, radius, liquid, alpha = 1) {
  const w = radius * 0.62;
  const h = radius * 1.05;

  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.lineJoin = "round";

  ctx.fillStyle = "rgba(191, 255, 234, 0.16)";
  ctx.strokeStyle = "rgba(215, 255, 244, 0.82)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.roundRect(-w * 0.5, -h * 0.18, w, h * 0.72, 4);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(-w * 0.22, -h * 0.52, w * 0.44, h * 0.38, 3);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = liquid;
  ctx.shadowBlur = 12;
  ctx.shadowColor = liquid;
  ctx.beginPath();
  ctx.roundRect(-w * 0.39, h * 0.02, w * 0.78, h * 0.33, 3);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = ALCHEMY.gold;
  ctx.beginPath();
  ctx.roundRect(-w * 0.3, -h * 0.62, w * 0.6, h * 0.14, 3);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(-w * 0.18 + i * w * 0.17, h * (0.05 - i * 0.08), radius * 0.055, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawAlchemistBody(ctx, radius, active) {
  ctx.save();

  ctx.fillStyle = ALCHEMY.coat;
  ctx.strokeStyle = ALCHEMY.gold;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -radius * 1.15);
  ctx.quadraticCurveTo(radius * 0.95, -radius * 0.55, radius * 0.7, radius * 1.05);
  ctx.lineTo(radius * 0.24, radius * 1.2);
  ctx.quadraticCurveTo(0, radius * 1.05, -radius * 0.24, radius * 1.2);
  ctx.lineTo(-radius * 0.7, radius * 1.05);
  ctx.quadraticCurveTo(-radius * 0.95, -radius * 0.55, 0, -radius * 1.15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = active ? ALCHEMY.emerald : "rgba(255, 215, 106, 0.72)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -radius * 0.55);
  ctx.lineTo(0, radius * 0.95);
  ctx.moveTo(-radius * 0.34, -radius * 0.08);
  ctx.lineTo(radius * 0.34, -radius * 0.08);
  ctx.stroke();

  ctx.fillStyle = "#191724";
  ctx.strokeStyle = active ? ALCHEMY.emerald : ALCHEMY.gold;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -radius * 0.66, radius * 0.52, Math.PI * 0.06, Math.PI * 1.94);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = ALCHEMY.glass;
  ctx.shadowBlur = active ? 14 : 8;
  ctx.shadowColor = active ? ALCHEMY.emerald : ALCHEMY.gold;
  for (let i = -1; i <= 1; i += 2) {
    ctx.beginPath();
    ctx.arc(i * radius * 0.18, -radius * 0.67, radius * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.shadowBlur = 0;

  ctx.fillStyle = ALCHEMY.emerald;
  ctx.beginPath();
  ctx.arc(0, -radius * 0.12, radius * 0.12, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(-radius * 0.86, radius * 0.04);
  ctx.rotate(-0.28);
  drawPotion(ctx, radius * 0.56, ALCHEMY.acid, 0.92);
  ctx.restore();

  ctx.save();
  ctx.translate(radius * 0.86, radius * 0.08);
  ctx.rotate(0.22);
  drawPotion(ctx, radius * 0.5, ALCHEMY.violet, 0.9);
  ctx.restore();

  ctx.restore();
}

function drawAlchemistBurst(ctx, burst, frameCount) {
  const progress = 1 - burst.life / burst.maxLife;
  const alpha = Math.max(0, burst.life / burst.maxLife);
  const radius = burst.radius * (0.28 + progress * 0.88);
  const isQ = burst.type === "q";
  const isE = burst.type === "e";
  const primary = isQ ? ALCHEMY.acid : isE ? ALCHEMY.mercury : ALCHEMY.gold;
  const secondary = isQ ? ALCHEMY.emerald : isE ? ALCHEMY.emerald : ALCHEMY.violet;

  ctx.save();
  ctx.translate(burst.x, burst.y);
  ctx.globalCompositeOperation = "lighter";

  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
  glow.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.22})`);
  glow.addColorStop(0.46, isQ ? `rgba(184, 255, 44, ${alpha * 0.18})` : `rgba(255, 215, 106, ${alpha * 0.16})`);
  glow.addColorStop(1, "rgba(10, 12, 16, 0)");
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.fill();

  ctx.save();
  ctx.rotate(burst.seed + frameCount * (isE ? -0.025 : 0.028));
  drawAlchemyCircle(ctx, Math.max(18, radius * 0.56), frameCount, alpha * 0.9, primary, secondary);
  ctx.restore();

  if (isQ) {
    ctx.rotate(burst.angle);
    for (let i = -1; i <= 1; i++) {
      ctx.save();
      ctx.rotate(i * 0.34);
      ctx.strokeStyle = `rgba(184, 255, 44, ${alpha * 0.72})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius * 0.88, 0);
      ctx.stroke();
      ctx.restore();
    }
  }

  ctx.restore();
}

function drawAlchemistSpark(ctx, spark) {
  const alpha = Math.max(0, spark.life / spark.maxLife);

  ctx.save();
  ctx.translate(spark.x, spark.y);
  ctx.rotate(spark.angle);
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = alpha;
  ctx.fillStyle = spark.color;
  ctx.shadowBlur = 12;
  ctx.shadowColor = spark.color;
  ctx.beginPath();
  ctx.moveTo(0, -spark.size * 1.7);
  ctx.lineTo(spark.size * 1.25, 0);
  ctx.lineTo(0, spark.size * 1.7);
  ctx.lineTo(-spark.size * 1.25, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawAlchemistPlayer(ctx, state, buffs, isInvulnSkill = false) {
  const { player, frameCount } = state;
  if (!player) return;

  const radius = player.radius;
  const fc = frameCount || 0;
  const isQ = (buffs.q || 0) > 0;
  const isE = (buffs.e || 0) > 0;
  const isR = (buffs.r || 0) > 0;
  const active = isQ || isE || isR || isInvulnSkill;
  const pulse = (Math.sin(fc * 0.16) + 1) * 0.5;
  const aim = Math.atan2((state.mouse?.y ?? player.y) - player.y, (state.mouse?.x ?? player.x + 100) - player.x);

  if (player.gracePeriod > 0 && !active && Math.floor(fc / 6) % 2 !== 0) return;

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.globalCompositeOperation = "lighter";

  const auraRadius = radius * (isR ? 2.45 : isQ ? 2.05 : isE ? 1.95 : 1.5);
  const aura = ctx.createRadialGradient(0, 0, radius * 0.25, 0, 0, auraRadius);
  aura.addColorStop(0, active ? "rgba(215, 255, 244, 0.22)" : "rgba(255, 215, 106, 0.08)");
  aura.addColorStop(0.52, isQ ? "rgba(184, 255, 44, 0.16)" : isR ? "rgba(255, 215, 106, 0.18)" : "rgba(0, 255, 157, 0.1)");
  aura.addColorStop(1, "rgba(12, 10, 18, 0)");
  ctx.beginPath();
  ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
  ctx.fillStyle = aura;
  ctx.fill();

  if (active) {
    drawAlchemyCircle(
      ctx,
      radius * (isR ? 2.12 + pulse * 0.12 : 1.66 + pulse * 0.08),
      fc,
      isR ? 0.72 : 0.48,
      isQ ? ALCHEMY.acid : ALCHEMY.gold,
      isE ? ALCHEMY.mercury : ALCHEMY.emerald,
    );
  }

  for (let i = 0; i < 3; i++) {
    const a = fc * 0.035 + i * (Math.PI * 2 / 3);
    const x = Math.cos(a) * radius * 1.55;
    const y = Math.sin(a) * radius * 0.9;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a + Math.PI / 2);
    drawPotion(ctx, radius * 0.34, i === 0 ? ALCHEMY.acid : i === 1 ? ALCHEMY.violet : ALCHEMY.gold, active ? 0.86 : 0.52);
    ctx.restore();
  }

  ctx.save();
  ctx.rotate(aim);
  ctx.strokeStyle = ALCHEMY.gold;
  ctx.lineWidth = 3;
  ctx.shadowBlur = 12;
  ctx.shadowColor = ALCHEMY.gold;
  ctx.beginPath();
  ctx.moveTo(radius * 0.18, radius * 0.02);
  ctx.lineTo(radius * 1.32, radius * 0.02);
  ctx.stroke();

  ctx.translate(radius * 1.48, 0);
  ctx.rotate(fc * 0.02);
  drawPotion(ctx, radius * 0.64, isQ ? ALCHEMY.acid : isR ? ALCHEMY.gold : ALCHEMY.emerald, 0.98);
  ctx.restore();

  drawAlchemistBody(ctx, radius, active);

  if (isE) {
    ctx.strokeStyle = "rgba(215, 255, 244, 0.78)";
    ctx.lineWidth = 2.4;
    ctx.shadowBlur = 16;
    ctx.shadowColor = ALCHEMY.mercury;
    ctx.beginPath();
    ctx.arc(0, 0, radius * (1.42 + pulse * 0.12), 0, Math.PI * 2);
    ctx.stroke();
  }

  if (isR) {
    ctx.save();
    ctx.rotate(-fc * 0.035);
    ctx.strokeStyle = "rgba(255, 215, 106, 0.72)";
    ctx.lineWidth = 2.2;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.arc(0, 0, radius * (2.28 + pulse * 0.12), 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  if (player.shield > 0) {
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.25, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 215, 106, 0.58)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.restore();
}

export const alchemist = {
  id: "alchemist",

  onTrigger: (key, state, canvas, changeStateFn) => {
    const { player, mouse } = state;
    const aim = Math.atan2((mouse?.y ?? player.y) - player.y, (mouse?.x ?? player.x + 100) - player.x);

    if (key === "q") {
      const start = state.bullets.length;
      for (let i = 0; i < Math.PI * 2; i += Math.PI / 5) {
        spawnBullet(player.x, player.y, player.x + Math.cos(i), player.y + Math.sin(i), true, 0, "player", 2.1);
      }

      for (let i = start; i < state.bullets.length; i++) {
        const b = state.bullets[i];
        b.radius = 10;
        b.life = 56;
        b.visualStyle = "alchemist_flask";
        b.alchemistBomb = true;
        b.alchemistPrepared = true;
        b.damage = 2.1;
      }

      state.activeBuffs.q = 20;
      pushAlchemistBurst(state, "q", player.x, player.y, 178, 38, aim);
      for (let i = 0; i < 16; i++) {
        pushAlchemistSpark(state, player.x, player.y, Math.random() * Math.PI * 2, 1.2 + Math.random() * 2.4, 24, 2.2, i % 2 === 0 ? ALCHEMY.acid : ALCHEMY.emerald);
      }
    }

    if (key === "e") {
      if (player.hp < player.maxHp) {
        player.hp = Math.min(player.maxHp, player.hp + 1);
        updateHealthUI();
        if (!state.floatingTexts) state.floatingTexts = [];
        state.floatingTexts.push({ x: player.x, y: player.y - 34, text: "+1 HP", color: ALCHEMY.mercury, life: 42 });
      } else {
        player.exp = (player.exp || 0) + 50;
        if (!state.floatingTexts) state.floatingTexts = [];
        state.floatingTexts.push({ x: player.x, y: player.y - 34, text: "+50 EXP", color: ALCHEMY.gold, life: 42 });
      }

      state.activeBuffs.e = 32;
      pushAlchemistBurst(state, "e", player.x, player.y, 138, 36, aim);
      for (let i = 0; i < 12; i++) {
        pushAlchemistSpark(state, player.x, player.y, -Math.PI / 2 + (Math.random() - 0.5) * 0.9, 0.9 + Math.random() * 1.8, 26, 2, i % 2 === 0 ? ALCHEMY.mercury : ALCHEMY.gold);
      }
    }

    if (key === "r") {
      state.activeBuffs.r = 4 * FPS;
      state.screenShake = { timer: 14, intensity: 4 };
      if (!state.skillRangeIndicators) state.skillRangeIndicators = [];
      state.skillRangeIndicators.push({
        x: player.x,
        y: player.y,
        radius: 250,
        life: 42,
        maxLife: 42,
        color: "rgba(255, 215, 106, 1)",
      });
      pushAlchemistBurst(state, "r", player.x, player.y, 245, 46, aim);
    }

    return true;
  },

  update: (state) => {
    const { player, bullets, frameCount } = state;
    const buffs = state.activeBuffs || { q: 0, e: 0, r: 0 };
    const fc = frameCount || 0;

    if (buffs.r > 0) {
      bullets.forEach((b) => {
        if (!b.isPlayer && !b.alchemistTransmuted && dist(player.x, player.y, b.x, b.y) < 250) {
          const angle = Math.atan2(b.y - player.y, b.x - player.x);
          b.isPlayer = true;
          b.ownerCharacter = "alchemist";
          b.visualStyle = "alchemist_flask";
          b.alchemistTransmuted = true;
          b.alchemistPrepared = true;
          b.vx *= -1.55;
          b.vy *= -1.55;
          b.radius = Math.max(5, Math.min(13, b.radius || 7));
          b.damage = (b.damage || 1) * 2;
          b.life = Math.max(b.life || 0, 120);
          pushAlchemistSpark(state, b.x, b.y, angle + Math.PI, 1.4, 20, 2.2, ALCHEMY.gold);
        }
      });

      if (fc % 8 === 0) {
        pushAlchemistSpark(state, player.x, player.y, Math.random() * Math.PI * 2, 0.8, 20, 1.8, fc % 16 === 0 ? ALCHEMY.gold : ALCHEMY.emerald);
      }
    }

    bullets.forEach((b) => {
      if (!b.isPlayer || b.ownerCharacter !== "alchemist" || b.alchemistPrepared) return;

      b.alchemistPrepared = true;
      b.visualStyle = "alchemist_flask";

      if (buffs.q > 0) {
        b.alchemistBomb = true;
        b.radius = Math.max(b.radius || 4, 5);
        b.damage = (b.damage || 1) * 1.15;
      }

      if (buffs.e > 0) {
        b.alchemistElixir = true;
        b.pierce = true;
      }

      if (buffs.r > 0) {
        b.alchemistTransmuted = true;
        b.damage = (b.damage || 1) * 1.25;
      }
    });

    updateAlchemistVfx(state);
  },

  draw: (state, ctx, canvas, buffs) => {
    const { player, frameCount } = state;
    const fc = frameCount || 0;

    if ((buffs.r || 0) > 0) {
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.globalCompositeOperation = "lighter";
      const pulse = Math.sin(fc * 0.12) * 9;
      const radius = 250 + pulse;

      const field = ctx.createRadialGradient(0, 0, 20, 0, 0, radius);
      field.addColorStop(0, "rgba(255, 215, 106, 0.08)");
      field.addColorStop(0.5, "rgba(0, 255, 157, 0.11)");
      field.addColorStop(1, "rgba(16, 16, 24, 0)");
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = field;
      ctx.fill();

      drawAlchemyCircle(ctx, radius * 0.72, fc, 0.8, ALCHEMY.gold, ALCHEMY.emerald);
      drawAlchemyCircle(ctx, radius * 0.98, fc * 0.7, 0.48, ALCHEMY.mercury, ALCHEMY.gold);
      ctx.restore();
    }

    if ((buffs.e || 0) > 0) {
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.globalCompositeOperation = "lighter";
      const pulse = Math.sin(fc * 0.24) * 5;
      const heal = ctx.createRadialGradient(0, 0, 8, 0, 0, 105 + pulse);
      heal.addColorStop(0, "rgba(215, 255, 244, 0.2)");
      heal.addColorStop(0.55, "rgba(0, 255, 157, 0.12)");
      heal.addColorStop(1, "rgba(0, 255, 157, 0)");
      ctx.beginPath();
      ctx.arc(0, 0, 105 + pulse, 0, Math.PI * 2);
      ctx.fillStyle = heal;
      ctx.fill();
      ctx.restore();
    }

    state.alchemistBursts?.forEach((burst) => drawAlchemistBurst(ctx, burst, fc));
    state.alchemistSparks?.forEach((spark) => drawAlchemistSpark(ctx, spark));
  },
};
