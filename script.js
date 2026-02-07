const boardEl = document.getElementById("board");
const levelIndexEl = document.getElementById("level-index");
const levelTotalEl = document.getElementById("level-total");
const levelTitleEl = document.getElementById("level-title");
const levelGoalEl = document.getElementById("level-goal");
const levelTipEl = document.getElementById("level-tip");
const statusBox = document.getElementById("status-box");
const prevBtn = document.getElementById("prev-level");
const nextBtn = document.getElementById("next-level");
const resetBtn = document.getElementById("reset-level");
const hintBtn = document.getElementById("show-hint");
const toggleGridBtn = document.getElementById("toggle-grid");

const BOARD_W = 9;
const BOARD_H = 10;
const RED_PALACE = { xMin: 3, xMax: 5, yMin: 7, yMax: 9 };
const BLACK_PALACE = { xMin: 3, xMax: 5, yMin: 0, yMax: 2 };

const pieceText = {
  r: { red: "车", black: "车" },
  n: { red: "马", black: "马" },
  b: { red: "相", black: "象" },
  a: { red: "仕", black: "士" },
  k: { red: "帅", black: "将" },
  c: { red: "炮", black: "炮" },
  p: { red: "兵", black: "卒" },
};
const PIECE_VALUES = { k: 10000, r: 900, c: 450, n: 400, b: 200, a: 200, p: 100 };

const levels = [
  {
    title: "对战·入门开局",
    goal: "你执黑，红方先手。双方 16 子标准开局，按规则一步步下。",
    tips: [
      "红方是机器，黑方由你操作。",
      "标准开局摆法：车马象士将士象马车。",
      "注意将军/应将，不能送将。",
    ],
    difficulty: "easy",
    pieces: [
      { id: "rr1", type: "r", side: "red", x: 0, y: 9 },
      { id: "rn1", type: "n", side: "red", x: 1, y: 9 },
      { id: "rb1", type: "b", side: "red", x: 2, y: 9 },
      { id: "ra1", type: "a", side: "red", x: 3, y: 9 },
      { id: "rk", type: "k", side: "red", x: 4, y: 9 },
      { id: "ra2", type: "a", side: "red", x: 5, y: 9 },
      { id: "rb2", type: "b", side: "red", x: 6, y: 9 },
      { id: "rn2", type: "n", side: "red", x: 7, y: 9 },
      { id: "rr2", type: "r", side: "red", x: 8, y: 9 },
      { id: "rc1", type: "c", side: "red", x: 1, y: 7 },
      { id: "rc2", type: "c", side: "red", x: 7, y: 7 },
      { id: "rp1", type: "p", side: "red", x: 0, y: 6 },
      { id: "rp2", type: "p", side: "red", x: 2, y: 6 },
      { id: "rp3", type: "p", side: "red", x: 4, y: 6 },
      { id: "rp4", type: "p", side: "red", x: 6, y: 6 },
      { id: "rp5", type: "p", side: "red", x: 8, y: 6 },
      { id: "br1", type: "r", side: "black", x: 0, y: 0 },
      { id: "bn1", type: "n", side: "black", x: 1, y: 0 },
      { id: "bb1", type: "b", side: "black", x: 2, y: 0 },
      { id: "ba1", type: "a", side: "black", x: 3, y: 0 },
      { id: "bk", type: "k", side: "black", x: 4, y: 0 },
      { id: "ba2", type: "a", side: "black", x: 5, y: 0 },
      { id: "bb2", type: "b", side: "black", x: 6, y: 0 },
      { id: "bn2", type: "n", side: "black", x: 7, y: 0 },
      { id: "br2", type: "r", side: "black", x: 8, y: 0 },
      { id: "bc1", type: "c", side: "black", x: 1, y: 2 },
      { id: "bc2", type: "c", side: "black", x: 7, y: 2 },
      { id: "bp1", type: "p", side: "black", x: 0, y: 3 },
      { id: "bp2", type: "p", side: "black", x: 2, y: 3 },
      { id: "bp3", type: "p", side: "black", x: 4, y: 3 },
      { id: "bp4", type: "p", side: "black", x: 6, y: 3 },
      { id: "bp5", type: "p", side: "black", x: 8, y: 3 },
    ],
  },
  {
    title: "对战·标准开局",
    goal: "双方 16 子标准开局，红方会优先吃子。",
    tips: [
      "红方更倾向于吃子。",
      "注意兵线推进与中路控制。",
      "先稳住将，再找机会吃子。",
    ],
    difficulty: "medium",
    pieces: [],
  },
  {
    title: "对战·进阶开局",
    goal: "双方 16 子标准开局，红方会选择更优交换。",
    tips: [
      "红方更关注子力价值。",
      "注意炮马配合与对将威胁。",
      "稳住阵型，再找突破点。",
    ],
    difficulty: "hard",
    pieces: [],
  },
  {
    title: "对战·高手压制",
    goal: "双方 16 子标准开局，红方会积极争先并持续制造将军压力。",
    tips: [
      "双方子力完整，先稳住将位再争先手。",
      "红方会频繁施压中路，注意车炮协防。",
      "被将军时优先找安全解将，再考虑反击。",
    ],
    difficulty: "hard",
    pieces: [],
  },
  {
    title: "对战·专家残局",
    goal: "双方 16 子标准开局，红方使用前瞻搜索，更会计算连续威胁。",
    tips: [
      "红方会预判后续变化，轻率吃子容易被反制。",
      "中局要兼顾子力交换与将位安全。",
      "每步都要看对手下一手将军点。",
    ],
    difficulty: "expert",
    pieces: [],
  },
  {
    title: "对战·大师挑战",
    goal: "双方 16 子标准开局，红方更深前瞻，容错极低。",
    tips: [
      "先手价值很高，走子前先看三步内风险。",
      "避免形成被双重攻击的薄弱点。",
      "红方会算三层变化，任何失误都可能被放大。",
    ],
    difficulty: "nightmare",
    pieces: [],
  },
  {
    title: "对战·宗师试炼",
    goal: "双方 16 子标准开局，红方会进行更深层计算并持续压制先手。",
    tips: [
      "不要轻易兑掉关键子力，红方会利用先后手差距滚雪球。",
      "每步都先检查将位安全，再考虑反击路线。",
      "中路与肋道同时受压时，优先处理将军风险。",
    ],
    difficulty: "master",
    pieces: [],
  },
  {
    title: "对战·特级大师",
    goal: "双方 16 子标准开局，红方会强化算杀与强制手段。",
    tips: [
      "红方会优先寻找连续将军或先手吃子。",
      "避免给红方形成双车/车炮联动通道。",
      "宁可少吃一子，也要先拆掉对方进攻节奏。",
    ],
    difficulty: "grandmaster",
    pieces: [],
  },
  {
    title: "对战·巅峰决战",
    goal: "双方 16 子标准开局，红方几乎不留明显战术漏洞。",
    tips: [
      "开局失先会被快速放大，尽量争取主动。",
      "任何一步前都先看对方两种最强反击。",
      "如果局面被压制，优先求稳化解而非冒险抢攻。",
    ],
    difficulty: "legend",
    pieces: [],
  },
];

let currentLevelIndex = 0;
let pieces = [];
let initialPieces = [];
let selectedId = null;
let hintIndex = 0;
let showCoords = false;
let completed = false;
let currentTurn = "red";
let audioEnabled = true;
let audioCtx = null;
const lastSoundAt = {};

const dragState = {};

function clonePieces(levelPieces) {
  return levelPieces.map((p) => ({ ...p }));
}

function buildInitialPieces() {
  return [
    { id: "rr1", type: "r", side: "red", x: 0, y: 9 },
    { id: "rn1", type: "n", side: "red", x: 1, y: 9 },
    { id: "rb1", type: "b", side: "red", x: 2, y: 9 },
    { id: "ra1", type: "a", side: "red", x: 3, y: 9 },
    { id: "rk", type: "k", side: "red", x: 4, y: 9 },
    { id: "ra2", type: "a", side: "red", x: 5, y: 9 },
    { id: "rb2", type: "b", side: "red", x: 6, y: 9 },
    { id: "rn2", type: "n", side: "red", x: 7, y: 9 },
    { id: "rr2", type: "r", side: "red", x: 8, y: 9 },
    { id: "rc1", type: "c", side: "red", x: 1, y: 7 },
    { id: "rc2", type: "c", side: "red", x: 7, y: 7 },
    { id: "rp1", type: "p", side: "red", x: 0, y: 6 },
    { id: "rp2", type: "p", side: "red", x: 2, y: 6 },
    { id: "rp3", type: "p", side: "red", x: 4, y: 6 },
    { id: "rp4", type: "p", side: "red", x: 6, y: 6 },
    { id: "rp5", type: "p", side: "red", x: 8, y: 6 },
    { id: "br1", type: "r", side: "black", x: 0, y: 0 },
    { id: "bn1", type: "n", side: "black", x: 1, y: 0 },
    { id: "bb1", type: "b", side: "black", x: 2, y: 0 },
    { id: "ba1", type: "a", side: "black", x: 3, y: 0 },
    { id: "bk", type: "k", side: "black", x: 4, y: 0 },
    { id: "ba2", type: "a", side: "black", x: 5, y: 0 },
    { id: "bb2", type: "b", side: "black", x: 6, y: 0 },
    { id: "bn2", type: "n", side: "black", x: 7, y: 0 },
    { id: "br2", type: "r", side: "black", x: 8, y: 0 },
    { id: "bc1", type: "c", side: "black", x: 1, y: 2 },
    { id: "bc2", type: "c", side: "black", x: 7, y: 2 },
    { id: "bp1", type: "p", side: "black", x: 0, y: 3 },
    { id: "bp2", type: "p", side: "black", x: 2, y: 3 },
    { id: "bp3", type: "p", side: "black", x: 4, y: 3 },
    { id: "bp4", type: "p", side: "black", x: 6, y: 3 },
    { id: "bp5", type: "p", side: "black", x: 8, y: 3 },
  ];
}

function buildBoard() {
  boardEl.innerHTML = "";
  for (let y = 0; y < BOARD_H; y += 1) {
    for (let x = 0; x < BOARD_W; x += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (isStarPoint(x, y)) cell.classList.add("star");
      cell.dataset.x = x;
      cell.dataset.y = y;
      if (showCoords) {
        const coord = document.createElement("div");
        coord.className = "coord";
        coord.textContent = `${x},${y}`;
        cell.appendChild(coord);
      }
      boardEl.appendChild(cell);
    }
  }

  const lines = createBoardLinesSvg();
  boardEl.appendChild(lines);

  const river = document.createElement("div");
  river.className = "river-band";
  river.innerHTML = "<span>楚河</span><span>汉界</span>";
  boardEl.appendChild(river);
}

function createBoardLinesSvg() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.classList.add("board-lines");

  const lineGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  lineGroup.setAttribute("stroke", "var(--line)");
  lineGroup.setAttribute("stroke-width", "0.32");
  lineGroup.setAttribute("stroke-linecap", "square");

  const startX = 100 / 18;
  const stepX = 100 / 9;
  const startY = 100 / 20;
  const stepY = 100 / 10;

  for (let row = 0; row < BOARD_H; row += 1) {
    const y = startY + row * stepY;
    const h = document.createElementNS("http://www.w3.org/2000/svg", "line");
    h.setAttribute("x1", `${startX}`);
    h.setAttribute("x2", `${100 - startX}`);
    h.setAttribute("y1", `${y}`);
    h.setAttribute("y2", `${y}`);
    lineGroup.appendChild(h);
  }

  const riverTop = startY + 4 * stepY;
  const riverBottom = startY + 5 * stepY;
  for (let col = 0; col < BOARD_W; col += 1) {
    const x = startX + col * stepX;
    const v1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    v1.setAttribute("x1", `${x}`);
    v1.setAttribute("x2", `${x}`);
    v1.setAttribute("y1", `${startY}`);
    v1.setAttribute("y2", `${riverTop}`);
    lineGroup.appendChild(v1);

    const v2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    v2.setAttribute("x1", `${x}`);
    v2.setAttribute("x2", `${x}`);
    v2.setAttribute("y1", `${riverBottom}`);
    v2.setAttribute("y2", `${100 - startY}`);
    lineGroup.appendChild(v2);
  }

  const palaceGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  palaceGroup.setAttribute("stroke", "var(--line-soft)");
  palaceGroup.setAttribute("stroke-width", "0.32");

  const left = startX + 3 * stepX;
  const right = startX + 5 * stepX;
  const top = startY;
  const topBottom = startY + 2 * stepY;
  const bottomTop = startY + 7 * stepY;
  const bottom = startY + 9 * stepY;

  const diag = (x1, y1, x2, y2) => {
    const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l.setAttribute("x1", `${x1}`);
    l.setAttribute("y1", `${y1}`);
    l.setAttribute("x2", `${x2}`);
    l.setAttribute("y2", `${y2}`);
    palaceGroup.appendChild(l);
  };

  diag(left, top, right, topBottom);
  diag(right, top, left, topBottom);
  diag(left, bottomTop, right, bottom);
  diag(right, bottomTop, left, bottom);

  svg.appendChild(lineGroup);
  svg.appendChild(palaceGroup);
  return svg;
}

function isStarPoint(x, y) {
  const redRows = [6, 7];
  const blackRows = [2, 3];
  if ([1, 7].includes(x) && (redRows.includes(y) || blackRows.includes(y))) return true;
  if (x === 4 && (redRows.includes(y) || blackRows.includes(y))) return true;
  if ([0, 2, 4, 6, 8].includes(x) && y === 3) return true;
  if ([0, 2, 4, 6, 8].includes(x) && y === 6) return true;
  return false;
}

function renderPieces() {
  const cells = boardEl.querySelectorAll(".cell");
  cells.forEach((cell) => {
    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);
    const piece = pieces.find((p) => p.x === x && p.y === y);
    const existing = cell.querySelector(".piece");
    if (existing) existing.remove();
    if (piece) {
      const el = document.createElement("div");
      el.className = `piece ${piece.side}`;
      if (piece.id === selectedId) el.classList.add("selected");
      const label = pieceText[piece.type];
      el.textContent = label && typeof label === "object" ? label[piece.side] : label;
      el.dataset.id = piece.id;
      el.draggable = false;
      el.addEventListener("dragstart", (e) => e.preventDefault());
      el.addEventListener("touchstart", onPieceTouchStart, { passive: false });
      cell.appendChild(el);
    }
  });
  renderHighlights();
}

function renderLevel() {
  const level = levels[currentLevelIndex];
  if (!level.pieces || level.pieces.length === 0) {
    level.pieces = buildInitialPieces();
  }
  levelIndexEl.textContent = String(currentLevelIndex + 1);
  levelTotalEl.textContent = String(levels.length);
  levelTitleEl.textContent = level.title;
  levelGoalEl.textContent = level.goal;
  hintIndex = 0;
  levelTipEl.textContent = level.tips[0];
  statusBox.textContent = "红方思考中…";
  completed = false;
  selectedId = null;
  currentTurn = "red";

  pieces = clonePieces(level.pieces);
  initialPieces = clonePieces(level.pieces);

  buildBoard();
  renderPieces();
  updateButtons();
  scheduleAiMove();
}

function updateButtons() {
  prevBtn.disabled = currentLevelIndex === 0;
  nextBtn.disabled = currentLevelIndex === levels.length - 1;
}

function getPieceById(id) {
  return pieces.find((p) => p.id === id);
}

function pieceAt(x, y) {
  return pieces.find((p) => p.x === x && p.y === y);
}

function removePiece(id) {
  pieces = pieces.filter((p) => p.id !== id);
}

function getCellFromPoint(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el) return null;
  const cell = el.classList.contains("cell") ? el : el.closest(".cell");
  if (cell) return { x: Number(cell.dataset.x), y: Number(cell.dataset.y) };
  const rect = boardEl.getBoundingClientRect();
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    return null;
  }
  const col = Math.floor(((x - rect.left) / rect.width) * BOARD_W);
  const row = Math.floor(((y - rect.top) / rect.height) * BOARD_H);
  const clampedX = Math.max(0, Math.min(BOARD_W - 1, col));
  const clampedY = Math.max(0, Math.min(BOARD_H - 1, row));
  return { x: clampedX, y: clampedY };
}

function handleClickSelection(pieceId) {
  if (selectedId === pieceId) {
    selectedId = null;
    playSound("select");
  } else {
    selectedId = pieceId;
    playSound("select");
  }
  renderPieces();
}

function renderHighlights() {
  const cells = boardEl.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.classList.remove("legal");
    cell.classList.remove("capture");
  });
  if (!selectedId) return;
  if (currentTurn !== "black") return;
  const piece = getPieceById(selectedId);
  if (!piece || piece.side !== "black") return;
  for (let x = 0; x < BOARD_W; x += 1) {
    for (let y = 0; y < BOARD_H; y += 1) {
      if (piece.x === x && piece.y === y) continue;
      const target = pieceAt(x, y);
      if (target && target.side === piece.side) continue;
      const validation = validateMove(piece, x, y, Boolean(target));
      if (!validation.ok) continue;
      if (wouldLeaveKingInCheck(piece, x, y, target)) continue;
      const cell = boardEl.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
      if (!cell) continue;
      cell.classList.add("legal");
      if (target) cell.classList.add("capture");
    }
  }
}

function onPieceTouchStart(event) {
  if (completed) return;
  const pieceId = event.currentTarget.dataset.id;
  const piece = getPieceById(pieceId);
  if (!piece) return;
  if (currentTurn !== "black" || piece.side !== "black") {
    if (!selectedId) {
      statusBox.textContent = "现在是红方回合。";
    }
    return;
  }
  event.preventDefault();
  handleClickSelection(pieceId);
}

boardEl.addEventListener("click", (event) => {
  if (completed) return;
  const pieceEl = event.target.classList.contains("piece") ? event.target : event.target.closest(".piece");
  if (pieceEl) {
    const pieceId = pieceEl.dataset.id;
    const piece = getPieceById(pieceId);
    if (!piece) return;
    if (currentTurn !== "black") {
      if (!selectedId) {
        statusBox.textContent = "现在是红方回合。";
      }
      return;
    }
    if (piece.side === "black") {
      handleClickSelection(pieceId);
    } else if (selectedId) {
      attemptMove(selectedId, piece.x, piece.y);
    }
    return;
  }
  if (currentTurn !== "black") return;
  const cell = event.target.classList.contains("cell")
    ? event.target
    : event.target.closest(".cell");
  if (!cell) return;
  const x = Number(cell.dataset.x);
  const y = Number(cell.dataset.y);
  if (!selectedId) {
    const targetPiece = pieceAt(x, y);
    if (targetPiece && targetPiece.side === "black") {
      handleClickSelection(targetPiece.id);
    }
    return;
  }
  attemptMove(selectedId, x, y);
});

boardEl.addEventListener(
  "touchend",
  (event) => {
    if (completed) return;
    if (currentTurn !== "black") return;
    if (!selectedId) return;
    const touch = event.changedTouches && event.changedTouches[0];
    if (!touch) return;
    const target = getCellFromPoint(touch.clientX, touch.clientY);
    if (target) {
      attemptMove(selectedId, target.x, target.y);
      event.preventDefault();
    }
  },
  { passive: false }
);

function attemptMove(pieceId, toX, toY) {
  const piece = getPieceById(pieceId);
  if (!piece) return;
  if (piece.side !== currentTurn) {
    statusBox.textContent = "还没轮到你。";
    return;
  }
  if (piece.x === toX && piece.y === toY) return;

  const targetPiece = pieceAt(toX, toY);
  if (targetPiece && targetPiece.side === piece.side) {
    statusBox.textContent = "不能吃自己的棋子。";
    return;
  }

  const validation = validateMove(piece, toX, toY, Boolean(targetPiece));
  if (!validation.ok) {
    statusBox.textContent = validation.reason;
    playSound("error");
    return;
  }

  if (wouldLeaveKingInCheck(piece, toX, toY, targetPiece)) {
    statusBox.textContent = "不能送将。";
    playSound("error");
    return;
  }

  if (targetPiece) removePiece(targetPiece.id);
  piece.x = toX;
  piece.y = toY;
  selectedId = null;

  renderPieces();
  handleAfterMove(targetPiece);
}

function validateMove(piece, toX, toY, isCapture) {
  const dx = toX - piece.x;
  const dy = toY - piece.y;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  const forward = piece.side === "red" ? -1 : 1;

  const pieceBetween = () => countBetween(piece.x, piece.y, toX, toY);

  switch (piece.type) {
    case "r":
      if (dx !== 0 && dy !== 0) return { ok: false, reason: "车走直线。" };
      if (pieceBetween() > 0) return { ok: false, reason: "车不能隔子。" };
      return { ok: true };
    case "c":
      if (dx !== 0 && dy !== 0) return { ok: false, reason: "炮走直线。" };
      const between = pieceBetween();
      if (isCapture) {
        if (between !== 1) return { ok: false, reason: "炮吃子必须隔一个棋子。" };
      } else {
        if (between !== 0) return { ok: false, reason: "炮走棋不能隔子。" };
      }
      return { ok: true };
    case "n":
      if (!((absX === 1 && absY === 2) || (absX === 2 && absY === 1))) {
        return { ok: false, reason: "马走日字。" };
      }
      const legX = piece.x + (absX === 2 ? dx / 2 : 0);
      const legY = piece.y + (absY === 2 ? dy / 2 : 0);
      if (pieceAt(legX, legY)) return { ok: false, reason: "马腿被堵住了。" };
      return { ok: true };
    case "b":
      if (!(absX === 2 && absY === 2)) return { ok: false, reason: "相走田字。" };
      const eyeX = piece.x + dx / 2;
      const eyeY = piece.y + dy / 2;
      if (pieceAt(eyeX, eyeY)) return { ok: false, reason: "象眼被堵住了。" };
      if (piece.side === "red" && toY < 5) return { ok: false, reason: "相不能过河。" };
      if (piece.side === "black" && toY > 4) return { ok: false, reason: "象不能过河。" };
      return { ok: true };
    case "a":
      if (!(absX === 1 && absY === 1)) return { ok: false, reason: "仕走一格对角。" };
      if (piece.side === "red" && !inRedPalace(toX, toY)) return { ok: false, reason: "仕不能出九宫。" };
      if (piece.side === "black" && !inBlackPalace(toX, toY)) return { ok: false, reason: "士不能出九宫。" };
      return { ok: true };
    case "k":
      if (!((absX === 1 && absY === 0) || (absX === 0 && absY === 1))) {
        return { ok: false, reason: "帅走一格直线。" };
      }
      if (piece.side === "red" && !inRedPalace(toX, toY)) return { ok: false, reason: "帅不能出九宫。" };
      if (piece.side === "black" && !inBlackPalace(toX, toY)) return { ok: false, reason: "将不能出九宫。" };
      return { ok: true };
    case "p":
      if (dy !== forward && dy !== 0) return { ok: false, reason: "兵只能向前或横走。" };
      if (dy === 0 && absX !== 1) return { ok: false, reason: "兵横走一格。" };
      if (dy === forward && absX !== 0) return { ok: false, reason: "兵直走一格。" };
      if (piece.side === "red") {
        if (piece.y >= 5) {
          if (dy !== -1 || dx !== 0) return { ok: false, reason: "兵过河前只能向前。" };
        }
      } else {
        if (piece.y <= 4) {
          if (dy !== 1 || dx !== 0) return { ok: false, reason: "卒过河前只能向前。" };
        }
      }
      return { ok: true };
    default:
      return { ok: false, reason: "未知棋子。" };
  }
}

function countBetween(fromX, fromY, toX, toY) {
  if (fromX === toX && fromY === toY) return 0;
  let count = 0;
  if (fromX === toX) {
    const step = fromY < toY ? 1 : -1;
    for (let y = fromY + step; y !== toY; y += step) {
      if (pieceAt(fromX, y)) count += 1;
    }
  } else if (fromY === toY) {
    const step = fromX < toX ? 1 : -1;
    for (let x = fromX + step; x !== toX; x += step) {
      if (pieceAt(x, fromY)) count += 1;
    }
  }
  return count;
}

function cloneBoardState() {
  return pieces.map((p) => ({ ...p }));
}

function applyMove(state, pieceId, toX, toY) {
  const moving = state.find((p) => p.id === pieceId);
  if (!moving) return;
  const targetIndex = state.findIndex((p) => p.x === toX && p.y === toY);
  if (targetIndex !== -1) state.splice(targetIndex, 1);
  moving.x = toX;
  moving.y = toY;
}

function findKing(state, side) {
  return state.find((p) => p.side === side && p.type === "k");
}

function wouldLeaveKingInCheck(piece, toX, toY, targetPiece) {
  const state = cloneBoardState();
  applyMove(state, piece.id, toX, toY);
  const king = findKing(state, piece.side);
  if (!king) return false;
  if (kingsFacing(state)) return true;
  return isSquareAttacked(state, king.x, king.y, piece.side === "red" ? "black" : "red");
}

function isSquareAttacked(state, x, y, bySide) {
  for (const p of state) {
    if (p.side !== bySide) continue;
    if (canAttack(state, p, x, y)) return true;
  }
  const attackerKing = state.find((p) => p.side === bySide && p.type === "k");
  if (attackerKing && attackerKing.x === x) {
    const between = countBetweenState(state, attackerKing.x, attackerKing.y, x, y);
    if (between === 0) return true;
  }
  return false;
}

function kingsFacing(state) {
  const redKing = findKing(state, "red");
  const blackKing = findKing(state, "black");
  if (!redKing || !blackKing) return false;
  if (redKing.x !== blackKing.x) return false;
  return countBetweenState(state, redKing.x, redKing.y, blackKing.x, blackKing.y) === 0;
}

function canAttack(state, piece, toX, toY) {
  const dx = toX - piece.x;
  const dy = toY - piece.y;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  const forward = piece.side === "red" ? -1 : 1;
  const pieceBetween = () => countBetweenState(state, piece.x, piece.y, toX, toY);
  switch (piece.type) {
    case "r":
      if (dx !== 0 && dy !== 0) return false;
      return pieceBetween() === 0;
    case "c":
      if (dx !== 0 && dy !== 0) return false;
      return pieceBetween() === 1;
    case "n": {
      if (!((absX === 1 && absY === 2) || (absX === 2 && absY === 1))) return false;
      const legX = piece.x + (absX === 2 ? dx / 2 : 0);
      const legY = piece.y + (absY === 2 ? dy / 2 : 0);
      return !pieceAtState(state, legX, legY);
    }
    case "b": {
      if (!(absX === 2 && absY === 2)) return false;
      const eyeX = piece.x + dx / 2;
      const eyeY = piece.y + dy / 2;
      if (pieceAtState(state, eyeX, eyeY)) return false;
      if (piece.side === "red" && toY < 5) return false;
      if (piece.side === "black" && toY > 4) return false;
      return true;
    }
    case "a": {
      if (!(absX === 1 && absY === 1)) return false;
      if (piece.side === "red" && !inRedPalace(toX, toY)) return false;
      if (piece.side === "black" && !inBlackPalace(toX, toY)) return false;
      return true;
    }
    case "k": {
      if (!((absX === 1 && absY === 0) || (absX === 0 && absY === 1))) return false;
      if (piece.side === "red" && !inRedPalace(toX, toY)) return false;
      if (piece.side === "black" && !inBlackPalace(toX, toY)) return false;
      return true;
    }
    case "p": {
      if (dy !== forward && dy !== 0) return false;
      if (dy === 0 && absX !== 1) return false;
      if (dy === forward && absX !== 0) return false;
      if (piece.side === "red") {
        if (piece.y >= 5) return dy === -1 && dx === 0;
      } else {
        if (piece.y <= 4) return dy === 1 && dx === 0;
      }
      return true;
    }
    default:
      return false;
  }
}

function pieceAtState(state, x, y) {
  return state.find((p) => p.x === x && p.y === y);
}

function countBetweenState(state, fromX, fromY, toX, toY) {
  if (fromX === toX && fromY === toY) return 0;
  let count = 0;
  if (fromX === toX) {
    const step = fromY < toY ? 1 : -1;
    for (let y = fromY + step; y !== toY; y += step) {
      if (pieceAtState(state, fromX, y)) count += 1;
    }
  } else if (fromY === toY) {
    const step = fromX < toX ? 1 : -1;
    for (let x = fromX + step; x !== toX; x += step) {
      if (pieceAtState(state, x, fromY)) count += 1;
    }
  }
  return count;
}

function inRedPalace(x, y) {
  return x >= RED_PALACE.xMin && x <= RED_PALACE.xMax && y >= RED_PALACE.yMin && y <= RED_PALACE.yMax;
}

function inBlackPalace(x, y) {
  return (
    x >= BLACK_PALACE.xMin && x <= BLACK_PALACE.xMax && y >= BLACK_PALACE.yMin && y <= BLACK_PALACE.yMax
  );
}

function handleAfterMove(capturedPiece) {
  if (capturedPiece && capturedPiece.type === "k") {
    if (capturedPiece.side === "red") {
      winGame("黑方胜利！");
    } else {
      winGame("红方胜利！");
    }
    return;
  }

  playSound(capturedPiece ? "capture" : "move");

  if (currentTurn === "black") {
    currentTurn = "red";
    statusBox.textContent = "红方思考中…";
    scheduleAiMove();
  } else {
    currentTurn = "black";
    statusBox.textContent = "轮到你（黑方）";
  }

  checkGameState();
}

function scheduleAiMove() {
  if (completed || currentTurn !== "red") return;
  window.setTimeout(() => {
    if (completed || currentTurn !== "red") return;
    aiMove();
  }, 500);
}

function aiMove() {
  const level = levels[currentLevelIndex];
  const moves = getAllLegalMoves("red");
  if (moves.length === 0) {
    if (isInCheck("red")) {
      winGame("黑方胜利！");
    } else {
      winGame("和棋！");
    }
    return;
  }

  let chosen = null;
  if (level.difficulty === "easy") {
    chosen = randomMove(moves);
  } else if (level.difficulty === "medium") {
    chosen = pickGreedyMove(moves);
  } else if (level.difficulty === "hard") {
    chosen = pickBestMove(moves);
  } else if (level.difficulty === "expert") {
    chosen = pickBestMoveWithLookahead(moves, 2, 14);
  } else if (level.difficulty === "nightmare") {
    chosen = pickBestMoveWithLookahead(moves, 3, 14);
  } else if (level.difficulty === "master") {
    chosen = pickBestMoveWithLookahead(moves, 4, 10, false);
  } else if (level.difficulty === "grandmaster") {
    chosen = pickBestMoveWithLookahead(moves, 4, 12, false, 1000);
  } else {
    chosen = pickBestMoveWithLookahead(moves, 4, 12, false, 850);
  }

  if (!chosen) return;
  if (chosen.capture) removePiece(chosen.capture.id);
  const piece = getPieceById(chosen.pieceId);
  if (!piece) return;
  piece.x = chosen.toX;
  piece.y = chosen.toY;
  renderPieces();
  handleAfterMove(chosen.capture);
}

function randomMove(moves) {
  return moves[Math.floor(Math.random() * moves.length)];
}

function pickBestMove(moves) {
  let bestScore = -Infinity;
  let best = [];
  for (const move of moves) {
    const score = evaluateMove(move);
    if (score > bestScore) {
      bestScore = score;
      best = [move];
    } else if (score === bestScore) {
      best.push(move);
    }
  }
  return randomMove(best);
}

function pickGreedyMove(moves) {
  const captures = moves.filter((m) => m.capture);
  if (captures.length === 0) return randomMove(moves);
  let bestValue = -Infinity;
  let bestCaptures = [];
  for (const move of captures) {
    const gain = PIECE_VALUES[move.capture.type] ?? 0;
    const attacker = getPieceById(move.pieceId);
    const cost = attacker ? (PIECE_VALUES[attacker.type] ?? 0) : 0;
    const score = gain - cost * 0.2;
    if (score > bestValue) {
      bestValue = score;
      bestCaptures = [move];
    } else if (score === bestValue) {
      bestCaptures.push(move);
    }
  }
  return randomMove(bestCaptures);
}

function pickBestMoveWithLookahead(moves, depth, branchLimit, randomizeTies = true, maxThinkMs = Infinity) {
  const baseState = cloneBoardState();
  const ordered = orderMovesForSearch(baseState, moves, "red").slice(0, branchLimit);
  const deadline = Number.isFinite(maxThinkMs) ? performance.now() + maxThinkMs : Infinity;
  let bestScore = -Infinity;
  let bestMoves = [];
  for (const move of ordered) {
    if (performance.now() > deadline) break;
    const nextState = clonePieces(baseState);
    applyMove(nextState, move.pieceId, move.toX, move.toY);
    const score = minimax(nextState, "black", depth - 1, -Infinity, Infinity, branchLimit, deadline);
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }
  const candidates = bestMoves.length > 0 ? bestMoves : ordered;
  if (!randomizeTies) return candidates[0] ?? null;
  return randomMove(candidates);
}

function evaluateMove(move) {
  const snapshot = clonePieces(pieces);
  const moving = snapshot.find((p) => p.id === move.pieceId);
  if (!moving) return -Infinity;
  if (move.capture) {
    const idx = snapshot.findIndex((p) => p.id === move.capture.id);
    if (idx !== -1) snapshot.splice(idx, 1);
  }
  moving.x = move.toX;
  moving.y = move.toY;
  let score = materialScore(snapshot);
  if (move.capture) score += (PIECE_VALUES[move.capture.type] ?? 0) * 0.1;
  const redKing = findKing(snapshot, "red");
  const blackKing = findKing(snapshot, "black");
  if (redKing && isSquareAttacked(snapshot, redKing.x, redKing.y, "black")) score -= 80;
  if (blackKing && isSquareAttacked(snapshot, blackKing.x, blackKing.y, "red")) score += 60;
  return score;
}

function materialScore(state) {
  let red = 0;
  let black = 0;
  state.forEach((p) => {
    const val = PIECE_VALUES[p.type] ?? 0;
    if (p.side === "red") red += val;
    else black += val;
  });
  return red - black;
}

function orderMovesForSearch(state, moves, side) {
  const scored = moves.map((move) => ({ move, score: quickMoveScore(state, move, side) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.map((item) => item.move);
}

function quickMoveScore(state, move, side) {
  let score = 0;
  if (move.capture) score += (PIECE_VALUES[move.capture.type] ?? 0) * 2;
  const moving = state.find((p) => p.id === move.pieceId);
  if (moving?.type === "p") {
    score += side === "red" ? Math.max(0, 9 - move.toY) : Math.max(0, move.toY);
  }
  if (move.toX >= 3 && move.toX <= 5) score += 8;
  return score;
}

function minimax(state, sideToMove, depth, alpha, beta, branchLimit, deadline = Infinity) {
  if (performance.now() > deadline) return evaluateStateForRed(state);
  const redKing = findKing(state, "red");
  const blackKing = findKing(state, "black");
  if (!redKing) return -1000000 - depth;
  if (!blackKing) return 1000000 + depth;
  if (depth <= 0) return evaluateStateForRed(state);

  const legalMoves = getAllLegalMovesFromState(state, sideToMove);
  if (legalMoves.length === 0) {
    const inCheck = isInCheckOnState(state, sideToMove);
    if (!inCheck) return 0;
    return sideToMove === "red" ? -1000000 - depth : 1000000 + depth;
  }

  const orderedMoves = orderMovesForSearch(state, legalMoves, sideToMove).slice(0, branchLimit);
  if (sideToMove === "red") {
    let best = -Infinity;
    for (const move of orderedMoves) {
      if (performance.now() > deadline) break;
      const nextState = clonePieces(state);
      applyMove(nextState, move.pieceId, move.toX, move.toY);
      const score = minimax(nextState, "black", depth - 1, alpha, beta, branchLimit, deadline);
      if (score > best) best = score;
      if (score > alpha) alpha = score;
      if (beta <= alpha) break;
    }
    return best;
  }

  let best = Infinity;
  for (const move of orderedMoves) {
    if (performance.now() > deadline) break;
    const nextState = clonePieces(state);
    applyMove(nextState, move.pieceId, move.toX, move.toY);
    const score = minimax(nextState, "red", depth - 1, alpha, beta, branchLimit, deadline);
    if (score < best) best = score;
    if (score < beta) beta = score;
    if (beta <= alpha) break;
  }
  return best;
}

function evaluateStateForRed(state) {
  let score = materialScore(state);
  const redMoves = getAllLegalMovesFromState(state, "red").length;
  const blackMoves = getAllLegalMovesFromState(state, "black").length;
  score += (redMoves - blackMoves) * 3;
  const blackKing = findKing(state, "black");
  if (blackKing && isSquareAttacked(state, blackKing.x, blackKing.y, "red")) score += 40;
  const redKing = findKing(state, "red");
  if (redKing && isSquareAttacked(state, redKing.x, redKing.y, "black")) score -= 50;
  return score;
}

function isInCheckOnState(state, side) {
  const king = findKing(state, side);
  if (!king) return false;
  const attacker = side === "red" ? "black" : "red";
  return isSquareAttacked(state, king.x, king.y, attacker);
}

function getAllLegalMovesFromState(state, side) {
  const moves = [];
  for (const piece of state) {
    if (piece.side !== side) continue;
    for (let x = 0; x < BOARD_W; x += 1) {
      for (let y = 0; y < BOARD_H; y += 1) {
        if (piece.x === x && piece.y === y) continue;
        const target = pieceAtState(state, x, y);
        if (target && target.side === side) continue;
        if (!validateMoveOnState(state, piece, x, y, Boolean(target))) continue;
        if (wouldLeaveKingInCheckOnState(state, piece, x, y)) continue;
        moves.push({
          pieceId: piece.id,
          fromX: piece.x,
          fromY: piece.y,
          toX: x,
          toY: y,
          capture: target || null,
        });
      }
    }
  }
  return moves;
}

function validateMoveOnState(state, piece, toX, toY, isCapture) {
  const dx = toX - piece.x;
  const dy = toY - piece.y;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  const forward = piece.side === "red" ? -1 : 1;
  const pieceBetween = () => countBetweenState(state, piece.x, piece.y, toX, toY);

  switch (piece.type) {
    case "r":
      return (dx === 0 || dy === 0) && pieceBetween() === 0;
    case "c": {
      if (dx !== 0 && dy !== 0) return false;
      const between = pieceBetween();
      return isCapture ? between === 1 : between === 0;
    }
    case "n": {
      if (!((absX === 1 && absY === 2) || (absX === 2 && absY === 1))) return false;
      const legX = piece.x + (absX === 2 ? dx / 2 : 0);
      const legY = piece.y + (absY === 2 ? dy / 2 : 0);
      return !pieceAtState(state, legX, legY);
    }
    case "b": {
      if (!(absX === 2 && absY === 2)) return false;
      const eyeX = piece.x + dx / 2;
      const eyeY = piece.y + dy / 2;
      if (pieceAtState(state, eyeX, eyeY)) return false;
      if (piece.side === "red" && toY < 5) return false;
      if (piece.side === "black" && toY > 4) return false;
      return true;
    }
    case "a":
      if (!(absX === 1 && absY === 1)) return false;
      return piece.side === "red" ? inRedPalace(toX, toY) : inBlackPalace(toX, toY);
    case "k":
      if (!((absX === 1 && absY === 0) || (absX === 0 && absY === 1))) return false;
      return piece.side === "red" ? inRedPalace(toX, toY) : inBlackPalace(toX, toY);
    case "p":
      if (dy !== forward && dy !== 0) return false;
      if (dy === 0 && absX !== 1) return false;
      if (dy === forward && absX !== 0) return false;
      if (piece.side === "red" && piece.y >= 5) return dy === -1 && dx === 0;
      if (piece.side === "black" && piece.y <= 4) return dy === 1 && dx === 0;
      return true;
    default:
      return false;
  }
}

function wouldLeaveKingInCheckOnState(state, piece, toX, toY) {
  const nextState = clonePieces(state);
  applyMove(nextState, piece.id, toX, toY);
  const king = findKing(nextState, piece.side);
  if (!king) return false;
  if (kingsFacing(nextState)) return true;
  return isSquareAttacked(nextState, king.x, king.y, piece.side === "red" ? "black" : "red");
}

function getAllLegalMoves(side) {
  const moves = [];
  for (const piece of pieces) {
    if (piece.side !== side) continue;
    for (let x = 0; x < BOARD_W; x += 1) {
      for (let y = 0; y < BOARD_H; y += 1) {
        if (piece.x === x && piece.y === y) continue;
        const target = pieceAt(x, y);
        if (target && target.side === side) continue;
        const validation = validateMove(piece, x, y, Boolean(target));
        if (!validation.ok) continue;
        if (wouldLeaveKingInCheck(piece, x, y, target)) continue;
        moves.push({
          pieceId: piece.id,
          fromX: piece.x,
          fromY: piece.y,
          toX: x,
          toY: y,
          capture: target || null,
        });
      }
    }
  }
  return moves;
}

function isInCheck(side) {
  const king = findKing(pieces, side);
  if (!king) return false;
  const attacker = side === "red" ? "black" : "red";
  return isSquareAttacked(pieces, king.x, king.y, attacker);
}

function checkGameState() {
  if (completed) return;
  const sideToMove = currentTurn;
  const inCheck = isInCheck(sideToMove);
  const legalMoves = getAllLegalMoves(sideToMove);
  if (legalMoves.length === 0) {
    if (inCheck) {
      winGame(sideToMove === "red" ? "黑方胜利！" : "红方胜利！");
    } else {
      winGame("和棋！");
    }
    return;
  }
  if (inCheck) {
    statusBox.textContent = sideToMove === "red" ? "将军！红方被将军" : "将军！黑方被将军";
    playSound("check");
  }
}

prevBtn.addEventListener("click", () => {
  if (currentLevelIndex > 0) {
    currentLevelIndex -= 1;
    playSound("level");
    renderLevel();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentLevelIndex < levels.length - 1) {
    currentLevelIndex += 1;
    playSound("level");
    renderLevel();
  }
});

resetBtn.addEventListener("click", () => {
  pieces = clonePieces(initialPieces);
  selectedId = null;
  completed = false;
  currentTurn = "red";
  statusBox.textContent = "红方思考中…";
  playSound("reset");
  renderPieces();
  scheduleAiMove();
});

hintBtn.addEventListener("click", () => {
  const level = levels[currentLevelIndex];
  hintIndex = (hintIndex + 1) % level.tips.length;
  levelTipEl.textContent = level.tips[hintIndex];
  playSound("hint");
});

toggleGridBtn.addEventListener("click", () => {
  showCoords = !showCoords;
  playSound("select");
  buildBoard();
  renderPieces();
});

renderLevel();

function ensureAudioContext() {
  if (audioCtx) return audioCtx;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  audioCtx = new AudioCtx();
  return audioCtx;
}

function playTone({ type = "sine", freq = 440, gain = 0.03, start = 0, duration = 0.14, endFreq = null }) {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (endFreq) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(50, endFreq), now + duration);
  }
  amp.gain.setValueAtTime(0.001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(amp).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function unlockAudio() {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {
      audioEnabled = false;
    });
  }
}

document.addEventListener("pointerdown", unlockAudio, { once: true, passive: true });

function winGame(message) {
  completed = true;
  statusBox.textContent = message;
  playSound("success");
  boardEl.classList.add("celebrate");
  setTimeout(() => boardEl.classList.remove("celebrate"), 600);
  window.setTimeout(() => {
    window.alert(message);
  }, 80);
}

function playSound(kind) {
  if (!audioEnabled) return;
  const now = performance.now();
  const minInterval = { select: 50, move: 70, capture: 90, error: 120, check: 350, hint: 120 };
  const wait = minInterval[kind] ?? 80;
  if (lastSoundAt[kind] && now - lastSoundAt[kind] < wait) return;
  lastSoundAt[kind] = now;

  if (kind === "success") {
    playTone({ type: "triangle", freq: 523, gain: 0.04, duration: 0.14 });
    playTone({ type: "triangle", freq: 659, gain: 0.045, start: 0.12, duration: 0.14 });
    playTone({ type: "triangle", freq: 784, gain: 0.05, start: 0.24, duration: 0.2 });
    return;
  }
  if (kind === "capture") {
    playTone({ type: "square", freq: 240, gain: 0.04, duration: 0.08 });
    playTone({ type: "triangle", freq: 180, gain: 0.045, start: 0.06, duration: 0.16 });
    return;
  }
  if (kind === "error") {
    playTone({ type: "sawtooth", freq: 210, gain: 0.03, duration: 0.09, endFreq: 150 });
    playTone({ type: "sawtooth", freq: 170, gain: 0.025, start: 0.08, duration: 0.08, endFreq: 130 });
    return;
  }
  if (kind === "check") {
    playTone({ type: "square", freq: 460, gain: 0.028, duration: 0.06 });
    playTone({ type: "square", freq: 520, gain: 0.028, start: 0.07, duration: 0.06 });
    return;
  }
  if (kind === "hint") {
    playTone({ type: "sine", freq: 680, gain: 0.022, duration: 0.06 });
    playTone({ type: "sine", freq: 760, gain: 0.022, start: 0.06, duration: 0.07 });
    return;
  }
  if (kind === "level") {
    playTone({ type: "triangle", freq: 330, gain: 0.03, duration: 0.08 });
    playTone({ type: "triangle", freq: 494, gain: 0.03, start: 0.08, duration: 0.1 });
    return;
  }
  if (kind === "reset") {
    playTone({ type: "sine", freq: 500, gain: 0.022, duration: 0.06 });
    playTone({ type: "sine", freq: 320, gain: 0.022, start: 0.06, duration: 0.1 });
    return;
  }

  playTone({ type: "triangle", freq: 430, gain: 0.022, duration: 0.08 });
}
