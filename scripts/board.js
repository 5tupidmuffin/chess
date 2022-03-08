// API to manipulate html board element
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
}
