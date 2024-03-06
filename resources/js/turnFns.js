import {
  b1,
  b2,
  b3,
  b4,
  b5,
  b6,
  b7,
  b8,
  b9,
  firstRow,
  secondRow,
  thirdRow,
  firstColumn,
  secondColumn,
  thirdColumn,
  forwardSlash,
  backslash,
  state,
} from "./state.js";

export function checkWin(arr, value) {
  arr.forEach((route) => {
    if (route.length === 3) {
      endGame(`${value} wins!`);
    }
  });
}

export function setMove(btn, value) {
  let arr = [];
  value === "X"
    ? (arr = state.xRoutes)
    : value === "O"
    ? (arr = state.oRoutes)
    : null;
  // set value of button to either X or O
  btn.innerHTML = value;
  // disable button
  btn.setAttribute("disabled", true);
  // remove from available options
  state.availableBtns.splice(state.availableBtns.indexOf(btn), 1);
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

  if (state.round > 2) {
    checkWin(arr, value);
  }
}

export function removeAvailableRoutes(arr, move) {
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
}

export function checkTie() {
  if (
    state.availablePCRoutes.length < 1 &&
    state.availableHumanRoutes.length < 1
  ) {
    endGame("It's a draw!");
  }
}

export function endGame(result) {
  document.getElementById("message").innerHTML = result;
  state.availableBtns.forEach((btn) => btn.setAttribute("disabled", true));
  state.gameOver = true;
}
