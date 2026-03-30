import { state } from "../state.js";
import { FPS } from "../config.js";
import { dist } from "../utils.js";
import { UI, updateHealthUI, updateXPUI } from "../ui.js";

/**
 * Xử lý khi player nhận sát thương.
 * Cập nhật để tính đến Kỹ năng Bất tử
 */
export function playerTakeDamage(ctx, canvas, changeStateFn) {
  if (state.player.gracePeriod > 0 || state.player.dashTimeLeft > 0) return;

  // Bất tử từ Kỹ năng Tank E hoặc Ghost Q
  let buffs = state.activeBuffs || { q: 0, e: 0, r: 0 };
  if (
    buffs.e > 0 &&
    (state.player.characterId === "tank" ||
      state.player.characterId === "ghost")
  ) {
    return;
  }

  if (state.player.shield > 0) {
    state.player.shield--;
    state.player.shieldRegenTimer = 5 * FPS;
  } else {
    state.player.hp--;
  }

  state.player.gracePeriod = 60;
  updateHealthUI();

  // Flash màn hình đỏ
  ctx.fillStyle = "rgba(255,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (state.player.hp <= 0) changeStateFn("GAME_OVER");
}

export function addExperience(amount, changeStateFn) {
  if (!state.player) return;
  state.player.experience += amount;

  if (state.player.experience >= state.player.experienceToLevel) {
    state.player.experience -= state.player.experienceToLevel;
    state.player.experienceToLevel = Math.max(
      50,
      Math.floor(state.player.experienceToLevel * 1.15),
    );
    state.upgradeFromXP = true;
    updateXPUI();
    changeStateFn("UPGRADE");
    return;
  }
  updateXPUI();
}

/**
 * Cập nhật bullets, tích hợp Đóng băng thời gian.
 */
export function updateBullets(
  ctx,
  canvas,
  changeStateFn,
  isTimeFrozen = false,
) {
  let { player, boss, bullets, ghosts } = state;
  let buffs = state.activeBuffs || { q: 0, e: 0, r: 0 };
  let isInvulnSkill =
    buffs.e > 0 &&
    (player.characterId === "tank" || player.characterId === "ghost");
  let isInvulnerable =
    player.gracePeriod > 0 || player.dashTimeLeft > 0 || isInvulnSkill;

  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];

    // Đạn địch bị đóng băng
    if (!b.isPlayer && isTimeFrozen) {
      // Giữ nguyên vị trí
    } else {
      b.x += b.vx;
      b.y += b.vy;
      b.life--;
    }

    let hitWall = false;
    if (b.x < b.radius) {
      b.x = b.radius;
      b.vx *= -1;
      hitWall = true;
    } else if (b.x > canvas.width - b.radius) {
      b.x = canvas.width - b.radius;
      b.vx *= -1;
      hitWall = true;
    }

    if (b.y < b.radius) {
      b.y = b.radius;
      b.vy *= -1;
      hitWall = true;
    } else if (b.y > canvas.height - b.radius) {
      b.y = canvas.height - b.radius;
      b.vy *= -1;
      hitWall = true;
    }

    if (hitWall) {
      if (b.bounces > 0) {
        b.bounces--;
        if (b.bounces >= 0) b.life = Math.max(b.life, 30);
      } else b.life = 0;
    }

    if (b.life <= 0) {
      bullets.splice(i, 1);
      continue;
    }

    if (b.isPlayer) {
      if (boss && dist(b.x, b.y, boss.x, boss.y) < boss.radius + b.radius) {
        boss.hp -= 1;
        state.player.coins = (state.player.coins || 0) + 2;
        UI.bossHp.style.width = Math.max(0, (boss.hp / boss.maxHp) * 100) + "%";
        bullets.splice(i, 1);
        if (boss.hp <= 0) {
          state.player.coins = (state.player.coins || 0) + 100;
          state._bossKilled = true;
        }
        continue;
      }

      let hitGhost = false;
      for (let j = ghosts.length - 1; j >= 0; j--) {
        let g = ghosts[j];
        if (
          g.isStunned <= 0 &&
          g.x > 0 &&
          dist(b.x, b.y, g.x, g.y) < g.radius + b.radius
        ) {
          if (state.isBossLevel) {
            ghosts.splice(j, 1);
            state.player.coins = (state.player.coins || 0) + 10;
          } else {
            g.isStunned = 300;
            addExperience(6, changeStateFn);
            state.player.coins = (state.player.coins || 0) + 5;
          }
          bullets.splice(i, 1);
          hitGhost = true;
          break;
        }
      }
      if (hitGhost) continue;
    } else {
      if (
        !isInvulnerable &&
        dist(b.x, b.y, player.x, player.y) < player.radius + b.radius - 2
      ) {
        playerTakeDamage(ctx, canvas, changeStateFn);
        bullets.splice(i, 1);
        continue;
      }
    }
  }
}
