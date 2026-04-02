import { state } from "./state.js";
import { playSound } from "./game/audio.js";
import { UI } from "./ui.js";
import { setupInput } from "./input.js";
import { initAuth, syncRemoteState, isAuthenticated, showLoginScreen } from "./auth.js";
import { changeState, startGame, nextStage, openBossArena, handleBossArenaReward } from "./game/flow.js";
import { update } from "./game/update.js";
import { draw } from "./game/draw.js";
import { openShop } from "./characters/shop.js";
import { setupMenuButtons } from "./characters/select.js";
import { evolve } from "./game/evolutions.js";
import { handleSkillsUpdate } from "./game/skills.js";
import { updateBossUI } from "./ui.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

document.addEventListener("click", (event) => {
  if (event.target.closest("button")) {
    playSound("button");
  }
});

function changeStateBound(newState) {
  changeState(newState, gameLoop);
}

function nextStageBound() {
  nextStage(gameLoop);
}

function gameLoop() {
  if (state.gameState !== "PLAYING") return;

  handleSkillsUpdate(canvas, changeStateBound);

  const result = update(ctx, canvas, changeStateBound);
  updateBossUI();

  if (result === "BOSS_KILLED" || result === "STAGE_CLEAR") {
    if (result === "BOSS_KILLED" && state.bossArenaMode) {
      handleBossArenaReward(gameLoop);
      return;
    }
    nextStageBound();
    return;
  }

  if (state.gameState === "PLAYING") {
    draw(ctx, canvas);
    state.loopId = requestAnimationFrame(gameLoop);
  }
}

setupInput(canvas);

// Kiểm tra đăng nhập TRƯỚC KHI hiện menu
initAuth(async () => {
  await syncRemoteState();
  changeStateBound("MENU");
});

UI.btnStart.onclick = () => startGame(gameLoop);

// Cửa hàng và Chọn nhân vật
setupMenuButtons(openShop, (newState) => {
  if (isAuthenticated()) {
    changeStateBound(newState);
  } else {
    showLoginScreen();
  }
});

// Boss Arena button setup
const arenaBtn = document.getElementById("btn-boss-arena");
if (arenaBtn) {
  arenaBtn.onclick = () => {
    if (isAuthenticated()) {
        openBossArena(changeStateBound, gameLoop);
    } else {
        showLoginScreen();
    }
  };
}
// Arena back button
const arenaBack = document.getElementById("btn-arena-back");
if (arenaBack) {
  arenaBack.onclick = () => {
    document.getElementById("screen-boss-arena").classList.add("hidden");
    document.getElementById("screen-main").classList.remove("hidden");
  };
}

// Chờ 1 chút để Auth init xử lý. Nếu có token sẽ tự hiện menu, nếu không sẽ hiện Login.
if (isAuthenticated()) {
    changeStateBound("MENU");
} else {
    showLoginScreen();
}

export { evolve };
