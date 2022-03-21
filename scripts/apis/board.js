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
    return this.board[position] ? true : false;
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
    if (!this.possibleMoves.length) return;
    this.#toggleCssClass(this.possibleMoves, "possible");
    this.#toggleCssClass(this.kills, "kill");
    this.possibleMoves = [];
  }

  removeAllHighlights() {
    // remove highlight on current piece and its moves
    this.removeHighlightPiece();
    this.removeHighlightedPlaces();
  }

  movePiece(fromHere, toHere) {
    // perform a move
    if (this.pastMove.length) this.#toggleCssClass(this.pastMove, "pastMove");
    let pieceToBeMoved = null;
    for (let child of this.board[fromHere].children) {
      if (child.nodeName === "IMG") {
        pieceToBeMoved = this.board[fromHere].removeChild(child);
        break;
      }
    }
    for (let child of this.board[toHere].children) {
      if (child.nodeName === "IMG") {
        this.board[toHere].removeChild(child);
        break;
      }
    }
    this.board[toHere].appendChild(pieceToBeMoved);
    this.pastMove = [fromHere, toHere];
    this.#toggleCssClass(this.pastMove, "pastMove");
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

  boardFromFen(fenString) {
    // construct a board from fen string
    let compBoard = fenToBoard(fenString);
    let boardCursor = 0,
      compCursor = 0;

    while (boardCursor < 64 && compCursor < 64) {
      for (let child of this.board[boardCursor].children) {
        if (child.nodeName === "IMG") {
          this.board[boardCursor].removeChild(child);
        }
      }
      if (compBoard[compCursor]) {
        let el = document.createElement("img");
        let piece = compBoard[compCursor];
        el.src = PieceImages[piece.color][piece.piece];
        this.board[boardCursor].appendChild(el);
      }
      boardCursor++;
      compCursor++;
    }
  }
}