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

const pieceText = {
  r: "车",
  n: "马",
  b: "相",
  a: "仕",
  k: "帅",
  c: "炮",
  p: "兵",
};

const levels = [
  {
    title: "直线吃子",
    goal: "用车吃掉前方的黑卒。",
    tips: [
      "车走直线，不能拐弯。",
      "中间不能有棋子挡路。",
      "点一下红车，再点黑卒。",
    ],
    maxMoves: 1,
    pieces: [
      { id: "r1", type: "r", side: "red", x: 4, y: 9 },
      { id: "bp1", type: "p", side: "black", x: 4, y: 6 },
    ],
    goalSpec: { type: "capture", targetId: "bp1" },
  },
  {
    title: "炮隔子打",
    goal: "用炮隔一个棋子吃掉目标。",
    tips: [
      "炮吃子时必须隔一个棋子。",
      "隔的棋子可以是黑棋。",
      "先找到一条直线。",
    ],
    maxMoves: 1,
    pieces: [
      { id: "c1", type: "c", side: "red", x: 4, y: 9 },
      { id: "block", type: "p", side: "black", x: 4, y: 7 },
      { id: "bp2", type: "p", side: "black", x: 4, y: 5 },
    ],
    goalSpec: { type: "capture", targetId: "bp2" },
  },
  {
    title: "马走日",
    goal: "用马吃掉目标，不要踩到马腿。",
    tips: [
      "马走日字，先直走一格，再斜走一格。",
      "如果马腿被堵住，就不能走。",
      "看看马腿的位置是否空着。",
    ],
    maxMoves: 1,
    pieces: [
      { id: "n1", type: "n", side: "red", x: 4, y: 9 },
      { id: "bp3", type: "p", side: "black", x: 5, y: 7 },
    ],
    goalSpec: { type: "capture", targetId: "bp3" },
  },
  {
    title: "相走田",
    goal: "用相吃掉目标，注意象眼。",
    tips: [
      "相走田字，两格对角。",
      "象眼必须空着。",
      "相不能过河。",
    ],
    maxMoves: 1,
    pieces: [
      { id: "b1", type: "b", side: "red", x: 2, y: 9 },
      { id: "bp4", type: "p", side: "black", x: 4, y: 7 },
    ],
    goalSpec: { type: "capture", targetId: "bp4" },
  },
  {
    title: "仕守九宫",
    goal: "用仕吃掉九宫里的目标。",
    tips: [
      "仕只能在九宫里走。",
      "仕走一格对角。",
      "注意九宫范围：横三竖三。",
    ],
    maxMoves: 1,
    pieces: [
      { id: "a1", type: "a", side: "red", x: 3, y: 9 },
      { id: "bp5", type: "p", side: "black", x: 4, y: 8 },
    ],
    goalSpec: { type: "capture", targetId: "bp5" },
  },
  {
    title: "帅的范围",
    goal: "帅只能在九宫里活动，吃掉目标。",
    tips: [
      "帅走一格直线。",
      "不能走出九宫。",
      "先确认目标在宫里。",
    ],
    maxMoves: 1,
    pieces: [
      { id: "k1", type: "k", side: "red", x: 4, y: 9 },
      { id: "bp6", type: "p", side: "black", x: 4, y: 8 },
    ],
    goalSpec: { type: "capture", targetId: "bp6" },
  },
  {
    title: "过河兵",
    goal: "兵过河后可以横走，吃掉左边的棋子。",
    tips: [
      "兵过河后可以左右走。",
      "兵只能向前或左右走，不能后退。",
      "试试向左走一步。",
    ],
    maxMoves: 1,
    pieces: [
      { id: "p1", type: "p", side: "red", x: 4, y: 4 },
      { id: "bp7", type: "p", side: "black", x: 3, y: 4 },
    ],
    goalSpec: { type: "capture", targetId: "bp7" },
  },
  {
    title: "选择正确的吃子",
    goal: "用炮吃掉目标，车被挡住了。",
    tips: [
      "车走直线不能隔子。",
      "炮吃子必须隔一个棋子。",
      "看看哪条直线有“隔子”。",
    ],
    maxMoves: 1,
    pieces: [
      { id: "r2", type: "r", side: "red", x: 0, y: 9 },
      { id: "c2", type: "c", side: "red", x: 2, y: 9 },
      { id: "block2", type: "p", side: "black", x: 2, y: 7 },
      { id: "bp8", type: "p", side: "black", x: 2, y: 5 },
      { id: "block3", type: "p", side: "black", x: 0, y: 8 },
    ],
    goalSpec: { type: "capture", targetId: "bp8" },
  },
  {
    title: "马腿检查",
    goal: "用马吃掉目标，别被马腿挡住。",
    tips: [
      "马走日字，先直走一格再斜走一格。",
      "先看看马腿是否有棋子。",
      "目标在日字终点。",
    ],
    maxMoves: 1,
    pieces: [
      { id: "n2", type: "n", side: "red", x: 3, y: 9 },
      { id: "bp9", type: "p", side: "black", x: 4, y: 7 },
      { id: "bp10", type: "p", side: "black", x: 1, y: 8 },
    ],
    goalSpec: { type: "capture", targetId: "bp9" },
  },
  {
    title: "炮的对齐",
    goal: "用炮隔子吃掉竖线上的目标。",
    tips: [
      "炮吃子必须隔一个棋子。",
      "隔子和目标必须在同一直线。",
      "看看哪个方向刚好隔一个棋子。",
    ],
    maxMoves: 1,
    pieces: [
      { id: "c3", type: "c", side: "red", x: 0, y: 9 },
      { id: "block4", type: "p", side: "black", x: 0, y: 7 },
      { id: "bp11", type: "p", side: "black", x: 0, y: 5 },
      { id: "bp12", type: "p", side: "black", x: 2, y: 8 },
    ],
    goalSpec: { type: "capture", targetId: "bp11" },
  },
  {
    title: "仕走对角",
    goal: "用仕吃掉九宫里的目标。",
    tips: [
      "仕走一格对角。",
      "不能走出九宫。",
      "目标在九宫中心附近。",
    ],
    maxMoves: 1,
    pieces: [
      { id: "a2", type: "a", side: "red", x: 5, y: 9 },
      { id: "bp13", type: "p", side: "black", x: 4, y: 8 },
    ],
    goalSpec: { type: "capture", targetId: "bp13" },
  },
  {
    title: "车直线清路",
    goal: "用车吃掉目标，注意中间不能挡子。",
    tips: [
      "车走直线，不能隔子。",
      "先看清楚那条线是通的。",
      "目标在同一路上。",
    ],
    maxMoves: 1,
    pieces: [
      { id: "r3", type: "r", side: "red", x: 6, y: 9 },
      { id: "bp14", type: "p", side: "black", x: 6, y: 6 },
      { id: "block5", type: "p", side: "black", x: 6, y: 8 },
      { id: "bp15", type: "p", side: "black", x: 8, y: 9 },
    ],
    goalSpec: { type: "capture", targetId: "bp15" },
  },
  {
    title: "挡炮练习",
    goal: "先用车挡住炮线，再用车吃掉目标。",
    tips: [
      "炮攻击需要隔一个棋子。",
      "把车移动到炮和目标之间。",
      "挡好后再吃掉目标。",
    ],
    maxMoves: 2,
    pieces: [
      { id: "r4", type: "r", side: "red", x: 4, y: 9 },
      { id: "bp16", type: "p", side: "black", x: 4, y: 6 },
      { id: "c4", type: "c", side: "black", x: 4, y: 4 },
    ],
    goalSpec: {
      type: "sequence",
      steps: [
        { type: "move", pieceId: "r4", to: { x: 4, y: 7 } },
        { type: "capture", targetId: "bp16" },
      ],
      progress: 0,
    },
  },
  {
    title: "牵制小练习",
    goal: "用马吃掉目标，不要被挡住。",
    tips: [
      "先看马腿是否被堵住。",
      "目标在日字终点。",
      "先选马再落子。",
    ],
    maxMoves: 1,
    pieces: [
      { id: "n3", type: "n", side: "red", x: 7, y: 9 },
      { id: "bp17", type: "p", side: "black", x: 6, y: 7 },
    ],
    goalSpec: { type: "capture", targetId: "bp17" },
  },
  {
    title: "双将军入门",
    goal: "用车吃掉目标，走到中路最关键的一格。",
    tips: [
      "车走直线，注意中间不能挡子。",
      "目标就在同一条线上。",
      "吃掉目标就是关键一步。",
    ],
    maxMoves: 1,
    pieces: [
      { id: "r5", type: "r", side: "red", x: 4, y: 9 },
      { id: "bp18", type: "p", side: "black", x: 4, y: 6 },
      { id: "bp19", type: "p", side: "black", x: 1, y: 9 },
    ],
    goalSpec: { type: "capture", targetId: "bp18" },
  },
];

let currentLevelIndex = 0;
let pieces = [];
let initialPieces = [];
let selectedId = null;
let hintIndex = 0;
let moveCount = 0;
let showCoords = false;
let completed = false;
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
      if (y === 4 || y === 5) cell.classList.add("river");
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
      el.textContent = pieceText[piece.type];
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
  statusBox.textContent = "准备开始！";
  completed = false;
  selectedId = null;
  moveCount = 0;
  if (level.goalSpec.type === "sequence") {
    level.goalSpec.progress = 0;
  }

  pieces = clonePieces(level.pieces);
  initialPieces = clonePieces(level.pieces);

  buildBoard();
  renderPieces();
  updateButtons();
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
  if (!piece || piece.side !== "red") {
    statusBox.textContent = "只能移动红方棋子。";
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
  if (piece.side !== "red") {
    if (!selectedId) {
      statusBox.textContent = "只能移动红方棋子。";
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
  if (piece.side !== "red") {
    if (!selectedId) {
      statusBox.textContent = "只能移动红方棋子。";
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
  if (piece.side !== "red") {
    statusBox.textContent = "只能移动红方棋子。";
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
  moveCount += 1;

  renderPieces();
  checkGoal(targetPiece ? targetPiece.id : null, pieceId, toX, toY);
}

function validateMove(piece, toX, toY, isCapture) {
  const dx = toX - piece.x;
  const dy = toY - piece.y;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);

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
      if (toY < 5) return { ok: false, reason: "相不能过河。" };
      return { ok: true };
    case "a":
      if (!(absX === 1 && absY === 1)) return { ok: false, reason: "仕走一格对角。" };
      if (!inRedPalace(toX, toY)) return { ok: false, reason: "仕不能出九宫。" };
      return { ok: true };
    case "k":
      if (!((absX === 1 && absY === 0) || (absX === 0 && absY === 1))) {
        return { ok: false, reason: "帅走一格直线。" };
      }
      if (!inRedPalace(toX, toY)) return { ok: false, reason: "帅不能出九宫。" };
      return { ok: true };
    case "p":
      if (dy > 0) return { ok: false, reason: "兵不能后退。" };
      if (piece.y >= 5) {
        if (!(dx === 0 && dy === -1)) return { ok: false, reason: "兵过河前只能向前。" };
      } else {
        if (!((dx === 0 && dy === -1) || (absX === 1 && dy === 0))) {
          return { ok: false, reason: "兵过河后可以左右或向前。" };
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

function checkGoal(capturedId, movedId, toX, toY) {
  const level = levels[currentLevelIndex];
  if (level.goalSpec.type === "capture") {
    if (capturedId === level.goalSpec.targetId) {
      winLevel();
      return;
    }
  }

  if (level.goalSpec.type === "sequence") {
    const stepIndex = level.goalSpec.progress ?? 0;
    const step = level.goalSpec.steps[stepIndex];
    if (step) {
      const matched =
        (step.type === "move" &&
          movedId === step.pieceId &&
          toX === step.to.x &&
          toY === step.to.y) ||
        (step.type === "capture" && capturedId === step.targetId);
      if (matched) {
        level.goalSpec.progress = stepIndex + 1;
        if (level.goalSpec.progress >= level.goalSpec.steps.length) {
          winLevel();
          return;
        }
        statusBox.textContent = "很好！再完成下一步。";
        playSound("success");
        return;
      }
    }
  }

  if (moveCount >= level.maxMoves) {
    statusBox.textContent = "还没完成目标，试试重置本关。";
    playSound("error");
  } else {
    statusBox.textContent = "继续加油！";
    playSound("move");
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
  moveCount = 0;
  statusBox.textContent = "已重置本关。";
  const level = levels[currentLevelIndex];
  if (level.goalSpec.type === "sequence") {
    level.goalSpec.progress = 0;
  }
  renderPieces();
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

function winLevel() {
  statusBox.textContent = "太棒啦，完成目标！";
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
