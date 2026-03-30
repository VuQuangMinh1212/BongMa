import { state } from "../state.js";
import { dist } from "../utils.js";

export function draw(ctx, canvas) {
  let { player, boss, bullets, ghosts, mouse, activeBuffs } = state;
  let buffs = activeBuffs || { q: 0, e: 0, r: 0 };

  ctx.fillStyle = "#0a0a0c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#1a1a24";
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 40) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  // --- Visual Kỹ Năng ---
  if (player.characterId === "tank" && buffs.r > 0) {
    ctx.beginPath();
    ctx.arc(player.x, player.y, 200 + (15 - buffs.r) * 5, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 255, 204, ${buffs.r / 15})`;
    ctx.lineWidth = 10;
    ctx.stroke();
  }
  if (player.characterId === "sharpshooter" && buffs.r > 0) {
    ctx.fillStyle = `rgba(255, 0, 0, ${buffs.r / 20})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (player.characterId === "mage" && buffs.r > 0) {
    ctx.fillStyle = `rgba(0, 150, 255, 0.15)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // --- Boss ---
  if (boss) {
    ctx.beginPath();
    ctx.arc(boss.x, boss.y, boss.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#111";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = boss.summonCooldown > 0 ? "#ff0055" : "#ff00ff";
    ctx.shadowBlur = 20;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fillRect(boss.x - 10, boss.y - 10, 20, 20);
  }

  // --- Ghosts ---
  for (let g of ghosts) {
    if (g.x < 0) continue;
    let isDashing =
      g.historyPath.length > 2 &&
      dist(
        g.historyPath[g.historyPath.length - 1].x,
        g.historyPath[g.historyPath.length - 1].y,
        g.historyPath[g.historyPath.length - 2].x,
        g.historyPath[g.historyPath.length - 2].y,
      ) >
        8 * g.speedRate;

    if (g.historyPath.length > 0 && g.isStunned <= 0) {
      ctx.beginPath();
      ctx.moveTo(g.historyPath[0].x, g.historyPath[0].y);
      for (let p of g.historyPath) ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = isDashing
        ? "rgba(0, 255, 204, 0.5)"
        : "rgba(255, 68, 68, 0.3)";
      ctx.lineWidth = g.radius * 2;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);

    // Đổi màu quái nếu bị Mage đóng băng
    if (player.characterId === "mage" && buffs.r > 0) ctx.fillStyle = "#00aaff";
    else ctx.fillStyle = g.isStunned > 0 ? "#333" : "#ff4444";

    ctx.fill();
    if (g.isStunned <= 0) {
      ctx.strokeStyle = isDashing ? "#00ffcc" : "#ff0000";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // --- Bullets ---
  for (let b of bullets) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    if (b.isPlayer) ctx.fillStyle = "#00ffcc";
    else ctx.fillStyle = b.style === 1 ? "#ff00ff" : "#ff4444";
    ctx.fill();
  }

  // --- Player ---
  let isInvulnSkill =
    buffs.e > 0 &&
    (player.characterId === "tank" || player.characterId === "ghost");

  if (player.dashTimeLeft > 0 || isInvulnSkill) {
    ctx.beginPath();
    ctx.arc(
      player.x,
      player.y,
      player.radius + (isInvulnSkill ? 5 : 2),
      0,
      Math.PI * 2,
    );
    ctx.fillStyle =
      player.characterId === "ghost" ? "rgba(100,100,255,0.5)" : "white";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "white";
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (player.gracePeriod > 0) {
    if (Math.floor(state.frameCount / 6) % 2 === 0) {
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fillStyle = player.color;
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  } else {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = player.color;
    ctx.fill();
    ctx.shadowBlur = 0;

    if (player.shield > 0) {
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius + 6, 0, Math.PI * 2);
      ctx.strokeStyle = "#00aaff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(0, 255, 204, 0.5)";
  ctx.stroke();
}
