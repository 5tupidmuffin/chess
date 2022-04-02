// API to manipulate html board element
import { fenToBoard } from "../debugTools/fenString.js";

const PieceImages = {
  w: {
    k: "../../assets/images/king_white.png",
    q: "../../assets/images/queen_white.png",
    b: "../../assets/images/bishop_white.png",
    n: "../../assets/images/knight_white.png",
    r: "../../assets/images/rook_white.png",
    p: "../../assets/images/pawn_white.png",
  },
  // black pieces
  b: {
    k: "../../assets/images/king_black.png",
    q: "../../assets/images/queen_black.png",
    b: "../../assets/images/bishop_black.png",
    n: "../../assets/images/knight_black.png",
    r: "../../assets/images/rook_black.png",
    p: "../../assets/images/pawn_black.png",
  },
};

export default class Board {
  constructor(htmlBoardElement = document.querySelector(".board")) {
    this.board = htmlBoardElement;
    this.selectedPiece = null;
    this.possibleMoves = [];
    this.kills = [];
    this.pastMove = [];
  }

  #toggleCssClass(places, cssSelector) {
    if (!places) return;
    for (let idx of places) {
      this.board[idx].classList.toggle(cssSelector);
    }
  }

  hasAPiece(position) {
    for (let child of this.board[position].children) {
      if (child.nodeName === "IMG") return true;
    }
    return false;
  }

  #filterMoves(MovesObjects) {
    let moves = [],
      kills = [];
    if (!MovesObjects) return { moves, kills };
    moves = MovesObjects.filter((move) => !move?.kill).map((move) => move.to);
    kills = MovesObjects.filter((move) => move?.kill).map((move) => move.to);
    return {
      moves,
      kills,
    };
  }

  highLightPiece(position) {
    // highlight clicked piece
    this.selectedPiece = position;
    this.#toggleCssClass([this.selectedPiece], "selected");
  }

  removeHighlightPiece() {
    // remove highlight on clicked piece
    if (this.selectedPiece === null) return;
    this.#toggleCssClass([this.selectedPiece], "selected");
    this.selectedPiece = null;
  }

  highlightPlaces(arrayOfPositions) {
    // highlight possible moves and kills
    const { moves, kills } = this.#filterMoves(arrayOfPositions);
    this.possibleMoves = moves;
    this.kills = kills;
    this.#toggleCssClass(this.possibleMoves, "possible");
    this.#toggleCssClass(this.kills, "kill");
  }

  removeHighlightedPlaces() {
    // remove highlight on possible moves and kills
    if (this.possibleMoves.length)
      this.#toggleCssClass(this.possibleMoves, "possible");
    if (this.kills.length) this.#toggleCssClass(this.kills, "kill");
    this.possibleMoves = [];
    this.kills = [];
  }

  removeAllHighlights() {
    // remove highlight on current piece and its moves
    this.removeHighlightPiece();
    this.removeHighlightedPlaces();
  }

  movePiece(fromHere, toHere) {
    // perform a move
    if (this.pastMove.length) this.#toggleCssClass(this.pastMove, "pastMove");
    let pieceToBeMoved = this.removePiece(fromHere);
    this.removePiece(toHere);
    this.board[toHere].appendChild(pieceToBeMoved);
    this.pastMove = [fromHere, toHere];
    this.#toggleCssClass(this.pastMove, "pastMove");
  }

  doThisMove(move) {
    if (move?.enPassantKill) this.removePiece(move.enPassantKill);
    if (move?.castling) {
      this.movePiece(move.castling.from, move.castling.to);
    }
    this.movePiece(move.from, move.to);
  }

  removePiece(fromHere) {
    // remove a piece from board
    let pieceToBeRemoved = null;
    for (let child of this.board[fromHere].children) {
      if (child.nodeName === "IMG") {
        pieceToBeRemoved = this.board[fromHere].removeChild(child);
        break;
      }
    }
    return pieceToBeRemoved;
  }

  addPiece(here, color, type) {
    this.removePiece(here);
    const el = document.createElement("img");
    el.src = PieceImages[color][type];
    this.board[here].appendChild(el);
  }

  boardFromFen(fenString) {
    // construct a board from fen string
    let compBoard = [];
    ({ board: compBoard } = fenToBoard(fenString));
    let boardCursor = 0,
      compCursor = 0;

    while (boardCursor < 64 && compCursor < 64) {
      this.removePiece(boardCursor);
      if (compBoard[compCursor]) {
        let piece = compBoard[compCursor];
        this.addPiece(boardCursor, piece.color, piece.piece);
      }
      boardCursor++;
      compCursor++;
    }
  }
}
