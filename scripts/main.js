import { getMoves, getPieceType } from "./moves.js";
import { printBoard, showIndexOfPlace } from "./debugTools/utils.js";
import Board from "./board.js";

const displayBoard = document.querySelectorAll(".box");
const ChessBoard = new Board(displayBoard);

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
  window.boardFromFen = ChessBoard.fenToBoad();
  showIndexOfPlace(displayBoard);
  return true;
};

window.disableDebugTools = () => {
  // disble debug tools
  delete window?.printBoard;
  return true;
};

const piece_placed_sound = new Audio("./assets/sounds/piece_placed.mp3");

const pieceExistOnIndex = (index) => {
  for (let child of displayBoard[index].children) {
    if (child.nodeName === "IMG") {
      return child;
    }
  }
  return false;
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
      board[index] = board[pastIndex];
      board[pastIndex] = 0;

      if (castlingData?.[index]?.side === "left") {
        // castling on the left side
        ChessBoard.movePiece(castlingData?.[index]?.rook, index + 1);
        // update board representation
        board[index + 1] = board[castlingData?.[index]?.rook];
        board[castlingData?.[index]?.rook] = 0;
      } else {
        // castling on the right side
        ChessBoard.movePiece(castlingData?.[index]?.rook, index - 1);
        // update board representation
        board[index - 1] = board[castlingData?.[index]?.rook];
        board[castlingData?.[index]?.rook] = 0;
      }
      ChessBoard.movePiece(pastIndex, index); // move the king
      ChessBoard.removeAllHighlights();
      piece_placed_sound.play();
      pastBox = null;
      child = null;
      return;
    }
    if (
      getPieceType(pastIndex).type === "pawn" &&
      highLightedPlaces?.enPassant?.[`${index}`]
    ) {
      // its en passant
      ChessBoard.movePiece(pastIndex, index);
      ChessBoard.removePiece(highLightedPlaces?.enPassant?.[`${index}`]?.kill);
      ChessBoard.removeAllHighlights();
      piece_placed_sound.play();
      board[pastIndex] = 0;
      pastBox = null;
      child = null;
      return;
    }

    ChessBoard.removeAllHighlights();
    ChessBoard.movePiece(pastIndex, index);
    board[index] = board[pastIndex];
    piece_placed_sound.play();
    board[pastIndex] = 0;
    pastBox = null;
    child = null;
    return;
  }
  // if selected piece is selected again
  if (pastBox !== null) {
    ChessBoard.removeAllHighlights();
    pastBox = null;
    child = null;
    pastIndex = null;
    return;
  }
  // if no piece was selected previously
  if (!pastBox && pieceExistOnIndex(index)) {
    ChessBoard.highLightPiece(index);
    highLightedPlaces = getMoves(index);
    if (highLightedPlaces?.enPassant) {
      Object.keys(highLightedPlaces.enPassant).forEach((place) => {
        highLightedPlaces.moves.push(Number(place));
      });
    }
    ChessBoard.highlightPlaces(highLightedPlaces.moves);
    ChessBoard.highlightKills(highLightedPlaces.kills);
    child = pieceExistOnIndex(index);
    pastBox = box;
    pastIndex = index;
  }
};

displayBoard.forEach((box, index) => {
  box.onclick = () => clickMove(box, index);
});
