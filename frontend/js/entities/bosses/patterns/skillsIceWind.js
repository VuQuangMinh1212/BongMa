import { state } from "../../../state.js";
import { spawnWarning, spawnHazard, spawnSafeZone, spawnBeam } from "../../helpers.js";
import { activateShield, ring, fan, aim, TAU } from "./patternHelpers.js";

export const ICE_WIND_SKILLS = {
  // ==========================================
  // ❄️ ICE BOSS
  // ==========================================
  "Frost Nova": (boss) => {
    activateShield(boss, 100);
    ring(boss.x, boss.y, 36, 0, 2);
    spawnHazard("frost", boss.x, boss.y, 300, 240);
  },

  "Icicle Rain": (boss) => {
    activateShield(boss, 120);
    for (let i = 0; i < 40; i++) {
      state.delayedTasks.push({
        delay: i * 4,
        action: () => {
          const rx = state.camera.x + Math.random() * 1536;
          state.bullets.push({
            x: rx, y: state.camera.y + 15,
            vx: 0, vy: 8,
            radius: 8, life: 120,
            isPlayer: false, style: 2, damage: 1,
          });
        },
      });
    }
  },

  "Blizzard Barrage": (boss) => {
    activateShield(boss, 150);
    for (let wave = 0; wave < 3; wave++) {
      for (let i = 0; i < 12; i++) {
        state.delayedTasks.push({
          delay: wave * 15 + i * 8,
          action: () => {
            const angle = aim(boss) + (wave - 1) * 0.35 + Math.sin(i * 0.5) * 0.15;
            const speed = 7 - wave * 0.5;
            state.bullets.push({
              x: boss.x, y: boss.y,
              vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
              isPlayer: false, radius: 9, life: 180,
              style: 2, damage: 1,
            });
          },
        });
      }
    }
  },

  "Frozen Wall": (boss) => {
    activateShield(boss, 140);
    const gapX = state.player.x;
    for (let row = 0; row < 3; row++) {
      const rowY = state.camera.y + 100 + row * 260;
      for (let x = state.camera.x; x < state.camera.x + 1600; x += 70) {
        if (Math.abs(x - gapX) < 130) continue; 
        const wx = x;
        const wy = rowY;
        spawnWarning(wx, wy, 30, 50 + row * 10, "ice_warn");
        state.delayedTasks.push({
          delay: 50 + row * 10,
          action: () => {
            spawnHazard("frost", wx, wy, 30, 240, 0.6, "boss");
            state.screenShake.timer = 3;
            state.screenShake.intensity = 4;
          },
        });
      }
    }
  },

  "Permafrost": (boss) => {
    activateShield(boss, 100);
    const cx = state.player.x;
    const cy = state.player.y;
    spawnWarning(cx, cy, 200, 60, "ice_warn");
    state.delayedTasks.push({
      delay: 60,
      action: () => {
        spawnHazard("frost", cx, cy, 200, 300, 0, "boss");
        state.playerStatus = state.playerStatus || {};
        state.playerStatus.slowTimer = 180;
        state.screenShake.timer = 10;
        state.screenShake.intensity = 6;
      },
    });
  },

  "GLACIAL AGE": (boss) => {
    boss.ultimatePhase = true;
    state.globalHazard = { type: "ice", active: true, timer: 600, damage: 0.8, graceTimer: 90 };
    spawnSafeZone(boss.x, boss.y, 300, 600, {
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
    });
    for (let i = 0; i < 20; i++) {
      state.delayedTasks.push({
        delay: i * 30,
        action: () => spawnHazard(
          "frost",
          state.camera.x + Math.random() * 1536,
          state.camera.y + Math.random() * 864,
          60 + Math.random() * 40,
          180,
        ),
      });
    }
  },

  // ==========================================
  // 🌪️ WIND BOSS
  // ==========================================
  "Cyclone Barrage": (boss) => {
    activateShield(boss, 80);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * TAU;
      spawnHazard("vortex", boss.x + Math.cos(a) * 200, boss.y + Math.sin(a) * 200, 80, 480);
    }
  },

  "Vacuum Wave": (boss) => {
    activateShield(boss, 100);
    spawnHazard("vortex", boss.x, boss.y, 400, 300);
    for (let i = 0; i < 5; i++) {
      state.delayedTasks.push({
        delay: i * 20,
        action: () => fan(boss.x, boss.y, aim(boss), 7, 0.2, 4),
      });
    }
  },

  "Blade Gale": (boss) => {
    activateShield(boss, 120);
    for (let i = 0; i < 12; i++) {
      state.delayedTasks.push({
        delay: i * 8,
        action: () => {
          const baseAngle = (i / 12) * TAU;
          state.bullets.push({
            x: boss.x, y: boss.y,
            vx: Math.cos(baseAngle) * 7, vy: Math.sin(baseAngle) * 7,
            isPlayer: false, radius: 10, life: 160,
            style: 4, damage: 1, bounces: 1,
          });
          state.bullets.push({
            x: boss.x, y: boss.y,
            vx: Math.cos(-baseAngle + 0.3) * 4.5, vy: Math.sin(-baseAngle + 0.3) * 4.5,
            isPlayer: false, radius: 8, life: 200,
            style: 4, damage: 0.8,
          });
        },
      });
    }
  },

  "Typhoon Eye": (boss) => {
    activateShield(boss, 100);
    const eyeX = state.player.x;
    const eyeY = state.player.y;
    spawnWarning(eyeX, eyeY, 200, 40, "wind_warn");
    state.delayedTasks.push({
      delay: 40,
      action: () => {
        spawnHazard("vortex", eyeX, eyeY, 300, 180, 0, "boss");
        state.screenShake.timer = 10;
        state.screenShake.intensity = 8;
        state.delayedTasks.push({
          delay: 180,
          action: () => ring(eyeX, eyeY, 20, 0, 4, "boss", 1.2),
        });
      },
    });
  },

  "Air Shatter": (boss) => {
    activateShield(boss, 90);
    const baseAngle = aim(boss);
    for (let i = 0; i < 20; i++) {
      const a = baseAngle + (i / 20) * TAU;
      state.bullets.push({
        x: boss.x, y: boss.y,
        vx: Math.cos(a) * 5.5, vy: Math.sin(a) * 5.5,
        isPlayer: false, radius: 9, life: 150,
        style: 4, damage: 0.8, splitAt: 75,
      });
    }
  },

  HURRICANE: (boss) => {
    boss.ultimatePhase = true;
    state.globalHazard = { type: "wind", active: true, timer: 600, damage: 0.5, graceTimer: 90 };
    state.screenShake.timer = 600;
    state.screenShake.intensity = 5;
    state.screenShake.type = "wind";
    spawnSafeZone(state.player.x, state.player.y, 250, 600, { vx: 1.2, vy: 0 });
  },
};
