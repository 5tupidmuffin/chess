import { showIndexOfPlace } from "./debugTools/utils.js";
import Board from "./apis/board.js";
import Chess from "./apis/chess.js";

// start position fen
const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const displayBoard = document.querySelectorAll(".box");
const ChessBoard = new Board(displayBoard);
let chess = new Chess(fen);

ChessBoard.boardFromFen(fen);

window.enableDebugTools = () => {
  // enable debug tools
  window.printBoard = () => chess.printBoard();
  window.fenToBoard = (fen) => {
    ChessBoard.boardFromFen(fen);
    chess = new Chess(fen);
  };
  window.displayRep = ChessBoard;
  window.memoryRep = chess;
  showIndexOfPlace(displayBoard);
  return true;
};

window.disableDebugTools = () => {
  // disble debug tools
  delete window?.printBoard;
  return true;
};

const piece_placed_sound = new Audio("./assets/sounds/piece_placed.mp3");

// perform a move on click
let pastIndex = null;
let highLightedPlaces = [];

const clickMove = (_, index) => {
  // if a piece was selected previously
  if (pastIndex !== null && pastIndex !== index) {
    if (
      !ChessBoard.possibleMoves.includes(index) &&
      !ChessBoard.kills.includes(index)
    )
      return; // highlightedPlaces === LegalMoves

    ChessBoard.removeAllHighlights();
    const [move] = highLightedPlaces.filter((move) => move.to === index);
    ChessBoard.doThisMove(move);
    chess.doThisMove(move);
    piece_placed_sound.play();
    pastIndex = null;
    return;
  }
  // if selected piece is selected again
  if (pastIndex !== null) {
    ChessBoard.removeAllHighlights();
    pastIndex = null;
    return;
  }
  // if no piece was selected previously
  if (pastIndex === null && ChessBoard.hasAPiece(index)) {
    ChessBoard.highLightPiece(index);
    highLightedPlaces = chess.generateMoves(index);
    ChessBoard.highlightPlaces(highLightedPlaces);
    pastIndex = index;
  }
};

displayBoard.forEach((box, index) => {
  box.onclick = () => clickMove(box, index);
});
