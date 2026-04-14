import { state } from "../../state.js";

// ===== LAVA FLOOR (fire theme) =====
export function drawLavaFloor(ctx) {
  const t = state.frameCount * 0.02;

  ctx.save();

  // 1. NỀN GỐC (BASE GRADIENT)
  const baseGrad = ctx.createRadialGradient(
    state.world.width / 2,
    state.world.height / 2,
    0,
    state.world.width / 2,
    state.world.height / 2,
    state.world.width * 0.8,
  );
  baseGrad.addColorStop(0, "#1a0800");
  baseGrad.addColorStop(1, "#050100");

  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, state.world.width, state.world.height);

  ctx.globalCompositeOperation = "lighter";

  // 2. MẠCH DUNG NHAM
  const numVeins = 4;
  for (let i = 0; i < numVeins; i++) {
    ctx.beginPath();
    const startY = (state.world.height / numVeins) * i + 100;
    ctx.moveTo(0, startY);

    for (let x = 0; x <= state.world.width; x += 100) {
      const wave1 = Math.sin(x * 0.005 + t + i) * 60;
      const wave2 = Math.cos(x * 0.01 - t * 0.5) * 40;
      ctx.lineTo(x, startY + wave1 + wave2);
    }

    ctx.strokeStyle =
      i % 2 === 0 ? "rgba(255, 60, 0, 0.04)" : "rgba(200, 20, 0, 0.03)";
    ctx.lineWidth = 120 + Math.sin(t * 2 + i) * 20;
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 120, 0, 0.05)";
    ctx.lineWidth = 40;
    ctx.stroke();
  }

  // 3. HẠT TÀN LỬA (EMBER PARTICLES)
  if (!state.lavaParticles) state.lavaParticles = [];

  if (Math.random() < 0.3) {
    state.lavaParticles.push({
      x: Math.random() * state.world.width,
      y: state.world.height + 20,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -(Math.random() * 2 + 0.5),
      size: Math.random() * 3 + 1,
      life: 1.0,
      decay: Math.random() * 0.01 + 0.005,
      seed: Math.random() * Math.PI * 2,
    });
  }

  for (let i = state.lavaParticles.length - 1; i >= 0; i--) {
    let p = state.lavaParticles[i];
    p.x += Math.sin(t * 5 + p.seed) * 0.5 + p.vx;
    p.y += p.vy;
    p.life -= p.decay;

    if (p.life <= 0) {
      state.lavaParticles.splice(i, 1);
      continue;
    }

    const greenScale = Math.floor(150 * p.life);
    ctx.fillStyle = `rgba(255, ${greenScale}, 0, ${p.life})`;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";

  // 4. LƯỚI KHÔNG GIAN
  const gridSize = 100;
  ctx.strokeStyle = "rgba(255, 80, 0, 0.04)";
  ctx.lineWidth = 1;

  ctx.beginPath();
  for (let x = 0; x <= state.world.width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, state.world.height);
  }
  for (let y = 0; y <= state.world.height; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(state.world.width, y);
  }
  ctx.stroke();

  ctx.restore();
}

// ===== BURN VIGNETTE (screen-space) =====
export function drawBurnVignette(ctx, canvas) {
  const pulse = (Math.sin(state.frameCount * 0.1) + 1) * 0.5;
  const grad = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.3,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.8,
  );
  grad.addColorStop(0, "rgba(0, 0, 0, 0)");
  grad.addColorStop(1, `rgba(100, 10, 0, ${0.1 + pulse * 0.1})`);

  ctx.save();
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

// ===== PERMANENT SCARS (vết cháy vĩnh viễn) =====
export function drawPermanentScars(ctx) {
  if (!state.permanentScars) return;
  state.permanentScars.forEach((s) => {
    ctx.save();
    const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius);
    grad.addColorStop(0, "rgba(20, 10, 0, 0.8)");
    grad.addColorStop(0.7, "rgba(40, 20, 0, 0.4)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

// ===== MAP GRID =====
export function drawMapGrid(ctx) {
  const gridSize = 100;

  ctx.save();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
  ctx.lineWidth = 1;

  ctx.beginPath();

  for (let x = 0; x <= state.world.width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, state.world.height);
  }

  for (let y = 0; y <= state.world.height; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(state.world.width, y);
  }

  ctx.stroke();

  const pulse = (Math.sin(state.frameCount * 0.05) + 1) * 0.5;

  ctx.strokeStyle = `rgba(255, 80, 80, ${0.2 + pulse * 0.2})`;
  ctx.lineWidth = 3;

  ctx.shadowBlur = 10;
  ctx.shadowColor = "rgba(255,80,80,0.5)";

  ctx.strokeRect(0, 0, state.world.width, state.world.height);

  ctx.restore();
}

// ===== THEMED BACKGROUND (main entry) =====
export function drawThemedBackground(ctx) {
  const theme = state.currentMapTheme || "fire";
  const w = state.world.width;
  const h = state.world.height;
  const cx = state.camera.x;
  const cy = state.camera.y;
  const cw = state.camera.width;
  const ch = state.camera.height;
  const t = state.frameCount;

  ctx.save();

  // 1. TÔ NỀN GỐC (Chỉ fill vùng Camera)
  let colors = {
    fire: ["#1a0500", "#050100"],
    earth: ["#1a1000", "#050300"],
    ice: ["#001122", "#00050a"],
    wind: ["#001a1a", "#000505"],
    thunder: ["#0a001a", "#05000a"],
    void: ["#030005", "#000000"],
    glitch: ["#050505", "#000000"],
    omni: [`hsla(${(t * 0.5) % 360}, 50%, 8%, 1)`, "#000000"],
  };

  let cSet = colors[theme] || colors.fire;
  let bgGrad = ctx.createRadialGradient(
    cx + cw / 2,
    cy + ch / 2,
    0,
    cx + cw / 2,
    cy + ch / 2,
    cw,
  );
  bgGrad.addColorStop(0, cSet[0]);
  bgGrad.addColorStop(1, cSet[1]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(cx, cy, cw, ch);

  // 2. LƯỚI KHÔNG GIAN ĐỔI MÀU THEO THEME
  const gridSize = 100;
  const startX = Math.floor(cx / gridSize) * gridSize;
  const startY = Math.floor(cy / gridSize) * gridSize;

  let gridAlpha = 0.05;
  let gridColor = "255, 255, 255";

  if (theme === "fire") gridColor = "255, 60, 0";
  if (theme === "earth") gridColor = "200, 100, 0";
  if (theme === "ice") gridColor = "0, 200, 255";
  if (theme === "wind") gridColor = "0, 255, 200";
  if (theme === "thunder") gridColor = "200, 0, 255";
  if (theme === "void") {
    gridColor = "100, 0, 255";
    gridAlpha = 0.03;
  }
  if (theme === "glitch") {
    gridColor = t % 10 < 2 ? "255, 0, 255" : "0, 255, 0";
    gridAlpha = 0.1;
    if (t % 20 < 2)
      ctx.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
  }
  if (theme === "omni") {
    gridColor = `${Math.floor((Math.sin(t * 0.05) + 1) * 127)}, ${Math.floor((Math.cos(t * 0.05) + 1) * 127)}, 255`;
    gridAlpha = 0.08;
  }

  ctx.strokeStyle = `rgba(${gridColor}, ${gridAlpha})`;
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let x = startX; x <= cx + cw; x += gridSize) {
    ctx.moveTo(x, Math.max(0, cy));
    ctx.lineTo(x, Math.min(h, cy + ch));
  }
  for (let y = startY; y <= cy + ch; y += gridSize) {
    ctx.moveTo(Math.max(0, cx), y);
    ctx.lineTo(Math.min(w, cx + cw), y);
  }
  ctx.stroke();

  // 3. HIỆU ỨNG TRANG TRÍ THEO BẢN ĐỒ
  ctx.globalCompositeOperation = "lighter";

  if (theme === "fire") {
    const numVeins = 3;
    for (let i = 0; i < numVeins; i++) {
      ctx.beginPath();
      const vY = (h / numVeins) * i + 200;
      if (vY > cy - 300 && vY < cy + ch + 300) {
        ctx.moveTo(cx, vY);
        for (let x = cx; x <= cx + cw; x += 100) {
          const wave = Math.sin(x * 0.005 + t * 0.02 + i) * 60;
          ctx.lineTo(x, vY + wave);
        }
        ctx.strokeStyle = `rgba(255, 60, 0, ${0.05 + Math.sin(t * 0.05) * 0.02})`;
        ctx.lineWidth = 80;
        ctx.stroke();
        ctx.strokeStyle = "rgba(255, 150, 0, 0.1)";
        ctx.lineWidth = 20;
        ctx.stroke();
      }
    }
  } else if (theme === "wind") {
    ctx.strokeStyle = "rgba(0, 255, 200, 0.05)";
    ctx.lineWidth = 40;
    for (let i = 0; i < 5; i++) {
      let wx = cx + ((t * 2 + i * 500) % (cw + 1000)) - 500;
      ctx.beginPath();
      ctx.arc(wx, cy + ch / 2 + Math.sin(t * 0.02 + i) * 300, 200, 0, Math.PI);
      ctx.stroke();
    }
  } else if (theme === "glitch") {
    ctx.fillStyle = "rgba(0, 255, 0, 0.15)";
    ctx.font = "bold 20px monospace";
    for (let i = 0; i < 15; i++) {
      let bx = cx + ((Math.sin(i * 77) * cw) / 2 + cw / 2);
      let by = cy + ((t * 8 + i * 200) % (ch + 100)) - 50;
      ctx.fillText(Math.random() > 0.5 ? "1" : "0", bx, by);
    }
  } else if (theme === "void") {
    ctx.fillStyle = "rgba(100, 0, 255, 0.1)";
    for (let i = 0; i < 10; i++) {
      let nx = cx + ((Math.sin(i * 99) * cw) / 2 + cw / 2);
      let ny = cy + ((Math.cos(i * 88) * ch) / 2 + ch / 2);
      ctx.beginPath();
      ctx.arc(nx, ny, Math.sin(t * 0.05 + i) * 30 + 50, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (theme === "ice") {
    ctx.fillStyle = "rgba(0, 200, 255, 0.02)";
    for (let i = 0; i < 3; i++) {
      let ix = cx + Math.sin(t * 0.01 + i) * 100;
      let iy = cy + Math.cos(t * 0.01 + i) * 100;
      ctx.beginPath();
      ctx.ellipse(
        ix + cw / 2,
        iy + ch / 2,
        cw * 0.8,
        ch * 0.8,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }

  ctx.restore();
}
