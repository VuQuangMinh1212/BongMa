import { state } from "../state.js";
import { UI } from "../ui.js";

const EVOLUTIONS = {
  speed: {
    mode: "FLASH_OVERDRIVE",
    effect: (player) => {
      player.speed *= 3;
      player.contactDamage = true;
    },
  },
  fire: {
    mode: "LEAD_HURRICANE",
    effect: (player) => {
      player.fireRate = Math.max(1, player.fireRate / 3);
      player.noReload = true;
    },
  },
  multi: {
    mode: "APOCALYPSE_SPREAD",
    effect: (player) => {
      player.multiShot += 5;
      player.spreadAngle = 45;
    },
  },
  bounce: {
    mode: "INFINITY_PINBALL",
    effect: (player) => {
      player.bounces = 10;
    },
  },
  dash: {
    mode: "EXECUTION_DRIVE",
    effect: (player) => {
      player.dashDamage = 50;
      player.dashRadius = 100;

      player.dashEffect = () => {
        state.ghosts.forEach((ghost, index) => {
          if (ghost.x < 0) return;
          const dx = ghost.x - player.x;
          const dy = ghost.y - player.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d <= player.dashRadius) {
            ghost.isStunned = 300;
            if (state.isBossLevel) state.ghosts.splice(index, 1);
          }
        });

        if (state.boss) {
          const dx = state.boss.x - player.x;
          const dy = state.boss.y - player.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d <= player.dashRadius) {
            state.boss.hp -= player.dashDamage;
            UI.bossHp.style.width =
              Math.max(0, (state.boss.hp / state.boss.maxHp) * 100) + "%";
          }
        }
      };
    },
  },
};

export function evolve(type) {
  if (!state.evolutions) state.evolutions = {};
  state.evolutions[type] = true;
  const evolution = EVOLUTIONS[type];
  if (!evolution) return;
  state.player.mode = evolution.mode;
  evolution.effect(state.player);
  alert(`${type} has evolved into its ultimate form: ${evolution.mode}!`);
}
