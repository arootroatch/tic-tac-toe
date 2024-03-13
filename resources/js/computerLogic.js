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
  state,
} from "./state.js";

export function computerTurn(move) {
  const corners = [b1, b3, b7, b9];
  const backslashCorners = [b1, b9];
  const forwardSlashCorners = [b3, b7];
  const sides = [b2, b4, b6, b8];

  if (state.round === 1) {
    // if the first move was a corner, play the middle square
    if (corners.includes(move)) {
      setMove(b5, "O");
      state.computerFirstMove = b5;
      removeAvailableRoutes(state.availableHumanRoutes, b5.id);
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
      state.computerFirstMove = adjacentCorners[index];
      removeAvailableRoutes(
        state.availableHumanRoutes,
        adjacentCorners[index].id
      );
    } else {
      // always play a corner to prevent forking
      let index = Math.floor(Math.random() * corners.length);
      setMove(corners[index], "O");
      removeAvailableRoutes(state.availableHumanRoutes, corners[index].id);
      state.computerFirstMove = corners[index];
    }
  } else if (state.round > 2) {
    // check for winning moves
    win();
    // if no winning moves, check for places to block
    if (!state.gameOver) {
      let blocked = block();
      // if there's no winning path and no path to block
      if (!blocked) {
        if (state.availableBtns.length === 1) {
          setMove(state.availableBtns[0], "O");
          removeAvailableRoutes(
            state.availableHumanRoutes,
            state.availableBtns[0].id
          );
          checkTie();
        } else {
          let index = Math.floor(Math.random() * state.availableBtns.length);
          removeAvailableRoutes(
            state.availableHumanRoutes,
            state.availableBtns[index].id
          );
          setMove(state.availableBtns[index], "O");
          checkTie();
        }
      }
    }
  } else if (state.round === 2) {
    // check if we need to block
    let blocked = block();
    if (!blocked) {
      // take the center if it still isn't taken
      if (state.availableBtns.includes(b5)) {
        setMove(b5, "O");
        removeAvailableRoutes(state.availableHumanRoutes, b5.id);
      } else if (
        (backslashCorners.includes(state.humanFirstMove) &&
          backslashCorners.includes(state.humanSecondMove)) ||
        (forwardSlashCorners.includes(state.humanFirstMove) &&
          forwardSlashCorners.includes(state.humanSecondMove))
      ) {
        // if the human played opposing corners, play a side square
        let index = Math.floor(Math.random() * sides.length);
        setMove(sides[index], "O");
        removeAvailableRoutes(state.availableHumanRoutes, sides[index].id);
      } else {
        findBestPossibleMoves();
      }
    }
  }

  if (!state.gameOver) {
    state.availableBtns.forEach((btn) => btn.removeAttribute("disabled"));
    message.innerHTML = "Your turn!";
  }
}
function findBestPossibleMoves() {
  // look at which of the available routes our first move is in
  let computerOpenRoutes = state.availablePCRoutes.filter((route) =>
    route.includes(state.computerFirstMove)
  );

  // boil that down to just the available buttons and filter our duplicates
  let computerFlat = computerOpenRoutes.flat();
  let computerOpenMoves = computerFlat.filter(
    (value, index) =>
      computerFlat.indexOf(value) === index &&
      state.availableBtns.includes(value)
  );

  // of these possible routes, which one ALSO blocks their route to winning?
  // first, find all winning routes for the human opp
  let humanOpenRoutes = [];
  state.availableHumanRoutes.forEach((route) => {
    if (
      route.includes(state.humanFirstMove) ||
      route.includes(state.humanSecondMove)
    ) {
      if (!route.includes(state.computerFirstMove)) {
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
  removeAvailableRoutes(state.availableHumanRoutes, bestMoves[index].id);
}

function block() {
  console.log("blocking");
  // check for two in a row, block the third move if available, remove from possible routes

  // find the index of the route that needs to be blocked
  let blocked = false;
  for (let i = 0; i < state.xRoutes.length; i++) {
    if (state.xRoutes[i].length === 2) {
      // compare that to allRoutes to find the btn we need to play
      for (let j = 0; j < allRoutes[i].length && !blocked; j++) {
        if (
          !state.xRoutes[i].includes(allRoutes[i][j]) &&
          state.availableBtns.includes(allRoutes[i][j])
        ) {
          setMove(allRoutes[i][j], "O");
          removeAvailableRoutes(state.availableHumanRoutes, allRoutes[i][j].id);
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

  state.availablePCRoutes.forEach((route) => {
    if (!state.gameOver) {
      switch (route) {
        case firstRow:
          isWinningMove(state.oRoutes[0], firstRow);
          break;
        case secondRow:
          isWinningMove(state.oRoutes[1], secondRow);
          break;
        case thirdRow:
          isWinningMove(state.oRoutes[2], thirdRow);
          break;
        case firstColumn:
          isWinningMove(state.oRoutes[3], firstColumn);
          break;
        case secondColumn:
          isWinningMove(state.oRoutes[4], secondColumn);
          break;
        case thirdColumn:
          isWinningMove(state.oRoutes[5], thirdColumn);
          break;
        case forwardSlash:
          isWinningMove(state.oRoutes[6], forwardSlash);
          break;
        case backslash:
          isWinningMove(state.oRoutes[7], backslash);
          break;
      }
    }
  });
}
