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
  } else {
    selectedId = pieceId;
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

  if (currentTurn === "black") {
    currentTurn = "red";
    statusBox.textContent = "红方思考中…";
    playSound("move");
    scheduleAiMove();
  } else {
    currentTurn = "black";
    statusBox.textContent = "轮到你（黑方）";
    playSound("move");
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
    const captures = moves.filter((m) => m.capture);
    chosen = captures.length > 0 ? randomMove(captures) : randomMove(moves);
  } else {
    chosen = pickBestMove(moves);
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
  return materialScore(snapshot);
}

function materialScore(state) {
  const values = { k: 1000, r: 90, c: 45, n: 40, b: 20, a: 20, p: 10 };
  let red = 0;
  let black = 0;
  state.forEach((p) => {
    const val = values[p.type] ?? 0;
    if (p.side === "red") red += val;
    else black += val;
  });
  return red - black;
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
  }
}

prevBtn.addEventListener("click", () => {
  if (currentLevelIndex > 0) {
    currentLevelIndex -= 1;
    renderLevel();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentLevelIndex < levels.length - 1) {
    currentLevelIndex += 1;
    renderLevel();
  }
});

resetBtn.addEventListener("click", () => {
  pieces = clonePieces(initialPieces);
  selectedId = null;
  completed = false;
  currentTurn = "red";
  statusBox.textContent = "红方思考中…";
  renderPieces();
  scheduleAiMove();
});

hintBtn.addEventListener("click", () => {
  const level = levels[currentLevelIndex];
  hintIndex = (hintIndex + 1) % level.tips.length;
  levelTipEl.textContent = level.tips[hintIndex];
});

toggleGridBtn.addEventListener("click", () => {
  showCoords = !showCoords;
  buildBoard();
  renderPieces();
});

renderLevel();

function winGame(message) {
  statusBox.textContent = message;
  completed = true;
  playSound("success");
  boardEl.classList.add("celebrate");
  setTimeout(() => boardEl.classList.remove("celebrate"), 600);
}

function playSound(kind) {
  if (!audioEnabled) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  const now = ctx.currentTime;
  if (kind === "success") {
    osc.frequency.setValueAtTime(620, now);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  } else if (kind === "error") {
    osc.frequency.setValueAtTime(180, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  } else {
    osc.frequency.setValueAtTime(420, now);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  }
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(now + 0.35);
  setTimeout(() => ctx.close(), 500);
}
