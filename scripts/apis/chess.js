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
        piece: {},
        from,
        to,
        kill (O),
        promotion,
        flags: { at that move },
        anySpecialMove
      }
    */
    const build = {
      ...to,
      piece: this.board[from],
      from,
    };

    if (this.board[build.to]) {
      build.kill = this.board[build.to];
    }

    movesList.push(build);
  }

  #deepCopy(anything) {
    return JSON.parse(JSON.stringify(anything));
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

  printBoard() {
    const getPieceNotation = (pieceObj) => {
      if (pieceObj === null) return "-";
      if (pieceObj.color === "w") {
        return pieceObj.piece.toUpperCase();
      } else {
        return pieceObj.piece;
      }
    };

    const lastRow = `  | a b c d e f g h |`;
    let row = 8;

    for (let i = 0; i <= 56; i += 8) {
      console.log(
        `${row} | ${getPieceNotation(this.board[i])} ${getPieceNotation(
          this.board[i + 1]
        )} ${getPieceNotation(this.board[i + 2])} ${getPieceNotation(
          this.board[i + 3]
        )} ${getPieceNotation(this.board[i + 4])} ${getPieceNotation(
          this.board[i + 5]
        )} ${getPieceNotation(this.board[i + 6])} ${getPieceNotation(
          this.board[i + 7]
        )} |`
      );
      row--;
    }
    console.log(lastRow);
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
    this.flags = this.#deepCopy(move.flags);
    if (this.flags.enPassantSquare) this.flags.enPassantSquare = null;
    if (move?.enPassantSquare)
      this.flags.enPassantSquare = move.enPassantSquare;
    if (move?.enPassantKill) this.board[move.enPassantKill] = null;

    // castling
    if (move?.castling) {
      this.board[move.castling.to] = this.board[move.castling.from];
      this.board[move.castling.from] = null;
    }

    // if rooks move from initial position
    if (move.whiteKingSide !== undefined)
      this.flags.restrictions.castling.whiteKingSide = false;
    if (move.whiteQueenSide !== undefined)
      this.flags.restrictions.castling.whiteQueenSide = false;
    if (move.blackKingSide !== undefined)
      this.flags.restrictions.castling.whiteKingSide = false;
    if (move.blackQueenSide !== undefined)
      this.flags.restrictions.castling.whiteQueenSide = false;

    this.board[move.from] = null;
    this.history.push(move);
    this.#changeTurn();
  }

  undoLastMove() {
    // undo last performed move
    if (!this.history.length) return;
    let lastMove = this.history.pop();
    this.board[lastMove.from] = this.board[lastMove.to];
    this.flags = lastMove.flags;
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

    // castling
    if (lastMove?.castling) {
      this.board[lastMove.castling.from] = this.board[lastMove.castling.to];
      this.board[lastMove.castling.to] = null;
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
