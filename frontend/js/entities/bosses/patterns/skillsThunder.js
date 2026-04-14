import { state } from "../../../state.js";
import { spawnWarning, spawnHazard, spawnBeam, spawnSafeZone } from "../../helpers.js";
import { activateShield, ring, aim } from "./patternHelpers.js";

export const THUNDER_SKILLS = {
  "Tesla Field": (boss) => {
    activateShield(boss, 150);
    const px = state.player.x;
    const py = state.player.y;
    const nodeCount = 6;
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const hx = px + Math.cos(angle) * 130;
      const hy = py + Math.sin(angle) * 130;
      spawnWarning(hx, hy, 45, 60, "thunder_warn");
      state.delayedTasks.push({
        delay: 60,
        action: () => spawnHazard("static", hx, hy, 45, 300, 0.5, "boss"),
      });
    }
    state.delayedTasks.push({
      delay: 75,
      action: () => {
        spawnBeam(boss.x, boss.y, px, py, 45, 40);
        state.screenShake.timer = 15;
        state.screenShake.intensity = 8;
        state.screenShake.type = "thunder";
      },
    });
  },

  "Chain Lightning": (boss) => {
    activateShield(boss, 120);
    const totalStrikes = 5;
    for (let i = 0; i < totalStrikes; i++) {
      state.delayedTasks.push({
        delay: i * 25,
        action: () => {
          const px = state.player.x + (Math.random() - 0.5) * 60;
          const py = state.player.y + (Math.random() - 0.5) * 60;
          spawnBeam(boss.x, boss.y, px, py, 15, 10);
          state.delayedTasks.push({
            delay: 25,
            action: () => {
              ring(px, py, 6, Math.random() * Math.PI, 3, "boss", 0.5);
              state.screenShake.timer = 5;
              state.screenShake.intensity = 4;
              state.screenShake.type = "thunder";
            },
          });
        },
      });
    }
  },

  "Ball Lightning": (boss) => {
    activateShield(boss, 120);
    const angles = [0, Math.PI * 2 / 3, Math.PI * 4 / 3];
    angles.forEach((a, idx) => {
      state.delayedTasks.push({
        delay: idx * 15,
        action: () => {
          state.bullets.push({
            x: boss.x, y: boss.y,
            vx: Math.cos(a) * 5, vy: Math.sin(a) * 5,
            isPlayer: false, radius: 18, life: 300,
            style: 3, damage: 1, bounces: 5,
            isBallLightning: true,
          });
        },
      });
    });
    spawnHazard("static", boss.x, boss.y, 80, 120, 0.3, "boss");
    state.screenShake.timer = 8;
    state.screenShake.intensity = 5;
    state.screenShake.type = "thunder";
  },

  "EMP Burst": (boss) => {
    activateShield(boss, 100);
    spawnWarning(boss.x, boss.y, 250, 50, "thunder_warn");
    state.delayedTasks.push({
      delay: 50,
      action: () => {
        state.player.shield = 0;
        state.playerStatus = state.playerStatus || {};
        state.playerStatus.stunTimer = Math.max(state.playerStatus.stunTimer || 0, 30);
        ring(boss.x, boss.y, 24, 0, 3, "boss", 1);
        spawnHazard("static", boss.x, boss.y, 250, 90, 0.6, "boss");
        state.screenShake.timer = 20;
        state.screenShake.intensity = 10;
        state.screenShake.type = "thunder";
      },
    });
  },

  "Ionized Field": (boss) => {
    activateShield(boss, 120);
    spawnWarning(state.player.x, state.player.y, 120, 45, "thunder_warn");
    state.delayedTasks.push({
      delay: 45,
      action: () => {
        spawnHazard("static", state.player.x, state.player.y, 120, 480, 0.5, "boss");
        spawnBeam(boss.x, boss.y, state.player.x, state.player.y, 20, 15);
        state.screenShake.timer = 10;
        state.screenShake.intensity = 6;
      },
    });
    for (let i = 1; i <= 3; i++) {
      state.delayedTasks.push({
        delay: 45 + i * 120,
        action: () => {
          spawnWarning(state.player.x, state.player.y, 100, 30, "thunder_warn");
          state.delayedTasks.push({
            delay: 30,
            action: () => spawnHazard("static", state.player.x, state.player.y, 100, 240, 0.5, "boss"),
          });
        },
      });
    }
  },

  "HEAVEN'S WRATH": (boss) => {
    boss.ultimatePhase = true;
    state.screenShake.timer = 600;
    state.screenShake.intensity = 8;
    state.screenShake.type = "thunder";
    state.globalHazard = { type: "electric", active: true, timer: 600, damage: 1.5, graceTimer: 90 };
    spawnSafeZone(
      state.camera.x + Math.random() * 1536,
      state.camera.y + Math.random() * 864,
      250, 600,
      { vx: 1, vy: 1 },
    );
  },
};
