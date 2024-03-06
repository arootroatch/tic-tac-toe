import { setMove, removeAvailableRoutes, checkTie } from "./turnFns.js";
import { state } from "./state.js";
import { computerTurn } from "./computerLogic.js";
// arrays to track each player's moves in context of winning combinations

function handleClick(event) {
  state.round === 1
    ? (state.humanFirstMove = event.target)
    : state.round === 2
    ? (state.humanSecondMove = event.target)
    : null;
  // display X on page
  setMove(event.target, "X");

  // what winning routes did this disqualify for the PC opponent?
  removeAvailableRoutes(state.availablePCRoutes, event.target.id);
  if (state.round > 2) {
    checkTie();
  }
  state.availableBtns.forEach((btn) => btn.setAttribute("disabled", true));

  if (!state.gameOver) {
    document.getElementById("message").innerHTML =
      "Your opponent is thinking...";
    setTimeout(() => {
      // trigger PC turn - pass in the button that was clicked
      computerTurn(event.target);
      // increment round count
      state.round += 1;
    }, 2000);
  }
}

state.availableBtns.forEach((btn) =>
  btn.addEventListener("click", handleClick)
);
