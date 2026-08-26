/* =====================================================
   SHINE PORTFOLIO
   JAVASCRIPT
   Nursing × AI × Technology
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ===================================================
     CURRENT YEAR
  =================================================== */

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* ===================================================
     MOBILE MENU
  =================================================== */

  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", function () {

      mobileMenu.classList.toggle("active");
      menuButton.classList.toggle("active");

      const isOpen =
        mobileMenu.classList.contains("active");

      menuButton.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );

    });


    /* Close menu after clicking a link */

    const mobileLinks =
      mobileMenu.querySelectorAll("a");

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


  /* ===================================================
     SMOOTH SCROLL
  =================================================== */

  const navigationLinks =
    document.querySelectorAll('a[href^="#"]');

  navigationLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

      const targetId =
        this.getAttribute("href");

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


  /* ===================================================
     HEADER SCROLL EFFECT
  =================================================== */

  const header =
    document.querySelector(".header");

  function updateHeader() {

    if (!header) {
      return;
    }

    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

  }

  window.addEventListener("scroll", updateHeader);

  updateHeader();


  /* ===================================================
     4 × 4 PHOTO PUZZLE
  =================================================== */

  const puzzleBoard =
    document.getElementById("puzzleBoard");

  const shuffleButton =
    document.getElementById("shufflePuzzle");

  const skipButton =
    document.getElementById("skipPuzzle");

  const movesElement =
    document.getElementById("puzzleMoves");


  if (
    puzzleBoard &&
    shuffleButton &&
    skipButton &&
    movesElement
  ) {

    const SIZE = 4;

    const TOTAL =
      SIZE * SIZE;

    let tiles = [];

    let moves = 0;

    let puzzleSolved = false;


    /* ================================================
       CREATE SOLVED PUZZLE
    ================================================ */

    function createSolvedPuzzle() {

      tiles = [];

      for (let i = 0; i < TOTAL - 1; i++) {

        tiles.push(i);

      }

      /* Last tile = empty */

      tiles.push(null);

    }


    /* ================================================
       RENDER PUZZLE
    ================================================ */

    function renderPuzzle() {

      puzzleBoard.innerHTML = "";

      tiles.forEach(function (tile, index) {

        const piece =
          document.createElement("div");

        piece.className =
          "puzzle-piece";


        /* Empty square */

        if (tile === null) {

          piece.classList.add("empty");

        }

        /* Image piece */

        else {

          const row =
            Math.floor(tile / SIZE);

          const column =
            tile % SIZE;

          piece.style.backgroundPosition =
            `${column * 33.333333}% ${row * 33.333333}%`;

          piece.addEventListener(
            "click",
            function () {

              moveTile(index);

            }
          );

        }

        puzzleBoard.appendChild(piece);

      });

      movesElement.textContent = moves;

    }


    /* ================================================
       GET EMPTY TILE
    ================================================ */

    function getEmptyIndex() {

      return tiles.indexOf(null);

    }


    /* ================================================
       CHECK IF TILE CAN MOVE
    ================================================ */

    function isAdjacent(indexA, indexB) {

      const rowA =
        Math.floor(indexA / SIZE);

      const colA =
        indexA % SIZE;

      const rowB =
        Math.floor(indexB / SIZE);

      const colB =
        indexB % SIZE;


      const rowDifference =
        Math.abs(rowA - rowB);

      const colDifference =
        Math.abs(colA - colB);


      return (
        rowDifference + colDifference === 1
      );

    }


    /* ================================================
       MOVE TILE
    ================================================ */

    function moveTile(index) {

      if (puzzleSolved) {
        return;
      }

      const emptyIndex =
        getEmptyIndex();


      if (
        !isAdjacent(
          index,
          emptyIndex
        )
      ) {

        return;

      }


      /* Swap */

      const temporary =
        tiles[index];

      tiles[index] =
        tiles[emptyIndex];

      tiles[emptyIndex] =
        temporary;


      moves++;

      renderPuzzle();

      checkSolved();

    }


    /* ================================================
       CHECK SOLVED
    ================================================ */

    function checkSolved() {

      for (
        let i = 0;
        i < TOTAL - 1;
        i++
      ) {

        if (tiles[i] !== i) {

          return false;

        }

      }

      if (tiles[TOTAL - 1] !== null) {

        return false;

      }


      puzzleSolved = true;


      setTimeout(function () {

        alert(
          "🎉 Puzzle solved!\n\n" +
          "Moves: " + moves
        );

      }, 150);


      return true;

    }


    /* ================================================
       GET RANDOM VALID MOVE
    ================================================ */

    function getRandomMove() {

      const emptyIndex =
        getEmptyIndex();

      const possibleMoves = [];


      const row =
        Math.floor(emptyIndex / SIZE);

      const col =
        emptyIndex % SIZE;


      if (row > 0) {

        possibleMoves.push(
          emptyIndex - SIZE
        );

      }

      if (row < SIZE - 1) {

        possibleMoves.push(
          emptyIndex + SIZE
        );

      }

      if (col > 0) {

        possibleMoves.push(
          emptyIndex - 1
        );

      }

      if (col < SIZE - 1) {

        possibleMoves.push(
          emptyIndex + 1
        );

      }


      return possibleMoves[
        Math.floor(
          Math.random() *
          possibleMoves.length
        )
      ];

    }


    /* ================================================
       SHUFFLE PUZZLE
       Uses real legal moves so puzzle is solvable.
    ================================================ */

    function shufflePuzzle() {

      createSolvedPuzzle();

      moves = 0;

      puzzleSolved = false;


      /*
        Make many legal random moves.
        This prevents impossible puzzle states.
      */

      let previousEmpty = -1;

      const shuffleMoves = 250;


      for (
        let i = 0;
        i < shuffleMoves;
        i++
      ) {

        const emptyIndex =
          getEmptyIndex();

        const possibleMoves = [];


        const row =
          Math.floor(emptyIndex / SIZE);

        const col =
          emptyIndex % SIZE;


        if (row > 0) {

          possibleMoves.push(
            emptyIndex - SIZE
          );

        }

        if (row < SIZE - 1) {

          possibleMoves.push(
            emptyIndex + SIZE
          );

        }

        if (col > 0) {

          possibleMoves.push(
            emptyIndex - 1
          );

        }

        if (col < SIZE - 1) {

          possibleMoves.push(
            emptyIndex + 1
          );

        }


        /* Avoid immediately reversing */

        const filteredMoves =
          possibleMoves.filter(
            function (move) {
              return move !== previousEmpty;
            }
          );


        const choices =
          filteredMoves.length > 0
            ? filteredMoves
            : possibleMoves;


        const selectedIndex =
          choices[
            Math.floor(
              Math.random() *
              choices.length
            )
          ];


        const temporary =
          tiles[selectedIndex];

        tiles[selectedIndex] =
          tiles[emptyIndex];

        tiles[emptyIndex] =
          temporary;


        previousEmpty =
          emptyIndex;

      }


      /*
        Very small chance of accidentally
        returning to solved state.
      */

      if (checkSolved()) {

        shufflePuzzle();

        return;

      }


      moves = 0;

      renderPuzzle();

    }


    /* ================================================
       SKIP PUZZLE
    ================================================ */

    skipButton.addEventListener(
      "click",
      function () {

        puzzleSolved = true;

        alert(
          "Puzzle skipped. You can try it anytime!"
        );

      }
    );


    /* ================================================
       SHUFFLE BUTTON
    ================================================ */

    shuffleButton.addEventListener(
      "click",
      function () {

        shufflePuzzle();

      }
    );


    /* ================================================
       START PUZZLE
    ================================================ */

    shufflePuzzle();

  }


  /* ===================================================
     EXTERNAL LINKS
     Open social/project links safely
  =================================================== */

  const externalLinks =
    document.querySelectorAll(
      'a[target="_blank"]'
    );

  externalLinks.forEach(function (link) {

    link.addEventListener(
      "click",
      function () {

        this.setAttribute(
          "rel",
          "noopener noreferrer"
        );

      }
    );

  });


  /* ===================================================
     IMAGE FALLBACK
     If an image is missing, don't show broken icon.
  =================================================== */

  const images =
    document.querySelectorAll("img");

  images.forEach(function (image) {

    image.addEventListener(
      "error",
      function () {

        this.style.background =
          "linear-gradient(135deg,#222,#090909)";

        this.style.objectFit =
          "cover";

        this.alt =
          "Shine R Mathew";

      }
    );

  });

});