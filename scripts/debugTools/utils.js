import { board } from "../main.js";

export const printBoard = () => {
  // print computer's board representation
  for (let i = 0; i < 64; i += 8) {
    console.log(
      `${board[i]} ${board[i + 1]} ${board[i + 2]} ${board[i + 3]} ${
        board[i + 4]
      } ${board[i + 5]} ${board[i + 6]} ${board[i + 7]}`
    );
  }
};

export const showIndexOfPlace = (board) => {
  board.forEach((box, index) => {
    const el = document.createElement("p");
    el.textContent = index;
    box.onmouseover = () => {
      box.appendChild(el);
    };
    box.onmouseleave = () => {
      box.removeChild(el);
    };
  });
};
