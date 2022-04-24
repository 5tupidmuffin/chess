import minimax from "./minimax";
import moveSort from "./moveSort";
import Chess from "../apis/chess";

// return move from computer's side
const deduceMove = (chess: Chess): Move => {
  let moves = chess.generateMoves();
  moveSort(moves, 0, moves.length - 1);
  let bestValue = -Infinity;
  let score = -Infinity;
  let bestMove = moves[0];

  for (let move of moves) {
    chess.doThisMove(move);
    score = minimax(chess, 2, -Infinity, Infinity, false);
    chess.undoLastMove();
    if (score > bestValue) {
      bestValue = score;
      bestMove = move;
    }
  }

  return bestMove;
};

export default deduceMove;
