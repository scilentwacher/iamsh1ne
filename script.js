/* =========================================================
   SHINE PORTFOLIO
   COMPLETE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* CURRENT YEAR */
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* MOBILE MENU */
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("active");
      menuButton.classList.toggle("active");

      const isOpen = mobileMenu.classList.contains("active");

      menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.classList.toggle("menu-open", isOpen);
    });

    const mobileLinks = mobileMenu.querySelectorAll("a");

    mobileLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("active");
        menuButton.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });
  }

  /* SMOOTH SCROLLING */
  const navigationLinks = document.querySelectorAll('a[href^="#"]');

  navigationLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        const header = document.querySelector(".header");
        const offset = header ? header.offsetHeight + 10 : 10;
        const targetTop =
          target.getBoundingClientRect().top +
          window.scrollY -
          offset;

        window.scrollTo({
          top: targetTop,
          behavior: "smooth"
        });
      }
    });
  });

  /* HEADER SCROLL EFFECT */
  const header = document.querySelector(".header");

  if (header) {
    function updateHeader() {
      header.classList.toggle("scrolled", window.scrollY > 30);
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
  }

  /* 4 × 4 PHOTO PUZZLE */
  const puzzleBoard = document.getElementById("puzzleBoard");
  const shuffleButton = document.getElementById("shufflePuzzle");
  const skipButton = document.getElementById("skipPuzzle");
  const movesElement = document.getElementById("puzzleMoves");

  if (puzzleBoard && shuffleButton && skipButton) {

    const SIZE = 4;
    const puzzleImage = "images/photo-1.jpg";

    let tiles = [];
    let emptyIndex = 15;
    let moves = 0;
    let puzzleSolved = false;

    function createSolvedPuzzle() {
      tiles = [];

      for (let i = 0; i < 15; i++) {
        tiles.push(i);
      }

      tiles.push(null);
      emptyIndex = 15;
      moves = 0;
      puzzleSolved = false;

      updateMoves();
      renderPuzzle();
    }

    function renderPuzzle() {
      puzzleBoard.innerHTML = "";

      tiles.forEach(function (tile, index) {

        const piece = document.createElement("div");
        piece.className = "puzzle-piece";

        if (tile === null) {
          piece.classList.add("empty");
        } else {

          const row = Math.floor(tile / SIZE);
          const column = tile % SIZE;

          piece.style.backgroundImage = `url("${puzzleImage}")`;
          piece.style.backgroundSize = `${SIZE * 100}% ${SIZE * 100}%`;
          piece.style.backgroundPosition =
            `${(column / (SIZE - 1)) * 100}% ${(row / (SIZE - 1)) * 100}%`;

          piece.addEventListener("click", function () {
            moveTile(index);
          });
        }

        puzzleBoard.appendChild(piece);
      });
    }

    function isAdjacent(index) {
      const row1 = Math.floor(index / SIZE);
      const col1 = index % SIZE;

      const row2 = Math.floor(emptyIndex / SIZE);
      const col2 = emptyIndex % SIZE;

      return (
        Math.abs(row1 - row2) +
        Math.abs(col1 - col2) === 1
      );
    }

    function moveTile(index) {
      if (puzzleSolved || !isAdjacent(index)) return;

      tiles[emptyIndex] = tiles[index];
      tiles[index] = null;
      emptyIndex = index;

      moves++;
      updateMoves();
      renderPuzzle();
      checkSolved();
    }

    function updateMoves() {
      if (movesElement) {
        movesElement.textContent = moves;
      }
    }

    function checkSolved() {
      for (let i = 0; i < 15; i++) {
        if (tiles[i] !== i) return;
      }

      if (tiles[15] !== null) return;

      puzzleSolved = true;

      setTimeout(function () {
        alert(
          "🎉 Puzzle solved!\n\n" +
          "You rebuilt my photo in " +
          moves +
          " moves."
        );
      }, 150);
    }

    function shufflePuzzle() {
      createSolvedPuzzle();

      let previousEmpty = -1;
      const shuffleMoves = 180;

      for (let i = 0; i < shuffleMoves; i++) {

        const possibleMoves = [];
        const row = Math.floor(emptyIndex / SIZE);
        const col = emptyIndex % SIZE;

        if (row > 0) possibleMoves.push(emptyIndex - SIZE);
        if (row < SIZE - 1) possibleMoves.push(emptyIndex + SIZE);
        if (col > 0) possibleMoves.push(emptyIndex - 1);
        if (col < SIZE - 1) possibleMoves.push(emptyIndex + 1);

        const filteredMoves = possibleMoves.filter(function (move) {
          return move !== previousEmpty;
        });

        const choices = filteredMoves.length
          ? filteredMoves
          : possibleMoves;

        const selectedIndex =
          choices[Math.floor(Math.random() * choices.length)];

        previousEmpty = emptyIndex;

        tiles[emptyIndex] = tiles[selectedIndex];
        tiles[selectedIndex] = null;
        emptyIndex = selectedIndex;
      }

      moves = 0;
      puzzleSolved = false;

      updateMoves();
      renderPuzzle();
    }

    function skipPuzzle() {
      puzzleSolved = true;
      puzzleBoard.innerHTML = "";

      const skipped = document.createElement("div");

      skipped.style.gridColumn = "1 / -1";
      skipped.style.gridRow = "1 / -1";
      skipped.style.display = "flex";
      skipped.style.alignItems = "center";
      skipped.style.justifyContent = "center";
      skipped.style.textAlign = "center";
      skipped.style.padding = "30px";
      skipped.style.color = "#777";
      skipped.style.fontSize = "1rem";

      skipped.innerHTML = `
        <div>
          <div style="
            font-size:3rem;
            margin-bottom:15px;
            color:white;
          ">✓</div>

          <strong style="
            color:white;
            display:block;
            margin-bottom:8px;
          ">Puzzle skipped</strong>

          <span>You can try it again anytime.</span>
        </div>
      `;

      puzzleBoard.appendChild(skipped);
    }

    shuffleButton.addEventListener("click", shufflePuzzle);
    skipButton.addEventListener("click", skipPuzzle);

    createSolvedPuzzle();

    setTimeout(function () {
      shufflePuzzle();
    }, 300);
  }
});
