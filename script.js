/* =========================================================
   SHINE R MATHEW — PORTFOLIO JAVASCRIPT
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

  const menuButton = document.querySelector(".menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");

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


  /* =======================================================
     SMOOTH SCROLL
  ======================================================= */

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

  const puzzle =
    document.querySelector(".puzzle-container");

  if (!puzzle) {
    return;
  }


  /* -------------------------------------------------------
     PUZZLE SETTINGS
  ------------------------------------------------------- */

  const GRID_SIZE = 4;
  const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

  /*
     Change this if you want another photo.

     Your current photos should be:

     images/photo-1.jpg
     images/photo-2.jpg
     images/photo-3.jpg
  */

  const puzzleImage =
    "images/photo-1.jpg";


  /* -------------------------------------------------------
     PUZZLE VARIABLES
  ------------------------------------------------------- */

  let tiles = [];
  let emptyIndex = TOTAL_TILES - 1;

  let moves = 0;
  let seconds = 0;

  let timerInterval = null;
  let puzzleStarted = false;
  let puzzleSolved = false;


  /* =======================================================
     FIND PUZZLE UI ELEMENTS
  ======================================================= */

  const movesElement =
    document.querySelector("#puzzleMoves");

  const timerElement =
    document.querySelector("#puzzleTimer");

  const shuffleButton =
    document.querySelector("#shufflePuzzle");

  const skipButton =
    document.querySelector("#skipPuzzle");


  /* =======================================================
     FORMAT TIMER
  ======================================================= */

  function formatTime(totalSeconds) {

    const minutes =
      Math.floor(totalSeconds / 60);

    const secs =
      totalSeconds % 60;

    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(secs).padStart(2, "0")
    );

  }


  /* =======================================================
     UPDATE PUZZLE STATS
  ======================================================= */

  function updateStats() {

    if (movesElement) {
      movesElement.textContent = moves;
    }

    if (timerElement) {
      timerElement.textContent =
        formatTime(seconds);
    }

  }


  /* =======================================================
     START TIMER
  ======================================================= */

  function startTimer() {

    if (timerInterval) {
      return;
    }

    timerInterval =
      setInterval(function () {

        seconds++;

        updateStats();

      }, 1000);

  }


  /* =======================================================
     STOP TIMER
  ======================================================= */

  function stopTimer() {

    if (timerInterval) {

      clearInterval(timerInterval);

      timerInterval = null;

    }

  }


  /* =======================================================
     CREATE SOLVED PUZZLE
  ======================================================= */

  function createSolvedPuzzle() {

    tiles = [];

    for (
      let i = 0;
      i < TOTAL_TILES - 1;
      i++
    ) {

      tiles.push(i);

    }

    /*
       Last position is empty.
    */

    tiles.push(null);

    emptyIndex =
      TOTAL_TILES - 1;

  }


  /* =======================================================
     GET VALID MOVES
  ======================================================= */

  function getValidMoves(index) {

    const validMoves = [];

    const row =
      Math.floor(index / GRID_SIZE);

    const column =
      index % GRID_SIZE;


    /* UP */

    if (row > 0) {
      validMoves.push(
        index - GRID_SIZE
      );
    }


    /* DOWN */

    if (row < GRID_SIZE - 1) {
      validMoves.push(
        index + GRID_SIZE
      );
    }


    /* LEFT */

    if (column > 0) {
      validMoves.push(
        index - 1
      );
    }


    /* RIGHT */

    if (column < GRID_SIZE - 1) {
      validMoves.push(
        index + 1
      );
    }


    return validMoves;

  }


  /* =======================================================
     SHUFFLE PUZZLE
  ======================================================= */

  function shufflePuzzle() {

    createSolvedPuzzle();

    /*
       Use actual legal puzzle movements
       so the puzzle remains solvable.
    */

    let previousEmpty =
      -1;

    const shuffleMoves = 250;

    for (
      let i = 0;
      i < shuffleMoves;
      i++
    ) {

      const possibleMoves =
        getValidMoves(emptyIndex)
          .filter(function (index) {
            return index !== previousEmpty;
          });


      const randomIndex =
        possibleMoves[
          Math.floor(
            Math.random() *
            possibleMoves.length
          )
        ];


      /*
         Swap tile with empty space.
      */

      tiles[emptyIndex] =
        tiles[randomIndex];

      tiles[randomIndex] =
        null;


      previousEmpty =
        emptyIndex;

      emptyIndex =
        randomIndex;

    }


    /*
       Reset game.
    */

    moves = 0;
    seconds = 0;

    puzzleStarted = false;
    puzzleSolved = false;

    stopTimer();

    updateStats();

    renderPuzzle();

  }


  /* =======================================================
     RENDER PUZZLE
  ======================================================= */

  function renderPuzzle() {

    puzzle.innerHTML = "";


    tiles.forEach(function (
      tile,
      index
    ) {

      const piece =
        document.createElement("button");

      piece.className =
        "puzzle-piece";


      /*
         Empty square.
      */

      if (tile === null) {

        piece.classList.add("empty");

        piece.setAttribute(
          "aria-label",
          "Empty puzzle space"
        );

      }


      /*
         Image tile.
      */

      else {

        const row =
          Math.floor(tile / GRID_SIZE);

        const column =
          tile % GRID_SIZE;


        piece.style.backgroundImage =
          `url("${puzzleImage}")`;


        /*
           Position the correct portion
           of the original image.
        */

        piece.style.backgroundPosition =
          `${(column / (GRID_SIZE - 1)) * 100}% ` +
          `${(row / (GRID_SIZE - 1)) * 100}%`;


        piece.setAttribute(
          "aria-label",
          `Puzzle piece ${tile + 1}`
        );


        piece.addEventListener(
          "click",
          function () {

            moveTile(index);

          }
        );

      }


      puzzle.appendChild(piece);

    });

  }


  /* =======================================================
     MOVE TILE
  ======================================================= */

  function moveTile(index) {

    if (puzzleSolved) {
      return;
    }


    const validMoves =
      getValidMoves(emptyIndex);


    /*
       Tile can move only if it is
       directly beside empty space.
    */

    if (!validMoves.includes(index)) {
      return;
    }


    /*
       Start timer on first move.
    */

    if (!puzzleStarted) {

      puzzleStarted = true;

      startTimer();

    }


    /*
       Swap.
    */

    tiles[emptyIndex] =
      tiles[index];

    tiles[index] =
      null;


    emptyIndex =
      index;


    moves++;

    updateStats();

    renderPuzzle();


    /*
       Check solution.
    */

    checkSolved();

  }


  /* =======================================================
     CHECK IF PUZZLE IS SOLVED
  ======================================================= */

  function checkSolved() {

    for (
      let i = 0;
      i < TOTAL_TILES - 1;
      i++
    ) {

      if (tiles[i] !== i) {
        return false;
      }

    }


    if (tiles[TOTAL_TILES - 1] !== null) {
      return false;
    }


    puzzleSolved = true;

    stopTimer();

    showPuzzleSuccess();

    return true;

  }


  /* =======================================================
     PUZZLE SUCCESS
  ======================================================= */

  function showPuzzleSuccess() {

    const message =
      document.querySelector(
        "#puzzleMessage"
      );

    if (message) {

      message.textContent =
        "✓ Puzzle solved — you found the photo!";

      message.style.color =
        "white";

    }

    /*
       Small visual effect.
    */

    puzzle.style.transform =
      "scale(1.015)";

    setTimeout(function () {

      puzzle.style.transform =
        "scale(1)";

    }, 250);

  }


  /* =======================================================
     SHUFFLE BUTTON
  ======================================================= */

  if (shuffleButton) {

    shuffleButton.addEventListener(
      "click",
      function () {

        shufflePuzzle();

      }
    );

  }


  /* =======================================================
     SKIP PUZZLE
  ======================================================= */

  if (skipButton) {

    skipButton.addEventListener(
      "click",
      function () {

        stopTimer();

        puzzleSolved = true;

        /*
           Show complete image.
        */

        puzzle.innerHTML = "";

        const image =
          document.createElement("img");

        image.src =
          puzzleImage;

        image.alt =
          "Shine R Mathew";

        image.style.width =
          "100%";

        image.style.height =
          "100%";

        image.style.objectFit =
          "cover";

        image.style.gridColumn =
          "1 / -1";

        image.style.gridRow =
          "1 / -1";

        puzzle.appendChild(image);


        const message =
          document.querySelector(
            "#puzzleMessage"
          );

        if (message) {

          message.textContent =
            "Puzzle skipped — here's the complete photo.";

          message.style.color =
            "#aaa";

        }

      }
    );

  }


  /* =======================================================
     INITIALIZE PUZZLE
  ======================================================= */

  shufflePuzzle();

});