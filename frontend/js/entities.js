import { state } from "./state.js";
import { FPS } from "./config.js";

// =======================
// ATTACK MODES (0 → 24)
// =======================
const TAU = Math.PI * 2;

function fireAngle(sx, sy, angle, style = 0, source = "boss") {
  spawnBullet(
    sx,
    sy,
    sx + Math.cos(angle),
    sy + Math.sin(angle),
    false,
    style,
    source,
  );
}

function ring(sx, sy, count, offset = 0, style = 0, source = "boss") {
  for (let i = 0; i < count; i++) {
    fireAngle(sx, sy, offset + (i * TAU) / count, style, source);
  }
}

function fan(sx, sy, baseAngle, count, spread, style = 0, source = "boss") {
  const start = baseAngle - (spread * (count - 1)) / 2;
  for (let i = 0; i < count; i++) {
    fireAngle(sx, sy, start + i * spread, style, source);
  }
}

function aim(boss, extraAngle = 0) {
  return (
    Math.atan2(state.player.y - boss.y, state.player.x - boss.x) + extraAngle
  );
}

function rainCurtain(xStart, xEnd, step, yStart, txBias, style = 0, source = "boss") {
  for (let x = xStart; x <= xEnd; x += step) {
    spawnBullet(
      x,
      yStart,
      x + txBias,
      600,
      false,
      style,
      source,
    );
  }
}

export const ATTACK_MODES = {
  0: (boss) => {
    // Dense radial burst + inner ring
    const phase = boss.hp < boss.maxHp * 0.5 ? 1 : 0;
    ring(boss.x, boss.y, phase ? 28 : 22, boss.attackTimer * 0.04, 1);
    ring(boss.x, boss.y, phase ? 14 : 10, -boss.attackTimer * 0.06, 2);
  },

  1: (boss) => {
    // Multi-layer aimed fan
    const base = aim(boss);
    fan(boss.x, boss.y, base, 11, 0.06, 2);
    fan(boss.x, boss.y, base + 0.14, 7, 0.035, 1);
  },

  2: (boss) => {
    // Chaos burst with targeted follow-up
    for (let i = 0; i < 18; i++) {
      fireAngle(boss.x, boss.y, Math.random() * TAU, i % 2 ? 1 : 0);
    }
    const base = aim(boss);
    fan(boss.x, boss.y, base, 8, 0.05, 3);
  },

  3: (boss) => {
    // Double spiral
    const t = boss.attackTimer * 0.14;
    for (let i = 0; i < 18; i++) {
      fireAngle(boss.x, boss.y, t + i * 0.33, 1);
      fireAngle(boss.x, boss.y, -t - i * 0.33, 1);
    }
  },

  4: (boss) => {
    // Aimed crossfire with spread
    const base = aim(boss);
    for (let i = -4; i <= 4; i++) {
      fireAngle(boss.x, boss.y, base + i * 0.08, 2);
      if (i % 2 === 0) fireAngle(boss.x, boss.y, base + Math.PI / 2 + i * 0.04, 1);
    }
  },

  5: (boss) => {
    // Rotating hex ring + inner spin
    ring(boss.x, boss.y, 30, boss.attackTimer * 0.05, 1);
    ring(boss.x, boss.y, 12, -boss.attackTimer * 0.08, 2);
  },

  6: (boss) => {
    // Four-way cross plus player fan
    const base = aim(boss);
    fireAngle(boss.x, boss.y, 0, 1);
    fireAngle(boss.x, boss.y, Math.PI / 2, 1);
    fireAngle(boss.x, boss.y, Math.PI, 1);
    fireAngle(boss.x, boss.y, (Math.PI * 3) / 2, 1);
    fan(boss.x, boss.y, base, 9, 0.07, 2);
  },

  7: (boss) => {
    // Moving sniper + orbiting bullets
    const base = aim(boss, Math.sin(boss.attackTimer * 0.05) * 0.25);
    fireAngle(boss.x, boss.y, base, 3);
    fireAngle(boss.x, boss.y, base + 0.03, 2);
    fireAngle(boss.x, boss.y, base - 0.03, 2);
    ring(boss.x, boss.y, 8, boss.attackTimer * 0.1, 1);
  },

  8: (boss) => {
    // Expanding dual rings
    const phase = boss.attackTimer % 60;
    const offset = phase * 0.12;
    ring(boss.x, boss.y, 24, offset, 1);
    ring(boss.x, boss.y, 12, -offset * 1.35, 2);
  },

  9: (boss) => {
    // Dense aimed ring
    const base = aim(boss);
    ring(boss.x, boss.y, 18, base, 2);
    fan(boss.x, boss.y, base, 7, 0.045, 3);
  },

  10: (boss) => {
    // Heavy sniper burst
    const base = aim(boss);
    fan(boss.x, boss.y, base, 7, 0.025, 3);
  },

  11: (boss) => {
    // Random rain + diagonal pressure
    for (let i = 0; i < 20; i++) {
      fireAngle(boss.x, boss.y, Math.random() * TAU, 0);
    }
    for (let x = 40; x <= 760; x += 120) {
      spawnBullet(x, 0, x + (Math.random() > 0.5 ? 60 : -60), 600, false, 1, "boss");
    }
  },

  12: (boss) => {
    // Rotating bullet cage
    const t = boss.attackTimer * 0.08;
    ring(boss.x, boss.y, 36, t, 1);
    ring(boss.x, boss.y, 18, -t * 1.5, 2);
  },

  13: (boss) => {
    // Sweeping curtain
    const sweep = Math.sin(boss.attackTimer * 0.05) * 180;
    for (let x = 0; x <= 800; x += 40) {
      spawnBullet(
        x,
        -10,
        x + sweep,
        620,
        false,
        1,
        "boss",
      );
    }
  },

  14: (boss) => {
    // Twin spiral shots
    const t = boss.attackTimer * 0.12;
    for (let i = 0; i < 14; i++) {
      fireAngle(boss.x, boss.y, t + i * 0.48, 1);
      fireAngle(boss.x, boss.y, t + Math.PI + i * 0.48, 1);
    }
    fan(boss.x, boss.y, aim(boss), 5, 0.04, 3);
  },

  15: (boss) => {
    // Reverse spiral, denser
    const t = -boss.attackTimer * 0.11;
    for (let i = 0; i < 24; i++) {
      fireAngle(boss.x, boss.y, t + i * 0.28, 1);
    }
  },

  16: (boss) => {
    // Triple shotgun burst
    const base = aim(boss);
    fan(boss.x, boss.y, base, 15, 0.035, 2);
    fan(boss.x, boss.y, base + 0.12, 9, 0.025, 1);
  },

  17: (boss) => {
    // Cross walls from top/side
    for (let x = 20; x <= 780; x += 35) {
      spawnBullet(x, 0, x + 20 * Math.sin(boss.attackTimer * 0.08), 600, false, 1, "boss");
    }
    for (let y = 40; y <= 560; y += 60) {
      spawnBullet(0, y, 800, y + 30 * Math.cos(boss.attackTimer * 0.06), false, 2, "boss");
    }
  },

  18: (boss) => {
    // Flower burst with inner petals
    ring(boss.x, boss.y, 32, boss.attackTimer * 0.04, 1);
    ring(boss.x, boss.y, 16, boss.attackTimer * 0.04 + Math.PI / 32, 2);
  },

  19: (boss) => {
    // Double spiral with offset layers
    const t = boss.attackTimer * 0.1;
    for (let i = 0; i < 12; i++) {
      fireAngle(boss.x, boss.y, t + i * 0.55, 1);
      fireAngle(boss.x, boss.y, -t + i * 0.55 + Math.PI / 6, 1);
    }
  },

  20: (boss) => {
    // Fake aim then perpendicular burst
    const base = aim(boss);
    fan(boss.x, boss.y, base, 7, 0.055, 2);
    fan(boss.x, boss.y, base + Math.PI / 2, 7, 0.055, 1);
  },

  21: (boss) => {
    // Sine wave pattern
    for (let i = 0; i < 18; i++) {
      const angle = Math.sin(boss.attackTimer * 0.09 + i * 0.55) * 1.1;
      fireAngle(boss.x, boss.y, angle, i % 2 ? 1 : 0);
    }
  },

  22: (boss) => {
    // Multi-ring expansion
    const t = (boss.attackTimer % 45) * 0.16;
    ring(boss.x, boss.y, 16, t, 1);
    ring(boss.x, boss.y, 24, -t * 1.2, 2);
    ring(boss.x, boss.y, 32, t * 0.6, 0);
  },

  23: (boss) => {
    // Targeted rain from above
    const px = state.player.x;
    for (let i = -4; i <= 4; i++) {
      const x = px + i * 55 + Math.sin(boss.attackTimer * 0.04 + i) * 25;
      spawnBullet(x, -20, x + i * 10, 620, false, 1, "boss");
    }
    rainCurtain(60, 740, 80, -30, 0, 0);
  },

  24: (boss) => {
    // Smart tracking burst + outer ring
    const base = aim(boss);
    fan(boss.x, boss.y, base, 11, 0.03, 3);
    ring(boss.x, boss.y, 12, boss.attackTimer * 0.12, 2);
  },

  // ===== NEW ATTACK MODES =====
  25: (boss) => {
    // Fullscreen rain - đạn rơi từ trên xuống toàn màn hình
    for (let x = 20; x <= 780; x += 30) {
      spawnBullet(x, -20, x + (Math.random() - 0.5) * 60, 620, false, 1, "boss");
    }
  },

  26: (boss) => {
    // Cross Laser - 4 tia laser xoay từ boss
    const t = boss.attackTimer * 0.06;
    for (let arm = 0; arm < 4; arm++) {
      const baseAngle = t + arm * (Math.PI / 2);
      for (let i = 0; i < 8; i++) {
        fireAngle(boss.x, boss.y, baseAngle + i * 0.08, 2);
      }
    }
  },

  27: (boss) => {
    // Diamond Cage - đạn bay hình thoi khép vào player
    const px = state.player.x, py = state.player.y;
    const r = 250;
    const points = [
      { x: px, y: py - r },
      { x: px + r, y: py },
      { x: px, y: py + r },
      { x: px - r, y: py },
    ];
    points.forEach(p => {
      for (let i = -2; i <= 2; i++) {
        spawnBullet(p.x + i * 20, p.y, px, py, false, 1, "boss");
      }
    });
  },

  28: (boss) => {
    // Spiral Inferno - 3 lớp xoáy ốc
    const t = boss.attackTimer * 0.15;
    for (let layer = 0; layer < 3; layer++) {
      for (let i = 0; i < 10; i++) {
        fireAngle(boss.x, boss.y, t * (1 + layer * 0.3) + i * 0.65 + layer * (TAU / 3), layer);
      }
    }
  },

  29: (boss) => {
    // Death Wave - sóng đạn sin tỏa ra
    const base = boss.attackTimer * 0.03;
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * TAU + Math.sin(boss.attackTimer * 0.1 + i * 0.5) * 0.3;
      fireAngle(boss.x, boss.y, base + angle, i % 3);
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
    color: "#ff4500",
    shape: "circle",
    icon: "🔥",
    phaseCount: 3,
    phases: [
      { attackModes: [0, 1, 2], speedMult: 1.0 },
      { attackModes: [3, 4, 25], speedMult: 1.3 },
      { attackModes: [28, 27, 1], speedMult: 1.6, rageFireRate: 0.7 },
    ],
    phaseColors: [
      { start: "#ff4500", end: "#ff0000" },
      { start: "#ff9900", end: "#ff2200" },
      { start: "#ff0000", end: "#ffff00" },
    ],
  },
  iceBoss: {
    name: "Ice Queen",
    hp: 180,
    speed: 1.5,
    color: "#00ffff",
    shape: "hexagon",
    icon: "❄️",
    phaseCount: 2,
    phases: [
      { attackModes: [5, 6, 7], speedMult: 1.0 },
      { attackModes: [8, 9, 26], speedMult: 1.4, rageFireRate: 0.75 },
    ],
    phaseColors: [
      { start: "#00ffff", end: "#0099ff" },
      { start: "#99ffff", end: "#33ccff" },
    ],
  },
  thunderBoss: {
    name: "Thunder King",
    hp: 220,
    speed: 2.5,
    color: "#ffff00",
    shape: "triangle",
    icon: "⚡",
    phaseCount: 3,
    phases: [
      { attackModes: [10, 11, 12], speedMult: 1.0 },
      { attackModes: [13, 14, 29], speedMult: 1.4 },
      { attackModes: [25, 26, 28], speedMult: 1.8, rageFireRate: 0.6 },
    ],
    phaseColors: [
      { start: "#ffff00", end: "#ffcc00" },
      { start: "#ffcc33", end: "#ffaa00" },
      { start: "#ffffff", end: "#ffff00" },
    ],
  },
  earthBoss: {
    name: "Earth Titan",
    hp: 250,
    speed: 1,
    color: "#8b4513",
    shape: "square",
    icon: "🪨",
    phaseCount: 2,
    phases: [
      { attackModes: [15, 16, 17], speedMult: 1.0 },
      { attackModes: [18, 19, 27], speedMult: 1.5, rageFireRate: 0.7 },
    ],
    phaseColors: [
      { start: "#8b4513", end: "#5a3310" },
      { start: "#a0522d", end: "#6b4226" },
    ],
  },
  windBoss: {
    name: "Wind Spirit",
    hp: 190,
    speed: 3,
    color: "#00ffcc",
    shape: "star",
    icon: "🌪️",
    phaseCount: 3,
    phases: [
      { attackModes: [20, 21, 22], speedMult: 1.0 },
      { attackModes: [23, 24, 29], speedMult: 1.5 },
      { attackModes: [25, 26, 28], speedMult: 2.0, rageFireRate: 0.5 },
    ],
    phaseColors: [
      { start: "#00ffcc", end: "#00cc99" },
      { start: "#33ffcc", end: "#00ffaa" },
      { start: "#00ffff", end: "#ffffff" },
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

  // --- Boss Movement ---
  boss.moveTimer++;
  if (boss.moveTimer % 120 === 0) {
    // Pick new target position
    const padding = 80;
    boss.moveTargetX = padding + Math.random() * (800 - padding * 2);
    boss.moveTargetY = padding + Math.random() * (300 - padding);
  }
  // Smooth movement towards target
  const currentPhaseIdx = getBossPhase(boss);
  const phaseSpeedMult = boss.phases[currentPhaseIdx]?.speedMult || 1.0;
  const moveSpeed = boss.speed * phaseSpeedMult * 0.02;
  boss.x += (boss.moveTargetX - boss.x) * moveSpeed;
  boss.y += (boss.moveTargetY - boss.y) * moveSpeed;

  if (boss.isCharging) {
    if (boss.chargeTimer > 0) {
      boss.chargeTimer--;
    } else {
      boss.isCharging = false;
      spawnMode(boss.chargeAttack || 0);
    }
    return;
  }

  const phaseModes = boss.phases[currentPhaseIdx].attackModes;
  const rageRate = boss.phases[currentPhaseIdx].rageFireRate || 1.0;
  const attackInterval = Math.max(30, Math.floor(60 * rageRate));

  if (boss.attackTimer % attackInterval === 0) {
    const index = Math.floor(boss.attackTimer / attackInterval) % phaseModes.length;
    spawnMode(phaseModes[index]);
  }

  if (boss.attackTimer % 300 === 0) {
    boss.isCharging = true;
    boss.chargeTimer = 60;
    boss.chargeAttack = phaseModes[Math.floor(Math.random() * phaseModes.length)];
  }
}

function getBossPhase(boss) {
  const ratio = boss.hp / boss.maxHp;
  if (boss.phaseCount === 3) {
    if (ratio > 0.66) return 0;
    if (ratio > 0.33) return 1;
    return 2;
  }
  // 2 phases
  return ratio > 0.5 ? 0 : 1;
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
    shape: cfg.shape,
    name: cfg.name,
    bossType: type,
    phaseColors: cfg.phaseColors,
    phaseCount: cfg.phaseCount || 2,
    moveTimer: 0,
    moveTargetX: 400,
    moveTargetY: 150,

    phases: cfg.phases.map(p => ({ ...p })),
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

