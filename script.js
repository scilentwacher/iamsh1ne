/* =========================================================
   SHINE PORTFOLIO
   JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* =======================================================
     CURRENT YEAR
  ======================================================= */

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* =======================================================
     MOBILE MENU
  ======================================================= */

  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", function () {

      mobileMenu.classList.toggle("active");
      menuButton.classList.toggle("active");

      const isOpen = mobileMenu.classList.contains("active");

      menuButton.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );

    });


    /* Close mobile menu after clicking a link */

    const mobileLinks = mobileMenu.querySelectorAll("a");

    mobileLinks.forEach(function (link) {

      link.addEventListener("click", function () {

        mobileMenu.classList.remove("active");
        menuButton.classList.remove("active");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

  }


  /* =======================================================
     SMOOTH SCROLLING
  ======================================================= */

  const navigationLinks =
    document.querySelectorAll('a[href^="#"]');

  navigationLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

      const targetId = this.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target =
        document.querySelector(targetId);

      if (target) {

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    });

  });


  /* =======================================================
     MENU BUTTON ANIMATION
  ======================================================= */

  const menuStyle = document.createElement("style");

  menuStyle.textContent = `
    
    .menu-button span {
      transition:
        transform 0.3s ease,
        opacity 0.3s ease;
    }

    .menu-button.active span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }

    .menu-button.active span:nth-child(2) {
      opacity: 0;
    }

    .menu-button.active span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

  `;

  document.head.appendChild(menuStyle);


  /* =======================================================
     HEADER SCROLL EFFECT
  ======================================================= */

  const header =
    document.querySelector(".header");

  if (header) {

    function updateHeader() {

      if (window.scrollY > 30) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

    }

    window.addEventListener(
      "scroll",
      updateHeader
    );

    updateHeader();

  }


  /* =======================================================
     4 × 4 PHOTO PUZZLE
  ======================================================= */

  const puzzleBoard =
    document.getElementById("puzzleBoard");

  const puzzleMovesElement =
    document.getElementById("puzzleMoves");

  const shuffleButton =
    document.getElementById("shufflePuzzle");

  const skipButton =
    document.getElementById("skipPuzzle");


  if (
    puzzleBoard &&
    puzzleMovesElement &&
    shuffleButton &&
    skipButton
  ) {

    const GRID_SIZE = 4;
    const TOTAL_TILES = 16;

    let tiles = [];
    let moves = 0;
    let puzzleSolved = false;


    /* =====================================================
       CREATE PUZZLE
    ===================================================== */

    function createPuzzle() {

      tiles = [];

      for (let i = 0; i < TOTAL_TILES - 1; i++) {
        tiles.push(i);
      }

      /* Empty space */

      tiles.push(null);

      moves = 0;
      puzzleSolved = false;

      updateMoves();

      shufflePuzzle();

    }


    /* =====================================================
       UPDATE MOVE COUNTER
    ===================================================== */

    function updateMoves() {

      puzzleMovesElement.textContent = moves;

    }


    /* =====================================================
       CHECK IF TWO TILES CAN MOVE
    ===================================================== */

    function isAdjacent(tileIndex, emptyIndex) {

      const tileRow =
        Math.floor(tileIndex / GRID_SIZE);

      const tileColumn =
        tileIndex % GRID_SIZE;

      const emptyRow =
        Math.floor(emptyIndex / GRID_SIZE);

      const emptyColumn =
        emptyIndex % GRID_SIZE;


      const rowDifference =
        Math.abs(tileRow - emptyRow);

      const columnDifference =
        Math.abs(tileColumn - emptyColumn);


      return (
        rowDifference + columnDifference === 1
      );

    }


    /* =====================================================
       MOVE TILE
    ===================================================== */

    function moveTile(tileIndex) {

      if (puzzleSolved) {
        return;
      }

      const emptyIndex =
        tiles.indexOf(null);


      if (!isAdjacent(tileIndex, emptyIndex)) {
        return;
      }


      /* Swap tile with empty space */

      const temporary =
        tiles[tileIndex];

      tiles[tileIndex] =
        tiles[emptyIndex];

      tiles[emptyIndex] =
        temporary;


      moves++;

      updateMoves();

      renderPuzzle();

      checkSolved();

    }


    /* =====================================================
       RENDER PUZZLE
    ===================================================== */

    function renderPuzzle() {

      puzzleBoard.innerHTML = "";


      tiles.forEach(function (tile, index) {

        const tileElement =
          document.createElement("button");

        tileElement.type = "button";

        tileElement.className =
          "puzzle-tile";


        /* Empty tile */

        if (tile === null) {

          tileElement.classList.add(
            "puzzle-empty"
          );

          tileElement.setAttribute(
            "aria-label",
            "Empty space"
          );

        }


        /* Image tile */

        else {

          const row =
            Math.floor(tile / GRID_SIZE);

          const column =
            tile % GRID_SIZE;


          tileElement.style.backgroundImage =
            'url("images/photo-1.jpg")';


          tileElement.style.backgroundSize =
            `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`;


          tileElement.style.backgroundPosition =
            `${(column / (GRID_SIZE - 1)) * 100}% ${(row / (GRID_SIZE - 1)) * 100}%`;


          tileElement.setAttribute(
            "aria-label",
            `Puzzle piece ${tile + 1}`
          );


          tileElement.addEventListener(
            "click",
            function () {
              moveTile(index);
            }
          );

        }


        puzzleBoard.appendChild(
          tileElement
        );

      });

    }


    /* =====================================================
       SHUFFLE PUZZLE
    ===================================================== */

    function shufflePuzzle() {

      puzzleSolved = false;

      /*
        Start from solved state and make many
        valid random moves.

        This guarantees the puzzle remains solvable.
      */

      tiles = [];

      for (let i = 0; i < TOTAL_TILES - 1; i++) {
        tiles.push(i);
      }

      tiles.push(null);


      let emptyIndex =
        tiles.indexOf(null);


      let previousIndex = -1;


      for (let i = 0; i < 250; i++) {

        const possibleMoves = [];


        for (
          let tileIndex = 0;
          tileIndex < TOTAL_TILES;
          tileIndex++
        ) {

          if (
            tileIndex !== emptyIndex &&
            tileIndex !== previousIndex &&
            isAdjacent(
              tileIndex,
              emptyIndex
            )
          ) {

            possibleMoves.push(
              tileIndex
            );

          }

        }


        if (possibleMoves.length === 0) {
          continue;
        }


        const randomIndex =
          Math.floor(
            Math.random() *
            possibleMoves.length
          );


        const selectedTile =
          possibleMoves[randomIndex];


        const temporary =
          tiles[selectedTile];

        tiles[selectedTile] =
          tiles[emptyIndex];

        tiles[emptyIndex] =
          temporary;


        previousIndex =
          emptyIndex;

        emptyIndex =
          selectedTile;

      }


      moves = 0;

      updateMoves();

      renderPuzzle();

    }


    /* =====================================================
       CHECK SOLVED
    ===================================================== */

    function checkSolved() {

      for (
        let i = 0;
        i < TOTAL_TILES - 1;
        i++
      ) {

        if (tiles[i] !== i) {
          return;
        }

      }


      if (tiles[TOTAL_TILES - 1] !== null) {
        return;
      }


      puzzleSolved = true;


      setTimeout(function () {

        alert(
          "🎉 Puzzle solved!\n\n" +
          "You rebuilt the photo in " +
          moves +
          " moves."
        );

      }, 150);

    }


    /* =====================================================
       SHUFFLE AGAIN BUTTON
    ===================================================== */

    shuffleButton.addEventListener(
      "click",
      function () {

        shufflePuzzle();

      }
    );


    /* =====================================================
       SKIP PUZZLE
    ===================================================== */

    skipButton.addEventListener(
      "click",
      function () {

        puzzleSolved = true;

        puzzleBoard.innerHTML = "";

        const skippedMessage =
          document.createElement("div");

        skippedMessage.className =
          "puzzle-skipped";

        skippedMessage.innerHTML = `
          <div>
            <strong>Puzzle skipped.</strong>
            <br>
            <span>You can try it anytime.</span>
          </div>
        `;

        puzzleBoard.appendChild(
          skippedMessage
        );

      }
    );


    /* =====================================================
       START PUZZLE
    ===================================================== */

    createPuzzle();

  }


  /* =======================================================
     IMAGE ERROR HANDLING
  ======================================================= */

  const portfolioImages =
    document.querySelectorAll(
      "img[src^='images/']"
    );


  portfolioImages.forEach(function (image) {

    image.addEventListener(
      "error",
      function () {

        console.warn(
          "Could not load image:",
          image.getAttribute("src")
        );

      }
    );

  });

});