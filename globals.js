const b1 = document.getElementById("1");
const b2 = document.getElementById("2");
const b3 = document.getElementById("3");
const b4 = document.getElementById("4");
const b5 = document.getElementById("5");
const b6 = document.getElementById("6");
const b7 = document.getElementById("7");
const b8 = document.getElementById("8");
const b9 = document.getElementById("9");

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

export {
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
};
