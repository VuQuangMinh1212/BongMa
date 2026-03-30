/**
 * main.js — Entry point
 *
 * Chỉ làm 3 việc:
 *  1. Khởi tạo input, auth, menu buttons
 *  2. Chạy game loop (update → draw)
 *  3. Kết nối các module lại với nhau
 *
 * Logic cụ thể nằm trong:
 *  - game/flow.js      (initGame, startGame, nextStage, changeState)
 *  - game/update.js    (update mỗi frame)
 *  - game/draw.js      (render canvas)
 *  - game/combat.js    (sát thương, XP, va chạm đạn)
 *  - characters/       (manager, shop, select)
 *  - auth.js           (login, sync server)
 *  - input.js          (keyboard/mouse)
 */

import { state } from "./state.js";
import { GHOST_DATA_KEY } from "./config.js";
import { UI } from "./ui.js";
import { setupInput } from "./input.js";
import { initAuth, syncRemoteState } from "./auth.js";
import { changeState, startGame, nextStage } from "./game/flow.js";
import { update } from "./game/update.js";
import { draw } from "./game/draw.js";
import { openShop } from "./characters/shop.js";
import { setupMenuButtons } from "./characters/select.js";
import { evolve } from "./game/evolutions.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ---------- Helpers để truyền ctx/canvas vào các module ----------

function changeStateBound(newState) {
  changeState(newState, gameLoop);
}

function nextStageBound() {
  nextStage(gameLoop);
}

// ---------- Game Loop ----------

function gameLoop() {
  if (state.gameState !== "PLAYING") return;

  const result = update(ctx, canvas, changeStateBound);

  if (result === "BOSS_KILLED" || result === "STAGE_CLEAR") {
    nextStageBound();
    return;
  }

  if (state.gameState === "PLAYING") {
    draw(ctx, canvas);
    state.loopId = requestAnimationFrame(gameLoop);
  }
}

// ---------- Setup ----------

setupInput(canvas);

// Auth: kiểm tra token, hiện login hoặc main screen
initAuth(() => syncRemoteState());

// Nút Reset
document.getElementById("btn-clear").addEventListener("click", () => {
  if (confirm("Xóa toàn bộ tiến trình?")) {
    localStorage.removeItem(GHOST_DATA_KEY);
    location.reload();
  }
});

// Nút "Vào Trận"
UI.btnStart.onclick = () => startGame(gameLoop);

// Menu buttons: shop, character select, back
setupMenuButtons(openShop, changeStateBound);

// Khởi chạy game ở MENU
changeStateBound("MENU");

// Re-export evolve để các module cũ import từ main.js vẫn hoạt động
export { evolve };
