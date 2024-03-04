import { checkTie, removeAvailableRoutes, setMove } from "./turnFns.js";
import {
  firstRow,
  secondRow,
  thirdRow,
  firstColumn,
  secondColumn,
  thirdColumn,
  forwardSlash,
  backslash,
  b1,
  b2,
  b3,
  b4,
  b5,
  b6,
  b7,
  b8,
  b9,
  allRoutes,
} from "./globals.js";

let computerFirstMove;

let oRoutes = [[], [], [], [], [], [], [], []];

export function computerTurn(
  move,
  xRoutes,
  round,
  availableBtns,
  gameOver,
  availablePCRoutes,
  availableHumanRoutes,
  humanFirstMove, 
  humanSecondMove
) {
  const corners = [b1, b3, b7, b9];
  const backslashCorners = [b1, b9];
  const forwardSlashCorners = [b3, b7];
  const sides = [b2, b4, b6, b8];

  if (round === 1) {
    // if the first move was a corner, play the middle square
    if (corners.includes(move)) {
      setMove(b5, "O", oRoutes, availableBtns, round);
      computerFirstMove = b5;
      removeAvailableRoutes(availableHumanRoutes, b5.id, round);
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
      setMove(adjacentCorners[index], "O", oRoutes, availableBtns, round);
      removeAvailableRoutes(availableHumanRoutes, adjacentCorners[index].id);
    } else {
      // always play a corner to prevent forking
      let index = Math.floor(Math.random() * corners.length);
      setMove(corners[index], "O", oRoutes, availableBtns, round);
      removeAvailableRoutes(availableHumanRoutes, corners[index].id);
      computerFirstMove = corners[index];
    }
  } else if (round > 2) {
    // check for winning moves
    win(availablePCRoutes, gameOver);
    // if no winning moves, check for places to block
    if (!gameOver) {
      let blocked = block(xRoutes, availableBtns, round, availableHumanRoutes);
      // if there's no winning path and no path to block
      if (!blocked) {
        if (availableBtns.length === 1) {
          setMove(availableBtns[0], "O", oRoutes, availableBtns, round);
          removeAvailableHumanRoutes(availableBtns[0], "O");
          checkTie();
        } else {
          let index = Math.floor(Math.random() * availableBtns.length);
          removeAvailableRoutes(availableHumanRoutes, availableBtns[index].id);
          setMove(availableBtns[index], "O", oRoutes, availableBtns, round);
          checkTie();
        }
      }
    }
  } else if (round === 2) {
    // check if we need to block
    let blocked = block(xRoutes, availableBtns, round, availableHumanRoutes);
    if (!blocked) {
      // take the center if it still isn't taken
      if (availableBtns.includes(b5)) {
        setMove(b5, "O", oRoutes, availableBtns, round);
        removeAvailableRoutes(availableHumanRoutes, b5.id);
      } else if (
        (backslashCorners.includes(humanFirstMove) &&
          backslashCorners.includes(humanSecondMove)) ||
        (forwardSlashCorners.includes(humanFirstMove) &&
          forwardSlashCorners.includes(humanSecondMove))
      ) {
        // if the human played opposing corners, play a side square
        let index = Math.floor(Math.random() * sides.length);
        setMove(sides[index], "O", oRoutes, availableBtns, round);
        removeAvailableRoutes(availableHumanRoutes, sides[index].id);
      } else {
        findBestPossibleMoves(availablePCRoutes, availableHumanRoutes, availableBtns, humanFirstMove);
      }
    }
  }

  if (!gameOver) {
    availableBtns.forEach((btn) => btn.removeAttribute("disabled"));
    message.innerHTML = "Your turn!";
  }
}
function findBestPossibleMoves(availablePCRoutes, availableHumanRoutes, availableBtns, humanFirstMove) {
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
  setMove(bestMoves[index], "O", oRoutes, availableBtns, round);
  removeAvailableRoutes(availableHumanRoutes, bestMoves[index].id);
}

function block(xRoutes, availableBtns, round, availableHumanRoutes) {
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
          setMove(allRoutes[i][j], "O", oRoutes, availableBtns, round);
          removeAvailableRoutes(availableHumanRoutes, allRoutes[i][j].id);
          blocked = true;
        }
      }
    }
  }
  return blocked;
}

function win(availablePCRoutes, gameOver, oRoutes, availableBtns, round) {
  // for each available route, see if we already have 2 in a row and then make the winning move

  function isWinningMove(
    currentRoute,
    winningRoute,
    oRoutes,
    availableBtns,
    round
  ) {
    if (currentRoute.length === 2) {
      winningRoute.forEach((btn) => {
        if (!currentRoute.includes(btn)) {
          setMove(btn, "O", oRoutes, availableBtns, round);
        }
      });
    }
  }

  availablePCRoutes.forEach((route) => {
    if (!gameOver) {
      switch (route) {
        case firstRow:
          isWinningMove(oRoutes[0], firstRow, oRoutes, availableBtns, round);
          break;
        case secondRow:
          isWinningMove(oRoutes[1], secondRow, oRoutes, availableBtns, round);
          break;
        case thirdRow:
          isWinningMove(oRoutes[2], thirdRow, oRoutes, availableBtns, round);
          break;
        case firstColumn:
          isWinningMove(oRoutes[3], firstColumn, oRoutes, availableBtns, round);
          break;
        case secondColumn:
          isWinningMove(
            oRoutes[4],
            secondColumn,
            oRoutes,
            availableBtns,
            round
          );
          break;
        case thirdColumn:
          isWinningMove(oRoutes[5], thirdColumn, oRoutes, availableBtns, round);
          break;
        case forwardSlash:
          isWinningMove(
            oRoutes[6],
            forwardSlash,
            oRoutes,
            availableBtns,
            round
          );
          break;
        case backslash:
          isWinningMove(oRoutes[7], backslash, oRoutes, availableBtns, round);
          break;
      }
    }
  });
}
