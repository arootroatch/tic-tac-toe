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
  console.log("human");
  round === 1
    ? (humanFirstMove = event)
    : round === 2
    ? (humanSecondMove = event)
    : null;
  // display X on page
  setMove(event, "X");

  // what winning routes did this disqualify for the PC opponent?
  removeAvailablePCRoutes(event.id);

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
  console.log("checkWin");
  if (value === "O") {
    for (let i = 0; i < oRoutes.length && !gameOver; i++) {
      if (oRoutes[i].length === 3) {
        message.innerHTML = `You lose! Please try again`;
        availableBtns.forEach((btn) => btn.setAttribute("disabled", true));
        gameOver = true;
      }
    }
  } else if (value === "X") {
    for (let i = 0; i < xRoutes.length && !gameOver; i++) {
      if (xRoutes[i].length === 3) {
        message.innerHTML = `You win!`;
        availableBtns.forEach((btn) => btn.setAttribute("disabled", true));
        gameOver = true;
      }
    }
  }
}

function computerTurn(move) {
  console.log("computerTurn");
  if (round === 1) {
    // if the first move was a corner, play the middle square
    if (corners.includes(move)) {
      setMove(b5, "O");
      computerFirstMove = b5;
      removeAvailableHumanRoutes(b5.id);
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
      removeAvailableHumanRoutes(adjacentCorners[index].id);
    } else {
      // always play a corner to prevent forking
      let index = Math.floor(Math.random() * corners.length);
      setMove(corners[index], "O");
      removeAvailableHumanRoutes(corners[index].id);
      computerFirstMove = corners[index];
    }
  } else if (round > 2) {
    // check for winning moves
    win();
    // if no winning moves, check for places to block
    if (!gameOver) {
      let blocked = block();
      console.log("blocked", blocked);
      // if there's no winning path and no path to block
      if (!blocked) {
        console.log(availableBtns);
        console.log(availableBtns.length);
        if (availableBtns.length === 1) {
          setMove(availableBtns[0], "O");
          removeAvailableHumanRoutes(availableBtns[0], "O");
        } else {
          let index = Math.floor(Math.random() * availableBtns.length);
          removeAvailableHumanRoutes(availableBtns[index].id);
          setMove(availableBtns[index], "O");
          console.log(index);
        }
      }
    }
  } else if (round === 2) {
    // check if we need to block
    let blocked = block();
    console.log("blocked", blocked);
    if (!blocked) {
      // take the center if it still isn't taken
      if (availableBtns.includes(b5)) {
        setMove(b5, "O");
        removeAvailableHumanRoutes(b5.id);
      } else if (
        (backslashCorners.includes(humanFirstMove) &&
          backslashCorners.includes(humanSecondMove)) ||
        (forwardSlashCorners.includes(humanFirstMove) &&
          forwardSlashCorners.includes(humanSecondMove))
      ) {
        console.log('opposing');
        // if the human played opposing corners, play a side square
        let index = Math.floor(Math.random() * sides.length);
        console.log(index)
        console.log(sides[index]);
        setMove(sides[index], "O");
        removeAvailableHumanRoutes(sides[index].id);
      } else {
        // look at which of the available routes our first move is in
        let computerOpenRoutes = [];
        availablePCRoutes.forEach((route) => {
          if (route.includes(computerFirstMove)) {
            computerOpenRoutes.push(route);
          }
        });
        console.log("computerFirst", computerFirstMove);
        console.log("compOpenRoutes", computerOpenRoutes);
        // boil that down to just the available buttons and filter our duplicates
        let computerFlat = computerOpenRoutes.flat();
        let computerOpenMoves = computerFlat.filter(
          (value, index) =>
            computerFlat.indexOf(value) === index &&
            availableBtns.includes(value)
        );
        console.log("computerOpen", computerOpenMoves);

        // of these possible routes, which one ALSO blocks their route to winning?
        // first, find all winning routes for the human opp
        let humanOpenRoutes = [];
        availableHumanRoutes.forEach((route) => {
          if (
            route.includes(humanFirstMove) ||
            route.includes(humanSecondMove)
          ) {
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
        console.log("humanOpen", humanOpenMoves);
        // now the moves that are in both computerOpenMoves and humanOpenMoves are the best possible next moves
        let overlappingMoves = computerOpenMoves.filter((move) =>
          humanOpenMoves.includes(move)
        );
        console.log("overlap", overlappingMoves);
        // if any of these moves is a corner, we need to prioritize that to prevent forking
        let cornerMoves = overlappingMoves.filter((move) =>
          corners.includes(move)
        );
        // let's check just in case there isn't a corner move
        let bestMoves;
        cornerMoves.length < 1
          ? (bestMoves = overlappingMoves)
          : (bestMoves = cornerMoves);
        // randomly choose one of these bestMoves and do it
        console.log("bestmoves", bestMoves);
        let index = Math.floor(Math.random() * bestMoves.length);
        setMove(bestMoves[index], "O");
        removeAvailableHumanRoutes(bestMoves[index].id);
      }
    }
  }
  if (!gameOver) {
    message.innerHTML = "Your turn!";
  }
}

function setMove(btn, value) {
  console.log("setMove");
  // set value of button to either X or O
  btn.innerHTML = value;
  // disable button
  btn.setAttribute("disabled", true);
  // remove from available options
  availableBtns.splice(availableBtns.indexOf(btn), 1);
  // update appropriate arrays
  if (value === "O") {
    switch (btn) {
      case b1:
        firstColumnO.push(btn);
        firstRowO.push(btn);
        backslashO.push(btn);
        break;
      case b2:
        firstRowO.push(btn);
        secondColumnO.push(btn);
        break;
      case b3:
        firstRowO.push(btn);
        thirdColumnO.push(btn);
        forwardSlashO.push(btn);
        break;
      case b4:
        secondRowO.push(btn);
        firstColumnO.push(btn);
        break;
      case b5:
        backslashO.push(btn);
        forwardSlashO.push(btn);
        secondRowO.push(btn);
        secondColumnO.push(btn);
        break;
      case b6:
        secondRowO.push(btn);
        thirdColumnO.push(btn);
        break;
      case b7:
        forwardSlashO.push(btn);
        firstColumnO.push(btn);
        thirdRowO.push(btn);
        break;
      case b8:
        thirdRowO.push(btn);
        secondColumnO.push(btn);
        break;
      case b9:
        backslashO.push(btn);
        thirdRowO.push(btn);
        thirdColumnO.push(btn);
        break;
    }
  } else if (value === "X") {
    switch (btn) {
      case b1:
        firstColumnX.push(btn);
        firstRowX.push(btn);
        backslashX.push(btn);
        break;
      case b2:
        firstRowX.push(btn);
        secondColumnX.push(btn);
        break;
      case b3:
        firstRowX.push(btn);
        thirdColumnX.push(btn);
        forwardSlashX.push(btn);
        break;
      case b4:
        secondRowX.push(btn);
        firstColumnX.push(btn);
        break;
      case b5:
        backslashX.push(btn);
        forwardSlashX.push(btn);
        secondRowX.push(btn);
        secondColumnX.push(btn);
        break;
      case b6:
        secondRowX.push(btn);
        thirdColumnX.push(btn);
        break;
      case b7:
        forwardSlashX.push(btn);
        firstColumnX.push(btn);
        thirdRowX.push(btn);
        break;
      case b8:
        thirdRowX.push(btn);
        secondColumnX.push(btn);
        break;
      case b9:
        backslashX.push(btn);
        thirdRowX.push(btn);
        thirdColumnX.push(btn);
        break;
    }
  }

  if (round > 2) {
    checkWin(value);
  }
}

function removeAvailablePCRoutes(move) {
  console.log("removeAvailablePCRoutes");
  switch (move) {
    case "1":
      if (availablePCRoutes.includes(firstRow)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(firstRow), 1);
      }
      if (availablePCRoutes.includes(firstColumn)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(firstColumn), 1);
      }
      if (availablePCRoutes.includes(backslash)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(backslash), 1);
      }
      break;
    case "2":
      if (availablePCRoutes.includes(firstRow)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(firstRow), 1);
      }
      if (availablePCRoutes.includes(secondColumn)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(secondColumn), 1);
      }
      break;
    case "3":
      if (availablePCRoutes.includes(firstRow)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(firstRow), 1);
      }
      if (availablePCRoutes.includes(thirdColumn)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(thirdColumn), 1);
      }
      if (availablePCRoutes.includes(forwardSlash)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(forwardSlash), 1);
      }
      break;
    case "4":
      if (availablePCRoutes.includes(secondRow)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(secondRow), 1);
      }
      if (availablePCRoutes.includes(firstColumn)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(firstColumn), 1);
      }
      break;
    case "5":
      if (availablePCRoutes.includes(secondRow)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(secondRow), 1);
      }
      if (availablePCRoutes.includes(secondColumn)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(secondColumn), 1);
      }
      if (availablePCRoutes.includes(backslash)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(backslash), 1);
      }
      if (availablePCRoutes.includes(forwardSlash)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(forwardSlash), 1);
      }
      break;
    case "6":
      if (availablePCRoutes.includes(secondRow)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(secondRow), 1);
      }
      if (availablePCRoutes.includes(thirdColumn)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(thirdColumn), 1);
      }
      break;
    case "7":
      if (availablePCRoutes.includes(thirdRow)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(thirdRow), 1);
      }
      if (availablePCRoutes.includes(firstColumn)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(firstColumn), 1);
      }
      if (availablePCRoutes.includes(forwardSlash)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(forwardSlash), 1);
      }
      break;
    case "8":
      if (availablePCRoutes.includes(thirdRow)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(thirdRow), 1);
      }
      if (availablePCRoutes.includes(secondColumn)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(secondColumn), 1);
      }
      break;
    case "9":
      if (availablePCRoutes.includes(thirdRow)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(thirdRow), 1);
      }
      if (availablePCRoutes.includes(thirdColumn)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(thirdColumn), 1);
      }
      if (availablePCRoutes.includes(backslash)) {
        availablePCRoutes.splice(availablePCRoutes.indexOf(backslash), 1);
      }
      break;
  }
  console.log(availablePCRoutes);
  if (round > 2) {
    checkTie();
  }
}

function removeAvailableHumanRoutes(move) {
  console.log("removeAvailableHumanRoutes");
  switch (move) {
    case "1":
      if (availableHumanRoutes.includes(firstRow)) {
        availableHumanRoutes.splice(availableHumanRoutes.indexOf(firstRow), 1);
      }
      if (availableHumanRoutes.includes(firstColumn)) {
        availableHumanRoutes.splice(
          availableHumanRoutes.indexOf(firstColumn),
          1
        );
      }
      if (availableHumanRoutes.includes(backslash)) {
        availableHumanRoutes.splice(availableHumanRoutes.indexOf(backslash), 1);
      }
      break;
    case "2":
      if (availableHumanRoutes.includes(firstRow)) {
        availableHumanRoutes.splice(availableHumanRoutes.indexOf(firstRow), 1);
      }
      if (availableHumanRoutes.includes(secondColumn)) {
        availableHumanRoutes.splice(
          availableHumanRoutes.indexOf(secondColumn),
          1
        );
      }
      break;
    case "3":
      if (availableHumanRoutes.includes(firstRow)) {
        availableHumanRoutes.splice(availableHumanRoutes.indexOf(firstRow), 1);
      }
      if (availableHumanRoutes.includes(thirdColumn)) {
        availableHumanRoutes.splice(
          availableHumanRoutes.indexOf(thirdColumn),
          1
        );
      }
      if (availableHumanRoutes.includes(forwardSlash)) {
        availableHumanRoutes.splice(
          availableHumanRoutes.indexOf(forwardSlash),
          1
        );
      }
      break;
    case "4":
      if (availableHumanRoutes.includes(secondRow)) {
        availableHumanRoutes.splice(availableHumanRoutes.indexOf(secondRow), 1);
      }
      if (availableHumanRoutes.includes(firstColumn)) {
        availableHumanRoutes.splice(
          availableHumanRoutes.indexOf(firstColumn),
          1
        );
      }
      break;
    case "5":
      if (availableHumanRoutes.includes(secondRow)) {
        availableHumanRoutes.splice(availableHumanRoutes.indexOf(secondRow), 1);
      }
      if (availableHumanRoutes.includes(secondColumn)) {
        availableHumanRoutes.splice(
          availableHumanRoutes.indexOf(secondColumn),
          1
        );
      }
      if (availableHumanRoutes.includes(backslash)) {
        availableHumanRoutes.splice(availableHumanRoutes.indexOf(backslash), 1);
      }
      if (availableHumanRoutes.includes(forwardSlash)) {
        availableHumanRoutes.splice(
          availableHumanRoutes.indexOf(forwardSlash),
          1
        );
      }
      break;
    case "6":
      if (availableHumanRoutes.includes(secondRow)) {
        availableHumanRoutes.splice(availableHumanRoutes.indexOf(secondRow), 1);
      }
      if (availableHumanRoutes.includes(thirdColumn)) {
        availableHumanRoutes.splice(
          availableHumanRoutes.indexOf(thirdColumn),
          1
        );
      }
      break;
    case "7":
      if (availableHumanRoutes.includes(thirdRow)) {
        availableHumanRoutes.splice(availableHumanRoutes.indexOf(thirdRow), 1);
      }
      if (availableHumanRoutes.includes(firstColumn)) {
        availableHumanRoutes.splice(
          availableHumanRoutes.indexOf(firstColumn),
          1
        );
      }
      if (availableHumanRoutes.includes(forwardSlash)) {
        availableHumanRoutes.splice(
          availableHumanRoutes.indexOf(forwardSlash),
          1
        );
      }
      break;
    case "8":
      if (availableHumanRoutes.includes(thirdRow)) {
        availableHumanRoutes.splice(availableHumanRoutes.indexOf(thirdRow), 1);
      }
      if (availableHumanRoutes.includes(secondColumn)) {
        availableHumanRoutes.splice(
          availableHumanRoutes.indexOf(secondColumn),
          1
        );
      }
      break;
    case "9":
      if (availableHumanRoutes.includes(thirdRow)) {
        availableHumanRoutes.splice(availableHumanRoutes.indexOf(thirdRow), 1);
      }
      if (availableHumanRoutes.includes(thirdColumn)) {
        availableHumanRoutes.splice(
          availableHumanRoutes.indexOf(thirdColumn),
          1
        );
      }
      if (availableHumanRoutes.includes(backslash)) {
        availableHumanRoutes.splice(availableHumanRoutes.indexOf(backslash), 1);
      }
      break;
  }
  console.log(availableHumanRoutes);
  if (round > 2) {
    checkTie();
  }
}

function checkTie() {
  console.log("checkTie");
  if (availablePCRoutes.length < 1 && availableHumanRoutes.length < 1) {
    message.innerHTML = "It's a draw!";
    availableBtns.forEach((btn) => btn.setAttribute("disabled", true));
    gameOver = true;
  }
}

function block() {
  console.log("block");
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
          removeAvailableHumanRoutes(allRoutes[i][j].id);
          blocked = true;
        }
      }
    }
  }
  if (!blocked) {
    return false;
  } else return true;
}

function win() {
  console.log("win()");
  // for each available route, see if we already have 2 in a row and then make the winning move

  function isWinningMove(currentRoute, winningRoute) {
    if (currentRoute.length === 2) {
      for (let i = 0; i < winningRoute.length; i++) {
        if (!currentRoute.includes(winningRoute[i])) {
          setMove(winningRoute[i], "O");
        }
      }
    }
  }

  for (let i = 0; i < availablePCRoutes.length && !gameOver; i++) {
    switch (availablePCRoutes[i]) {
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
}

function restart() {
  location.reload();
}
