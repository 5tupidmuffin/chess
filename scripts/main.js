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
  window.printBoard = () => console.log(chess.board);
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
    if (
      // getPieceType(pastIndex).type === "king" &&
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
      return;
    }

    const enPassant = highLightedPlaces?.filter(
      (move) => move?.enPassantKill && move.to === index
    )[0];
    if (enPassant) {
      // its en passant
      ChessBoard.movePiece(pastIndex, index);
      ChessBoard.removePiece(enPassant.enPassantKill);
      chess.doThisMove(enPassant);
      ChessBoard.removeAllHighlights();
      piece_placed_sound.play();
      restrictions.enPassantKillable = null;
      pastIndex = null;
      return;
    }

    ChessBoard.removeAllHighlights();
    ChessBoard.movePiece(pastIndex, index);
    const move = highLightedPlaces.filter((move) => move.to === index)[0];
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
