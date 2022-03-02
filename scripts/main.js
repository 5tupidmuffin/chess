import { getMoves } from "./moves.js";

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

const piece_placed_sound = new Audio("./assets/sounds/piece_placed.mp3");

// perform a move on click
let pastBox = null;
let child = null;
let pastIndex = null;
let highLightedPlaces = {
  moves: [],
  kills: [],
};
displayBoard.forEach((box, index) => {
  box.onclick = () => {
    // if a piece was selected previously
    if (pastBox !== null && pastBox !== box) {
      if (
        !highLightedPlaces.moves.includes(index) &&
        !highLightedPlaces.kills.includes(index)
      )
        return; // highlightedPlaces === LegalMoves
      pastBox.classList.toggle("selected");
      highLightedPlaces.moves.forEach((place) => {
        displayBoard[place].classList.toggle("possible");
      });
      highLightedPlaces.kills.forEach((place) => {
        displayBoard[place].classList.toggle("kill");
      });
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
      highLightedPlaces.moves.forEach((place) => {
        displayBoard[place].classList.toggle("possible");
      });
      highLightedPlaces.kills.forEach((place) => {
        displayBoard[place].classList.toggle("kill");
      });
      pastBox = null;
      child = null;
      pastIndex = null;
      return;
    }
    // if no piece was selected previously
    if (box.children.length > 0) {
      box.classList.toggle("selected");
      highLightedPlaces = getMoves(index);
      highLightedPlaces.moves.forEach((place) => {
        displayBoard[place].classList.toggle("possible");
      });
      highLightedPlaces.kills.forEach((place) => {
        displayBoard[place].classList.toggle("kill");
      });
      child = box.children[0];
      pastBox = box;
      pastIndex = index;
    }
  };
});
