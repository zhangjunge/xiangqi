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
    title: "对战·入门",
    goal: "你执黑，红方先手。目标：吃掉对方将（帅）。",
    tips: [
      "红方是机器，黑方由你操作。",
      "不考虑将军规则，直接吃掉对方将即可。",
      "先观察红方走子，再找吃子机会。",
    ],
    difficulty: "easy",
    pieces: [
      { id: "rk", type: "k", side: "red", x: 4, y: 9 },
      { id: "rr1", type: "r", side: "red", x: 4, y: 7 },
      { id: "rp1", type: "p", side: "red", x: 3, y: 6 },
      { id: "rp2", type: "p", side: "red", x: 5, y: 6 },
      { id: "bk", type: "k", side: "black", x: 4, y: 0 },
      { id: "br1", type: "r", side: "black", x: 4, y: 2 },
      { id: "bp1", type: "p", side: "black", x: 3, y: 3 },
      { id: "bp2", type: "p", side: "black", x: 5, y: 3 },
    ],
  },
  {
    title: "对战·进阶",
    goal: "加入炮与马，红方会优先吃子。",
    tips: [
      "注意炮的隔子吃法。",
      "马腿被堵就不能跳。",
      "先稳住将，再找机会吃子。",
    ],
    difficulty: "medium",
    pieces: [
      { id: "rk", type: "k", side: "red", x: 4, y: 9 },
      { id: "rr1", type: "r", side: "red", x: 0, y: 9 },
      { id: "rn1", type: "n", side: "red", x: 2, y: 7 },
      { id: "rc1", type: "c", side: "red", x: 6, y: 7 },
      { id: "rp1", type: "p", side: "red", x: 4, y: 6 },
      { id: "bk", type: "k", side: "black", x: 4, y: 0 },
      { id: "br1", type: "r", side: "black", x: 8, y: 0 },
      { id: "bn1", type: "n", side: "black", x: 6, y: 2 },
      { id: "bc1", type: "c", side: "black", x: 2, y: 2 },
      { id: "bp1", type: "p", side: "black", x: 4, y: 3 },
    ],
  },
  {
    title: "对战·挑战",
    goal: "接近正式对局阵容，红方会选择最优交换。",
    tips: [
      "优先保护将与关键子力。",
      "留意双车与双炮的威胁。",
      "稳住阵型，再找突破点。",
    ],
    difficulty: "hard",
    pieces: [
      { id: "rk", type: "k", side: "red", x: 4, y: 9 },
      { id: "rr1", type: "r", side: "red", x: 0, y: 9 },
      { id: "rr2", type: "r", side: "red", x: 8, y: 9 },
      { id: "rn1", type: "n", side: "red", x: 1, y: 7 },
      { id: "rc1", type: "c", side: "red", x: 7, y: 7 },
      { id: "rb1", type: "b", side: "red", x: 2, y: 9 },
      { id: "ra1", type: "a", side: "red", x: 3, y: 9 },
      { id: "rp1", type: "p", side: "red", x: 0, y: 6 },
      { id: "rp2", type: "p", side: "red", x: 6, y: 6 },
      { id: "bk", type: "k", side: "black", x: 4, y: 0 },
      { id: "br1", type: "r", side: "black", x: 0, y: 0 },
      { id: "br2", type: "r", side: "black", x: 8, y: 0 },
      { id: "bn1", type: "n", side: "black", x: 7, y: 2 },
      { id: "bc1", type: "c", side: "black", x: 1, y: 2 },
      { id: "bb1", type: "b", side: "black", x: 6, y: 0 },
      { id: "ba1", type: "a", side: "black", x: 5, y: 0 },
      { id: "bp1", type: "p", side: "black", x: 2, y: 3 },
      { id: "bp2", type: "p", side: "black", x: 8, y: 3 },
    ],
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

const dragState = {
  active: false,
  moved: false,
  pieceId: null,
  origin: null,
  pointerId: null,
  touchId: null,
  startX: 0,
  startY: 0,
  ghost: null,
  suppressClick: null,
};

function clonePieces(levelPieces) {
  return levelPieces.map((p) => ({ ...p }));
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

  const river = document.createElement("div");
  river.className = "river-band";
  river.innerHTML = "<span>楚河</span><span>汉界</span>";
  boardEl.appendChild(river);

  const palaceTop = document.createElement("div");
  palaceTop.className = "palace palace-top";
  boardEl.appendChild(palaceTop);

  const palaceBottom = document.createElement("div");
  palaceBottom.className = "palace palace-bottom";
  boardEl.appendChild(palaceBottom);
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
      el.addEventListener("pointerdown", onPiecePointerDown);
      el.addEventListener("click", onPieceClick);
      el.addEventListener("touchstart", onPieceTouchStart, { passive: false });
      cell.appendChild(el);
    }
  });
}

function renderLevel() {
  const level = levels[currentLevelIndex];
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

function onPiecePointerDown(event) {
  if (completed) return;
  const pieceId = event.currentTarget.dataset.id;
  const piece = getPieceById(pieceId);
  if (!piece) return;
  if (currentTurn !== "black" || piece.side !== "black") {
    statusBox.textContent = "现在是红方回合。";
    return;
  }

  dragState.active = true;
  dragState.moved = false;
  dragState.pieceId = pieceId;
  dragState.origin = { x: piece.x, y: piece.y };
  dragState.pointerId = event.pointerId;
  dragState.startX = event.clientX;
  dragState.startY = event.clientY;
  event.currentTarget.setPointerCapture(event.pointerId);
  boardEl.classList.add("dragging");

  function onMove(moveEvent) {
    if (!dragState.active) return;
    const dx = moveEvent.clientX - dragState.startX;
    const dy = moveEvent.clientY - dragState.startY;
    if (!dragState.moved && Math.hypot(dx, dy) > 6) {
      dragState.moved = true;
      createGhost(piece, moveEvent.clientX, moveEvent.clientY);
      event.currentTarget.classList.add("drag-hidden");
    }
    if (dragState.moved && dragState.ghost) {
      dragState.ghost.style.left = `${moveEvent.clientX - 26}px`;
      dragState.ghost.style.top = `${moveEvent.clientY - 26}px`;
    }
  }

  function onUp(upEvent) {
    event.currentTarget.releasePointerCapture(event.pointerId);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    boardEl.classList.remove("dragging");

    const wasDrag = dragState.moved;
    cleanupGhost(event.currentTarget);

    if (!wasDrag) {
      handleClickSelection(pieceId);
      dragState.suppressClick = { id: pieceId, time: performance.now() };
    } else {
      const target = getCellFromPoint(upEvent.clientX, upEvent.clientY);
      if (target) {
        attemptMove(pieceId, target.x, target.y);
      }
    }
    dragState.active = false;
  }

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
}

function createGhost(piece, clientX, clientY) {
  const ghost = document.createElement("div");
  ghost.className = `piece ${piece.side} ghost`;
  ghost.textContent = pieceText[piece.type];
  ghost.style.left = `${clientX - 26}px`;
  ghost.style.top = `${clientY - 26}px`;
  document.body.appendChild(ghost);
  dragState.ghost = ghost;
}

function cleanupGhost(originEl) {
  if (dragState.ghost) dragState.ghost.remove();
  dragState.ghost = null;
  originEl.classList.remove("drag-hidden");
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

function onPieceClick(event) {
  if (completed) return;
  const pieceId = event.currentTarget.dataset.id;
  const piece = getPieceById(pieceId);
  if (!piece) return;
  if (
    dragState.suppressClick &&
    dragState.suppressClick.id === pieceId &&
    performance.now() - dragState.suppressClick.time < 400
  ) {
    return;
  }
  if (currentTurn !== "black" || piece.side !== "black") {
    if (!selectedId) {
      statusBox.textContent = "现在是红方回合。";
    }
    return;
  }
  handleClickSelection(pieceId);
  event.stopPropagation();
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
  const touch = event.changedTouches && event.changedTouches[0];
  if (!touch) return;
  event.preventDefault();

  dragState.active = true;
  dragState.moved = false;
  dragState.pieceId = pieceId;
  dragState.origin = { x: piece.x, y: piece.y };
  dragState.touchId = touch.identifier;
  dragState.startX = touch.clientX;
  dragState.startY = touch.clientY;
  boardEl.classList.add("dragging");

  const originEl = event.currentTarget;

  function onTouchMove(moveEvent) {
    if (!dragState.active) return;
    const moveTouch = Array.from(moveEvent.changedTouches).find(
      (t) => t.identifier === dragState.touchId
    );
    if (!moveTouch) return;
    const dx = moveTouch.clientX - dragState.startX;
    const dy = moveTouch.clientY - dragState.startY;
    if (!dragState.moved && Math.hypot(dx, dy) > 6) {
      dragState.moved = true;
      createGhost(piece, moveTouch.clientX, moveTouch.clientY);
      originEl.classList.add("drag-hidden");
    }
    if (dragState.moved && dragState.ghost) {
      dragState.ghost.style.left = `${moveTouch.clientX - 26}px`;
      dragState.ghost.style.top = `${moveTouch.clientY - 26}px`;
    }
    moveEvent.preventDefault();
  }

  function onTouchEnd(endEvent) {
    const endTouch = Array.from(endEvent.changedTouches).find(
      (t) => t.identifier === dragState.touchId
    );
    if (!endTouch) return;
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("touchcancel", onTouchEnd);
    boardEl.classList.remove("dragging");

    const wasDrag = dragState.moved;
    cleanupGhost(originEl);

    if (!wasDrag) {
      handleClickSelection(pieceId);
      dragState.suppressClick = { id: pieceId, time: performance.now() };
    } else {
      const target = getCellFromPoint(endTouch.clientX, endTouch.clientY);
      if (target) {
        attemptMove(pieceId, target.x, target.y);
      }
    }
    dragState.active = false;
    dragState.touchId = null;
    endEvent.preventDefault();
  }

  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd, { passive: false });
  window.addEventListener("touchcancel", onTouchEnd, { passive: false });
}

boardEl.addEventListener("click", (event) => {
  if (completed) return;
  if (currentTurn !== "black") return;
  const cell = event.target.classList.contains("cell")
    ? event.target
    : event.target.closest(".cell");
  if (!cell) return;
  const x = Number(cell.dataset.x);
  const y = Number(cell.dataset.y);
  if (!selectedId) return;
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
  if (targetPiece && targetPiece.side === "red") {
    statusBox.textContent = "不能吃自己的棋子。";
    return;
  }

  const validation = validateMove(piece, toX, toY, Boolean(targetPiece));
  if (!validation.ok) {
    statusBox.textContent = validation.reason;
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
    winGame("黑方胜利！");
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
