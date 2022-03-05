import { getMoves, getPieceType } from "./moves.js";
import { printBoard } from "./debugTools/utils.js";

const displayBoard = document.querySelectorAll(".box");

// https://www.chess.com/terms/chess-piece-value
// prettier-ignore
export const board = [
  15, 13, 14, 19, 10, 14, 13, 15, // +10 to represent black pieces
  11, 11, 11, 11, 11, 11, 11, 11, 
  0,  0,  0,  0,  0,  0,  0,  0,  
  0,  0,  0,  0,  0,  0,  0,  0,  
  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,
  21, 21, 21, 21, 21, 21, 21, 21, // +20 to represent white pieces
  25, 23, 24, 29, 20, 24, 23, 25,
];

window.enableDebugTools = () => {
  // enable debug tools
  window.printBoard = printBoard;
  return true;
};

window.disableDebugTools = () => {
  // disble debug tools
  delete window?.printBoard;
  return true;
};

const piece_placed_sound = new Audio("./assets/sounds/piece_placed.mp3");

const updateHighlights = () => {
  // update highlighted moves and kills
  highLightedPlaces.moves.forEach((place) => {
    displayBoard[place].classList.toggle("possible");
  });
  highLightedPlaces.kills.forEach((place) => {
    displayBoard[place].classList.toggle("kill");
  });
};

// perform a move on click
let pastBox = null;
let child = null;
let pastIndex = null;
let highLightedPlaces = {
  moves: [],
  kills: [],
};

const clickMove = (box, index) => {
  // if a piece was selected previously
  if (pastBox !== null && pastBox !== box) {
    if (
      !highLightedPlaces.moves.includes(index) &&
      !highLightedPlaces.kills.includes(index)
    )
      return; // highlightedPlaces === LegalMoves
    if (
      getPieceType(pastIndex).type === "king" &&
      Math.abs(index - pastIndex) === 2
    ) {
      // its a castling move
      let castlingData = highLightedPlaces.castling;
      box.appendChild(pastBox.removeChild(child)); // move the king
      board[index] = board[pastIndex];
      board[pastIndex] = 0;

      if (castlingData?.[index]?.side === "left") {
        // castling on the left side
        displayBoard[index + 1].appendChild(
          displayBoard[castlingData?.[index]?.rook].removeChild(
            displayBoard[castlingData?.[index]?.rook].children[0]
          )
        );
        // update board representation
        board[index + 1] = board[castlingData?.[index]?.rook];
        board[castlingData?.[index]?.rook] = 0;
      } else {
        // castling on the right side
        displayBoard[index - 1].appendChild(
          displayBoard[castlingData?.[index]?.rook].removeChild(
            displayBoard[castlingData?.[index]?.rook].children[0]
          )
        );
        // update board representation
        board[index - 1] = board[castlingData?.[index]?.rook];
        board[castlingData?.[index]?.rook] = 0;
      }
      updateHighlights();
      pastBox.classList.toggle("selected");
      piece_placed_sound.play();
      pastBox = null;
      child = null;
      return;
    }
    pastBox.classList.toggle("selected");
    updateHighlights();
    if (box.children.length > 0) box.removeChild(box.children[0]);
    box.appendChild(pastBox.removeChild(child));
    board[index] = board[pastIndex];
    piece_placed_sound.play();
    board[pastIndex] = 0;
    pastBox = null;
    child = null;
    return;
  }
  // if selected piece is selected again
  if (pastBox !== null) {
    box.classList.toggle("selected");
    updateHighlights();
    pastBox = null;
    child = null;
    pastIndex = null;
    return;
  }
  // if no piece was selected previously
  if (box.children.length > 0) {
    box.classList.toggle("selected");
    highLightedPlaces = getMoves(index);
    updateHighlights();
    child = box.children[0];
    pastBox = box;
    pastIndex = index;
  }
};

displayBoard.forEach((box, index) => {
  box.onclick = () => clickMove(box, index);
});
