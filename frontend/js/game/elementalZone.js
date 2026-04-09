import { state } from "../state.js";
import { dist } from "../utils.js";

export function spawnElementalZone(enemy) {
  const element = enemy.element || "fire";

  const config = {
    fire: { radius: 80, duration: 180, color: "#ff5500" },
    ice: { radius: 90, duration: 200, color: "#00ccff" },
    lightning: { radius: 85, duration: 140, color: "#ffff00" },
    wind: { radius: 100, duration: 160, color: "#ccffff" },
    earth: { radius: 110, duration: 240, color: "#996633" },
  };

  const c = config[element];

  state.elementalZones.push({
    x: enemy.x,
    y: enemy.y,
    radius: c.radius,
    element,
    color: c.color,
    life: c.duration,
    maxLife: c.duration,
    tick: 0,
  });
}

// ================= UPDATE =================

export function updateElementalZones(player) {
  // Lưu baseSpeed 1 lần
  if (!player.baseSpeed) player.baseSpeed = player.speed;

  // RESET mỗi frame (QUAN TRỌNG)
  player.speed = player.baseSpeed;

  for (let i = state.elementalZones.length - 1; i >= 0; i--) {
    let z = state.elementalZones[i];

    z.life--;
    z.tick++;

    if (z.life <= 0) {
      state.elementalZones.splice(i, 1);
      continue;
    }

    let d = dist(player.x, player.y, z.x, z.y);

    if (d < z.radius) {
      applyZoneEffect(z, player);
    }
  }

  // ===== SLOW CAP =====
  const minSpeed = player.baseSpeed * 0.4; // không chậm quá 40%

  if (player.speed < minSpeed) {
    player.speed = minSpeed;
  }

  // chống NaN
  if (!isFinite(player.speed)) {
    player.speed = player.baseSpeed;
  }

  handleZoneInteractions();
}

// ================= EFFECT =================

function applyZoneEffect(zone, player) {
  switch (zone.element) {
    case "fire":
      player.hp -= 0.02;
      break;

    case "ice":
      player.speed *= 0.5;
      break;

    case "lightning":
      if (zone.tick % 20 === 0) {
        state.playerStatus.stunTimer = Math.max(
          state.playerStatus.stunTimer || 0,
          5,
        );
      }
      break;

    case "wind":
      let dx = player.x - zone.x;
      let dy = player.y - zone.y;
      let len = Math.hypot(dx, dy) || 1;
      player.x += (dx / len) * 2;
      player.y += (dy / len) * 2;
      break;

    case "earth":
      player.speed *= 0.5;
      break;
  }
}

// ================= REACTION =================

function handleZoneInteractions() {
  for (let i = 0; i < state.elementalZones.length; i++) {
    for (let j = i + 1; j < state.elementalZones.length; j++) {
      let a = state.elementalZones[i];
      let b = state.elementalZones[j];

      let d = dist(a.x, a.y, b.x, b.y);

      if (d < a.radius + b.radius) {
        // FIRE + ICE = cancel
        if (
          (a.element === "fire" && b.element === "ice") ||
          (a.element === "ice" && b.element === "fire")
        ) {
          a.life = 0;
          b.life = 0;
        }

        // FIRE + WIND = spread
        if (
          (a.element === "fire" && b.element === "wind") ||
          (b.element === "fire" && a.element === "wind")
        ) {
          a.radius += 0.5;
          b.radius += 0.5;
        }

        // LIGHTNING + ICE = shock freeze
        if (
          (a.element === "lightning" && b.element === "ice") ||
          (b.element === "lightning" && a.element === "ice")
        ) {
          a.damageBoost = true;
          b.damageBoost = true;
        }
      }
    }
  }
}
