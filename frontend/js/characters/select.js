import { state } from "../state.js";
import { CHARACTERS, GHOST_DATA_KEY } from "../config.js";
import { saveGame } from "../utils.js";

export function openCharacterSelect(changeStateFn) {
  changeStateFn("MENU");
  document.getElementById("screen-main").classList.add("hidden");
  document.getElementById("screen-char-select").classList.remove("hidden");
  renderCharacterSelect();
}

export function renderCharacterSelect() {
  document.getElementById("char-coins").innerText =
    `Tiền: ${state.player?.coins || 0}`;
  let container = document.getElementById("char-cards");
  container.innerHTML = "";

  CHARACTERS.forEach((char) => {
    let owned = state.ownedCharacters.includes(char.id);
    let selected = state.selectedCharacter === char.id;
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${char.name} ${selected ? "(Đã chọn)" : ""}</h3>
      <p>HP: ${char.baseStats.hp}</p>
      <p>Tốc độ: ${char.baseStats.speed}</p>
    `;

    if (owned) {
      // Nút chọn nhân vật
      let selBtn = document.createElement("button");
      selBtn.innerText = selected ? "Đã chọn" : "Chọn";
      selBtn.disabled = selected;
      selBtn.onclick = () => {
        state.selectedCharacter = char.id;
        saveGame(state, GHOST_DATA_KEY);
        renderCharacterSelect();
      };
      card.appendChild(selBtn);

      // Nút nâng cấp HP
      let upgBtn = document.createElement("button");
      upgBtn.innerText = "Nâng cấp HP (100 coins)";
      upgBtn.onclick = () => {
        if (state.player.coins >= 100) {
          state.player.coins -= 100;
          let entry = state.characterUpgrades[char.id] || {
            hp: 0,
            speed: 0,
            fireRate: 0,
          };
          entry.hp = (entry.hp || 0) + 1;
          state.characterUpgrades[char.id] = entry;
          saveGame(state, GHOST_DATA_KEY);
          renderCharacterSelect();
        }
      };
      card.appendChild(upgBtn);
    } else {
      let lock = document.createElement("div");
      lock.innerText = "Chưa mở khóa";
      card.appendChild(lock);
    }

    container.appendChild(card);
  });
}

export function closeShopOrSelect() {
  document.getElementById("screen-shop").classList.add("hidden");
  document.getElementById("screen-char-select").classList.add("hidden");
  document.getElementById("screen-main").classList.remove("hidden");
}

export function setupMenuButtons(openShopFn, changeStateFn) {
  document.getElementById("btn-shop").onclick = () => openShopFn(changeStateFn);
  document.getElementById("btn-select-character").onclick = () =>
    openCharacterSelect(changeStateFn);
  document.getElementById("btn-shop-back").onclick = closeShopOrSelect;
  document.getElementById("btn-char-back").onclick = closeShopOrSelect;
}
