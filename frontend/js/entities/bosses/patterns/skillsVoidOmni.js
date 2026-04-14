import { state } from "../../../state.js";
import { spawnWarning, spawnHazard, spawnBeam, spawnMeteor, spawnSafeZone } from "../../helpers.js";
import { activateShield, fireAngle, ring, fan, aim } from "./patternHelpers.js";

export const VOID_OMNI_SKILLS = {
  // ==========================================
  // 🌌 VOID (HƯ KHÔNG)
  // ==========================================
  ABYSSAL_RIFT: (boss) => {
    activateShield(boss, 150);
    for (let i = 0; i < 4; i++) {
      state.delayedTasks.push({
        delay: i * 20,
        action: () => {
          const px = state.player.x + (Math.random() - 0.5) * 400;
          const py = state.player.y + (Math.random() - 0.5) * 400;
          spawnWarning(px, py, 80, 45, "void_warn");
          state.delayedTasks.push({
            delay: 45,
            action: () => {
              ring(px, py, 12, 0, 10, "boss", 2);
              state.screenShake.timer = 5;
              state.screenShake.intensity = 8;
            },
          });
        },
      });
    }
  },

  DARK_MATTER_BEAM: (boss) => {
    activateShield(boss, 150);
    let startAngle = aim(boss) - 0.5;
    for (let i = 0; i < 15; i++) {
      state.delayedTasks.push({
        delay: i * 4,
        action: () => {
          let a = startAngle + i * 0.08;
          spawnBeam(boss.x, boss.y, boss.x + Math.cos(a) * 2000, boss.y + Math.sin(a) * 2000, 20, 30);
          state.screenShake.timer = 5;
          state.screenShake.intensity = 5;
        },
      });
    }
  },

  GRAVITY_CRUSH: (boss) => {
    activateShield(boss, 120);
    let px = state.player.x;
    let py = state.player.y;
    spawnWarning(px, py, 150, 60, "void_warn");
    state.delayedTasks.push({
      delay: 60,
      action: () => {
        spawnHazard("void_crush", px, py, 150, 120, 1.5, "boss");
        state.screenShake.timer = 15;
        state.screenShake.intensity = 15;
        ring(px, py, 16, 0, 10, "boss", 1.5);
      },
    });
  },

  ECLIPSE_RING: (boss) => {
    activateShield(boss, 120);
    for (let i = 0; i < 5; i++) {
      state.delayedTasks.push({
        delay: i * 20,
        action: () => ring(boss.x, boss.y, 24, i * 0.1, 10, "boss", 1),
      });
    }
  },

  COSMIC_FRACTURE: (boss) => {
    activateShield(boss, 150);
    for (let i = 0; i < 4; i++) {
      state.delayedTasks.push({
        delay: i * 15,
        action: () => {
          let lx = state.player.x + (Math.random() - 0.5) * 600;
          let ly = state.player.y + (Math.random() - 0.5) * 600;
          spawnWarning(lx, ly, 60, 45, "void_warn");
          state.delayedTasks.push({
            delay: 45,
            action: () => {
              spawnHazard("void_rift", lx, ly, 60, 180, 1, "boss");
              state.screenShake.timer = 8;
              state.screenShake.intensity = 8;
            },
          });
        },
      });
    }
  },

  STAR_DEVOURER: (boss) => {
    activateShield(boss, 180);
    let angle = aim(boss);
    let devX = boss.x + Math.cos(angle) * 100;
    let devY = boss.y + Math.sin(angle) * 100;
    spawnHazard("void_devourer", devX, devY, 100, 300, 1, "boss");
  },

  SINGULARITY_BOMB: (boss) => {
    activateShield(boss, 150);
    spawnWarning(boss.x, boss.y, 180, 60, "void_warn");
    state.delayedTasks.push({
      delay: 60,
      action: () => {
        spawnHazard("void_crush", boss.x, boss.y, 180, 60, 0, "boss");
        state.delayedTasks.push({
          delay: 60,
          action: () => {
            ring(boss.x, boss.y, 24, 0, 10, "boss", 2);
            ring(boss.x, boss.y, 16, Math.PI / 12, 10, "boss", 1.5);
            spawnHazard("void_rift", boss.x, boss.y, 120, 120, 1.2, "boss");
            state.screenShake.timer = 20;
            state.screenShake.intensity = 15;
          },
        });
      },
    });
  },

  NULL_ZONE: (boss) => {
    activateShield(boss, 120);
    const cx = state.player.x;
    const cy = state.player.y;
    spawnWarning(cx, cy, 250, 45, "void_warn");
    state.delayedTasks.push({
      delay: 45,
      action: () => {
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2;
          const rx = cx + Math.cos(a) * 200;
          const ry = cy + Math.sin(a) * 200;
          spawnHazard("void_rift", rx, ry, 70, 240, 0.8, "boss");
        }
        spawnHazard("vortex", cx, cy, 250, 180, 0, "boss");
        state.screenShake.timer = 10;
        state.screenShake.intensity = 8;
      },
    });
  },

  EVENT_HORIZON: (boss) => {
    boss.ultimatePhase = true;
    state.screenShake.timer = 600;
    state.screenShake.intensity = 8;
    state.globalHazard = { type: "electric", active: true, timer: 600, damage: 1.5, graceTimer: 90 };
    spawnSafeZone(
      state.camera.x + 200 + Math.random() * 1100,
      state.camera.y + 200 + Math.random() * 400,
      200, 600,
      { shrinking: false, vx: 0.5, vy: 0.5 },
    );
    for (let i = 0; i < 150; i++) {
      state.delayedTasks.push({
        delay: i * 4,
        action: () => {
          fireAngle(boss.x, boss.y, i * 0.13, 10, "boss", 1.5);
          fireAngle(boss.x, boss.y, -i * 0.13 + Math.PI, 10, "boss", 1.5);
        },
      });
    }
  },

  // ==========================================
  // 👑 OMNI (CHÚA TỂ NGUYÊN TỐ)
  // ==========================================
  Omni_SpatialMatrix: (boss) => {
    activateShield(boss, 150);
    let px = state.player.x;
    let py = state.player.y;
    let s = 130;
    spawnBeam(px - s, py - s, px + s, py - s, 30, 40);
    spawnBeam(px - s, py + s, px + s, py + s, 30, 40);
    spawnBeam(px - s, py - s, px - s, py + s, 30, 40);
    spawnBeam(px + s, py - s, px + s, py + s, 30, 40);
    spawnHazard("frost", px, py, s, 90, 0, "boss");
    spawnHazard("vortex", px, py, s * 1.5, 90, 0, "boss");
    state.delayedTasks.push({
      delay: 40,
      action: () => {
        spawnHazard("fire", px, py, s - 10, 60, 1.0, "boss");
        state.screenShake.timer = 15;
        state.screenShake.intensity = 12;
        state.screenShake.type = "earth";
        for (let j = 0; j < 12; j++) {
          let angle = (j / 12) * Math.PI * 2;
          state.bullets.push({
            x: px, y: py,
            vx: Math.cos(angle) * 7, vy: Math.sin(angle) * 7,
            isPlayer: false, radius: 12, life: 150,
            style: (j % 4) + 1, damage: 1.5,
          });
        }
      },
    });
  },

  Omni_PrismaticMeteors: (boss) => {
    activateShield(boss, 150);
    spawnHazard("vortex", state.player.x, state.player.y, 800, 150, 0, "boss");
    for (let i = 0; i < 4; i++) {
      state.delayedTasks.push({
        delay: i * 30,
        action: () => {
          let tx = state.player.x;
          let ty = state.player.y;
          spawnWarning(tx, ty, 70, 45, "omni_warn");
          for (let k = 0; k < 2; k++) {
            let lx = tx + (Math.random() - 0.5) * 200;
            let ly = ty + (Math.random() - 0.5) * 200;
            spawnWarning(lx, ly, 45, 30, "omni_warn");
            state.delayedTasks.push({
              delay: 30,
              action: () => {
                spawnBeam(boss.x, boss.y, lx, ly, 10, 10);
                state.screenShake.timer = 5;
                state.screenShake.intensity = 5;
                state.screenShake.type = "thunder";
              },
            });
          }
          state.delayedTasks.push({
            delay: 45,
            action: () => {
              spawnMeteor(tx, state.camera.y - 300, tx, ty);
              state.delayedTasks.push({
                delay: 18,
                action: () => {
                  spawnHazard("frost", tx, ty, 80, 120, 0, "boss");
                  state.screenShake.timer = 8;
                  state.screenShake.intensity = 8;
                  state.screenShake.type = "earth";
                  for (let j = 0; j < 8; j++) {
                    let angle = (j / 8) * Math.PI * 2;
                    state.bullets.push({
                      x: tx, y: ty,
                      vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5,
                      isPlayer: false, radius: 10, life: 150,
                      style: (j % 4) + 1, damage: 1,
                    });
                  }
                },
              });
            },
          });
        },
      });
    }
  },

  Omni_MirageAssault: (boss) => {
    activateShield(boss, 180);
    const elements = [
      { style: 1, hazard: "fire", color: "#ff4400" },
      { style: 2, hazard: "frost", color: "#00ffff" },
      { style: 4, hazard: "vortex", color: "#00ffcc" },
      { style: 3, hazard: "static", color: "#ffff00" },
    ];
    for (let i = 0; i < 4; i++) {
      state.delayedTasks.push({
        delay: i * 25,
        action: () => {
          let px = state.player.x;
          let py = state.player.y;
          let angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
          boss.x = px + Math.cos(angle) * 250;
          boss.y = py + Math.sin(angle) * 250;
          boss.color = elements[i].color;
          spawnBeam(boss.x, boss.y, px, py, 12, 10);
          if (i % 2 === 0) {
            fan(boss.x, boss.y, Math.atan2(py - boss.y, px - boss.x), 7, 0.2, elements[i].style, "boss", 1.5);
          } else {
            ring(boss.x, boss.y, 16, 0, elements[i].style, "boss", 1.5);
          }
          spawnHazard(elements[i].hazard, boss.x, boss.y, 60, 180, 1, "boss");
          state.screenShake.timer = 4;
          state.screenShake.intensity = 5;
        },
      });
    }
    state.delayedTasks.push({
      delay: 115,
      action: () => {
        boss.x = 400;
        boss.y = 300;
        boss.color = boss.originalColor;
        for (let j = 0; j < 4; j++) {
          ring(boss.x, boss.y, 12, j * (Math.PI / 24), elements[j].style, "boss", 2);
        }
        spawnHazard("static", state.player.x, state.player.y, 150, 45, 1.5, "boss");
        state.screenShake.timer = 20;
        state.screenShake.intensity = 15;
        state.screenShake.type = "thunder";
      },
    });
  },

  Omni_EternalCarousel: (boss) => {
    activateShield(boss, 180);
    boss.x = 400;
    boss.y = 300;
    spawnHazard("vortex", boss.x, boss.y, 800, 150, 0, "boss");
    for (let i = 0; i < 120; i++) {
      state.delayedTasks.push({
        delay: i,
        action: () => {
          let angle = i * 0.05;
          spawnBeam(boss.x, boss.y, boss.x + Math.cos(angle) * 1000, boss.y + Math.sin(angle) * 1000, 2, 5);
          spawnBeam(boss.x, boss.y, boss.x + Math.cos(angle + Math.PI / 2) * 1000, boss.y + Math.sin(angle + Math.PI / 2) * 1000, 2, 5);
          spawnBeam(boss.x, boss.y, boss.x + Math.cos(angle + Math.PI) * 1000, boss.y + Math.sin(angle + Math.PI) * 1000, 2, 5);
          spawnBeam(boss.x, boss.y, boss.x + Math.cos(angle + Math.PI * 1.5) * 1000, boss.y + Math.sin(angle + Math.PI * 1.5) * 1000, 2, 5);
          if (i % 15 === 0) ring(boss.x, boss.y, 8, -angle, 2, "boss", 1);
          if (i % 20 === 0) {
            state.bullets.push({
              x: boss.x, y: boss.y,
              vx: Math.cos(angle + Math.PI / 4) * 4, vy: Math.sin(angle + Math.PI / 4) * 4,
              isPlayer: false, radius: 10, life: 300, style: 1, damage: 1, bounces: 1,
            });
          }
        },
      });
    }
  },

  OMNI_DOOMSDAY_ARENA: (boss) => {
    boss.ultimatePhase = true;
    state.screenShake.timer = 150;
    state.screenShake.intensity = 12;
    boss.x = 400;
    boss.y = 300;
    let r = 280;
    for (let i = 0; i < 8; i++) {
      let angle1 = (i / 8) * Math.PI * 2;
      let angle2 = ((i + 1) / 8) * Math.PI * 2;
      spawnBeam(
        boss.x + Math.cos(angle1) * r, boss.y + Math.sin(angle1) * r,
        boss.x + Math.cos(angle2) * r, boss.y + Math.sin(angle2) * r,
        45, 180,
      );
    }
    spawnHazard("vortex", boss.x, boss.y, 800, 180, 0, "boss");
    for (let w = 0; w < 6; w++) {
      state.delayedTasks.push({
        delay: 45 + w * 25,
        action: () => {
          let offset = w % 2 === 0 ? 0 : Math.PI / 16;
          for (let i = 0; i < 16; i++) {
            let angle = offset + (i / 16) * Math.PI * 2;
            state.bullets.push({
              x: boss.x, y: boss.y,
              vx: Math.cos(angle) * 6, vy: Math.sin(angle) * 6,
              isPlayer: false, radius: 12, life: 150,
              style: (i % 4) + 1, damage: 1.5,
            });
          }
          state.screenShake.timer = 6;
          state.screenShake.intensity = 10;
        },
      });
    }
  },
};
