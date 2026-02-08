const TILE = 32;
const COLS = 25;
const ROWS = 15;

const BLOCKS = {
  0: { name: "Воздух", color: "transparent" },
  1: { name: "Трава", color: "#22c55e" },
  2: { name: "Земля", color: "#92400e" },
  3: { name: "Камень", color: "#9ca3af" },
  4: { name: "Дерево", color: "#a16207" },
  5: { name: "Вода", color: "#2563eb" }
};

const placeable = [1, 2, 3, 4, 5];
let selected = 1;

const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d");
const toolbar = document.getElementById("toolbar");

const world = Array.from({ length: ROWS }, (_, y) => {
  return Array.from({ length: COLS }, () => {
    if (y < 6) return 0;
    if (y === 6) return 1;
    if (y < 10) return 2;
    return 3;
  });
});

function addTree(x, baseY) {
  for (let y = baseY - 1; y > baseY - 4; y--) {
    if (y >= 0) world[y][x] = 4;
  }
  for (let y = baseY - 5; y <= baseY - 3; y++) {
    for (let dx = -1; dx <= 1; dx++) {
      const tx = x + dx;
      if (tx >= 0 && tx < COLS && y >= 0) {
        world[y][tx] = 1;
      }
    }
  }
}

for (let i = 2; i < COLS; i += 7) {
  addTree(i, 6);
}

for (let x = 12; x < 17; x++) {
  world[6][x] = 5;
  world[7][x] = 5;
}

function buildToolbar() {
  toolbar.innerHTML = "";

  placeable.forEach((id, idx) => {
    const btn = document.createElement("button");
    btn.className = `tool ${selected === id ? "active" : ""}`;
    btn.style.background = BLOCKS[id].color;
    btn.textContent = `${idx + 1}. ${BLOCKS[id].name}`;
    btn.type = "button";
    btn.addEventListener("click", () => {
      selected = id;
      buildToolbar();
    });

    toolbar.appendChild(btn);
  });
}

function drawGrid() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const id = world[y][x];
      if (id !== 0) {
        ctx.fillStyle = BLOCKS[id].color;
        ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      }
      ctx.strokeStyle = "rgba(15, 23, 42, 0.25)";
      ctx.strokeRect(x * TILE, y * TILE, TILE, TILE);
    }
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
}

function getTileFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = Math.floor(((event.clientX - rect.left) * scaleX) / TILE);
  const y = Math.floor(((event.clientY - rect.top) * scaleY) / TILE);
  return { x, y };
}

function inBounds(x, y) {
  return x >= 0 && x < COLS && y >= 0 && y < ROWS;
}

canvas.addEventListener("contextmenu", (e) => e.preventDefault());

canvas.addEventListener("mousedown", (event) => {
  const { x, y } = getTileFromEvent(event);
  if (!inBounds(x, y)) return;

  if (event.button === 0) {
    world[y][x] = 0;
  }

  if (event.button === 2) {
    world[y][x] = selected;
  }

  render();
});

window.addEventListener("keydown", (event) => {
  const n = Number(event.key);
  if (n >= 1 && n <= placeable.length) {
    selected = placeable[n - 1];
    buildToolbar();
  }
});

buildToolbar();
render();
