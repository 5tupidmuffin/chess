import { fenToBoard } from "../debugTools/fenString.js";
import * as moveGen from "../moves.js";

const pieceMap = {
  p: moveGen.pawnMoves,
  n: moveGen.knightMoves,
  b: moveGen.diagonalMoves,
  r: moveGen.slidingMoves,
  k: moveGen.kingMoves,
  q: (position, board) => {
    return moveGen
      .slidingMoves(position, board)
      .concat(moveGen.diagonalMoves(position, board));
  },
};

export default class Chess {
  // used Chess.js as reference
  constructor(fen) {
    this.board = new Array(64);

    this.currentTurn = "w";

    this.kings = {
      white: 60,
      black: 4,
    };

    this.history = []; // array of performed moves

    this.flags = {
      enPassantSquare: null,
      restrictions: {
        castling: {
          whiteKingSide: false,
          whiteQueenSide: false,
          blackKingSide: false,
          blackQueenSide: false,
        },
      },
    };

    this.halfMoves = 0;
    this.fullMoves = 0;

    if (fen) {
      this.#loadFen(fen);
    } else {
      this.#loadFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"); // default start position
    }
  }

  #loadFen(fen) {
    // load fen string
    ({
      board: this.board,
      whosMoveNext: this.currentTurn,
      flags: this.flags,
      halfMove: this.halfMoves,
      fullMove: this.fullMoves,
    } = fenToBoard(fen));
  }

  #addMove(from, to, movesList) {
    // add a move in possible moves
    /*
      move = {
        color,
        from,
        to,
        promotion (O),
        kill (O),
      }
    */
    if (typeof to === "object") {
      if (to?.enPassantSquare) {
        movesList.push({
          from,
          to: to.to,
          enPassantSquare: to.enPassantSquare,
        });
      }

      if (to?.enPassantKill) {
        movesList.push({
          from,
          to: to.to,
          enPassantKill: to.enPassantKill,
        });
      }
      return;
    }

    if (this.board[to]) {
      movesList.push({
        color: this.currentTurn,
        from,
        to: to,
        kill: this.board[to],
      });
    } else {
      movesList.push({
        color: this.currentTurn,
        from,
        to,
      });
    }
    return;
  }

  #changeTurn() {
    // change current player
    if (this.currentTurn === "w") {
      this.currentTurn = "b";
    } else {
      this.currentTurn = "w";
    }
  }

  #whoOpponent() {
    return this.currentTurn === "w" ? "b" : "w";
  }

  generateMoves(position = null) {
    // generate all possible moves for a side or for a single piece
    const possibleMoves = [];
    if (position) {
      if (this.board[position].color !== this.currentTurn) return;
      for (let move of pieceMap[this.board[position].piece](
        position,
        this.board,
        this.flags
      )) {
        this.#addMove(position, move, possibleMoves);
      }
    }
    return possibleMoves;
  }

  doThisMove(move) {
    // perform a move
    this.board[move.to] = this.board[move.from];

    // en passant conditions
    if (this.flags.enPassantSquare) this.flags.enPassantSquare = null;
    if (move?.enPassantSquare)
      this.flags.enPassantSquare = move.enPassantSquare;
    if (move?.enPassantKill) this.board[move.enPassantKill] = null;

    this.board[move.from] = null;
    this.history.push(move);
    this.#changeTurn();
  }

  undoLastMove() {
    // undo last performed move
    if (!this.history.length) return;
    let lastMove = this.history.pop();
    this.board[lastMove.from] = this.board[lastMove.to];
    if (lastMove?.kill) {
      this.board[lastMove.to] = lastMove.kill;
    } else {
      this.board[lastMove.to] = null;
    }

    // en passant
    if (lastMove?.enPassantKill) {
      this.board[lastMove.enPassantKill] = {
        color: this.currentTurn,
        piece: "p",
      };
      this.flags.enPassantSquare = lastMove.enPassantKill;
    }

    this.#changeTurn();
    return lastMove;
  }

  isInCheck(king) {
    return this.isAttacked(king);
  }

  isCheckMate(king) {
    return this.isInCheck(king) && this.generate_moves().length === 0;
  }

  isStaleMate(king) {
    // draw
    return !this.isInCheck(king) && this.generate_moves().length === 0;
  }

  isAttacked() {
    // check if given king is attacked or not
    return true;
  }
}
