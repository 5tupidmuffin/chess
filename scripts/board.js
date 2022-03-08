// API to manipulate html board element
import { fenToBoard } from "./debugTools/fenString.js";

const PieceImages = {
  20: "./assets/images/king_white.png",
  29: "./assets/images/queen_white.png",
  24: "./assets/images/bishop_white.png",
  23: "./assets/images/knight_white.png",
  25: "./assets/images/rook_white.png",
  21: "./assets/images/pawn_white.png",
  // black pieces
  10: "./assets/images/king_black.png",
  19: "./assets/images/queen_black.png",
  14: "./assets/images/bishop_black.png",
  13: "./assets/images/knight_black.png",
  15: "./assets/images/rook_black.png",
  11: "./assets/images/pawn_black.png",
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
    for (let idx of places) {
      this.board[idx].classList.toggle(cssSelector);
    }
  }

  highLightPiece(position) {
    this.selectedPiece = position;
    this.#toggleCssClass([this.selectedPiece], "selected");
  }

  removeHighlightPiece() {
    if (this.selectedPiece === null) return;
    this.#toggleCssClass([this.selectedPiece], "selected");
    this.selectedPiece = null;
  }

  highlightPlaces(arrayOfPositions) {
    this.possibleMoves = arrayOfPositions;
    this.#toggleCssClass(this.possibleMoves, "possible");
  }

  removeHighlightedPlaces() {
    if (!this.possibleMoves.length) return;
    this.#toggleCssClass(this.possibleMoves, "possible");
    this.possibleMoves = [];
  }

  highlightKills(arrayOfPositions) {
    this.kills = arrayOfPositions;
    this.#toggleCssClass(this.kills, "kill");
  }

  removeHighlightedKills() {
    if (!this.kills.length) return;
    this.#toggleCssClass(this.kills, "kill");
    this.kills = [];
  }

  removeAllHighlights() {
    this.removeHighlightPiece();
    this.removeHighlightedPlaces();
    this.removeHighlightedKills();
  }

  movePiece(fromHere, toHere) {
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

  boardFromFen(fenString) {
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
        el.src = PieceImages[compBoard[compCursor]];
        this.board[boardCursor].appendChild(el);
      }
      boardCursor++;
      compCursor++;
    }
  }

  fenToBoad() {
    return this.boardFromFen.bind(this);
  }
}
