const SET_THRESHOLD = 3;
const VARIETY_BONUS = 12;

const SETS = {
  carnivore: 3,
  herbivore: 4,
  biped: 5,
  quadruped: 5,
  aquatic: 7,
  avian: 7,
  triassic: 6,
  jurassic: 6,
  cretaceous: 6
};

const state = {};
Object.keys(SETS).forEach(k => state[k] = 0);

const tiles = document.querySelectorAll(".tile");

tiles.forEach(tile => {
  const key = tile.dataset.key;
  let pressTimer;

  tile.addEventListener("click", () => {
    state[key]++;
    updateTile(key);
  });

  tile.addEventListener("touchstart", () => {
    pressTimer = setTimeout(() => {
      state[key] = Math.max(0, state[key] - 1);
      updateTile(key);
    }, 500);
  });

  tile.addEventListener("touchend", () => {
    clearTimeout(pressTimer);
  });
});

function updateTile(key) {
  const tile = document.querySelector(`[data-key="${key}"]`);
  const count = state[key];

  tile.querySelector(".count").textContent = count;

  tile.classList.toggle("absent", count === 0);
  tile.classList.toggle("partial", count > 0 && count < SET_THRESHOLD);
  tile.classList.toggle("complete", count >= SET_THRESHOLD);

  updateScore();
}

function updateScore() {
  let score = 0;

  for (let key in state) {
    if (state[key] >= SET_THRESHOLD) {
      score += SETS[key];
    }
  }

  const varietyCount = Object.values(state).filter(v => v > 0).length;
  const varietyComplete = varietyCount === 9;

  if (varietyComplete) score += VARIETY_BONUS;

  document.getElementById("score").textContent = score;
  document.body.classList.toggle("variety-complete", varietyComplete);
}

document.getElementById("reset").onclick = () => {
  for (let key in state) state[key] = 0;
  Object.keys(state).forEach(updateTile);
};