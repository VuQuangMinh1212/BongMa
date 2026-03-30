import { state } from "./state.js";
import { FPS } from "./config.js";

// =======================
// ATTACK MODES (0 → 24)
// =======================
export const ATTACK_MODES = {
  0: (boss) => {
    for (let i = 0; i < Math.PI * 2; i += 0.35) {
      spawnBullet(boss.x, boss.y, boss.x + Math.cos(i), boss.y + Math.sin(i), false, 1, "boss");
    }
  },

  1: (boss) => {
    for (let i = -1; i <= 1; i++) {
      let angle = Math.atan2(state.player.y - boss.y, state.player.x - boss.x) + i * 0.15;
      spawnBullet(boss.x, boss.y, boss.x + Math.cos(angle), boss.y + Math.sin(angle), false, 2, "boss");
    }
  },

  2: (boss) => {
    for (let i = 0; i < 10; i++) {
      let angle = Math.random() * Math.PI * 2;
      spawnBullet(boss.x, boss.y, boss.x + Math.cos(angle), boss.y + Math.sin(angle), false, 1, "boss");
    }
  },

  3: (boss) => {
    for (let i = 0; i < 8; i++) {
      let angle = (boss.attackTimer * 0.1) + i * (Math.PI / 4);
      spawnBullet(boss.x, boss.y, boss.x + Math.cos(angle), boss.y + Math.sin(angle), false, 1, "boss");
    }
  },

  4: (boss) => {
    for (let i = -2; i <= 2; i++) {
      let angle = Math.atan2(state.player.y - boss.y, state.player.x - boss.x) + i * 0.08;
      spawnBullet(boss.x, boss.y, boss.x + Math.cos(angle), boss.y + Math.sin(angle), false, 1, "boss");
    }
  },

  // ===== NEW PATTERNS =====
  5: (boss) => {
    for (let i = 0; i < 16; i++) {
      let angle = i * (Math.PI * 2 / 16);
      spawnBullet(boss.x, boss.y, boss.x + Math.cos(angle), boss.y + Math.sin(angle), false, 1, "boss");
    }
  },

  6: (boss) => {
    let base = Math.atan2(state.player.y - boss.y, state.player.x - boss.x);
    for (let i = -3; i <= 3; i++) {
      spawnBullet(boss.x, boss.y, boss.x + Math.cos(base + i * 0.1), boss.y + Math.sin(base + i * 0.1), false);
    }
  },

  7: (boss) => {
    let t = boss.attackTimer * 0.05;
    spawnBullet(boss.x, boss.y, boss.x + Math.cos(t), boss.y + Math.sin(t), false);
  },

  8: (boss) => {
    for (let i = 0; i < 20; i++) {
      let angle = i * 0.3 + boss.attackTimer * 0.05;
      spawnBullet(boss.x, boss.y, boss.x + Math.cos(angle), boss.y + Math.sin(angle), false);
    }
  },

  9: (boss) => {
    for (let i = 0; i < 12; i++) {
      let angle = i * (Math.PI / 6);
      spawnBullet(boss.x, boss.y, boss.x + Math.cos(angle), boss.y + Math.sin(angle), false, 2);
    }
  },

  10: (boss) => {
    let angle = Math.atan2(state.player.y - boss.y, state.player.x - boss.x);
    spawnBullet(boss.x, boss.y, boss.x + Math.cos(angle), boss.y + Math.sin(angle), false, 3);
  },

  11: (boss) => {
    for (let i = 0; i < 6; i++) {
      let angle = Math.random() * Math.PI * 2;
      spawnBullet(boss.x, boss.y, boss.x + Math.cos(angle), boss.y + Math.sin(angle), false);
    }
  },

  12: (boss) => {
    for (let i = 0; i < 30; i++) {
      let angle = i * 0.2;
      spawnBullet(boss.x, boss.y, boss.x + Math.cos(angle), boss.y + Math.sin(angle), false);
    }
  },

  13: (boss) => {
    for (let i = -4; i <= 4; i++) {
      let angle = i * 0.1;
      spawnBullet(boss.x, boss.y, boss.x + Math.cos(angle), boss.y + Math.sin(angle), false);
    }
  },

  14: (boss) => {
    let t = boss.attackTimer * 0.2;
    spawnBullet(boss.x, boss.y, boss.x + Math.cos(t), boss.y + Math.sin(t), false);
    spawnBullet(boss.x, boss.y, boss.x - Math.cos(t), boss.y - Math.sin(t), false);
  },

 // =======================
// ADVANCED PATTERNS (15–24)
// =======================

15: (boss) => {
  // 🔄 Reverse spiral (ngược chiều mode 3)
  for (let i = 0; i < 10; i++) {
    let angle = -(boss.attackTimer * 0.08) + i * 0.5;
    spawnBullet(boss.x, boss.y,
      boss.x + Math.cos(angle),
      boss.y + Math.sin(angle),
      false);
  }
},

16: (boss) => {
  // 💥 Shotgun mạnh vào player
  let base = Math.atan2(state.player.y - boss.y, state.player.x - boss.x);
  for (let i = -6; i <= 6; i++) {
    spawnBullet(boss.x, boss.y,
      boss.x + Math.cos(base + i * 0.05),
      boss.y + Math.sin(base + i * 0.05),
      false, 2);
  }
},

17: (boss) => {
  // 🧱 Bullet wall ngang
  for (let i = -300; i <= 300; i += 40) {
    spawnBullet(boss.x + i, boss.y,
      boss.x + i,
      boss.y + 200,
      false);
  }
},

18: (boss) => {
  // 🌸 Flower burst (hoa nở)
  for (let i = 0; i < 24; i++) {
    let angle = i * (Math.PI * 2 / 24);
    spawnBullet(boss.x, boss.y,
      boss.x + Math.cos(angle),
      boss.y + Math.sin(angle),
      false, 1);
  }
},

19: (boss) => {
  // 🌀 Double spiral (2 lớp)
  for (let i = 0; i < 8; i++) {
    let angle1 = boss.attackTimer * 0.1 + i * 0.8;
    let angle2 = -boss.attackTimer * 0.1 + i * 0.8;

    spawnBullet(boss.x, boss.y,
      boss.x + Math.cos(angle1),
      boss.y + Math.sin(angle1),
      false);

    spawnBullet(boss.x, boss.y,
      boss.x + Math.cos(angle2),
      boss.y + Math.sin(angle2),
      false);
  }
},

20: (boss) => {
  // 🎯 Delayed aim (giả aim rồi lệch)
  let base = Math.atan2(state.player.y - boss.y, state.player.x - boss.x);

  for (let i = -2; i <= 2; i++) {
    let offset = (Math.random() - 0.5) * 0.3;
    spawnBullet(boss.x, boss.y,
      boss.x + Math.cos(base + i * 0.1 + offset),
      boss.y + Math.sin(base + i * 0.1 + offset),
      false);
  }
},

21: (boss) => {
  // 🌊 Wave pattern
  for (let i = 0; i < 10; i++) {
    let angle = Math.sin(boss.attackTimer * 0.1 + i) * Math.PI;
    spawnBullet(boss.x, boss.y,
      boss.x + Math.cos(angle),
      boss.y + Math.sin(angle),
      false);
  }
},

22: (boss) => {
  // 💣 Expanding rings (vòng lan rộng)
  let radius = (boss.attackTimer % 60) * 0.1;

  for (let i = 0; i < 16; i++) {
    let angle = i * (Math.PI * 2 / 16);
    spawnBullet(
      boss.x + Math.cos(angle) * radius * 10,
      boss.y + Math.sin(angle) * radius * 10,
      boss.x + Math.cos(angle),
      boss.y + Math.sin(angle),
      false
    );
  }
},

23: (boss) => {
  // ⚡ Random rain (mưa đạn từ trên)
  for (let i = 0; i < 8; i++) {
    let x = Math.random() * 800;
    spawnBullet(x, 0, x, 600, false);
  }
},

24: (boss) => {
  // 🧠 Smart tracking burst (semi-homing)
  let base = Math.atan2(state.player.y - boss.y, state.player.x - boss.x);

  for (let i = 0; i < 5; i++) {
    let angle = base + (Math.random() - 0.5) * 0.4;

    spawnBullet(boss.x, boss.y,
      boss.x + Math.cos(angle),
      boss.y + Math.sin(angle),
      false, 3);
  }
},
};

// =======================
// BOSSES (FIXED)
// =======================
export const BOSS_TYPES = {
  fireBoss: {
    name: "Fire Lord",
    hp: 200,
    speed: 2,
    attackModes: [0, 1, 2, 3, 4],
    color: "#ff4500",
    phaseColors: [
      { start: "#ff4500", end: "#ff0000" }, // phase 1
      { start: "#ff9900", end: "#ff2200" }, // phase 2
    ],
  },
  iceBoss: {
    name: "Ice Queen",
    hp: 180,
    speed: 1.5,
    attackModes: [5, 6, 7, 8, 9],
    color: "#00ffff",
    phaseColors: [
      { start: "#00ffff", end: "#0099ff" },
      { start: "#99ffff", end: "#33ccff" },
    ],
  },
  thunderBoss: {
    name: "Thunder King",
    hp: 220,
    speed: 2.5,
    attackModes: [10, 11, 12, 13, 14],
    color: "#ffff00",
    phaseColors: [
      { start: "#ffff00", end: "#ffcc00" },
      { start: "#ffcc33", end: "#ffaa00" },
    ],
  },
  earthBoss: {
    name: "Earth Titan",
    hp: 250,
    speed: 1,
    attackModes: [15, 16, 17, 18, 19],
    color: "#8b4513",
    phaseColors: [
      { start: "#8b4513", end: "#5a3310" },
      { start: "#a0522d", end: "#6b4226" },
    ],
  },
  windBoss: {
    name: "Wind Spirit",
    hp: 190,
    speed: 3,
    attackModes: [20, 21, 22, 23, 24],
    color: "#00ffcc",
    phaseColors: [
      { start: "#00ffcc", end: "#00cc99" },
      { start: "#33ffcc", end: "#00ffaa" },
    ],
  },
};

// =======================
// PLAYER
// =======================
export function getInitialPlayerState() {
  return {
    x: 400,
    y: 300,
    radius: 12,
    speed: 4.5,
    color: "#00ffcc",
    hp: 3,
    maxHp: 3,
    shield: 0,
    maxShield: 0,
    shieldRegenTimer: 0,
    coins: 0,
    gracePeriod: 120,
    fireRate: 20,
    cooldown: 0,
    multiShot: 1,
    bounces: 0,
    dashTimeLeft: 0,
    dashCooldownTimer: 0,
    dashMaxCooldown: 90,
    dashDx: 0,
    dashDy: 0,
    experience: 0,
    experienceToLevel: 100,
    buffs: { multiShot: 0, bounces: 0 },
  };
}

// =======================
// DUMMY (FIX LAG)
// =======================
export function generateDummy(targetFrames = 600) {
  let dummy = [];
  let speedMult =
    state.currentLevel <= 2
      ? 0.5
      : Math.min(1.0, 0.5 + (state.currentLevel - 2) * 0.1);

  for (let i = 0; i < targetFrames; i++) {
    let x = 400 + Math.cos(i * 0.02 * speedMult) * 250;
    let y = 300 + Math.sin(i * 0.03 * speedMult) * 200;
    dummy.push({ x: Math.round(x), y: Math.round(y) });
  }
  return dummy;
}

// =======================
// BULLET
// =======================
export function spawnBullet(sx, sy, tx, ty, isPlayer, style = 0, source = "enemy") {
  let angle = Math.atan2(ty - sy, tx - sx);
  let speed = isPlayer
    ? 10
    : state.isBossLevel
      ? 4.5
      : 3.5 + state.currentLevel * 0.2;

  let isGhostShot = source === "ghost";

  let baseMulti = isPlayer || isGhostShot ? state.player.multiShot : 1;
  let baseBounce = isPlayer || isGhostShot ? Math.max(0, state.player.bounces || 0) : 0;

  if (isPlayer && state.player.buffs) {
    baseMulti += state.player.buffs.multiShot;
    baseBounce += state.player.buffs.bounces;
  }

  let spread = 0.1 + baseMulti * 0.02;
  let startAngle = angle - (spread * (baseMulti - 1)) / 2;

  for (let i = 0; i < baseMulti; i++) {
    let a = startAngle + i * spread;
    state.bullets.push({
      x: sx,
      y: sy,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      isPlayer,
      radius: state.isBossLevel && !isPlayer ? 6 : 4,
      life: 180,
      bounces: baseBounce,
      style,
    });
  }
}

// =======================
// BOSS ATTACK (FIXED)
// =======================
export function spawnBossAttack() {
  const boss = state.boss;
  boss.attackTimer++;

  if (boss.isCharging) {
    if (boss.chargeTimer > 0) {
      boss.chargeTimer--;
      if (boss.chargeTimer % 20 === 0) {
 // Placeholder for chargeWindUp
      }
    } else {
      boss.isCharging = false;
      spawnMode(boss.chargeAttack || 0);
    }
    return;
  }

  const currentPhase = boss.hp <= boss.maxHp / 2 ? 1 : 0;
  const phaseModes = boss.phases[currentPhase].attackModes;

  if (boss.attackTimer % 60 === 0) {
    const index = Math.floor(boss.attackTimer / 60) % phaseModes.length;
    spawnMode(phaseModes[index]);
  }

  if (boss.attackTimer % 300 === 0) {
    boss.isCharging = true;
    boss.chargeTimer = 60;
    boss.chargeAttack = phaseModes[Math.floor(Math.random() * phaseModes.length)];
 // Placeholder for chargeStart
  }
}

// =======================
// CREATE BOSS (FIX PHASE)
// =======================
export function createBoss(type) {
  const cfg = BOSS_TYPES[type];

  return {
    x: 400,
    y: 150,
    radius: 40,
    hp: cfg.hp,
    maxHp: cfg.hp,
    speed: cfg.speed,
    attackTimer: 0,
    summonCooldown: 5 * FPS,
    ghostsActive: false,
    color: cfg.color,
    name: cfg.name,
    phaseColors: cfg.phaseColors, // Pass phaseColors to boss instance

    phases: [
      { attackModes: cfg.attackModes.slice(0, Math.ceil(cfg.attackModes.length / 2)) },
      { attackModes: cfg.attackModes.slice(Math.ceil(cfg.attackModes.length / 2)) },
    ],
  };
}

// =======================
// SPAWN MODE
// =======================
function spawnMode(mode) {
  if (ATTACK_MODES[mode]) {
    ATTACK_MODES[mode](state.boss);
  } else {
    console.warn(`Attack mode ${mode} is not defined.`);
  }
}

export function bossSummonGhosts() {
  state.ghosts = [];
  let ghostLimit = Math.min(state.currentLevel, 10);
  let runsToUse = [];


  if (state.pastRuns.length > 0) {
    let summonCount = Math.min(ghostLimit, state.pastRuns.length);
    let shuffled = [...state.pastRuns].sort(() => 0.5 - Math.random());
    runsToUse = shuffled.slice(0, summonCount);
  }








  runsToUse.push(generateDummy(999999));
  let currentSpeedRate =
    state.currentLevel <= 2
      ? 0.5
      : Math.min(1.0, 0.5 + (state.currentLevel - 2) * 0.1);


  runsToUse.forEach((runData, idx) => {
    let isDummy = idx === runsToUse.length - 1;
    state.ghosts.push({
      record: runData,
      speedRate: currentSpeedRate,
      timer: 0,
      lastIdx: -1,
      x: state.boss.x,
      y: state.boss.y,
      radius: 12,
      isStunned: 0,
      historyPath: [],
      isDummy: isDummy,
    });
  });
}

export function updateBossUI() {
  const boss = state.boss;
  const root = document.documentElement;

  if (!boss || !boss.phaseColors) return;

  const phase = boss.hp <= boss.maxHp / 2 ? 1 : 0;

  // Check if the phase has changed
  if (boss.currentPhase !== phase) {
    boss.currentPhase = phase; // Update the current phase

    // Trigger phase transition animation
    const bossUI = document.getElementById("boss-ui");
    if (bossUI) {
      bossUI.classList.add("phase-transition");
      setTimeout(() => bossUI.classList.remove("phase-transition"), 300); // Remove class after animation
    }
  }

  const current = boss.phaseColors[phase];

  // Update CSS variables for boss UI
  root.style.setProperty("--boss-name-color", current.end);
  root.style.setProperty("--boss-name-shadow", current.start);
  root.style.setProperty("--boss-hp-start", current.start);
  root.style.setProperty("--boss-hp-end", current.end);
}