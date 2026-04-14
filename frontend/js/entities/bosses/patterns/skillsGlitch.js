import { state } from "../../../state.js";
import { spawnWarning, spawnHazard, spawnBullet } from "../../helpers.js";
import { activateShield, fireAngle, ring, fan, aim } from "./patternHelpers.js";

export const GLITCH_SKILLS = {
  GLITCH_MEMORY_LEAK: (boss) => {
    activateShield(boss, 150);
    for (let i = 0; i < 15; i++) {
      state.delayedTasks.push({
        delay: i * 8,
        action: () => {
          let a = (i * Math.PI * 2) / 15 + state.frameCount * 0.01;
          fireAngle(boss.x, boss.y, a, 14, "boss", 2.5);
          if (i % 3 === 0) {
            fireAngle(boss.x, boss.y, aim(boss), 17, "boss", 5);
          }
        },
      });
    }
  },

  GLITCH_SYNTAX_ERROR: (boss) => {
    activateShield(boss, 150);
    for (let i = 0; i < 8; i++) {
      // Đảm bảo box không spawn ngay trên đầu player (min 150px)
      let px, py;
      do {
        px = state.player.x + (Math.random() - 0.5) * 800;
        py = state.player.y + (Math.random() - 0.5) * 800;
      } while (Math.hypot(px - state.player.x, py - state.player.y) < 150);

      // Dùng "spike" thay "laser" → CHỈ làm chậm, KHÔNG gây burn/damage trong phase cảnh báo
      spawnWarning(px, py, 60, 45, "spike");
      state.delayedTasks.push({
        delay: 45,
        action: () => {
          spawnHazard("error_box", px, py, 60, 120, 0.8, "boss");
          state.screenShake.timer = 5;
          state.screenShake.intensity = 5;
        },
      });
    }
  },

  GLITCH_FIREWALL_BREACH: (boss) => {
    activateShield(boss, 180);
    let px = state.player.x;
    let py = state.player.y;
    spawnWarning(px, py - 300, 300, 60, "laser");
    spawnWarning(px, py + 300, 300, 60, "laser");
    state.delayedTasks.push({
      delay: 60,
      action: () => {
        spawnHazard("pixel_wall", px, py - 300, 300, 200, 1.5, "boss");
        spawnHazard("pixel_wall", px, py + 300, 300, 200, 1.5, "boss");
        state.screenShake.timer = 10;
        state.screenShake.intensity = 8;
      },
    });
  },

  GLITCH_TROJAN_HORSE: (boss) => {
    activateShield(boss, 120);
    for (let i = 0; i < 12; i++) {
      state.delayedTasks.push({
        delay: i * 8,
        action: () => {
          let a = aim(boss) + Math.sin(i) * 0.5;
          fireAngle(boss.x, boss.y, a, 15, "boss", 1.5);
        },
      });
    }
  },

  GLITCH_BUFFER_OVERFLOW: (boss) => {
    activateShield(boss, 150);
    for (let i = 0; i < 50; i++) {
      state.delayedTasks.push({
        delay: i * 3,
        action: () => fireAngle(boss.x, boss.y, i * 0.2, 12, "boss", 1.5),
      });
    }
  },

  GLITCH_DEAD_PIXEL_STORM: (boss) => {
    activateShield(boss, 150);
    for (let i = 0; i < 60; i++) {
      state.delayedTasks.push({
        delay: i * 2,
        action: () => {
          let sx = state.camera.x + Math.random() * 1536;
          spawnBullet(sx, state.camera.y - 50, sx, state.camera.y + 800, false, 11, "boss", 1);
        },
      });
    }
  },

  GLITCH_PACKET_LOSS: (boss) => {
    activateShield(boss, 150);
    for (let wave = 0; wave < 3; wave++) {
      state.delayedTasks.push({
        delay: wave * 25,
        action: () => {
          let centerA = aim(boss);
          for (let i = -3; i <= 3; i++) {
            fireAngle(boss.x, boss.y, centerA + i * 0.2, 13, "boss", 3 + wave);
          }
        },
      });
    }
  },

  GLITCH_DDOS_ATTACK: (boss) => {
    activateShield(boss, 200);
    for (let i = 0; i < 20; i++) {
      state.delayedTasks.push({
        delay: i * 8,
        action: () => {
          let px = state.player.x + (Math.random() - 0.5) * 500;
          let py = state.player.y + (Math.random() - 0.5) * 500;
          spawnHazard("binary_rain", px, py, 120, 180, 2, "boss");
          if (i % 5 === 0) {
            state.screenShake.timer = 2;
            state.screenShake.intensity = 3;
          }
        },
      });
    }
  },

  GLITCH_FATAL_EXCEPTION: (boss) => {
    activateShield(boss, 120);
    for (let i = 0; i < 12; i++) {
      let angle = (i * Math.PI * 2) / 12;
      fireAngle(boss.x, boss.y, angle, 16, "boss", 2);
      state.delayedTasks.push({
        delay: 30,
        action: () => fireAngle(boss.x, boss.y, angle + 0.1, 11, "boss", 4),
      });
    }
    state.screenShake.timer = 15;
    state.screenShake.intensity = 10;
  },

  GLITCH_CORRUPTED_SECTOR: (boss) => {
    activateShield(boss, 150);
    let px = state.player.x;
    let py = state.player.y;
    let s = 250;
    spawnHazard("corrupt_laser", px - s, py, s, 180, 2, "boss");
    spawnHazard("corrupt_laser", px + s, py, s, 180, 2, "boss");
    spawnHazard("corrupt_laser", px, py - s, s, 180, 2, "boss");
    spawnHazard("corrupt_laser", px, py + s, s, 180, 2, "boss");
    for (let i = 0; i < 20; i++) {
      state.delayedTasks.push({
        delay: 60 + i * 5,
        action: () => fireAngle(boss.x, boss.y, aim(boss) + (Math.random() - 0.5) * 0.5, 17, "boss", 1.5),
      });
    }
  },

  ENTITY_KERNEL_PANIC: (boss) => {
    boss.ultimatePhase = true;
    state.glitch.matrixMode = true;
    state.screenShake.timer = 300;
    state.screenShake.intensity = 8;
    boss.x = 400;
    boss.y = 300;

    for (let i = 0; i < 300; i++) {
      state.delayedTasks.push({
        delay: i,
        action: () => {
          if (i % 5 === 0) {
            for (let j = 0; j < 8; j++) {
              let angle = (j * Math.PI) / 4 + i * 0.02;
              state.bullets.push({
                x: boss.x, y: boss.y,
                vx: Math.cos(angle) * 7, vy: Math.sin(angle) * 7,
                isPlayer: false, radius: 12, life: 200,
                style: 12, damage: 2,
              });
            }
          }
          if (Math.random() < 0.05) state.cinematicEffects.fogAlpha = 0.8;
          else state.cinematicEffects.fogAlpha = 0;
        },
      });
    }
  },
};
