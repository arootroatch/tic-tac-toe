import { setMove, removeAvailableRoutes } from "./turnLogic.js";
import { computerTurn } from "./computerLogic.js";

const b1 = document.getElementById("1");
const b2 = document.getElementById("2");
const b3 = document.getElementById("3");
const b4 = document.getElementById("4");
const b5 = document.getElementById("5");
const b6 = document.getElementById("6");
const b7 = document.getElementById("7");
const b8 = document.getElementById("8");
const b9 = document.getElementById("9");
const message = document.getElementById("message");
let gameOver = false;
// remember the first move for later
let computerFirstMove;
let humanFirstMove;
let humanSecondMove;

let availableBtns = [b1, b2, b3, b4, b5, b6, b7, b8, b9];
const firstRow = [b1, b2, b3];
const secondRow = [b4, b5, b6];
const thirdRow = [b7, b8, b9];
const firstColumn = [b1, b4, b7];
const secondColumn = [b2, b5, b8];
const thirdColumn = [b3, b6, b9];
const forwardSlash = [b3, b5, b7];
const backslash = [b1, b5, b9];
const allRoutes = [
  firstRow,
  secondRow,
  thirdRow,
  firstColumn,
  secondColumn,
  thirdColumn,
  forwardSlash,
  backslash,
];
const corners = [b1, b3, b7, b9];
const backslashCorners = [b1, b9];
const forwardSlashCorners = [b3, b7];
const sides = [b2, b4, b6, b8];
// routes will be removed from here as they become unavailable so the PC player can determine how to win
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
let availableHumanRoutes = [
  firstRow,
  secondRow,
  thirdRow,
  firstColumn,
  secondColumn,
  thirdColumn,
  forwardSlash,
  backslash,
];
// arrays to track each player's moves in context of winning combinations
let firstRowX = [];
let secondRowX = [];
let thirdRowX = [];
let firstColumnX = [];
let secondColumnX = [];
let thirdColumnX = [];
let forwardSlashX = [];
let backslashX = [];
let xRoutes = [
  firstRowX,
  secondRowX,
  thirdRowX,
  firstColumnX,
  secondColumnX,
  thirdColumnX,
  forwardSlashX,
  backslashX,
];
let firstRowO = [];
let secondRowO = [];
let thirdRowO = [];
let firstColumnO = [];
let secondColumnO = [];
let thirdColumnO = [];
let forwardSlashO = [];
let backslashO = [];
let oRoutes = [
  firstRowO,
  secondRowO,
  thirdRowO,
  firstColumnO,
  secondColumnO,
  thirdColumnO,
  forwardSlashO,
  backslashO,
];

let round = 1;

function handleClick(event) {
  round === 1
    ? (humanFirstMove = event)
    : round === 2
    ? (humanSecondMove = event)
    : null;
  // display X on page
  setMove(event, "X");

  // what winning routes did this disqualify for the PC opponent?
  removeAvailableRoutes(availablePCRoutes, event.id);
  availableBtns.forEach((btn) => btn.setAttribute("disabled", true));

  if (!gameOver) {
    message.innerHTML = "Your opponent is thinking...";
    setTimeout(() => {
      // trigger PC turn - pass in the button that was clicked
      computerTurn(event);
      // increment round count
      round++;
    }, 2000);
  }
}

availableBtns.forEach((btn) => btn.addEventListener("click", handleClick));