import { setMove, removeAvailableRoutes } from "./turnFns.js";
import {
  b1, b2, b3, b4, b5, b6, b7, b8, b9,
  firstRow, secondRow, thirdRow, firstColumn, secondColumn, thirdColumn, forwardSlash, backslash
} from "./globals.js";
import { computerTurn } from "./computerLogic.js";

function handleClick(event) {
  // arrays to track each player's moves in context of winning combinations
  let xRoutes = [[], [], [], [], [], [], [], []];
  let availableBtns = [b1, b2, b3, b4, b5, b6, b7, b8, b9];
  let availablePCRoutes = [
    firstRow,
    secondRow,
    thirdRow,
    firstColumn,
    secondColumn,
    thirdColumn,
    forwardSlash,
    backslash,
  ];
  let humanFirstMove;
  let humanSecondMove;
  let gameOver = false;
  let round = 1;

  round === 1
    ? (humanFirstMove = event.target)
    : round === 2
    ? (humanSecondMove = event.target)
    : null;
  // display X on page
  setMove(event.target, "X", xRoutes);

  // what winning routes did this disqualify for the PC opponent?
  removeAvailableRoutes(availablePCRoutes, event.id);
  availableBtns.forEach((btn) => btn.setAttribute("disabled", true));

  if (!gameOver) {
    document.getElementById("message").innerHTML =
      "Your opponent is thinking...";
    setTimeout(() => {
      // trigger PC turn - pass in the button that was clicked
      computerTurn(event, xRoutes);
      // increment round count
      round++;
    }, 2000);
  }
}

availableBtns.forEach((btn) => btn.addEventListener("click", handleClick));
