const displayBoard = document.querySelectorAll(".box");

// https://www.chess.com/terms/chess-piece-value
// prettier-ignore
const board = [
  15, 13, 13, 19, 10, 13, 13, 15, // +10 to represent black pieces
  11, 11, 11, 11, 11, 11, 11, 11, 
  0,  0,  0,  0,  0,  0,  0,  0,  
  0,  0,  0,  0,  0,  0,  0,  0,  
  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,
  21, 21, 21, 21, 21, 21, 21, 21, // +20 to represent white pieces
  25, 23, 23, 29, 20, 23, 23, 25,
];

const piece_placed_sound = new Audio("./assets/sounds/piece_placed.mp3");

// perform a move on click
let pastBox = null;
let child = null;
displayBoard.forEach((box, index) => {
  box.onclick = () => {
    // if a piece was selected previously
    if (pastBox !== null && pastBox !== box) {
      pastBox.classList.toggle("selected");
      if (box.children.length > 0) box.removeChild(box.children[0]);
      box.appendChild(pastBox.removeChild(child));
      piece_placed_sound.play();
      pastBox = null;
      child = null;
      return;
    }
    // if selected piece is selected again
    if (pastBox !== null) {
      box.classList.toggle("selected");
      pastBox = null;
      child = null;
      return;
    }
    // if no piece was selected previously
    if (box.children.length > 0) {
      box.classList.toggle("selected");
      child = box.children[0];
      pastBox = box;
    }
  };
});
