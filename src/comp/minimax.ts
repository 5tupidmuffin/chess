import moveSort from "./moveSort";
import Chess from "../apis/chess";

const piecesValue = {
  q: 2000,
  r: 800,
  b: 600,
  n: 500,
  p: 200,
  k: 5000,
};

const calcMaterial = (board: MemoryBoard, color: pieceColors): number => {
  let black = 0;
  let white = 0;
  for (let piece of board) {
    if (!piece) continue;
    if (piece.color === "w") white += piecesValue[piece.piece];
    if (piece.color === "b") black += piecesValue[piece.piece];
  }
  let value = black - white;
  return color === "w" ? -1 * value : value;
};

const evaluatePosition = (chess: Chess, color: pieceColors): number => {
  let opponentColor =
    color === "w" ? ("b" as pieceColors) : ("w" as pieceColors);
  if (chess.isCheckMate(color)) return Number.NEGATIVE_INFINITY;
  if (chess.isInCheck(color)) return -5000;
  if (chess.isCheckMate(opponentColor)) return Number.POSITIVE_INFINITY;
  if (chess.isInCheck(opponentColor)) return 5000;
  if (chess.isStaleMate()) return 0;
  return calcMaterial(chess.board, color);
};

// minimax
const minimax = (
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  color: boolean
) => {
  if (depth === 0 || chess.isGameOver()) {
    return evaluatePosition(chess, color ? "w" : "b");
  }

  if (color) {
    let maxEval = -Infinity;
    let moves = chess.generateMoves();
    moveSort(moves, 0, moves.length - 1);
    for (let move of moves) {
      let tempEval = -Infinity;
      chess.doThisMove(move);
      tempEval = minimax(chess, depth - 1, alpha, beta, false);
      chess.undoLastMove();
      maxEval = Math.max(tempEval, maxEval);
      alpha = Math.max(alpha, tempEval);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    let moves = chess.generateMoves();
    moveSort(moves, 0, moves.length - 1);
    for (let move of moves) {
      let tempEval = Infinity;
      chess.doThisMove(move);
      tempEval = minimax(chess, depth - 1, alpha, beta, true);
      chess.undoLastMove();
      minEval = Math.min(tempEval, minEval);
      beta = Math.min(beta, tempEval);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

export default minimax;
