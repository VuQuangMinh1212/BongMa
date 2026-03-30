import { state } from "../state.js";
import { CHARACTERS, GHOST_DATA_KEY } from "../config.js";
import { saveGame } from "../utils.js";

export function openShop(changeStateFn) {
  changeStateFn("MENU");
  document.getElementById("screen-main").classList.add("hidden");
  document.getElementById("screen-shop").classList.remove("hidden");
  renderShop();
}

export function renderShop() {
  document.getElementById("shop-coins").innerText =
    `Tiền: ${state.player?.coins || 0}`;
  let container = document.getElementById("shop-cards");
  container.innerHTML = "";

  CHARACTERS.forEach((char) => {
    let owned = state.ownedCharacters.includes(char.id);
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${char.name}</h3>
      <p>Giá: ${char.price}</p>
      <p>${char.skills[0].desc}</p>
    `;

    let btn = document.createElement("button");
    btn.innerText = owned ? "Đã mở khóa" : "Mua";
    btn.disabled = owned || (state.player?.coins || 0) < char.price;
    btn.onclick = () => {
      if (!owned && state.player.coins >= char.price) {
        state.player.coins -= char.price;
        state.ownedCharacters.push(char.id);
        saveGame(state, GHOST_DATA_KEY);
        renderShop();
      }
    };

    card.appendChild(btn);
    container.appendChild(card);
  });
}
