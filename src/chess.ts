import { fenToBoard } from "./debugTools/fenString";
import * as moveGen from "./moves.helper";

const pieceMap = {
  p: moveGen.pawnMoves,
  n: moveGen.knightMoves,
  b: moveGen.diagonalMoves,
  r: moveGen.slidingMoves,
  k: moveGen.kingMoves,
  q: (position: number, board: MemoryBoard, flags: Flags) => {
    return moveGen
      .slidingMoves(position, board, flags)
      .concat(moveGen.diagonalMoves(position, board, flags));
  },
};

/* 
  if the square on which the king stands, or the square which it must
cross, or the square which it is to occupy, is attacked by one or more of
the opponent's pieces,
https://www.fide.com/FIDE/handbook/LawsOfChess.pdf
*/
const castlingFilter = (move: Move, movesList: Moves) => {
  if (!move?.castling) return true;
  const { castling, from } = move;
  if (from < castling.from) {
    let inBetween = movesList.filter((move) => {
      if (move.from === from && (move.to === from + 1 || move.to === from + 2))
        return true;
      return false;
    });
    return inBetween.length === 2 ? true : false;
  } else {
    let inBetween = movesList.filter((move) => {
      if (move.from === from && (move.to === from - 1 || move.to === from - 2))
        return true;
      return false;
    });
    return inBetween.length === 2 ? true : false;
  }
};

export default class Chess {
  // used Chess.js as reference
  board: MemoryBoard;
  currentTurn: pieceColors;
  kings: Kings;
  history: Moves;
  flags: Flags;
  halfMoves: number;
  fullMoves: number;

  constructor(fen: string) {
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

  #loadFen(fen: string) {
    // load fen string
    ({
      board: this.board,
      nextPlayer: this.currentTurn,
      flags: this.flags,
      halfMove: this.halfMoves,
      fullMove: this.fullMoves,
    } = fenToBoard(fen));
  }

  #addMove(from: number, to: number | any, movesList: Moves) {
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
      notation: this.moveNotation(from, to.to),
    };

    if (this.board[build.to]) {
      build.kill = this.board[build.to];
    }

    movesList.push(build);
  }

  #deepCopy(anything: any) {
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

  #whoOpponent(): pieceColors {
    return this.currentTurn === "w" ? "b" : "w";
  }

  printBoard() {
    const getPieceNotation = (pieceObj: Piece) => {
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

  generateMoves(position: number = null, legal = true): Moves {
    // generate all possible moves for a side or for a single piece
    let possibleMoves: Moves = [];
    if (position !== null) {
      if (this.board[position].color !== this.currentTurn) return;
      for (let move of pieceMap[this.board[position].piece](
        position,
        this.board,
        this.flags
      )) {
        this.#addMove(position, move, possibleMoves);
      }

      // if psuedo legal moves are wanted
      if (!legal) return possibleMoves;
      let legalMoves = possibleMoves.filter((move) => {
        if (this.isInCheck(this.currentTurn) && move?.castling) return false;
        this.doThisMove(move);
        if (this.isAttacked(this.#whoOpponent())) {
          this.undoLastMove();
          return false;
        } else {
          this.undoLastMove();
          return true;
        }
      });
      legalMoves = legalMoves.filter((move) =>
        castlingFilter(move, legalMoves)
      );
      return legalMoves;
    }

    // generating all possible moves for a side [ can be improved with PieceList ]
    for (let i = 0; i < 64; i++) {
      if (this.board[i] && this.board[i]?.color === this.currentTurn) {
        possibleMoves = possibleMoves.concat(this.generateMoves(i, legal));
      }
    }
    return possibleMoves;
  }

  doThisMove(move: Move) {
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
    if (move?.whiteKingSide !== undefined)
      this.flags.restrictions.castling.whiteKingSide = false;
    if (move?.whiteQueenSide !== undefined)
      this.flags.restrictions.castling.whiteQueenSide = false;
    if (move?.blackKingSide !== undefined)
      this.flags.restrictions.castling.blackKingSide = false;
    if (move?.blackQueenSide !== undefined)
      this.flags.restrictions.castling.blackQueenSide = false;

    if (move?.promotion) this.board[move.to] = move?.promotion;

    this.board[move.from] = null;
    this.history.push(move);
    this.#changeTurn();
  }

  undoLastMove(): Move {
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

    if (lastMove?.promotion) this.board[lastMove.from] = lastMove.piece;

    this.#changeTurn();
    return lastMove;
  }

  isGameOver(): boolean {
    return this.isCheckMate() || this.isStaleMate();
  }

  isInCheck(king = this.currentTurn) {
    return this.isAttacked(king);
  }

  isCheckMate(king = this.currentTurn) {
    return this.isInCheck(king) && this.generateMoves().length === 0;
  }

  isStaleMate(king = this.currentTurn) {
    // draw
    return !this.isInCheck(king) && this.generateMoves().length === 0;
  }

  isAttacked(kingColor: pieceColors) {
    // check if given king is attacked or not
    let king = null;

    for (let i = 0; i < 64; i++) {
      if (
        this.board[i] &&
        this.board[i].color === kingColor &&
        this.board[i].piece === "k"
      ) {
        king = i;
        break;
      }
    }

    if (king === null)
      throw new Error(`no king found for specified color: ${kingColor}`);

    // check for pawn enemies
    const pawnMoves = kingColor === "w" ? [-7, -9] : [7, 9];
    for (let index of pawnMoves) {
      let enemy = this.board[king + index];
      if (enemy && enemy.color !== kingColor && enemy.piece === "p") {
        if (kingColor === "w") {
          if (Math.floor((king + index) / 8) + 1 === Math.floor(king / 8))
            return true;
        } else {
          if (Math.floor((king + index) / 8) - 1 === Math.floor(king / 8))
            return true;
        }
      }
    }

    // sliding enemies
    const possibleSlidingEnemies = pieceMap
      .r(king, this.board, this.flags)
      .filter(
        ({ to }) =>
          this.board[to] &&
          this.board[to]?.color !== kingColor &&
          (this.board[to]?.piece === "r" || this.board[to]?.piece === "q")
      );

    if (possibleSlidingEnemies.length) return true;

    // diagonal enemies
    const possibleDiagonalEnemies = pieceMap
      .b(king, this.board, this.flags)
      .filter(
        ({ to }) =>
          this.board[to] &&
          this.board[to]?.color !== kingColor &&
          (this.board[to]?.piece === "b" || this.board[to]?.piece === "q")
      );

    if (possibleDiagonalEnemies.length) return true;

    // knight enemies
    const possibleKnightEnemies = pieceMap
      .n(king, this.board, this.flags)
      .filter(
        ({ to }) =>
          this.board[to] &&
          this.board[to]?.color !== kingColor &&
          this.board[to]?.piece === "n"
      );

    if (possibleKnightEnemies.length) return true;

    return false;
  }

  moveNotation(from: number, to: number): string {
    const chars = "abcdefgh";
    const makeMove = (digit: number) => {
      return `${chars[digit % 8]}${8 - Math.floor(digit / 8)}`;
    };
    return `${makeMove(from)}${makeMove(to)}`;
  }
}
