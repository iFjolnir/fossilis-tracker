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
  updateVarietyIcons(state);

  const completeNow = isVarietyComplete(state);
  if (completeNow && !varietyCelebrated) {
    varietyCelebrated = true;
    popConfetti();
  }
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

  varietyCelebrated = false; // ← IMPORTANT

  Object.keys(state).forEach(updateTile);
};


function updateVarietyIcons(state) {
  const icons = document.querySelectorAll('#variety-icons img');

  icons.forEach(icon => {
    const key = icon.dataset.key;
    const count = state[key] || 0;

    // Missing types should be visible; owned types should fade out.
    if (count > 0) {
      icon.style.opacity = '0.1';
    } else {
      icon.style.opacity = '1';
    }
  });
}

const VARIETY_KEYS = [
  "carnivore",
  "herbivore",
  "biped",
  "quadruped",
  "aquatic",
  "avian",
  "triassic",
  "jurassic",
  "cretaceous",
];

let varietyCelebrated = false;

function isVarietyComplete(state) {
  return VARIETY_KEYS.every(k => (state[k] || 0) > 0);
}

function popConfetti() {
  const count = 40;        // more satisfying
  const durationMs = 2000; // longer
const rootStyles = getComputedStyle(document.documentElement);

const confettiColors = [
  rootStyles.getPropertyValue("--carnivore-bg").trim(),
  rootStyles.getPropertyValue("--herbivore-bg").trim(),
  rootStyles.getPropertyValue("--biped-bg").trim(),
  rootStyles.getPropertyValue("--quadruped-bg").trim(),
  rootStyles.getPropertyValue("--aquatic-bg").trim(),
  rootStyles.getPropertyValue("--avian-bg").trim(),
  rootStyles.getPropertyValue("--triassic-bg").trim(),
  rootStyles.getPropertyValue("--jurassic-bg").trim(),
  rootStyles.getPropertyValue("--cretaceous-bg").trim(),

];


  // Find dashboard area as the origin
  const dash = document.getElementById("dashboard");
  const rect = dash.getBoundingClientRect();

  const originX = rect.left + rect.width * 0.25; // near Variety area
  const originY = rect.top + rect.height * 0.55;


  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    p.className = "confetti";
    p.style.left = `${originX}px`;
    p.style.top = `${originY}px`;

    // random motion
    const dx = (Math.random() - 0.5) * 280;      // spread sideways
    const dy = -120 - Math.random() * 220;       // shoot upward
    const rot = (Math.random() - 0.5) * 720;     // spin
    const delay = Math.random() * 80;

    p.style.setProperty("--dx", `${dx}px`);
    p.style.setProperty("--dy", `${dy}px`);
    p.style.setProperty("--rot", `${rot}deg`);
    p.style.animationDelay = `${delay}ms`;

    document.body.appendChild(p);

    setTimeout(() => p.remove(), durationMs + delay + 150);
  }
}



updateVarietyIcons(state);
updateScore();

