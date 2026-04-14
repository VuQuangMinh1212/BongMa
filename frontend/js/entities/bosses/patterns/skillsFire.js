import { state } from "../../../state.js";
import { spawnWarning, spawnHazard, spawnMeteor, spawnSafeZone } from "../../helpers.js";
import { activateShield, ring } from "./patternHelpers.js";

export const FIRE_SKILLS = {
  "Meteor Strike": (boss) => {
    const count = 7;
    for (let i = 0; i < count; i++) {
      state.delayedTasks.push({
        delay: i * 15,
        action: () => {
          const tx = state.player.x + (Math.random() - 0.5) * 150;
          const ty = state.player.y + (Math.random() - 0.5) * 150;
          spawnWarning(tx, ty, 70, 90, "fire_warn");
          state.delayedTasks.push({
            delay: 90,
            action: () => spawnMeteor(tx, state.camera.y - 300, tx, ty),
          });
        },
      });
    }
  },

  "Inferno Pulse": (boss) => {
    activateShield(boss, 120);
    for (let i = 0; i < 8; i++) {
      state.delayedTasks.push({
        delay: i * 15,
        action: () => {
          const px = i % 2 === 0
            ? state.player.x + (Math.random() - 0.5) * 200
            : boss.x + (Math.random() - 0.5) * 300;
          const py = i % 2 === 0
            ? state.player.y + (Math.random() - 0.5) * 200
            : boss.y + (Math.random() - 0.5) * 300;
          spawnWarning(px, py, 65, 60, "fire_warn");
          state.delayedTasks.push({
            delay: 60,
            action: () => {
              spawnHazard("fire", px, py, 10, 240, 0.5, "boss", 75);
              state.screenShake.timer = 8;
              state.screenShake.intensity = 6;
              state.screenShake.type = "earth";
            },
          });
        },
      });
    }
  },

  "Flame Pillar": (boss) => {
    activateShield(boss, 120);
    const baseAngle = Math.atan2(state.player.y - boss.y, state.player.x - boss.x);
    for (let i = -2; i <= 2; i++) {
      const a = baseAngle + i * 0.28;
      for (let j = 0; j < 6; j++) {
        const dist = 80 + j * 80;
        const wx = boss.x + Math.cos(a) * dist;
        const wy = boss.y + Math.sin(a) * dist;
        spawnWarning(wx, wy, 40, 50 + j * 5, "fire_warn");
        state.delayedTasks.push({
          delay: 50 + j * 5,
          action: () => {
            spawnHazard("fire", wx, wy, 10, 180, 0.8, "boss", 45);
            state.screenShake.timer = 3;
            state.screenShake.intensity = 5;
          },
        });
      }
    }
  },

  "Magma Splash": (boss) => {
    activateShield(boss, 90);
    const startAngle = Math.atan2(state.player.y - boss.y, state.player.x - boss.x);
    for (let i = 0; i < 8; i++) {
      state.delayedTasks.push({
        delay: i * 12,
        action: () => {
          const a = startAngle + i * 0.8;
          const speed = 6 + i * 0.4;
          state.bullets.push({
            x: boss.x, y: boss.y,
            vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
            isPlayer: false, radius: 14, life: 80,
            style: 1, damage: 1.2, isMagma: true,
          });
        },
      });
    }
  },

  "Eruption Wall": (boss) => {
    activateShield(boss, 150);
    const gapStart = state.player.x - 150;
    const gapEnd = state.player.x + 150;
    const wallY = state.player.y - 200;
    for (let x = state.camera.x; x < state.camera.x + 1600; x += 80) {
      if (x > gapStart && x < gapEnd) continue;
      spawnWarning(x, wallY, 35, 60, "fire_warn");
      state.delayedTasks.push({
        delay: 60,
        action: () => {
          spawnHazard("fire", x, wallY, 10, 200, 1, "boss", 40);
          state.screenShake.timer = 4;
          state.screenShake.intensity = 6;
        },
      });
    }
  },

  SUPERNOVA: (boss) => {
    state.screenShake.timer = 200;
    state.screenShake.intensity = 10;
    state.screenShake.type = "wind";
    boss.ultimatePhase = true;
    state.globalHazard = { type: "fire", active: true, timer: 600, damage: 1.0, graceTimer: 90 };

    spawnSafeZone(state.player.x - 400, state.player.y - 200, 250, 600, { vx: 1.5, vy: 1, shrinking: false });
    spawnSafeZone(state.player.x + 200, state.player.y + 100, 250, 600, { vx: -1.5, vy: -1, shrinking: false });
  },
};
