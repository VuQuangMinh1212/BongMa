export function dist(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

export function saveGame(state, GHOST_DATA_KEY) {
  let savePlayer = { ...state.player };
  delete savePlayer.gracePeriod;
  localStorage.setItem(
    GHOST_DATA_KEY,
    JSON.stringify({
      level: state.currentLevel,
      runs: state.pastRuns,
      player: savePlayer,
      ownedCharacters: state.ownedCharacters,
      selectedCharacter: state.selectedCharacter,
      characterUpgrades: state.characterUpgrades,
    }),
  );
}

export async function saveGameToServer(username, state, GHOST_DATA_KEY) {
  saveGame(state, GHOST_DATA_KEY);
  if (!username) return;

  try {
    await fetch("http://localhost:3000/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        gameState: {
          level: state.currentLevel,
          runs: state.pastRuns,
          player: state.player,
          ownedCharacters: state.ownedCharacters,
          selectedCharacter: state.selectedCharacter,
          characterUpgrades: state.characterUpgrades,
        },
        coins: state.player?.coins || 0,
        ownedCharacters: state.ownedCharacters,
        selectedCharacter: state.selectedCharacter,
        characterUpgrades: state.characterUpgrades,
      }),
    });
  } catch (error) {
    console.warn("Save to server failed, offline mode:", error);
  }
}

export async function loadGameFromServer(username) {
  if (!username) return null;

  try {
    let res = await fetch(
      `http://localhost:3000/api/load?username=${encodeURIComponent(username)}`,
    );
    if (!res.ok) return null;
    let json = await res.json();
    return json;
  } catch (error) {
    console.warn("Load from server failed, offline mode:", error);
    return null;
  }
}
