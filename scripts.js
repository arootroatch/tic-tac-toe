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

function checkWin(value) {
  if (value === "O") {
    oRoutes.forEach((route) => {
      if (route.length === 3) {
        endGame("You lose! Please try again.");
      }
    });
  } else if (value === "X") {
    xRoutes.forEach((route) => {
      if (route.length === 3) {
        endGame("You win!");
      }
    });
  }
}

function computerTurn(move) {
  if (round === 1) {
    // if the first move was a corner, play the middle square
    if (corners.includes(move)) {
      setMove(b5, "O");
      computerFirstMove = b5;
      removeAvailableRoutes(availableHumanRoutes, b5.id);
    } else if (sides.includes(move)) {
      // if the first move is a side square, pick one of the adjacent corners
      let adjacentCorners = [];
      switch (move) {
        case b2:
          adjacentCorners.push(b1, b3);
          break;
        case b4:
          adjacentCorners.push(b1, b7);
          break;
        case b6:
          adjacentCorners.push(b3, b9);
          break;
        case b8:
          adjacentCorners.push(b7, b9);
      }
      let index = Math.floor(Math.random() * adjacentCorners.length);
      setMove(adjacentCorners[index], "O");
      removeAvailableRoutes(availableHumanRoutes, adjacentCorners[index].id);
    } else {
      // always play a corner to prevent forking
      let index = Math.floor(Math.random() * corners.length);
      setMove(corners[index], "O");
      removeAvailableRoutes(availableHumanRoutes, corners[index].id);
      computerFirstMove = corners[index];
    }
  } else if (round > 2) {
    // check for winning moves
    win();
    // if no winning moves, check for places to block
    if (!gameOver) {
      let blocked = block();
      // if there's no winning path and no path to block
      if (!blocked) {
        if (availableBtns.length === 1) {
          setMove(availableBtns[0], "O");
          removeAvailableHumanRoutes(availableBtns[0], "O");
        } else {
          let index = Math.floor(Math.random() * availableBtns.length);
          removeAvailableRoutes(availableHumanRoutes, availableBtns[index].id);
          setMove(availableBtns[index], "O");
        }
      }
    }
  } else if (round === 2) {
    // check if we need to block
    let blocked = block();
    if (!blocked) {
      // take the center if it still isn't taken
      if (availableBtns.includes(b5)) {
        setMove(b5, "O");
        removeAvailableRoutes(availableHumanRoutes, b5.id);
      } else if (
        (backslashCorners.includes(humanFirstMove) &&
          backslashCorners.includes(humanSecondMove)) ||
        (forwardSlashCorners.includes(humanFirstMove) &&
          forwardSlashCorners.includes(humanSecondMove))
      ) {
        // if the human played opposing corners, play a side square
        let index = Math.floor(Math.random() * sides.length);
        setMove(sides[index], "O");
        removeAvailableRoutes(availableHumanRoutes, sides[index].id);
      } else {
        findBestPossibleMoves();
      }
    }
  }
  if (!gameOver) {
    availableBtns.forEach((btn) => btn.removeAttribute("disabled"));
    message.innerHTML = "Your turn!";
  }
}
function findBestPossibleMoves(){
  // look at which of the available routes our first move is in
  let computerOpenRoutes = availablePCRoutes.filter((route) =>
    route.includes(computerFirstMove)
  );

  // boil that down to just the available buttons and filter our duplicates
  let computerFlat = computerOpenRoutes.flat();
  let computerOpenMoves = computerFlat.filter(
    (value, index) =>
      computerFlat.indexOf(value) === index && availableBtns.includes(value)
  );

  // of these possible routes, which one ALSO blocks their route to winning?
  // first, find all winning routes for the human opp
  let humanOpenRoutes = [];
  availableHumanRoutes.forEach((route) => {
    if (route.includes(humanFirstMove) || route.includes(humanSecondMove)) {
      if (!route.includes(computerFirstMove)) {
        humanOpenRoutes.push(route);
      }
    }
  });
  // then boil that down to available buttons and filter duplicates
  let humanFlat = humanOpenRoutes.flat();
  let humanOpenMoves = humanFlat.filter(
    (value, index) =>
      humanFlat.indexOf(value) === index && availableBtns.includes(value)
  );
  // now the moves that are in both computerOpenMoves and humanOpenMoves are the best possible next moves
  let overlappingMoves = computerOpenMoves.filter((move) =>
    humanOpenMoves.includes(move)
  );
  // if any of these moves is a corner, we need to prioritize that to prevent forking
  let cornerMoves = overlappingMoves.filter((move) => corners.includes(move));
  // let's check just in case there isn't a corner move
  let bestMoves;
  cornerMoves.length < 1
    ? (bestMoves = overlappingMoves)
    : (bestMoves = cornerMoves);
  // randomly choose one of these bestMoves and do it
  let index = Math.floor(Math.random() * bestMoves.length);
  setMove(bestMoves[index], "O");
  removeAvailableRoutes(availableHumanRoutes, bestMoves[index].id);
}

function setMove(btn, value) {
  let arr;
  if (value === "X") {
    arr = xRoutes;
  } else if (value === "O") {
    arr = oRoutes;
  }
  // set value of button to either X or O
  btn.innerHTML = value;
  // disable button
  btn.setAttribute("disabled", true);
  // remove from available options
  availableBtns.splice(availableBtns.indexOf(btn), 1);
  // update appropriate arrays
  switch (btn) {
    case b1:
      arr[3].push(btn);
      arr[0].push(btn);
      arr[7].push(btn);
      break;
    case b2:
      arr[0].push(btn);
      arr[4].push(btn);
      break;
    case b3:
      arr[0].push(btn);
      arr[5].push(btn);
      arr[6].push(btn);
      break;
    case b4:
      arr[1].push(btn);
      arr[3].push(btn);
      break;
    case b5:
      arr[7].push(btn);
      arr[6].push(btn);
      arr[1].push(btn);
      arr[4].push(btn);
      break;
    case b6:
      arr[1].push(btn);
      arr[5].push(btn);
      break;
    case b7:
      arr[6].push(btn);
      arr[3].push(btn);
      arr[2].push(btn);
      break;
    case b8:
      arr[2].push(btn);
      arr[4].push(btn);
      break;
    case b9:
      arr[7].push(btn);
      arr[2].push(btn);
      arr[5].push(btn);
      break;
  }

  if (round > 2) {
    checkWin(value);
  }
}

function removeAvailableRoutes(arr, move) {
  function checkAndSplice(route) {
    if (arr.includes(route)) {
      arr.splice(arr.indexOf(route), 1);
    }
  }
  switch (move) {
    case "1":
      checkAndSplice(firstRow);
      checkAndSplice(firstColumn);
      checkAndSplice(backslash);
      break;
    case "2":
      checkAndSplice(firstRow);
      checkAndSplice(secondColumn);
      break;
    case "3":
      checkAndSplice(firstRow);
      checkAndSplice(thirdColumn);
      checkAndSplice(forwardSlash);
      break;
    case "4":
      checkAndSplice(secondRow);
      checkAndSplice(firstColumn);
      break;
    case "5":
      checkAndSplice(secondRow);
      checkAndSplice(secondColumn);
      checkAndSplice(backslash);
      checkAndSplice(forwardSlash);
      break;
    case "6":
      checkAndSplice(secondRow);
      checkAndSplice(thirdColumn);
      break;
    case "7":
      checkAndSplice(thirdRow);
      checkAndSplice(firstColumn);
      checkAndSplice(forwardSlash);
      break;
    case "8":
      checkAndSplice(thirdRow);
      checkAndSplice(secondColumn);
      break;
    case "9":
      checkAndSplice(thirdRow);
      checkAndSplice(thirdColumn);
      checkAndSplice(backslash);
      break;
  }
  if (round > 2) {
    checkTie();
  }
}

function checkTie() {
  if (availablePCRoutes.length < 1 && availableHumanRoutes.length < 1) {
    endGame("It's a draw!");
  }
}

function endGame(result) {
  message.innerHTML = result;
  availableBtns.forEach((btn) => btn.setAttribute("disabled", true));
  gameOver = true;
}

function block() {
  // check for two in a row, block the third move if available, remove from possible routes

  // find the index of the route that needs to be blocked
  let blocked = false;
  for (let i = 0; i < xRoutes.length; i++) {
    if (xRoutes[i].length === 2) {
      // compare that to allRoutes to find the btn we need to play
      for (let j = 0; j < allRoutes[i].length && !blocked; j++) {
        if (
          !xRoutes[i].includes(allRoutes[i][j]) &&
          availableBtns.includes(allRoutes[i][j])
        ) {
          setMove(allRoutes[i][j], "O");
          removeAvailableRoutes(availableHumanRoutes, allRoutes[i][j].id);
          blocked = true;
        }
      }
    }
  }
  return blocked;
}

function win() {
  // for each available route, see if we already have 2 in a row and then make the winning move

  function isWinningMove(currentRoute, winningRoute) {
    if (currentRoute.length === 2) {
      winningRoute.forEach((btn) => {
        if (!currentRoute.includes(btn)) {
          setMove(btn, "O");
        }
      });
    }
  }

  availablePCRoutes.forEach((route) => {
    if (!gameOver) {
      switch (route) {
        case firstRow:
          isWinningMove(firstRowO, firstRow);
          break;
        case secondRow:
          isWinningMove(secondRowO, secondRow);
          break;
        case thirdRow:
          isWinningMove(thirdRowO, thirdRow);
          break;
        case firstColumn:
          isWinningMove(firstColumnO, firstColumn);
          break;
        case secondColumn:
          isWinningMove(secondColumnO, secondColumn);
          break;
        case thirdColumn:
          isWinningMove(thirdColumnO, thirdColumn);
          break;
        case forwardSlash:
          isWinningMove(forwardSlashO, forwardSlash);
          break;
        case backslash:
          isWinningMove(backslashO, backslash);
          break;
      }
    }
  });
}

