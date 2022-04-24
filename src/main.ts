import { showIndexOfPlace } from "./debugTools/utils";
import Board from "./apis/board";
import Chess from "./apis/chess";
import computerMove from "./comp/deduceMove";

// start position fen
const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const displayBoard = document.querySelectorAll(".box");
const ChessBoard = new Board(displayBoard);
let chess = new Chess(fen);

ChessBoard.boardFromFen(fen);

const modal = document.querySelector(".modal");
let active = false;
const showMessage = (message: string): void => {
  if (active || !message) return;
  active = true;
  modal.classList.toggle("hidden");
  modal.textContent = message;

  setTimeout(() => {
    active = false;
    modal.classList.toggle("hidden");
  }, 3 * 1000);
};

window.enableDebugTools = (): boolean => {
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

window.disableDebugTools = (): boolean => {
  // disble debug tools
  delete window?.printBoard;
  return true;
};

const piece_placed_sound = new Audio("./assets/sounds/piece_placed.mp3");

// perform a move on click
let pastIndex: number = null;
let highLightedPlaces: Moves = [];

const clickMove = (_: HTMLElement, index: number) => {
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

    if (chess.isGameOver()) {
      if (chess.isStaleMate()) showMessage("its stalemate!");
      if (chess.isCheckMate())
        showMessage(`${chess.currentTurn === "w" ? "black" : "white"} wins`);
    }

    const comMove = computerMove(chess);
    ChessBoard.doThisMove(comMove);
    chess.doThisMove(comMove);

    if (chess.isGameOver()) {
      if (chess.isStaleMate()) showMessage("its stalemate!");
      if (chess.isCheckMate())
        showMessage(`${chess.currentTurn === "w" ? "black" : "white"} wins`);
    }
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

displayBoard.forEach((box: HTMLElement, index: number) => {
  box.onclick = () => clickMove(box, index);
});
