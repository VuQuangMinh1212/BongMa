import { state } from "./state.js";
import { GHOST_DATA_KEY } from "./config.js";
import {
  TOKEN_KEY,
  register,
  login,
  loadGameFromServer,
  saveGameToServer,
} from "./utils.js";

export let currentUser = null;

export function showLoginScreen() {
  document.getElementById("screen-login").classList.remove("hidden");
  document.getElementById("screen-main").classList.add("hidden");
}

export function showMainScreen() {
  document.getElementById("screen-login").classList.add("hidden");
  document.getElementById("screen-main").classList.remove("hidden");
}

export function initAuth(onAuthenticated) {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    showLoginScreen();
  } else {
    showMainScreen();
    setTimeout(() => onAuthenticated(), 0);
  }
}

export async function syncRemoteState() {
  let remote = await loadGameFromServer(currentUser);
  if (!remote || !remote.gameState) return;

  let saved = {
    level: remote.gameState.level || 1,
    runs: remote.gameState.runs || [],
    player: remote.gameState.player || null,
    ownedCharacters: remote.gameState.ownedCharacters || ["speedster"],
    selectedCharacter: remote.gameState.selectedCharacter || "speedster",
    characterUpgrades: remote.gameState.characterUpgrades || {},
  };
  localStorage.setItem(GHOST_DATA_KEY, JSON.stringify(saved));
}

export function persistState() {
  saveGameToServer(currentUser, state, GHOST_DATA_KEY);
}
