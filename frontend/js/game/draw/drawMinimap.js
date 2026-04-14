import { state } from "../../state.js";
import { getPuzzleMinimapMarkers } from "../puzzle_manager.js";

export function drawMinimap(ctx, canvas) {
  const mmSize = 220;
  const padding = 20;
  const mmX = canvas.width - mmSize - padding;
  const mmY = padding + 60;

  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 2;
  ctx.fillRect(mmX, mmY, mmSize, mmSize);
  ctx.strokeRect(mmX, mmY, mmSize, mmSize);

  const scaleX = mmSize / state.world.width;
  const scaleY = mmSize / state.world.height;

  const drawDot = (obj, color, size) => {
    if (!obj || (obj.hp <= 0 && obj !== state.player)) return;
    const x = mmX + obj.x * scaleX;
    const y = mmY + obj.y * scaleY;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  };

  // 1. Enemies
  state.ghosts.forEach((g) => drawDot(g, "#ff4444", 2));

  // 2. Boss
  if (state.boss && state.boss.hp > 0) {
    drawDot(state.boss, state.boss.color || "#ff00ff", 4);
    ctx.strokeStyle = state.boss.color || "#ff00ff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(
      mmX + state.boss.x * scaleX,
      mmY + state.boss.y * scaleY,
      7,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  }

  // 3. Player
  if (state.player && state.player.hp > 0) {
    drawDot(state.player, "#00ffcc", 3);
  }

  // 3.5. Swarm zones
  if (!state.isBossLevel && !state.bossArenaMode)
    state.swarmZones.forEach((sz) => {
      if (sz.isCompleted) return;
      const color = state.frameCount % 40 < 20 ? "#ffaa00" : "#aa5500";
      const x = mmX + sz.x * scaleX;
      const y = mmY + sz.y * scaleY;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.stroke();
    });

  // 4. Camera frame
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(
    mmX + state.camera.x * scaleX,
    mmY + state.camera.y * scaleY,
    state.camera.width * scaleX,
    state.camera.height * scaleY,
  );

  // 5. Crates
  if (!state.isBossLevel && !state.bossArenaMode && state.crates) {
    state.crates.forEach((c) => {
      const x = mmX + c.x * scaleX;
      const y = mmY + c.y * scaleY;
      ctx.fillStyle = "#8B4513";
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // 6. Capture points
  if (!state.isBossLevel && !state.bossArenaMode && state.capturePoints) {
    state.capturePoints.forEach((cp) => {
      if (cp.state === "completed") return;
      const x = mmX + cp.x * scaleX;
      const y = mmY + cp.y * scaleY;
      const size = 6;

      ctx.fillStyle = "rgba(255, 215, 0, 0.4)";
      ctx.beginPath();
      ctx.arc(x, y, size + 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.stroke();

      if (cp.state === "guarding") {
        ctx.fillStyle = "#ff0000";
        ctx.font = "bold 8px Arial";
        ctx.textAlign = "center";
        ctx.fillText("B", x, y + 3);
      }
    });
  }

  // 7. Puzzle markers
  if (!state.isBossLevel && !state.bossArenaMode) {
    const markers = getPuzzleMinimapMarkers();
    markers.forEach((m) => {
      const mx = mmX + m.x * scaleX;
      const my = mmY + m.y * scaleY;

      if (m.type === "clue") {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(mx - 6, my - 9, 12, 18);

        ctx.fillStyle = m.revealed ? "#FFD700" : "#aaaaaa";
        ctx.fillRect(mx - 4, my - 7, 8, 14);

        ctx.fillStyle = m.revealed ? "#000" : "#fff";
        ctx.font = "bold 8px Arial";
        ctx.textAlign = "center";
        ctx.fillText(m.revealed ? "!" : "?", mx, my + 3.5);
      }

      if (m.type === "rune") {
        const isPending = m.state === "pending";

        const fillColor = isPending
          ? "#ff9900"
          : m.isNext
            ? "#ffff00"
            : "#cc44ff";

        ctx.beginPath();
        ctx.arc(mx, my, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mx, my, 6, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();

        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.font = "bold 8px Arial";
        ctx.textAlign = "center";
        ctx.fillText(m.symbol, mx, my + 3);
      }

      if (m.type === "domino") {
        ctx.beginPath();
        ctx.arc(mx, my, 5, 0, Math.PI * 2);
        ctx.fillStyle = m.isNext ? "#ffff00" : "#888";
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.stroke();
      }

      if (m.type === "melody") {
        ctx.beginPath();
        ctx.arc(mx, my, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#00ccff";
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.font = "bold 7px Arial";
        ctx.textAlign = "center";
        ctx.fillText("♪", mx, my + 2);
      }

      if (m.type === "torch") {
        ctx.beginPath();
        ctx.arc(mx, my, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#ff8800";
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.font = "bold 7px Arial";
        ctx.textAlign = "center";
        ctx.fillText("🔥", mx, my + 2);
      }

      if (m.type === "source") {
        ctx.fillStyle = m.color;
        ctx.beginPath();
        ctx.arc(mx, my, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  // 8. Stage portal
  if (!state.isBossLevel && state.stagePortal?.active) {
    const x = mmX + state.stagePortal.x * scaleX;
    const y = mmY + state.stagePortal.y * scaleY;
    const blink = Math.sin(state.frameCount * 0.15) > 0;
    if (blink) {
      ctx.fillStyle = "#cc00ff";
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 8px Arial";
      ctx.textAlign = "center";
      ctx.fillText("⚡", x, y + 3);
    }
  }
}
