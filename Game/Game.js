/* ============================================================
   CROSSBOW KINGDOM — Goblin Siege
   FULL JS — PART 1 / 2
   ============================================================ */

/* =========================
   CANVAS / RESIZE
   ========================= */
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = Math.floor(window.innerWidth * devicePixelRatio);
  canvas.height = Math.floor(window.innerHeight * devicePixelRatio);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resize);
resize();

/* =========================
   UI ELEMENTS
   ========================= */
const screenMenu = document.getElementById("screenMenu");
const screenBossSelect = document.getElementById("screenBossSelect");
const screenPause = document.getElementById("screenPause");
const screenGameOver = document.getElementById("screenGameOver");
const screenShop = document.getElementById("screenShop");

const btnStart = document.getElementById("btnStart");
const btnTestBosses = document.getElementById("btnTestBosses");
const btnBossSelectBack = document.getElementById("btnBossSelectBack");
const btnContinue = document.getElementById("btnContinue");
const btnRestartFromPause = document.getElementById("btnRestartFromPause");
const btnBackToMenu = document.getElementById("btnBackToMenu");
const btnRestart = document.getElementById("btnRestart");
const btnMenuFromOver = document.getElementById("btnMenuFromOver");
const btnShopContinue = document.getElementById("btnShopContinue");
const btnShopBackMenu = document.getElementById("btnShopBackMenu");

const hpHearts = document.getElementById("hpHearts");
const regenText = document.getElementById("regenText");
const waveText = document.getElementById("waveText");
const killsText = document.getElementById("killsText");
const scoreText = document.getElementById("scoreText");
const coinsText = document.getElementById("coinsText");
const gameOverStats = document.getElementById("gameOverStats");

const shopCoinsText = document.getElementById("shopCoinsText");
const shopWaveText = document.getElementById("shopWaveText");
const shopSubtitle = document.getElementById("shopSubtitle");
const upgradeList = document.getElementById("upgradeList");
const bossSelectList = document.getElementById("bossSelectList");

const difficultyButtons = [...document.querySelectorAll(".difficultyBtn")];

/* =========================
   SCREEN CONTROL
   ========================= */
function setScreen(which) {
  for (const el of [screenMenu, screenBossSelect, screenPause, screenGameOver, screenShop]) {
    el.classList.remove("active");
  }
  if (which === "menu") screenMenu.classList.add("active");
  if (which === "bossSelect") screenBossSelect.classList.add("active");
  if (which === "pause") screenPause.classList.add("active");
  if (which === "over") screenGameOver.classList.add("active");
  if (which === "shop") screenShop.classList.add("active");
}

/* =========================
   HELPERS / CONSTANTS
   ========================= */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const dist2 = (ax, ay, bx, by) => {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
};
const rand = (a, b) => a + Math.random() * (b - a);
const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;

const ARENA_PAD = 40;
const PLAYER_R = 20;
const ARROW_R = 4;
const COIN_PICKUP_R = 18;

const BASE_PLAYER_SPEED = 220;
const BASE_FIRE_COOLDOWN = 0.28;
const BASE_ARROW_SPEED = 720;
const BASE_ARROW_DAMAGE = 1;

const BASE_DASH_SPEED = 620;
const BASE_DASH_TIME = 0.18;
const BASE_DASH_CD = 2.6;

const MAX_HP = 3;
const REGEN_INTERVAL = 10.0;
const REGEN_GRACE = 0.0;

const WAVE_REST = 1.2;
const BASE_SPAWNS = 10;
const SPAWNS_PER_WAVE = 3;
const MAX_ALIVE = 26;

const ENEMY_SPRITE_SIZE = 148;

/* герой 610x409 */
const HERO_WIDTH = 610;
const HERO_HEIGHT = 409;
const HERO_SCALE = 0.42;
const HERO_DRAW_W = HERO_WIDTH * HERO_SCALE;
const HERO_DRAW_H = HERO_HEIGHT * HERO_SCALE;

const DIFFICULTIES = {
  easy: {
    label: "EASY",
    spawnMult: 0.8,
    enemySpeedMult: 0.88,
    enemyHpMult: 0.9,
    bossHpMult: 0.88,
    coinMult: 1.05
  },
  medium: {
    label: "MEDIUM",
    spawnMult: 1.0,
    enemySpeedMult: 1.0,
    enemyHpMult: 1.0,
    bossHpMult: 1.0,
    coinMult: 1.0
  },
  hard: {
    label: "HARD",
    spawnMult: 1.28,
    enemySpeedMult: 1.16,
    enemyHpMult: 1.18,
    bossHpMult: 1.24,
    coinMult: 1.1
  }
};

/* =========================
   ASSETS
   ========================= */
const ASSET_URLS = {
  background: "https://i.postimg.cc/9M71sVYr/1022f9d4-4e0b-4d47-9159-e8bd4ce14a7a.jpg",
  hero: "https://i.postimg.cc/XY1GGCvC/2026-02-23-40a37915-9c97-4063-b18c-591936f677c2.png",
  heroShoot: "https://i.postimg.cc/XY1GGCvC/2026-02-23-40a37915-9c97-4063-b18c-591936f677c2.png",

  goblin1: "https://i.postimg.cc/sDft6QVW/image-7-removebg-preview.png",
  goblin2: "https://i.postimg.cc/SsqZn3R6/image-6-removebg-preview.png",
  goblin3: "https://i.postimg.cc/xTW3khpw/image-11-removebg-preview.png",
  goblin4: "https://i.postimg.cc/B6V1rPrF/image-10-removebg-preview.png",

  boss_warlord_idle: "https://i.postimg.cc/QxfLXJ0Z/mec.png",
  boss_warlord_attack: "https://i.postimg.cc/k5xf5n9k/mec.png",

  boss_archer_idle: "https://i.postimg.cc/Pq80QsH6/luk.png",
  boss_archer_attack: "https://i.postimg.cc/2jHTy9R8/luk.png",

  boss_shaman_idle: "https://i.postimg.cc/jdLc76ty/mag.png",
  boss_shaman_attack: "https://i.postimg.cc/2jHTy9R8/luk.png",

  boss_brute_idle: "https://i.postimg.cc/xjPhRPrn/molot.png",
  boss_brute_attack: "https://i.postimg.cc/PxTKpB5J/molot.png",

  boss_hydra_idle: "https://i.postimg.cc/9F8S3FQ3/hudra.png",
  boss_hydra_attack: "https://i.postimg.cc/J42T66pw/hudra.png",

  boss_final_idle: "https://i.postimg.cc/kgLp41Sz/skel.png",
  boss_final_attack: "https://i.postimg.cc/SsddWDXq/skel.png",
  boss_final_p2_idle: "https://i.postimg.cc/tTjvds2q/skelet.png",
  boss_final_p2_attack: "https://i.postimg.cc/GtSjftJD/skel-2.png"
};

function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

const IMG = {};

async function loadAssets() {
  const keys = Object.keys(ASSET_URLS);
  const loaded = await Promise.all(keys.map((k) => loadImage(ASSET_URLS[k])));
  keys.forEach((k, i) => (IMG[k] = loaded[i]));
}

/* =========================
   MUSIC
   ========================= */
const music = new Audio();
music.loop = true;
music.volume = 0.45;
music.preload = "auto";
music.crossOrigin = "anonymous";
music.src = "https://files.catbox.moe/eyoauo.mp3";

let currentMusicUrl = music.src;
let musicUnlocked = false;

function unlockMusic() {
  if (musicUnlocked) return;
  musicUnlocked = true;
  music.play().catch(() => {});
}

async function setMusicFromUrl(url) {
  if (!url) return;
  const trimmed = url.trim();
  if (!trimmed) return;

  try {
    if (!music.paused) music.pause();
    currentMusicUrl = trimmed;
    music.src = trimmed;
    music.load();
    if (musicUnlocked) await music.play();
  } catch (err) {
    console.error("Music load/play error:", err);
    alert("Не удалось загрузить музыку по этой ссылке.");
  }
}

async function promptMusicUrl() {
  const url = prompt("Вставь прямую ссылку на музыку (.mp3 / .ogg / .wav):", currentMusicUrl || "");
  if (url === null) return;
  await setMusicFromUrl(url);
}

function toggleMusicPause() {
  if (!currentMusicUrl) return;
  if (music.paused) music.play().catch(() => {});
  else music.pause();
}

/* =========================
   SIMPLE SFX
   ========================= */
let audioCtx = null;

function ensureAudioCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
}

function playBeep(freq = 440, duration = 0.06, type = "square", volume = 0.03) {
  ensureAudioCtx();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

function sfxShoot() { playBeep(840, 0.04, "square", 0.018); }
function sfxHit() { playBeep(220, 0.05, "sawtooth", 0.02); }
function sfxCoin() { playBeep(1200, 0.06, "triangle", 0.02); }
function sfxBossCast() { playBeep(180, 0.12, "sawtooth", 0.025); }

/* =========================
   BOSS ORDER
   ========================= */
const BOSS_ORDER = [
  { key: "warlord", name: "GOBLIN WARLORD" },
  { key: "archerlord", name: "SKELETON ARCHER LORD" },
  { key: "shaman", name: "GOBLIN SHAMAN" },
  { key: "brute", name: "GIANT SKELETON KNIGHT" },
  { key: "hydra", name: "ANCIENT HYDRA" },
  { key: "swordmaster", name: "GREAT SKELETON SWORDMASTER" }
];

/* =========================
   UPGRADES
   ========================= */
const UPGRADE_DEFS = [
  { id: "damage", name: "Heavy Bolts", desc: "+1 урон стрелам", baseCost: 18, max: 5, apply() { state.upgrades.damage += 1; } },
  { id: "fireRate", name: "Fast Reload", desc: "Скорострельность выше", baseCost: 20, max: 6, apply() { state.upgrades.fireRate += 1; } },
  { id: "arrowSpeed", name: "Swift Arrows", desc: "Стрелы летят быстрее", baseCost: 15, max: 5, apply() { state.upgrades.arrowSpeed += 1; } },
  { id: "slow", name: "Frost String", desc: "Стрелы замедляют врагов", baseCost: 24, max: 4, apply() { state.upgrades.slow += 1; } },
  { id: "moveSpeed", name: "Scout Boots", desc: "Игрок бегает быстрее", baseCost: 18, max: 5, apply() { state.upgrades.moveSpeed += 1; } },
  { id: "dashSpeed", name: "Long Dash", desc: "Дэш быстрее и длиннее", baseCost: 22, max: 5, apply() { state.upgrades.dashSpeed += 1; } },
  { id: "dashCd", name: "Dash Training", desc: "Меньше кулдаун дэша", baseCost: 22, max: 5, apply() { state.upgrades.dashCd += 1; } },
  { id: "crit", name: "Sharpened Tips", desc: "Шанс критического урона", baseCost: 26, max: 5, apply() { state.upgrades.crit += 1; } },
  { id: "coinBoost", name: "Treasure Gloves", desc: "С врагов падает больше монет", baseCost: 20, max: 5, apply() { state.upgrades.coinBoost += 1; } },
  { id: "magnet", name: "Coin Magnet", desc: "Монеты притягиваются дальше", baseCost: 18, max: 4, apply() { state.upgrades.magnet += 1; } },

  /* passive upgrades */
  { id: "passiveBerserk", name: "Passive: Berserk", desc: "На low HP выше скорострельность", baseCost: 30, max: 1, apply() { state.upgrades.passiveBerserk = 1; } },
  { id: "passiveAegis", name: "Passive: Aegis", desc: "После получения урона дольше неуязвимость", baseCost: 32, max: 1, apply() { state.upgrades.passiveAegis = 1; } },
  { id: "passiveGreed", name: "Passive: Greed", desc: "Монеты чаще выпадают по 2", baseCost: 28, max: 1, apply() { state.upgrades.passiveGreed = 1; } },
  { id: "passiveRush", name: "Passive: Rush", desc: "После дэша короткое ускорение", baseCost: 28, max: 1, apply() { state.upgrades.passiveRush = 1; } },
  { id: "passiveBlood", name: "Passive: Blood Bolts", desc: "Криты создают маленький кровавый взрыв", baseCost: 34, max: 1, apply() { state.upgrades.passiveBlood = 1; } }
];

function getUpgradeLevel(id) {
  return state.upgrades[id] || 0;
}

function getUpgradeCost(def) {
  const lvl = getUpgradeLevel(def.id);
  return Math.floor(def.baseCost * (1 + lvl * 0.55));
}

function renderUpgradeShop() {
  upgradeList.innerHTML = "";
  shopCoinsText.textContent = state.testMode ? "∞" : String(Math.floor(state.coins));
  shopWaveText.textContent = String(state.wave);

  for (const def of UPGRADE_DEFS) {
    const lvl = getUpgradeLevel(def.id);
    const cost = getUpgradeCost(def);
    const maxed = lvl >= def.max;

    const card = document.createElement("div");
    card.className = "upgradeCard";

    const left = document.createElement("div");
    left.innerHTML = `
      <h4>${def.name} ${lvl > 0 ? `Lv.${lvl}` : ""}</h4>
      <p>${def.desc}</p>
    `;

    const meta = document.createElement("div");
    meta.className = "upgradeMeta";

    const price = document.createElement("div");
    price.innerHTML = maxed ? `<strong>MAX</strong>` : `<strong>${cost} coins</strong>`;

    const btn = document.createElement("button");
    btn.className = "btn buyBtn";
    btn.textContent = maxed ? "MAXED" : "BUY";

    const canBuy = state.testMode || state.coins >= cost;
    if (maxed) btn.classList.add("maxed");
    else if (canBuy) btn.classList.add("afford");

    btn.disabled = maxed || (!canBuy && !state.testMode);

    btn.addEventListener("click", () => {
      if (maxed) return;
      if (!state.testMode && state.coins < cost) return;
      if (!state.testMode) state.coins -= cost;
      def.apply();
      applyDerivedStats();
      renderUpgradeShop();
      updateUI();
    });

    meta.appendChild(price);
    meta.appendChild(btn);
    card.appendChild(left);
    card.appendChild(meta);
    upgradeList.appendChild(card);
  }
}

/* =========================
   INPUT
   ========================= */
const keys = new Set();
let mouseX = 0;
let mouseY = 0;
let mouseDown = false;

window.addEventListener("keydown", async (e) => {
  keys.add(e.code);

  if (e.code === "Escape") {
    if (state.mode === "playing") pauseGame();
    else if (state.mode === "paused") resumeGame();
  }

  if (e.code === "KeyM") {
    unlockMusic();
    await promptMusicUrl();
  }

  if (e.code === "KeyP") {
    toggleMusicPause();
  }
});

window.addEventListener("keyup", (e) => keys.delete(e.code));

canvas.addEventListener("mousemove", (e) => {
  const r = canvas.getBoundingClientRect();
  mouseX = e.clientX - r.left;
  mouseY = e.clientY - r.top;
});

canvas.addEventListener("mousedown", () => {
  mouseDown = true;
  unlockMusic();
  ensureAudioCtx();
});

window.addEventListener("mouseup", () => (mouseDown = false));

/* =========================
   GAME STATE
   ========================= */
const state = {
  mode: "menu",
  t: 0,
  dt: 0,
  lastTime: 0,

  kills: 0,
  score: 0,
  coins: 0,

  selectedDifficulty: "medium",

  wave: 1,
  waveSpawnsTotal: 0,
  waveSpawnsDone: 0,
  waveAlivePeak: 0,
  waveIsBoss: false,
  waveBossKey: null,

  nextSpawnAt: 0,
  waveEndsAt: 0,

  arena: { x: 0, y: 0, w: 0, h: 0 },

  arrows: [],
  goblins: [],
  bossProjectiles: [],
  bosses: [],
  particles: [],
  coinsDrop: [],

  assetsReady: false,

  testMode: false,
  queuedBossKey: null,

  waveBanner: {
    text: "",
    t: 0,
    life: 0
  },

  upgrades: {
    damage: 0,
    fireRate: 0,
    arrowSpeed: 0,
    slow: 0,
    moveSpeed: 0,
    dashSpeed: 0,
    dashCd: 0,
    crit: 0,
    coinBoost: 0,
    magnet: 0,

    passiveBerserk: 0,
    passiveAegis: 0,
    passiveGreed: 0,
    passiveRush: 0,
    passiveBlood: 0
  },

  derived: {
    playerSpeed: BASE_PLAYER_SPEED,
    fireCooldown: BASE_FIRE_COOLDOWN,
    arrowSpeed: BASE_ARROW_SPEED,
    arrowDamage: BASE_ARROW_DAMAGE,
    dashSpeed: BASE_DASH_SPEED,
    dashTime: BASE_DASH_TIME,
    dashCd: BASE_DASH_CD,
    critChance: 0,
    slowAmount: 0,
    magnet: 220
  }
};

const player = {
  x: 200,
  y: 200,
  vx: 0,
  vy: 0,
  hp: MAX_HP,
  regenTimer: REGEN_INTERVAL,
  lastHitAgo: 999,

  fireCd: 0,
  shootFlash: 0,

  dashCd: 0,
  dashing: false,
  dashT: 0,
  dashDirX: 0,
  dashDirY: 0,

  rushT: 0,
  invuln: 0
};

/* =========================
   DERIVED STATS
   ========================= */
function applyDerivedStats() {
  state.derived.playerSpeed = BASE_PLAYER_SPEED + state.upgrades.moveSpeed * 18;
  state.derived.fireCooldown = Math.max(0.11, BASE_FIRE_COOLDOWN - state.upgrades.fireRate * 0.025);
  state.derived.arrowSpeed = BASE_ARROW_SPEED + state.upgrades.arrowSpeed * 90;
  state.derived.arrowDamage = BASE_ARROW_DAMAGE + state.upgrades.damage;
  state.derived.dashSpeed = BASE_DASH_SPEED + state.upgrades.dashSpeed * 70;
  state.derived.dashTime = BASE_DASH_TIME + state.upgrades.dashSpeed * 0.015;
  state.derived.dashCd = Math.max(0.75, BASE_DASH_CD - state.upgrades.dashCd * 0.24);
  state.derived.critChance = state.upgrades.crit * 0.08;
  state.derived.slowAmount = state.upgrades.slow * 0.11;
  state.derived.magnet = 220 + state.upgrades.magnet * 60;
}

/* =========================
   RESET / ARENA
   ========================= */
function resetRun() {
  state.t = 0;
  state.kills = 0;
  state.score = 0;
  state.coins = state.testMode ? 999999 : 0;

  state.wave = 1;
  state.waveSpawnsTotal = 0;
  state.waveSpawnsDone = 0;
  state.waveAlivePeak = 0;
  state.waveIsBoss = false;
  state.waveBossKey = null;

  state.arrows.length = 0;
  state.goblins.length = 0;
  state.bossProjectiles.length = 0;
  state.bosses.length = 0;
  state.particles.length = 0;
  state.coinsDrop.length = 0;

  state.upgrades = {
    damage: 0,
    fireRate: 0,
    arrowSpeed: 0,
    slow: 0,
    moveSpeed: 0,
    dashSpeed: 0,
    dashCd: 0,
    crit: 0,
    coinBoost: 0,
    magnet: 0,

    passiveBerserk: 0,
    passiveAegis: 0,
    passiveGreed: 0,
    passiveRush: 0,
    passiveBlood: 0
  };
  applyDerivedStats();

  player.x = state.arena.x + state.arena.w * 0.35;
  player.y = state.arena.y + state.arena.h * 0.55;
  player.vx = 0;
  player.vy = 0;
  player.hp = MAX_HP;
  player.regenTimer = REGEN_INTERVAL;
  player.lastHitAgo = 999;
  player.fireCd = 0;
  player.shootFlash = 0;
  player.dashCd = 0;
  player.dashing = false;
  player.dashT = 0;
  player.rushT = 0;
  player.invuln = 0;

  if (state.testMode && state.queuedBossKey) {
    state.wave = 3;
    state.waveIsBoss = true;
    state.waveBossKey = state.queuedBossKey;
    state.waveSpawnsDone = 0;
    state.nextSpawnAt = state.t + 0.6;
    showShop(`Подготовка к бою: ${getBossConfig(state.waveBossKey).name}`, "START BOSS");
  } else {
    startWave(1);
  }
}

function updateArena() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  state.arena.x = ARENA_PAD;
  state.arena.y = ARENA_PAD + 64;
  state.arena.w = w - ARENA_PAD * 2;
  state.arena.h = h - (ARENA_PAD + 64) - ARENA_PAD;

  player.x = clamp(player.x, state.arena.x + PLAYER_R, state.arena.x + state.arena.w - PLAYER_R);
  player.y = clamp(player.y, state.arena.y + PLAYER_R, state.arena.y + state.arena.h - PLAYER_R);
}

/* =========================
   PARTICLES / FX
   ========================= */
function puff(x, y, n, power, color = "255,255,255") {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU;
    const s = (35 + Math.random() * 140) * (power || 1);
    state.particles.push({
      kind: "puff",
      x, y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      t: 0,
      life: 0.35 + Math.random() * 0.35,
      r: 1.5 + Math.random() * 2.5,
      color
    });
  }
}

function ring(x, y, radius, color = "255,255,255") {
  state.particles.push({
    kind: "ring",
    x, y,
    radius,
    t: 0,
    life: 0.45,
    color
  });
}

function showWaveBanner(text) {
  state.waveBanner.text = text;
  state.waveBanner.t = 0;
  state.waveBanner.life = 2.0;
}

/* =========================
   COINS
   ========================= */
function dropCoins(x, y, amount) {
  for (let i = 0; i < amount; i++) {
    const a = Math.random() * TAU;
    const d = rand(12, 34);
    state.coinsDrop.push({
      x: x + Math.cos(a) * d,
      y: y + Math.sin(a) * d,
      vx: Math.cos(a) * rand(20, 80),
      vy: Math.sin(a) * rand(20, 80),
      t: 0,
      life: 14,
      value: 1
    });
  }
}

function coinDropCount(base) {
  const extra = Math.floor(state.upgrades.coinBoost * 0.4);
  const mult = DIFFICULTIES[state.selectedDifficulty].coinMult;
  let amount = Math.max(1, Math.round((base + extra) * mult));
  if (state.upgrades.passiveGreed && Math.random() < 0.28) amount += 1;
  return amount;
}

/* =========================
   BOSS CONFIG / WAVES
   ========================= */
function difficultyData() {
  return DIFFICULTIES[state.selectedDifficulty];
}

function getBossConfig(key) {
  if (key === "warlord") return { key, name: "GOBLIN WARLORD", hp: 95, speed: 94, r: 40, color: "90,150,60" };
  if (key === "archerlord") return { key, name: "SKELETON ARCHER LORD", hp: 84, speed: 80, r: 36, color: "200,210,220" };
  if (key === "shaman") return { key, name: "GOBLIN SHAMAN", hp: 92, speed: 82, r: 38, color: "120,80,190" };
  if (key === "brute") return { key, name: "GIANT SKELETON KNIGHT", hp: 118, speed: 72, r: 46, color: "120,110,40" };
  if (key === "hydra") return { key, name: "ANCIENT HYDRA", hp: 110, speed: 88, r: 42, color: "180,220,200" };
  return { key, name: "GREAT SKELETON SWORDMASTER", hp: 160, speed: 118, r: 42, color: "210,210,230" };
}

function bossKeyForWave(wave) {
  const idx = Math.floor(wave / 3) - 1;
  return BOSS_ORDER[idx % BOSS_ORDER.length].key;
}

function startWave(n) {
  state.wave = n;
  state.waveSpawnsDone = 0;
  state.waveAlivePeak = 0;
  state.waveIsBoss = n % 3 === 0;
  state.waveEndsAt = Infinity;
  state.waveBossKey = state.waveIsBoss ? bossKeyForWave(n) : null;

  if (state.waveIsBoss) {
    state.waveSpawnsTotal = 0;
    state.nextSpawnAt = state.t + 0.9;
    showWaveBanner(`BOSS WAVE-${n}`);
  } else {
    const diff = difficultyData();
    state.waveSpawnsTotal = Math.floor((BASE_SPAWNS + (n - 1) * SPAWNS_PER_WAVE) * diff.spawnMult);
    state.nextSpawnAt = state.t + 0.35;
    showWaveBanner(`ВОЛНА-${n}`);
  }
}

function scheduleNextSpawn() {
  state.nextSpawnAt = state.t + rand(0.12, 0.42);
}

function spawnBoss() {
  const cfg = getBossConfig(state.waveBossKey);
  const diff = difficultyData();
  const a = state.arena;
  const hp = Math.round((cfg.hp + state.wave * 8) * diff.bossHpMult);

  const boss = {
    kind: cfg.key,
    name: cfg.name,
    x: a.x + a.w * 0.68,
    y: a.y + a.h * 0.34,
    vx: 0,
    vy: 0,
    r: cfg.r,
    hp,
    maxHp: hp,
    speed: cfg.speed * diff.enemySpeedMult,
    touchDamage: 1,
    hurtT: 0,
    color: cfg.color,

    attackState: "idle",
    attackTimer: 0.8,
    phaseTimer: 0,
    shotTimer: 0,
    swordAngle: 0,
    spawnT: 0,
    summonTag: `${cfg.key}_${Math.random().toString(36).slice(2)}`,

    phase: 1,
    cooldownMul: 1,
    speedMul: 1
  };

  state.bosses.push(boss);
  puff(boss.x, boss.y, 40, 1.5, cfg.color);
  ring(boss.x, boss.y, 26, cfg.color);
  sfxBossCast();
}

function spawnGoblin(typeForced = null, xForced = null, yForced = null, special = false, ownerBossTag = null) {
  if (!typeForced && state.goblins.length >= MAX_ALIVE) return;

  const w = state.wave;
  const diff = difficultyData();
  let type = typeForced || "easy";

  if (!typeForced) {
    const roll = Math.random();
    const hardChance = clamp((w - 4) * 0.07, 0, 0.48);
    const medChance = clamp((w - 1) * 0.10, 0.18, 0.68);

    if (roll < hardChance) type = Math.random() < 0.55 ? "hardFast" : "hardBrute";
    else if (roll < hardChance + medChance) type = "medium";
    else type = "easy";
  }

  const a = state.arena;
  let x = xForced;
  let y = yForced;

  if (x == null || y == null) {
    const side = Math.floor(Math.random() * 4);
    if (side === 0) { x = a.x + 10; y = a.y + Math.random() * a.h; }
    if (side === 1) { x = a.x + a.w - 10; y = a.y + Math.random() * a.h; }
    if (side === 2) { x = a.x + Math.random() * a.w; y = a.y + 10; }
    if (side === 3) { x = a.x + Math.random() * a.w; y = a.y + a.h - 10; }
  }

  let g = {
    type,
    x, y,
    vx: 0, vy: 0,
    r: 22,
    hp: 1,
    maxHp: 1,
    speed: 90,
    dmg: 1,
    armor: 0,
    imgKey: "goblin1",
    hurtT: 0,
    atkCd: 0,
    special,
    ownerBossTag,
    spawnT: 0,
    slowT: 0,
    slowFactor: 1
  };

  if (type === "easy") {
    g.hp = 2;
    g.speed = 92;
    g.r = 22;
    g.imgKey = "goblin1";
  } else if (type === "medium") {
    g.hp = 3;
    g.speed = 138;
    g.r = 24;
    g.imgKey = "goblin2";
  } else if (type === "hardFast") {
    g.hp = 5;
    g.speed = 174;
    g.r = 25;
    g.armor = 1;
    g.imgKey = "goblin3";
  } else if (type === "hardBrute") {
    g.hp = 8;
    g.speed = 108;
    g.r = 30;
    g.armor = 1;
    g.imgKey = "goblin4";
  }

  if (!special) {
    g.hp = Math.round((g.hp + Math.floor((w - 1) * 0.24)) * diff.enemyHpMult);
    g.speed *= diff.enemySpeedMult;
  } else {
    g.hp += 1;
    g.speed += 10;
  }

  g.maxHp = g.hp;

  state.goblins.push(g);
  state.waveAlivePeak = Math.max(state.waveAlivePeak, state.goblins.length);
  puff(x, y, 10, 1, "120,255,120");
}

/* =========================
   PLAYER SHOOT / DASH / DAMAGE
   ========================= */
function tryShoot() {
  if (player.fireCd > 0) return;

  const dx = mouseX - player.x;
  const dy = mouseY - player.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;

  const ax = player.x + ux * (PLAYER_R + 10);
  const ay = player.y + uy * (PLAYER_R + 10);

  let dmg = state.derived.arrowDamage;
  const crit = Math.random() < state.derived.critChance;
  if (crit) dmg *= 2;

  state.arrows.push({
    x: ax,
    y: ay,
    vx: ux * state.derived.arrowSpeed,
    vy: uy * state.derived.arrowSpeed,
    r: ARROW_R,
    dmg,
    life: 6.0, /* x5 longer */
    crit
  });

  player.fireCd = state.derived.fireCooldown;

  if (state.upgrades.passiveBerserk && player.hp === 1) {
    player.fireCd *= 0.72;
  }

  player.shootFlash = 0.12;
  puff(ax, ay, 7, 0.65, crit ? "255,120,120" : "255,220,120");
  sfxShoot();
}

function startDash() {
  if (player.dashCd > 0) return;
  if (player.dashing) return;

  let dx = 0;
  let dy = 0;
  if (keys.has("KeyA")) dx -= 1;
  if (keys.has("KeyD")) dx += 1;
  if (keys.has("KeyW")) dy -= 1;
  if (keys.has("KeyS")) dy += 1;

  if (dx === 0 && dy === 0) {
    dx = mouseX - player.x;
    dy = mouseY - player.y;
  }

  const len = Math.hypot(dx, dy) || 1;
  dx /= len;
  dy /= len;

  player.dashing = true;
  player.dashT = state.derived.dashTime;
  player.dashDirX = dx;
  player.dashDirY = dy;
  player.dashCd = state.derived.dashCd;

  if (state.upgrades.passiveRush) {
    player.rushT = 1.0;
  }
}

function damagePlayer(amount) {
  if (state.mode !== "playing") return;
  if (player.invuln > 0) return;

  player.hp -= amount;
  player.hp = Math.max(0, player.hp);
  player.lastHitAgo = 0;
  player.invuln = state.upgrades.passiveAegis ? 0.55 : 0.35;

  puff(player.x, player.y, 18, 1.2, "255,80,120");
  ring(player.x, player.y, 18, "255,80,120");
  sfxHit();

  if (player.hp <= 0) endGame();
}

function damageGoblin(g, dmg) {
  const real = Math.max(1, dmg - (g.armor || 0));
  g.hp -= real;
  g.hurtT = 0.15;
  puff(g.x, g.y, 10, 0.9, "120,255,120");

  if (state.derived.slowAmount > 0) {
    g.slowT = 1.15;
    g.slowFactor = 1 - state.derived.slowAmount;
  }

  if (g.hp <= 0) {
    state.kills += 1;
    state.score += 10 + state.wave * 2;
    dropCoins(g.x, g.y, coinDropCount(g.special ? 2 : 1));
    puff(g.x, g.y, 24, 1.1, "180,255,180");
    const idx = state.goblins.indexOf(g);
    if (idx >= 0) state.goblins.splice(idx, 1);
  }
}

function damageBoss(b, dmg) {
  let real = dmg;
  if (b.attackState === "block") real *= 0.22;

  b.hp -= real;
  b.hurtT = 0.15;
  puff(b.x, b.y, 14, 1.0, "255,170,90");

  if (state.upgrades.passiveBlood && dmg > state.derived.arrowDamage) {
    const count = 6;
    for (let i = 0; i < count; i++) {
      const a = (TAU / count) * i;
      bossFireProjectile(b.x, b.y, a, 180, 4, "255,80,90", 0.5, 0.35, "bloodBurst");
    }
  }

  if (b.hp <= 0) {
    state.kills += 12;
    state.score += 260 + state.wave * 30;
    dropCoins(b.x, b.y, coinDropCount(12));

    if (b.kind === "shaman") {
      state.goblins = state.goblins.filter(g => g.ownerBossTag !== b.summonTag);
    }

    puff(b.x, b.y, 54, 1.9, "255,220,120");
    ring(b.x, b.y, 40, "255,220,120");
    const idx = state.bosses.indexOf(b);
    if (idx >= 0) state.bosses.splice(idx, 1);
  }
}

/* =========================
   BOSS PROJECTILES / AI HELPERS
   ========================= */
function bossFireProjectile(x, y, ang, speed, r, color, damage, life, kind = "orb", extra = {}) {
  state.bossProjectiles.push({
    x, y,
    vx: Math.cos(ang) * speed,
    vy: Math.sin(ang) * speed,
    r,
    color,
    damage,
    life,
    kind,
    ...extra
  });
}

function bossPhaseUpdate(b) {
  if (b.phase === 1 && b.hp <= b.maxHp * 0.5) {
    b.phase = 2;
    b.cooldownMul = b.kind === "swordmaster" ? 0.52 : 0.65;
    b.speedMul = b.kind === "swordmaster" ? 1.38 : 1.25;
    puff(b.x, b.y, 26, 1.2, b.color);
    ring(b.x, b.y, 34, b.color);
    sfxBossCast();
  }
}

function bossMeleeOrRanged(b, dist, meleeList, rangedList, mixedList = []) {
  if (dist < 165) return meleeList[Math.floor(Math.random() * meleeList.length)];
  if (dist > 270) return rangedList[Math.floor(Math.random() * rangedList.length)];
  const all = [...mixedList, ...meleeList, ...rangedList];
  return all[Math.floor(Math.random() * all.length)];
}

function chooseBossAttack(b, dist) {
  let choice = "idle";

  if (b.kind === "warlord") {
    choice = bossMeleeOrRanged(b, dist,
      ["chargeSlash", "slamShockwave", "block"],
      ["swordThrow", "randomBurst", "summon"],
      ["swordThrow", "chargeSlash"]);
  } else if (b.kind === "archerlord") {
    choice = bossMeleeOrRanged(b, dist,
      ["backstepShot", "ringVolley"],
      ["arrowRain", "spreadShot", "pierceShot", "ghostArrows"],
      ["spreadShot", "ringVolley"]);
  } else if (b.kind === "shaman") {
    choice = bossMeleeOrRanged(b, dist,
      ["teleportNova", "cursePulse"],
      ["orbBurst", "laserTotems", "summonWave", "summonShield", "homingHex"],
      ["orbBurst", "cursePulse"]);
  } else if (b.kind === "brute") {
    choice = bossMeleeOrRanged(b, dist,
      ["smash", "doubleSmash", "megaCharge"],
      ["rockThrow", "shockRing"],
      ["megaCharge", "shockRing"]);
  } else if (b.kind === "hydra") {
    choice = bossMeleeOrRanged(b, dist,
      ["tripleBite", "tailSweep"],
      ["boneSpray", "poisonGlob", "spikeBurst"],
      ["boneSpray", "tripleBite"]);
  } else if (b.kind === "swordmaster") {
    if (b.phase === 1) {
      choice = bossMeleeOrRanged(b, dist,
        ["calDash", "tripleSlash", "crossSlash", "bladeBurst"],
        ["scarletRain", "swordWave", "teleSlice", "orbitKnives"],
        ["calDash", "swordWave", "tripleSlash"]
      );
    } else {
      choice = bossMeleeOrRanged(b, dist,
        ["p2_blenderDash", "p2_crossCombo", "p2_voidDive", "p2_bladePrison"],
        ["p2_skyRend", "p2_orbitStorm", "p2_hellLine", "p2_teleFury"],
        ["p2_blenderDash", "p2_orbitStorm", "p2_teleFury"]
      );
    }
  }

  b.attackState = choice;
  b.phaseTimer = 0;
  b.shotTimer = 0;

  const timerMap = {
    summon: 1.2,
    swordThrow: 0.95,
    block: 1.05,
    randomBurst: 1.2,
    chargeSlash: 0.8,
    slamShockwave: 0.85,

    arrowRain: 0.95,
    spreadShot: 0.55,
    pierceShot: 0.8,
    ringVolley: 0.7,
    backstepShot: 0.6,
    ghostArrows: 0.85,

    summonShield: 0.95,
    orbBurst: 0.8,
    teleportNova: 0.85,
    laserTotems: 1.0,
    cursePulse: 0.75,
    summonWave: 0.9,
    homingHex: 0.9,

    smash: 0.85,
    doubleSmash: 1.0,
    megaCharge: 0.7,
    rockThrow: 0.8,
    shockRing: 0.9,

    tripleBite: 0.8,
    tailSweep: 0.75,
    boneSpray: 0.7,
    poisonGlob: 0.8,
    spikeBurst: 0.85,

    calDash: 0.62,
    tripleSlash: 0.75,
    crossSlash: 0.68,
    bladeBurst: 0.7,
    scarletRain: 0.82,
    swordWave: 0.62,
    teleSlice: 0.72,
    orbitKnives: 0.8,

    p2_blenderDash: 0.48,
    p2_crossCombo: 0.6,
    p2_voidDive: 0.55,
    p2_bladePrison: 0.7,
    p2_skyRend: 0.72,
    p2_orbitStorm: 0.8,
    p2_hellLine: 0.68,
    p2_teleFury: 0.66
  };

  b.attackTimer = (timerMap[choice] || 0.9) * (b.cooldownMul || 1);
}
/* ============================================================
   CROSSBOW KINGDOM — Goblin Siege
   FULL JS — PART 2 / 2
   ============================================================ */

/* =========================
   BOSS PATTERNS
   ========================= */
function updateBossWarlord(b, dt) {
  if (b.attackState === "summon") {
    if (b.phaseTimer === 0) {
      ring(b.x, b.y, 32, "120,255,120");
      puff(b.x, b.y, 20, 1.0, "120,255,120");
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      const count = b.phase === 2 ? 4 : 3;
      for (let i = 0; i < count; i++) {
        const a = (TAU / count) * i + rand(-0.2, 0.2);
        spawnGoblin(i % 2 === 0 ? "hardFast" : "medium", b.x + Math.cos(a) * 92, b.y + Math.sin(a) * 92, true);
      }
      b.attackState = "idle";
      b.attackTimer = 0.55 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "swordThrow") {
    if (b.phaseTimer === 0) {
      b.swordAngle = Math.atan2(player.y - b.y, player.x - b.x);
      ring(b.x, b.y, 24, "255,220,120");
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      const shots = b.phase === 2 ? 5 : 3;
      for (let i = 0; i < shots; i++) {
        const spread = (i - (shots - 1) / 2) * 0.14;
        bossFireProjectile(b.x, b.y, b.swordAngle + spread, 600, 10, "255,230,150", 1, 1.3, "sword");
      }
      b.attackState = "idle";
      b.attackTimer = 0.55 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "block") {
    if (Math.random() < 0.22) puff(b.x, b.y, 1, 0.35, "120,220,255");
    if (b.attackTimer <= 0) {
      const shots = b.phase === 2 ? 9 : 6;
      for (let i = 0; i < shots; i++) {
        const a = Math.atan2(player.y - b.y, player.x - b.x) + (i - (shots - 1) / 2) * 0.11;
        bossFireProjectile(b.x, b.y, a, 500, 7, "120,220,255", 1, 1.2, "counter");
      }
      b.attackState = "idle";
      b.attackTimer = 0.5 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "randomBurst") {
    b.shotTimer -= dt;
    if (b.phaseTimer === 0) {
      ring(b.x, b.y, 34, "255,120,120");
      b.phaseTimer = 1;
    }
    if (b.shotTimer <= 0 && b.attackTimer > 0) {
      b.shotTimer = b.phase === 2 ? 0.07 : 0.1;
      const bursts = b.phase === 2 ? 4 : 3;
      for (let i = 0; i < bursts; i++) {
        const a = Math.random() * TAU;
        bossFireProjectile(b.x, b.y, a, rand(500, 650), 7, "255,100,120", 1, 1.35, "orb");
      }
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.5 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "chargeSlash") {
    if (b.phaseTimer === 0) {
      b.swordAngle = Math.atan2(player.y - b.y, player.x - b.x);
      b.phaseTimer = 1;
    }
    if (b.attackTimer > 0.22 * b.cooldownMul) {
      b.vx = 0;
      b.vy = 0;
    } else {
      const dashSpeed = b.speed * b.speedMul * 14;
      b.vx = Math.cos(b.swordAngle) * dashSpeed;
      b.vy = Math.sin(b.swordAngle) * dashSpeed;
      puff(b.x, b.y, 2, 0.3, "255,220,120");
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.45 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "slamShockwave") {
    if (b.phaseTimer === 0) {
      ring(b.x, b.y, 26, "255,180,80");
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      const count = b.phase === 2 ? 14 : 10;
      for (let i = 0; i < count; i++) {
        const a = (TAU / count) * i;
        bossFireProjectile(b.x, b.y, a, 360, 8, "255,180,80", 1, 1.2, "shock");
      }
      b.attackState = "idle";
      b.attackTimer = 0.5 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  }
}

function updateBossArcherLord(b, dt) {
  if (b.attackState === "arrowRain") {
    b.shotTimer -= dt;
    if (b.shotTimer <= 0 && b.attackTimer > 0.08) {
      b.shotTimer = b.phase === 2 ? 0.04 : 0.07;
      const count = b.phase === 2 ? 10 : 6;
      for (let i = 0; i < count; i++) {
        const tx = rand(state.arena.x + 24, state.arena.x + state.arena.w - 24);
        const ty = rand(state.arena.y + 24, state.arena.y + state.arena.h - 24);
        state.bossProjectiles.push({
          x: tx,
          y: ty - 240,
          vx: 0,
          vy: b.phase === 2 ? 720 : 620,
          r: b.phase === 2 ? 12 : 10,
          color: "230,230,255",
          damage: 1,
          life: 0.72,
          kind: "fallingArrow",
          telegraphX: tx,
          telegraphY: ty
        });
      }
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.4 * b.cooldownMul;
    }
  } else if (b.attackState === "spreadShot") {
    if (b.phaseTimer === 0) {
      const base = Math.atan2(player.y - b.y, player.x - b.x);
      const shots = b.phase === 2 ? 15 : 11;
      for (let i = 0; i < shots; i++) {
        bossFireProjectile(b.x, b.y, base + (i - (shots - 1) / 2) * 0.1, b.phase === 2 ? 620 : 560, 7, "220,220,255", 1, 1.45, "arrow");
      }
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.32 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "pierceShot") {
    if (b.phaseTimer === 0) {
      b.swordAngle = Math.atan2(player.y - b.y, player.x - b.x);
      ring(b.x, b.y, 24, "220,220,255");
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      const shots = b.phase === 2 ? 3 : 2;
      for (let i = 0; i < shots; i++) {
        bossFireProjectile(b.x, b.y, b.swordAngle + (i - (shots - 1) / 2) * 0.08, 820, 11, "255,255,255", 1, 1.1, "pierce");
      }
      b.attackState = "idle";
      b.attackTimer = 0.35 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "ringVolley") {
    if (b.phaseTimer === 0) {
      const count = b.phase === 2 ? 26 : 18;
      for (let i = 0; i < count; i++) {
        const a = (TAU / count) * i;
        bossFireProjectile(b.x, b.y, a, 400, 7, "180,220,255", 1, 1.45, "orb");
      }
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.35 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "backstepShot") {
    if (b.phaseTimer === 0) {
      const a = Math.atan2(player.y - b.y, player.x - b.x);
      b.vx = -Math.cos(a) * b.speed * b.speedMul * 9;
      b.vy = -Math.sin(a) * b.speed * b.speedMul * 9;
      const shots = b.phase === 2 ? 11 : 7;
      for (let i = 0; i < shots; i++) {
        bossFireProjectile(b.x, b.y, a + (i - (shots - 1) / 2) * 0.08, 620, 7, "255,245,190", 1, 1.3, "arrow");
      }
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.32 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "ghostArrows") {
    b.shotTimer -= dt;
    if (b.shotTimer <= 0 && b.attackTimer > 0.1) {
      b.shotTimer = b.phase === 2 ? 0.08 : 0.12;
      const count = b.phase === 2 ? 5 : 3;
      for (let i = 0; i < count; i++) {
        const a = Math.atan2(player.y - b.y, player.x - b.x) + rand(-0.32, 0.32);
        const px = b.x + Math.cos(a) * 150;
        const py = b.y + Math.sin(a) * 150;
        state.bossProjectiles.push({
          x: px,
          y: py,
          vx: Math.cos(a) * 680,
          vy: Math.sin(a) * 680,
          r: 7,
          color: "180,255,255",
          damage: 1,
          life: 0.95,
          kind: "ghostArrow"
        });
        puff(px, py, 8, 0.5, "180,255,255");
      }
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.35 * b.cooldownMul;
    }
  }
}

function updateBossShaman(b, dt) {
  if (b.attackState === "summonShield") {
    if (b.phaseTimer === 0) {
      const count = b.phase === 2 ? 4 : 3;
      for (let i = 0; i < count; i++) {
        const a = (TAU / count) * i;
        spawnGoblin("hardBrute", b.x + Math.cos(a) * 86, b.y + Math.sin(a) * 86, true, b.summonTag);
      }
      ring(b.x, b.y, 30, "180,120,255");
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.45 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "orbBurst") {
    if (b.phaseTimer === 0) {
      const count = b.phase === 2 ? 22 : 16;
      for (let i = 0; i < count; i++) {
        const a = (TAU / count) * i;
        bossFireProjectile(b.x, b.y, a, 390, 7, "200,120,255", 1, 1.7, "magic");
      }
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.42 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "teleportNova") {
    if (b.phaseTimer === 0) {
      b.x = rand(state.arena.x + 80, state.arena.x + state.arena.w - 80);
      b.y = rand(state.arena.y + 80, state.arena.y + state.arena.h - 80);
      puff(b.x, b.y, 24, 1.0, "180,120,255");
      ring(b.x, b.y, 24, "180,120,255");
      const count = b.phase === 2 ? 16 : 10;
      for (let i = 0; i < count; i++) {
        const a = (TAU / count) * i;
        bossFireProjectile(b.x, b.y, a, 390, 6, "180,120,255", 1, 1.3, "nova");
      }
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.4 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "laserTotems") {
    if (b.phaseTimer === 0) {
      const count = b.phase === 2 ? 6 : 4;
      for (let i = 0; i < count; i++) {
        const a = (TAU / count) * i;
        const tx = b.x + Math.cos(a) * 130;
        const ty = b.y + Math.sin(a) * 130;
        state.bossProjectiles.push({
          x: tx,
          y: ty,
          vx: 0,
          vy: 0,
          r: 10,
          color: "120,220,255",
          damage: 1,
          life: 1.0,
          kind: "totem"
        });
      }
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      const shots = b.phase === 2 ? 2 : 1;
      const angle = Math.atan2(player.y - b.y, player.x - b.x);
      for (const p of state.bossProjectiles) {
        if (p.kind === "totem" && p.life > 0.15) {
          for (let s = 0; s < shots; s++) {
            bossFireProjectile(p.x, p.y, angle + (s - (shots - 1) / 2) * 0.12, 520, 6, "120,220,255", 1, 1.1, "laser");
          }
        }
      }
      b.attackState = "idle";
      b.attackTimer = 0.42 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "cursePulse") {
    if (b.phaseTimer === 0) {
      ring(player.x, player.y, 34, "255,120,180");
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      const count = b.phase === 2 ? 18 : 12;
      for (let i = 0; i < count; i++) {
        const a = (TAU / count) * i;
        bossFireProjectile(player.x, player.y, a, 300, 6, "255,120,180", 1, 1.0, "curse");
      }
      b.attackState = "idle";
      b.attackTimer = 0.42 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "summonWave") {
    if (b.phaseTimer === 0) {
      const count = b.phase === 2 ? 6 : 4;
      for (let i = 0; i < count; i++) {
        const a = (TAU / count) * i + rand(-0.2, 0.2);
        spawnGoblin(i % 2 === 0 ? "medium" : "hardFast", b.x + Math.cos(a) * 110, b.y + Math.sin(a) * 110, true, b.summonTag);
      }
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.42 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "homingHex") {
    if (b.phaseTimer === 0) {
      const count = b.phase === 2 ? 8 : 5;
      const base = Math.atan2(player.y - b.y, player.x - b.x);
      for (let i = 0; i < count; i++) {
        bossFireProjectile(
          b.x,
          b.y,
          base + (i - (count - 1) / 2) * 0.18,
          220,
          8,
          "210,120,255",
          1,
          2.3,
          "homingOrb",
          { totalLife: 2.3, homingStrength: b.phase === 2 ? 260 : 180 }
        );
      }
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.45 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  }
}

function updateBossBrute(b, dt) {
  if (b.attackState === "smash") {
    if (b.phaseTimer === 0) {
      ring(b.x, b.y, 30, "255,180,80");
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      const count = b.phase === 2 ? 18 : 12;
      for (let i = 0; i < count; i++) {
        const a = (TAU / count) * i;
        bossFireProjectile(b.x, b.y, a, 330, 8, "255,180,80", 1, 1.15, "rockShard");
      }
      b.attackState = "idle";
      b.attackTimer = 0.5 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "doubleSmash") {
    b.shotTimer -= dt;
    if (b.phaseTimer === 0) {
      b.shotTimer = 0.22;
      b.phaseTimer = 1;
    }
    if (b.shotTimer <= 0 && b.attackTimer > 0.1) {
      b.shotTimer = 999;
      const count = b.phase === 2 ? 14 : 10;
      for (let i = 0; i < count; i++) {
        const a = (TAU / count) * i;
        bossFireProjectile(b.x, b.y, a, 290, 9, "255,140,90", 1, 1.0, "shock");
      }
    }
    if (b.attackTimer <= 0) {
      const count = b.phase === 2 ? 18 : 14;
      for (let i = 0; i < count; i++) {
        const a = (TAU / count) * i;
        bossFireProjectile(b.x, b.y, a, 360, 9, "255,180,80", 1, 1.15, "shock");
      }
      b.attackState = "idle";
      b.attackTimer = 0.55 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "megaCharge") {
    if (b.phaseTimer === 0) {
      b.swordAngle = Math.atan2(player.y - b.y, player.x - b.x);
      b.phaseTimer = 1;
    }
    if (b.attackTimer > 0.18 * b.cooldownMul) {
      b.vx = 0;
      b.vy = 0;
    } else {
      const dashSpeed = b.speed * b.speedMul * 16;
      b.vx = Math.cos(b.swordAngle) * dashSpeed;
      b.vy = Math.sin(b.swordAngle) * dashSpeed;
      puff(b.x, b.y, 2, 0.35, "255,180,80");
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.45 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "rockThrow") {
    if (b.phaseTimer === 0) {
      const count = b.phase === 2 ? 7 : 4;
      const base = Math.atan2(player.y - b.y, player.x - b.x);
      for (let i = 0; i < count; i++) {
        bossFireProjectile(b.x, b.y, base + (i - (count - 1) / 2) * 0.15, 430, 10, "210,170,120", 1, 1.2, "boulder");
      }
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.5 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "shockRing") {
    if (b.phaseTimer === 0) {
      const count = b.phase === 2 ? 26 : 18;
      for (let i = 0; i < count; i++) {
        const a = (TAU / count) * i;
        bossFireProjectile(b.x, b.y, a, 280 + (i % 2) * 60, 7, "255,210,120", 1, 1.25, "shock");
      }
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.55 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  }
}

function updateBossHydra(b, dt) {
  if (b.attackState === "tripleBite") {
    if (b.phaseTimer === 0) {
      const base = Math.atan2(player.y - b.y, player.x - b.x);
      b.swordAngle = base;
      b.phaseTimer = 1;
    }
    if (b.attackTimer > 0.18 * b.cooldownMul) {
      b.vx = 0;
      b.vy = 0;
    } else {
      const dashSpeed = b.speed * b.speedMul * 13.5;
      b.vx = Math.cos(b.swordAngle) * dashSpeed;
      b.vy = Math.sin(b.swordAngle) * dashSpeed;
      puff(b.x, b.y, 2, 0.3, "180,220,200");
    }
    if (b.attackTimer <= 0) {
      const count = b.phase === 2 ? 8 : 5;
      for (let i = 0; i < count; i++) {
        bossFireProjectile(b.x, b.y, b.swordAngle + (i - (count - 1) / 2) * 0.12, 410, 7, "180,220,200", 1, 1.0, "biteTrail");
      }
      b.attackState = "idle";
      b.attackTimer = 0.45 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "tailSweep") {
    if (b.phaseTimer === 0) {
      const count = b.phase === 2 ? 22 : 16;
      for (let i = 0; i < count; i++) {
        const a = (TAU / count) * i;
        bossFireProjectile(b.x, b.y, a, 310, 8, "150,255,180", 1, 1.2, "tail");
      }
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.45 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "boneSpray") {
    if (b.phaseTimer === 0) {
      const base = Math.atan2(player.y - b.y, player.x - b.x);
      const shots = b.phase === 2 ? 17 : 11;
      for (let i = 0; i < shots; i++) {
        bossFireProjectile(b.x, b.y, base + (i - (shots - 1) / 2) * 0.09, 500, 7, "220,240,220", 1, 1.3, "bone");
      }
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.45 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "poisonGlob") {
    if (b.phaseTimer === 0) {
      const count = b.phase === 2 ? 8 : 5;
      const base = Math.atan2(player.y - b.y, player.x - b.x);
      for (let i = 0; i < count; i++) {
        bossFireProjectile(b.x, b.y, base + (i - (count - 1) / 2) * 0.16, 320, 10, "120,255,120", 1, 1.5, "poison");
      }
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.5 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  } else if (b.attackState === "spikeBurst") {
    if (b.phaseTimer === 0) {
      const count = b.phase === 2 ? 20 : 14;
      for (let i = 0; i < count; i++) {
        const a = (TAU / count) * i;
        bossFireProjectile(b.x, b.y, a, 340, 8, "200,255,220", 1, 1.2, "spike");
      }
      b.phaseTimer = 1;
    }
    if (b.attackTimer <= 0) {
      b.attackState = "idle";
      b.attackTimer = 0.5 * b.cooldownMul;
      b.phaseTimer = 0;
    }
  }
}

/* =========================
   FINAL BOSS — CALAMITY STYLE
   ========================= */
function updateBossSwordmaster(b, dt) {
  /* phase 1: 8 attacks */
  if (b.phase === 1) {
    if (b.attackState === "calDash") {
      if (b.phaseTimer === 0) {
        b.swordAngle = Math.atan2(player.y - b.y, player.x - b.x);
        b.phaseTimer = 1;
      }
      if (b.attackTimer > 0.16 * b.cooldownMul) {
        b.vx = 0;
        b.vy = 0;
      } else {
        const dashSpeed = b.speed * b.speedMul * 18;
        b.vx = Math.cos(b.swordAngle) * dashSpeed;
        b.vy = Math.sin(b.swordAngle) * dashSpeed;
        puff(b.x, b.y, 2, 0.35, "255,255,255");
      }
      if (b.attackTimer <= 0) {
        b.attackState = "idle";
        b.attackTimer = 0.28 * b.cooldownMul;
        b.phaseTimer = 0;
      }
    }

    else if (b.attackState === "tripleSlash") {
      b.shotTimer -= dt;
      if (b.phaseTimer === 0) {
        b.shotTimer = 0.16;
        b.phaseTimer = 1;
      }
      if (b.shotTimer <= 0 && b.attackTimer > 0.08) {
        b.shotTimer = 999;
        const base = Math.atan2(player.y - b.y, player.x - b.x);
        for (let wave = 0; wave < 3; wave++) {
          const offset = (wave - 1) * 0.18;
          bossFireProjectile(b.x, b.y, base + offset, 430, 8, "255,120,120", 1, 1.0, "slash");
        }
      }
      if (b.attackTimer <= 0) {
        b.attackState = "idle";
        b.attackTimer = 0.32 * b.cooldownMul;
        b.phaseTimer = 0;
      }
    }

    else if (b.attackState === "crossSlash") {
      if (b.phaseTimer === 0) {
        const base = Math.atan2(player.y - b.y, player.x - b.x);
        const dirs = [base, base + Math.PI / 2, base + Math.PI, base + Math.PI * 1.5];
        for (const a of dirs) {
          bossFireProjectile(b.x, b.y, a, 460, 8, "255,200,200", 1, 1.1, "cross");
        }
        b.phaseTimer = 1;
      }
      if (b.attackTimer <= 0) {
        b.attackState = "idle";
        b.attackTimer = 0.34 * b.cooldownMul;
        b.phaseTimer = 0;
      }
    }

    else if (b.attackState === "bladeBurst") {
      if (b.phaseTimer === 0) {
        const count = 16;
        for (let i = 0; i < count; i++) {
          const a = (TAU / count) * i;
          bossFireProjectile(b.x, b.y, a, 330, 7, "255,180,180", 1, 1.25, "blade");
        }
        b.phaseTimer = 1;
      }
      if (b.attackTimer <= 0) {
        b.attackState = "idle";
        b.attackTimer = 0.34 * b.cooldownMul;
        b.phaseTimer = 0;
      }
    }

    else if (b.attackState === "scarletRain") {
      b.shotTimer -= dt;
      if (b.shotTimer <= 0 && b.attackTimer > 0.05) {
        b.shotTimer = 0.07;
        const count = 5;
        for (let i = 0; i < count; i++) {
          const tx = rand(state.arena.x + 20, state.arena.x + state.arena.w - 20);
          const ty = rand(state.arena.y + 20, state.arena.y + state.arena.h - 20);
          state.bossProjectiles.push({
            x: tx,
            y: ty - 200,
            vx: 0,
            vy: 620,
            r: 9,
            color: "255,90,110",
            damage: 1,
            life: 0.7,
            kind: "rainBlade",
            telegraphX: tx,
            telegraphY: ty
          });
        }
      }
      if (b.attackTimer <= 0) {
        b.attackState = "idle";
        b.attackTimer = 0.36 * b.cooldownMul;
      }
    }

    else if (b.attackState === "swordWave") {
      if (b.phaseTimer === 0) {
        const base = Math.atan2(player.y - b.y, player.x - b.x);
        const count = 9;
        for (let i = 0; i < count; i++) {
          bossFireProjectile(b.x, b.y, base + (i - 4) * 0.12, 520, 8, "220,220,255", 1, 1.2, "wave");
        }
        b.phaseTimer = 1;
      }
      if (b.attackTimer <= 0) {
        b.attackState = "idle";
        b.attackTimer = 0.28 * b.cooldownMul;
        b.phaseTimer = 0;
      }
    }

    else if (b.attackState === "teleSlice") {
      if (b.phaseTimer === 0) {
        b.x = clamp(player.x + rand(-140, 140), state.arena.x + b.r, state.arena.x + state.arena.w - b.r);
        b.y = clamp(player.y + rand(-140, 140), state.arena.y + b.r, state.arena.y + state.arena.h - b.r);
        puff(b.x, b.y, 16, 0.9, "220,220,255");
        b.swordAngle = Math.atan2(player.y - b.y, player.x - b.x);
        b.phaseTimer = 1;
      }
      if (b.attackTimer > 0.16 * b.cooldownMul) {
        b.vx = 0;
        b.vy = 0;
      } else {
        const dashSpeed = b.speed * b.speedMul * 17;
        b.vx = Math.cos(b.swordAngle) * dashSpeed;
        b.vy = Math.sin(b.swordAngle) * dashSpeed;
      }
      if (b.attackTimer <= 0) {
        b.attackState = "idle";
        b.attackTimer = 0.3 * b.cooldownMul;
        b.phaseTimer = 0;
      }
    }

    else if (b.attackState === "orbitKnives") {
      if (b.phaseTimer === 0) {
        const count = 10;
        for (let i = 0; i < count; i++) {
          const a = (TAU / count) * i;
          bossFireProjectile(
            b.x + Math.cos(a) * 70,
            b.y + Math.sin(a) * 70,
            a,
            240,
            7,
            "255,220,220",
            1,
            1.25,
            "orbitKnife",
            { orbitBoss: true, orbitAngle: a }
          );
        }
        b.phaseTimer = 1;
      }
      if (b.attackTimer <= 0) {
        b.attackState = "idle";
        b.attackTimer = 0.34 * b.cooldownMul;
        b.phaseTimer = 0;
      }
    }
  }

  /* phase 2: 8 different attacks, faster/more aggressive */
  else {
    if (b.attackState === "p2_blenderDash") {
      if (b.phaseTimer === 0) {
        b.swordAngle = Math.atan2(player.y - b.y, player.x - b.x);
        b.phaseTimer = 1;
      }
      if (b.attackTimer > 0.12 * b.cooldownMul) {
        b.vx = 0;
        b.vy = 0;
      } else {
        const dashSpeed = b.speed * b.speedMul * 22;
        b.vx = Math.cos(b.swordAngle) * dashSpeed;
        b.vy = Math.sin(b.swordAngle) * dashSpeed;
        const count = 4;
        for (let i = 0; i < count; i++) {
          bossFireProjectile(b.x, b.y, b.swordAngle + (i - 1.5) * 0.14, 300, 6, "255,100,100", 1, 0.55, "afterCut");
        }
      }
      if (b.attackTimer <= 0) {
        b.attackState = "idle";
        b.attackTimer = 0.22 * b.cooldownMul;
        b.phaseTimer = 0;
      }
    }

    else if (b.attackState === "p2_crossCombo") {
      if (b.phaseTimer === 0) {
        const base = Math.atan2(player.y - b.y, player.x - b.x);
        const angles = [base, base + 0.8, base - 0.8, base + Math.PI / 2, base - Math.PI / 2];
        for (const a of angles) {
          bossFireProjectile(b.x, b.y, a, 520, 8, "255,180,180", 1, 1.1, "crossCombo");
        }
        b.phaseTimer = 1;
      }
      if (b.attackTimer <= 0) {
        b.attackState = "idle";
        b.attackTimer = 0.24 * b.cooldownMul;
        b.phaseTimer = 0;
      }
    }

    else if (b.attackState === "p2_voidDive") {
      if (b.phaseTimer === 0) {
        b.x = clamp(player.x + rand(-220, 220), state.arena.x + b.r, state.arena.x + state.arena.w - b.r);
        b.y = state.arena.y + 30;
        puff(b.x, b.y, 18, 1.0, "255,255,255");
        b.swordAngle = Math.atan2(player.y - b.y, player.x - b.x);
        b.phaseTimer = 1;
      }
      if (b.attackTimer > 0.16 * b.cooldownMul) {
        b.vx = 0;
        b.vy = 0;
      } else {
        const dashSpeed = b.speed * b.speedMul * 20;
        b.vx = Math.cos(b.swordAngle) * dashSpeed;
        b.vy = Math.sin(b.swordAngle) * dashSpeed;
      }
      if (b.attackTimer <= 0) {
        const count = 12;
        for (let i = 0; i < count; i++) {
          const a = (TAU / count) * i;
          bossFireProjectile(b.x, b.y, a, 340, 7, "255,120,140", 1, 1.0, "voidRing");
        }
        b.attackState = "idle";
        b.attackTimer = 0.24 * b.cooldownMul;
        b.phaseTimer = 0;
      }
    }

    else if (b.attackState === "p2_bladePrison") {
      if (b.phaseTimer === 0) {
        const px = player.x;
        const py = player.y;
        const count = 14;
        for (let i = 0; i < count; i++) {
          const a = (TAU / count) * i;
          const sx = px + Math.cos(a) * 110;
          const sy = py + Math.sin(a) * 110;
          state.bossProjectiles.push({
            x: sx,
            y: sy,
            vx: -Math.cos(a) * 180,
            vy: -Math.sin(a) * 180,
            r: 8,
            color: "255,210,210",
            damage: 1,
            life: 0.9,
            kind: "prisonBlade"
          });
        }
        b.phaseTimer = 1;
      }
      if (b.attackTimer <= 0) {
        b.attackState = "idle";
        b.attackTimer = 0.28 * b.cooldownMul;
        b.phaseTimer = 0;
      }
    }

    else if (b.attackState === "p2_skyRend") {
      b.shotTimer -= dt;
      if (b.shotTimer <= 0 && b.attackTimer > 0.05) {
        b.shotTimer = 0.05;
        const count = 7;
        for (let i = 0; i < count; i++) {
          const tx = rand(state.arena.x + 18, state.arena.x + state.arena.w - 18);
          const ty = rand(state.arena.y + 18, state.arena.y + state.arena.h - 18);
          state.bossProjectiles.push({
            x: tx,
            y: ty - 230,
            vx: 0,
            vy: 760,
            r: 10,
            color: "255,120,120",
            damage: 1,
            life: 0.62,
            kind: "skyRend",
            telegraphX: tx,
            telegraphY: ty
          });
        }
      }
      if (b.attackTimer <= 0) {
        b.attackState = "idle";
        b.attackTimer = 0.24 * b.cooldownMul;
      }
    }

    else if (b.attackState === "p2_orbitStorm") {
      if (b.phaseTimer === 0) {
        const count = 18;
        for (let i = 0; i < count; i++) {
          const a = (TAU / count) * i;
          bossFireProjectile(
            b.x + Math.cos(a) * 84,
            b.y + Math.sin(a) * 84,
            a,
            260,
            7,
            "255,180,180",
            1,
            1.35,
            "stormKnife",
            { orbitBoss: true, orbitAngle: a, orbitRadius: 84 }
          );
        }
        b.phaseTimer = 1;
      }
      if (b.attackTimer <= 0) {
        b.attackState = "idle";
        b.attackTimer = 0.3 * b.cooldownMul;
        b.phaseTimer = 0;
      }
    }

    else if (b.attackState === "p2_hellLine") {
      if (b.phaseTimer === 0) {
        const base = Math.atan2(player.y - b.y, player.x - b.x);
        const count = 17;
        for (let i = 0; i < count; i++) {
          bossFireProjectile(b.x, b.y, base + (i - 8) * 0.07, 560, 8, "255,140,140", 1, 1.1, "hellLine");
        }
        b.phaseTimer = 1;
      }
      if (b.attackTimer <= 0) {
        b.attackState = "idle";
        b.attackTimer = 0.24 * b.cooldownMul;
        b.phaseTimer = 0;
      }
    }

    else if (b.attackState === "p2_teleFury") {
      b.shotTimer -= dt;
      if (b.phaseTimer === 0) {
        b.shotTimer = 0.14;
        b.phaseTimer = 1;
      }
      if (b.shotTimer <= 0 && b.attackTimer > 0.08) {
        b.shotTimer = 0.14;
        b.x = clamp(player.x + rand(-160, 160), state.arena.x + b.r, state.arena.x + state.arena.w - b.r);
        b.y = clamp(player.y + rand(-160, 160), state.arena.y + b.r, state.arena.y + state.arena.h - b.r);
        puff(b.x, b.y, 10, 0.7, "255,255,255");
        const base = Math.atan2(player.y - b.y, player.x - b.x);
        const count = 6;
        for (let i = 0; i < count; i++) {
          bossFireProjectile(b.x, b.y, base + (i - 2.5) * 0.12, 520, 7, "255,220,220", 1, 1.0, "teleFury");
        }
      }
      if (b.attackTimer <= 0) {
        b.attackState = "idle";
        b.attackTimer = 0.26 * b.cooldownMul;
        b.phaseTimer = 0;
      }
    }
  }
}

/* =========================
   GENERIC BOSS UPDATE
   ========================= */
function updateBoss(b, dt) {
  bossPhaseUpdate(b);

  b.hurtT = Math.max(0, b.hurtT - dt);
  b.attackTimer -= dt;
  b.spawnT = Math.min(1, b.spawnT + dt * 2);

  const dxp = player.x - b.x;
  const dyp = player.y - b.y;
  const dist = Math.hypot(dxp, dyp) || 1;
  const ux = dxp / dist;
  const uy = dyp / dist;

  if (b.attackState === "idle") {
    const preferred = (b.kind === "warlord" || b.kind === "brute" || b.kind === "hydra" || b.kind === "swordmaster") ? 180 : 250;
    let move = 0;
    if (dist > preferred + 20) move = 1;
    if (dist < preferred - 20) move = -0.65;

    b.vx = ux * b.speed * b.speedMul * move;
    b.vy = uy * b.speed * b.speedMul * move;

    b.x += b.vx * dt;
    b.y += b.vy * dt;

    if (b.attackTimer <= 0) {
      chooseBossAttack(b, dist);
    }
  } else {
    b.vx *= 0.92;
    b.vy *= 0.92;
    b.x += b.vx * dt;
    b.y += b.vy * dt;

    if (b.kind === "warlord") updateBossWarlord(b, dt);
    if (b.kind === "archerlord") updateBossArcherLord(b, dt);
    if (b.kind === "shaman") updateBossShaman(b, dt);
    if (b.kind === "brute") updateBossBrute(b, dt);
    if (b.kind === "hydra") updateBossHydra(b, dt);
    if (b.kind === "swordmaster") updateBossSwordmaster(b, dt);
  }

  const a = state.arena;
  b.x = clamp(b.x, a.x + b.r, a.x + a.w - b.r);
  b.y = clamp(b.y, a.y + b.r, a.y + a.h - b.r);

  const rr = b.r + PLAYER_R;
  if (dist2(b.x, b.y, player.x, player.y) <= rr * rr) {
    damagePlayer(b.touchDamage);
    const push = 100 * dt;
    b.x -= ux * push;
    b.y -= uy * push;
  }
}

/* =========================
   MODE HELPERS
   ========================= */
function showShop(subtitle = "Выбери улучшения", continueText = "START NEXT WAVE") {
  state.mode = "shop";
  shopSubtitle.textContent = subtitle;
  btnShopContinue.textContent = continueText;
  renderUpgradeShop();
  setScreen("shop");
}

function openBossSelect() {
  state.mode = "bossselect";
  setScreen("bossSelect");
}

function renderBossSelect() {
  bossSelectList.innerHTML = "";
  for (const boss of BOSS_ORDER) {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = boss.name;
    btn.addEventListener("click", async () => {
      if (!state.assetsReady) {
        await loadAssets();
        state.assetsReady = true;
      }
      state.testMode = true;
      state.queuedBossKey = boss.key;
      setScreen(null);
      resetRun();
    });
    bossSelectList.appendChild(btn);
  }
}

/* =========================
   MAIN UPDATE
   ========================= */
function update(dt) {
  updateArena();
  state.t += dt;
  state.waveBanner.t += dt;
  if (state.waveBanner.life > 0) state.waveBanner.life -= dt;

  player.fireCd = Math.max(0, player.fireCd - dt);
  player.shootFlash = Math.max(0, player.shootFlash - dt);
  player.dashCd = Math.max(0, player.dashCd - dt);
  player.invuln = Math.max(0, player.invuln - dt);
  player.lastHitAgo += dt;
  player.rushT = Math.max(0, player.rushT - dt);

  if (player.hp < MAX_HP) {
    if (player.lastHitAgo >= REGEN_GRACE) {
      player.regenTimer -= dt;
      if (player.regenTimer <= 0) {
        player.hp += 1;
        player.hp = Math.min(MAX_HP, player.hp);
        player.regenTimer = REGEN_INTERVAL;
        puff(player.x, player.y, 10, 0.7, "120,255,220");
      }
    }
  } else {
    player.regenTimer = REGEN_INTERVAL;
  }

  let mx = 0;
  let my = 0;
  if (keys.has("KeyA")) mx -= 1;
  if (keys.has("KeyD")) mx += 1;
  if (keys.has("KeyW")) my -= 1;
  if (keys.has("KeyS")) my += 1;

  const mLen = Math.hypot(mx, my) || 1;
  if (mLen > 0) {
    mx /= mLen;
    my /= mLen;
  }

  if (keys.has("ShiftLeft") || keys.has("ShiftRight")) startDash();

  let moveSpeed = state.derived.playerSpeed;
  if (player.rushT > 0) moveSpeed *= 1.32;

  if (player.dashing) {
    player.dashT -= dt;
    player.x += player.dashDirX * state.derived.dashSpeed * dt;
    player.y += player.dashDirY * state.derived.dashSpeed * dt;
    if (Math.random() < 0.75) puff(player.x, player.y, 2, 0.38, "120,220,255");
    if (player.dashT <= 0) player.dashing = false;
  } else {
    player.x += mx * moveSpeed * dt;
    player.y += my * moveSpeed * dt;
  }

  const a = state.arena;
  player.x = clamp(player.x, a.x + PLAYER_R, a.x + a.w - PLAYER_R);
  player.y = clamp(player.y, a.y + PLAYER_R, a.y + a.h - PLAYER_R);

  if (mouseDown) tryShoot();

  /* arrows */
  for (let i = state.arrows.length - 1; i >= 0; i--) {
    const b = state.arrows[i];
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;

    if (
      b.life <= 0 ||
      b.x < a.x - 60 || b.x > a.x + a.w + 60 ||
      b.y < a.y - 60 || b.y > a.y + a.h + 60
    ) {
      state.arrows.splice(i, 1);
      continue;
    }

    let removed = false;

    for (let j = state.goblins.length - 1; j >= 0; j--) {
      const g = state.goblins[j];
      const rr = b.r + g.r;
      if (dist2(b.x, b.y, g.x, g.y) <= rr * rr) {
        damageGoblin(g, b.dmg);
        state.arrows.splice(i, 1);
        removed = true;
        break;
      }
    }
    if (removed) continue;

    for (let j = state.bosses.length - 1; j >= 0; j--) {
      const boss = state.bosses[j];
      const rr = b.r + boss.r;
      if (dist2(b.x, b.y, boss.x, boss.y) <= rr * rr) {
        damageBoss(boss, b.dmg);
        state.arrows.splice(i, 1);
        removed = true;
        break;
      }
    }
  }

  /* goblins */
  for (let g of state.goblins) {
    g.hurtT = Math.max(0, g.hurtT - dt);
    g.atkCd = Math.max(0, g.atkCd - dt);
    g.spawnT = Math.min(1, (g.spawnT || 0) + dt * 2.8);
    g.slowT = Math.max(0, (g.slowT || 0) - dt);

    const dx = player.x - g.x;
    const dy = player.y - g.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;

    const slowMult = g.slowT > 0 ? g.slowFactor : 1;
    let sp = g.speed * slowMult;
    if (g.type === "medium") sp *= 1.02;

    g.vx = ux * sp;
    g.vy = uy * sp;

    if (g.type === "medium" && len < 120 && Math.random() < 0.012) {
      g.vx *= 1.55;
      g.vy *= 1.55;
    }

    g.x += g.vx * dt;
    g.y += g.vy * dt;

    g.x = clamp(g.x, a.x + g.r, a.x + a.w - g.r);
    g.y = clamp(g.y, a.y + g.r, a.y + a.h - g.r);

    const rr = g.r + PLAYER_R;
    if (dist2(g.x, g.y, player.x, player.y) <= rr * rr) {
      if (g.atkCd <= 0) {
        damagePlayer(g.dmg);
        g.atkCd = 0.75;
      }
      const push = 70 * dt;
      g.x -= ux * push;
      g.y -= uy * push;
    }
  }

  /* bosses */
  for (let boss of state.bosses) updateBoss(boss, dt);

  /* boss projectiles */
  for (let i = state.bossProjectiles.length - 1; i >= 0; i--) {
    const p = state.bossProjectiles[i];

    if (p.orbitBoss && state.bosses[0]) {
      p.orbitAngle += dt * 5.2;
      const boss = state.bosses[0];
      const radius = p.orbitRadius || 70;
      p.x = boss.x + Math.cos(p.orbitAngle) * radius;
      p.y = boss.y + Math.sin(p.orbitAngle) * radius;
      if (p.kind === "stormKnife") {
        const toward = Math.atan2(player.y - p.y, player.x - p.x);
        p.vx = Math.cos(toward) * 220;
        p.vy = Math.sin(toward) * 220;
      }
    }

    if (p.kind === "homingOrb" && p.life < (p.totalLife || 2.2) - 1.0) {
      const dx = player.x - p.x;
      const dy = player.y - p.y;
      const len = Math.hypot(dx, dy) || 1;
      const steer = p.homingStrength || 180;
      p.vx += (dx / len) * steer * dt;
      p.vy += (dy / len) * steer * dt;
    }

    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;

    if (
      p.life <= 0 ||
      p.x < a.x - 140 || p.x > a.x + a.w + 140 ||
      p.y < a.y - 140 || p.y > a.y + a.h + 140
    ) {
      state.bossProjectiles.splice(i, 1);
      continue;
    }

    const rr = p.r + PLAYER_R;
    if (dist2(p.x, p.y, player.x, player.y) <= rr * rr) {
      damagePlayer(p.damage);
      puff(p.x, p.y, 8, 0.8, p.color);
      state.bossProjectiles.splice(i, 1);
      continue;
    }
  }

  /* coins */
  for (let i = state.coinsDrop.length - 1; i >= 0; i--) {
    const c = state.coinsDrop[i];
    c.t += dt;
    c.life -= dt;

    const mdx = player.x - c.x;
    const mdy = player.y - c.y;
    const mlen = Math.hypot(mdx, mdy) || 1;

    if (mlen < state.derived.magnet) {
      const mag = 680 + (state.derived.magnet - mlen) * 3.8;
      c.vx += (mdx / mlen) * mag * dt;
      c.vy += (mdy / mlen) * mag * dt;
    }

    c.vx *= 0.94;
    c.vy *= 0.94;
    c.x += c.vx * dt;
    c.y += c.vy * dt;

    if (mlen < COIN_PICKUP_R + 10) {
      if (!state.testMode) state.coins += c.value;
      state.score += 2;
      puff(c.x, c.y, 5, 0.45, "255,220,120");
      sfxCoin();
      state.coinsDrop.splice(i, 1);
      continue;
    }

    if (c.life <= 0) {
      state.coinsDrop.splice(i, 1);
      continue;
    }
  }

  /* particles */
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.t += dt;
    if (p.kind === "puff") {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.pow(0.02, dt);
      p.vy *= Math.pow(0.02, dt);
    }
    if (p.t >= p.life) state.particles.splice(i, 1);
  }

  /* spawning */
  if (state.waveIsBoss) {
    if (state.bosses.length === 0 && state.goblins.length === 0) {
      if (state.waveSpawnsDone === 0 && state.t >= state.nextSpawnAt) {
        spawnBoss();
        state.waveSpawnsDone = 1;
      } else if (state.waveSpawnsDone === 1) {
        if (state.waveEndsAt === Infinity) state.waveEndsAt = state.t + WAVE_REST;
        if (state.t >= state.waveEndsAt) {
          if (state.testMode) {
            showShop("Босс побеждён. Можно продолжить тест с тем же сетапом.", "RESTART BOSS");
          } else {
            startWave(state.wave + 1);
            showShop(`Волна ${state.wave - 1} завершена. Купи улучшения.`, "START NEXT WAVE");
          }
        }
      }
    }
  } else {
    if (state.waveSpawnsDone < state.waveSpawnsTotal) {
      if (state.t >= state.nextSpawnAt) {
        spawnGoblin();
        state.waveSpawnsDone++;
        scheduleNextSpawn();
      }
    } else {
      if (state.goblins.length === 0 && state.bosses.length === 0) {
        if (state.waveEndsAt === Infinity) state.waveEndsAt = state.t + WAVE_REST;
        if (state.t >= state.waveEndsAt) {
          startWave(state.wave + 1);
          showShop(`Волна ${state.wave - 1} завершена. Выбери улучшения.`, "START NEXT WAVE");
        }
      }
    }
  }

  updateUI();
}

/* =========================
   UI UPDATE
   ========================= */
function updateUI() {
  hpHearts.innerHTML = "";
  for (let i = 0; i < MAX_HP; i++) {
    const d = document.createElement("div");
    d.className = "heart" + (i < player.hp ? "" : " empty");
    hpHearts.appendChild(d);
  }

  const regen = player.hp >= MAX_HP ? REGEN_INTERVAL : Math.max(0, player.regenTimer);
  regenText.textContent = player.hp >= MAX_HP ? "FULL" : `${regen.toFixed(1)}s`;
  waveText.textContent = state.waveIsBoss ? `${state.wave} (BOSS)` : String(state.wave);
  killsText.textContent = String(state.kills);
  scoreText.textContent = String(state.score);
  coinsText.textContent = state.testMode ? "∞" : String(Math.floor(state.coins));
}

/* =========================
   DRAW HELPERS
   ========================= */
function drawBossBar() {
  if (!state.bosses.length) return;
  const b = state.bosses[0];
  const barW = Math.min(460, window.innerWidth * 0.46);
  const barH = 18;
  const x = (window.innerWidth - barW) * 0.5;
  const y = 74;

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(x - 4, y - 24, barW + 8, barH + 32);

  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.fillRect(x, y, barW, barH);

  const hp01 = clamp(b.hp / b.maxHp, 0, 1);
  const grad = ctx.createLinearGradient(x, y, x + barW, y);
  grad.addColorStop(0, "rgba(255,190,90,0.95)");
  grad.addColorStop(1, "rgba(255,80,80,0.95)");
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, barW * hp01, barH);

  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, barW, barH);

  ctx.fillStyle = "white";
  ctx.font = "bold 16px system-ui, Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${b.name}${b.phase === 2 ? " • PHASE 2" : ""}`, x + barW * 0.5, y - 6);
  ctx.restore();
}

function drawMusicHint() {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(14, window.innerHeight - 42, 250, 28);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "13px system-ui, Arial";
  ctx.textAlign = "left";
  ctx.fillText("M — музыка • P — пауза музыки", 24, window.innerHeight - 23);
  ctx.restore();
}

function drawWaveBanner() {
  if (state.waveBanner.life <= 0) return;
  const total = 2.0;
  const t = clamp(state.waveBanner.t / total, 0, 1);
  const alpha = t < 0.2 ? t / 0.2 : t > 0.75 ? (1 - t) / 0.25 : 1;
  const scale = lerp(0.88, 1.0, Math.min(1, t * 2));

  ctx.save();
  ctx.translate(window.innerWidth * 0.5, window.innerHeight * 0.24);
  ctx.scale(scale, scale);
  ctx.globalAlpha = alpha * 0.95;

  ctx.fillStyle = "rgba(0,0,0,0.46)";
  ctx.fillRect(-170, -34, 340, 68);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "bold 34px system-ui, Arial";
  ctx.fillText(state.waveBanner.text, 0, 10);
  ctx.restore();
}

/* =========================
   DRAW BOSS SPRITES
   ========================= */
function getBossImageKey(boss, attacking) {
  if (boss.kind === "warlord") return attacking ? "boss_warlord_attack" : "boss_warlord_idle";
  if (boss.kind === "archerlord") return attacking ? "boss_archer_attack" : "boss_archer_idle";
  if (boss.kind === "shaman") return attacking ? "boss_shaman_attack" : "boss_shaman_idle";
  if (boss.kind === "brute") return attacking ? "boss_brute_attack" : "boss_brute_idle";
  if (boss.kind === "hydra") return attacking ? "boss_hydra_attack" : "boss_hydra_idle";
  if (boss.kind === "swordmaster") {
    if (boss.phase === 2) return attacking ? "boss_final_p2_attack" : "boss_final_p2_idle";
    return attacking ? "boss_final_attack" : "boss_final_idle";
  }
  return null;
}

/* =========================
   DRAW
   ========================= */
function draw() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  ctx.clearRect(0, 0, w, h);

  if (IMG.background) {
    ctx.drawImage(IMG.background, 0, 0, w, h);
  } else {
    ctx.fillStyle = "#0b111a";
    ctx.fillRect(0, 0, w, h);
  }

  const a = state.arena;
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.strokeRect(a.x, a.y, a.w, a.h);
  ctx.fillStyle = "rgba(0,0,0,0.16)";
  ctx.fillRect(a.x, a.y, a.w, a.h);
  ctx.restore();

  /* arrows */
  for (let b of state.arrows) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(Math.atan2(b.vy, b.vx));
    ctx.fillStyle = b.crit ? "rgba(255,120,120,0.95)" : "rgba(255,216,108,0.95)";
    ctx.fillRect(-8, -2, 16, 4);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillRect(4, -1, 6, 2);
    ctx.restore();
  }

  /* boss projectiles */
  for (let p of state.bossProjectiles) {
    ctx.save();

    if (p.kind === "fallingArrow" && p.telegraphX != null) {
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.telegraphX, p.telegraphY, p.r + 8, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = `rgba(${p.color},0.95)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, TAU);
    ctx.fill();

    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 2.2, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  /* coins */
  for (let c of state.coinsDrop) {
    ctx.save();
    ctx.fillStyle = "rgba(255,220,80,0.95)";
    ctx.beginPath();
    ctx.arc(c.x, c.y, 6, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "rgba(255,245,180,0.8)";
    ctx.beginPath();
    ctx.arc(c.x - 1.5, c.y - 1.5, 2.2, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  /* goblins */
  for (let g of state.goblins) {
    const img = IMG[g.imgKey];
    const appearScale = Math.min(1, g.spawnT || 1);
    const size = ENEMY_SPRITE_SIZE * appearScale;

    if (img) {
      ctx.save();
      ctx.globalAlpha = 0.5 + appearScale * 0.5;
      ctx.drawImage(img, g.x - size / 2, g.y - size / 2, size, size);

      if (g.hurtT > 0) {
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r * 1.12, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }

    const hp01 = clamp(g.hp / g.maxHp, 0, 1);
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(g.x - 22, g.y - g.r - 18, 44, 6);
    ctx.fillStyle = g.special ? "rgba(255,180,90,0.95)" : "rgba(108,240,255,0.9)";
    ctx.fillRect(g.x - 22, g.y - g.r - 18, 44 * hp01, 6);
    ctx.restore();
  }

  /* bosses */
  for (let b of state.bosses) {
    const appearScale = Math.min(1, b.spawnT || 1);
    const attacking = b.attackState !== "idle";
    const key = getBossImageKey(b, attacking);
    const img = key ? IMG[key] : null;

    if (img) {
      const size = (b.r * 3.05) * appearScale;
      ctx.save();
      ctx.globalAlpha = 0.55 + appearScale * 0.45;
      ctx.drawImage(img, b.x - size / 2, b.y - size / 2, size, size);

      if (b.attackState === "block") {
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = "rgba(120,220,255,1)";
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 1.6, 0, TAU);
        ctx.fill();
      }

      if (b.hurtT > 0) {
        ctx.globalAlpha = 0.28;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 1.08, 0, TAU);
        ctx.fill();
      }

      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = `rgba(${b.color},0.96)`;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    const hp01 = clamp(b.hp / b.maxHp, 0, 1);
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(b.x - 36, b.y - b.r - 22, 72, 8);
    ctx.fillStyle = "rgba(255,180,90,0.95)";
    ctx.fillRect(b.x - 36, b.y - b.r - 22, 72 * hp01, 8);
    ctx.restore();
  }

  /* player — no rotation */
  const heroImg = player.shootFlash > 0 && IMG.heroShoot ? IMG.heroShoot : IMG.hero;
  if (heroImg) {
    ctx.save();
    if (player.invuln > 0) ctx.globalAlpha = 0.75;
    const squash = player.dashing ? 1.08 : 1;
    ctx.translate(player.x, player.y);
    ctx.scale(squash, 1 / squash);
    ctx.drawImage(heroImg, -HERO_DRAW_W / 2, -HERO_DRAW_H / 2, HERO_DRAW_W, HERO_DRAW_H);
    ctx.restore();
  }

  /* dash cooldown */
  ctx.save();
  const cd = clamp(player.dashCd / state.derived.dashCd, 0, 1);
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(player.x, player.y, PLAYER_R + 10, -Math.PI / 2, -Math.PI / 2 + TAU * (1 - cd));
  ctx.stroke();
  ctx.restore();

  /* particles */
  for (let p of state.particles) {
    const k = 1 - p.t / p.life;
    ctx.save();
    if (p.kind === "ring") {
      ctx.globalAlpha = 0.42 * k;
      ctx.strokeStyle = `rgba(${p.color},${k})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius + (1 - k) * 16, 0, TAU);
      ctx.stroke();
    } else {
      ctx.globalAlpha = 0.28 * k;
      ctx.fillStyle = `rgba(${p.color},1)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (0.9 + (1 - k) * 1.6), 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  drawBossBar();
  drawMusicHint();
  drawWaveBanner();
}

/* =========================
   UI / FLOW
   ========================= */
function updateUI() {
  hpHearts.innerHTML = "";
  for (let i = 0; i < MAX_HP; i++) {
    const d = document.createElement("div");
    d.className = "heart" + (i < player.hp ? "" : " empty");
    hpHearts.appendChild(d);
  }

  const regen = player.hp >= MAX_HP ? REGEN_INTERVAL : Math.max(0, player.regenTimer);
  regenText.textContent = player.hp >= MAX_HP ? "FULL" : `${regen.toFixed(1)}s`;
  waveText.textContent = state.waveIsBoss ? `${state.wave} (BOSS)` : String(state.wave);
  killsText.textContent = String(state.kills);
  scoreText.textContent = String(state.score);
  coinsText.textContent = state.testMode ? "∞" : String(Math.floor(state.coins));
}

function startGame() {
  unlockMusic();
  setScreen(null);
  state.mode = "playing";
  state.testMode = false;
  state.queuedBossKey = null;
  resetRun();
}

function pauseGame() {
  if (state.mode !== "playing") return;
  state.mode = "paused";
  setScreen("pause");
}

function resumeGame() {
  if (state.mode !== "paused") return;
  setScreen(null);
  state.mode = "playing";
}

function endGame() {
  state.mode = "over";
  gameOverStats.textContent = `Волна: ${state.wave} • Убийства: ${state.kills} • Счёт: ${state.score} • Монеты: ${Math.floor(state.coins)}`;
  setScreen("over");
}

function backToMenu() {
  state.mode = "menu";
  state.testMode = false;
  state.queuedBossKey = null;
  setScreen("menu");
}

function continueFromShop() {
  setScreen(null);
  state.mode = "playing";

  if (state.testMode && state.bosses.length === 0 && state.goblins.length === 0 && state.waveIsBoss) {
    state.waveSpawnsDone = 0;
    state.nextSpawnAt = state.t + 0.6;
    showWaveBanner(`TEST: ${getBossConfig(state.waveBossKey).name}`);
  }
}

/* =========================
   BUTTONS
   ========================= */
difficultyButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    difficultyButtons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    state.selectedDifficulty = btn.dataset.difficulty;
  });
});

btnStart.addEventListener("click", async () => {
  unlockMusic();
  if (!state.assetsReady) {
    await loadAssets();
    state.assetsReady = true;
  }
  startGame();
});

btnTestBosses.addEventListener("click", () => {
  renderBossSelect();
  openBossSelect();
});

btnBossSelectBack.addEventListener("click", () => {
  backToMenu();
});

btnContinue.addEventListener("click", () => resumeGame());

btnRestartFromPause.addEventListener("click", async () => {
  unlockMusic();
  if (!state.assetsReady) {
    await loadAssets();
    state.assetsReady = true;
  }
  setScreen(null);
  state.mode = "playing";
  state.testMode = false;
  state.queuedBossKey = null;
  resetRun();
});

btnBackToMenu.addEventListener("click", () => backToMenu());

btnRestart.addEventListener("click", async () => {
  unlockMusic();
  if (!state.assetsReady) {
    await loadAssets();
    state.assetsReady = true;
  }
  setScreen(null);
  state.mode = "playing";
  state.testMode = false;
  state.queuedBossKey = null;
  resetRun();
});

btnMenuFromOver.addEventListener("click", () => backToMenu());

btnShopContinue.addEventListener("click", () => {
  continueFromShop();
});

btnShopBackMenu.addEventListener("click", () => {
  backToMenu();
});

/* =========================
   MAIN LOOP
   ========================= */
function loop(ts) {
  const t = ts / 1000;
  const dt = Math.min(0.033, state.lastTime ? (t - state.lastTime) : 0);
  state.lastTime = t;
  state.dt = dt;

  if (state.mode === "playing") {
    update(dt);
  } else {
    updateArena();
    updateUI();
  }

  draw();
  requestAnimationFrame(loop);
}

/* =========================
   INIT
   ========================= */
applyDerivedStats();
setScreen("menu");
updateArena();
updateUI();
renderBossSelect();
requestAnimationFrame(loop);
