
const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent =
  new Date().getFullYear();

// Number puzzle: arrange the tiles from 1 to 8.
const puzzleBoard = document.getElementById("puzzleBoard");
const puzzleMessage = document.getElementById("puzzleMessage");
const restartPuzzle = document.getElementById("restartPuzzle");

let tiles = [];
let moves = 0;
let solved = false;

function isSolved(board) {
  return board.every((value, index) => {
    if (index === 8) return value === 0;
    return value === index + 1;
  });
}

function getNeighbors(index) {
  const neighbors = [];
  const row = Math.floor(index / 3);
  const col = index % 3;

  if (row > 0) neighbors.push(index - 3);
  if (row < 2) neighbors.push(index + 3);
  if (col > 0) neighbors.push(index - 1);
  if (col < 2) neighbors.push(index + 1);

  return neighbors;
}

function shufflePuzzle() {
  // Start from the solved board and make legal moves.
  // This guarantees that the puzzle remains solvable.
  tiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];

  let previousEmpty = -1;

  for (let i = 0; i < 150; i++) {
    const emptyIndex = tiles.indexOf(0);

    let options = getNeighbors(emptyIndex).filter(
      (index) => index !== previousEmpty
    );

    if (options.length === 0) {
      options = getNeighbors(emptyIndex);
    }

    const nextIndex =
      options[Math.floor(Math.random() * options.length)];

    [tiles[emptyIndex], tiles[nextIndex]] =
      [tiles[nextIndex], tiles[emptyIndex]];

    previousEmpty = emptyIndex;
  }

  // Avoid starting with an already solved board.
  if (isSolved(tiles)) {
    shufflePuzzle();
    return;
  }

  moves = 0;
  solved = false;
  renderPuzzle();
}

function renderPuzzle() {
  puzzleBoard.innerHTML = "";

  tiles.forEach((value, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = value === 0
      ? "puzzle-tile empty"
      : "puzzle-tile";

    button.textContent = value === 0 ? "" : String(value);
    button.setAttribute(
      "aria-label",
      value === 0 ? "Empty space" : `Move tile ${value}`
    );

    button.disabled = value === 0 || solved;

    button.addEventListener("click", () => {
      moveTile(index);
    });

    puzzleBoard.appendChild(button);
  });

  puzzleMessage.textContent = solved
    ? `Puzzle solved in ${moves} moves! Great job!`
    : `Moves: ${moves}`;
}

function moveTile(index) {
  if (solved) return;

  const emptyIndex = tiles.indexOf(0);

  if (!getNeighbors(emptyIndex).includes(index)) {
    return;
  }

  [tiles[emptyIndex], tiles[index]] =
    [tiles[index], tiles[emptyIndex]];

  moves++;

  if (isSolved(tiles)) {
    solved = true;
  }

  renderPuzzle();
}

restartPuzzle.addEventListener("click", shufflePuzzle);

shufflePuzzle();
