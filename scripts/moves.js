import { board } from "./main.js";

const getPieceType = (startPosition) => {
  // return type and color of piece based on position
  let piece = board[startPosition];
  let color = piece >= 20 ? "white" : "black";
  let type = "";
  switch (color === "white" ? piece - 10 : piece) {
    case 10:
      type = "king";
      break;

    case 19:
      type = "queen";
      break;

    case 15:
      type = "rook";
      break;

    case 13:
      type = "knight";
      break;

    case 14:
      type = "bishop";
      break;

    default:
      type = "pawn";
      break;
  }
  return { color, type };
};

export const getMoves = (startPosition) => {
  let piece = getPieceType(startPosition);
  switch (piece.type) {
    case "queen":
      const sliding = slidingMoves(startPosition),
        diagonal = diagonalMoves(startPosition);
      return {
        moves: sliding.moves.concat(diagonal.moves),
        kills: sliding.kills.concat(diagonal.kills),
      };
    case "knight":
      return knightMoves(startPosition);
    case "rook":
      return slidingMoves(startPosition);
    case "bishop":
      return diagonalMoves(startPosition);
    case "king":
      return [];
    default:
      // pawn
      return pawnMoves(startPosition);
  }
};

// for rook and queen
const slidingMoves = (startPosition) => {
  let validMoves = {
    moves: [],
    kills: [],
  };
  const self = getPieceType(startPosition);
  //horizontal moves
  for (let i = startPosition + 1; i % 8 !== 0; i++) {
    if (board[i] !== 0 || i > 63) {
      if (getPieceType(i).color !== self.color) {
        validMoves.kills.push(i);
      }
      break;
    }
    validMoves.moves.push(i);
  }
  for (let i = startPosition - 1; i % 8 !== 7; i--) {
    if (board[i] !== 0 || i < 0) {
      if (getPieceType(i).color !== self.color) {
        validMoves.kills.push(i);
      }
      break;
    }
    validMoves.moves.push(i);
  }

  //vertical moves
  for (let i = startPosition + 8; i <= 63; i += 8) {
    if (board[i] !== 0) {
      if (getPieceType(i).color !== self.color) {
        validMoves.kills.push(i);
      }
      break;
    }
    validMoves.moves.push(i);
  }
  for (let i = startPosition - 8; i >= 0; i -= 8) {
    if (board[i] !== 0) {
      if (getPieceType(i).color !== self.color) {
        validMoves.kills.push(i);
      }
      break;
    }
    validMoves.moves.push(i);
  }

  return validMoves;
};

// bishop and queen
const diagonalMoves = (startPosition) => {
  let validMoves = {
    moves: [],
    kills: [],
  };
  const self = getPieceType(startPosition);
  //   upper moves
  for (let i = startPosition - 9; i > 0; i -= 9) {
    if (board[i] !== 0 || i % 8 === 7) {
      if (getPieceType(i).color !== self.color && i % 8 !== 7) {
        validMoves.kills.push(i);
      }
      break;
    }
    validMoves.moves.push(i);
  }
  for (let i = startPosition - 7; i > 0; i -= 7) {
    if (board[i] !== 0 || i % 8 === 0) {
      if (getPieceType(i).color !== self.color && i % 8 !== 0) {
        validMoves.kills.push(i);
      }
      break;
    }
    validMoves.moves.push(i);
  }
  //   lower moves
  for (let i = startPosition + 9; i < 64; i += 9) {
    if (board[i] !== 0 || i % 8 === 0) {
      if (getPieceType(i).color !== self.color && i % 8 !== 0) {
        validMoves.kills.push(i);
      }
      break;
    }
    validMoves.moves.push(i);
  }
  for (let i = startPosition + 7; i < 64; i += 7) {
    if (board[i] !== 0 || i % 8 === 7) {
      if (getPieceType(i).color !== self.color && i % 8 !== 7) {
        validMoves.kills.push(i);
      }
      break;
    }
    validMoves.moves.push(i);
  }
  return validMoves;
};

const pawnMoves = (startPosition) => {
  /*
        TODO:
        - implement promotion
        - implement en passant
    */

  const piece = getPieceType(startPosition);
  const validMoves = {
    moves: [],
    kills: [],
  };
  if (piece.color === "white") {
    if (startPosition - 8 < 0) {
      //   promotion
    }
    if (board[startPosition - 8] === 0)
      validMoves.moves.push(startPosition - 8);
    // if first move
    if (Math.floor(startPosition / 8) === 6 && board[startPosition - 16] === 0)
      validMoves.moves.push(startPosition - 16);

    // kills
    if (
      board[startPosition - 9] !== 0 &&
      getPieceType(startPosition - 9).color !== piece.color
    )
      validMoves.kills.push(startPosition - 9);
    if (
      board[startPosition - 7] !== 0 &&
      getPieceType(startPosition - 7).color !== piece.color
    )
      validMoves.kills.push(startPosition - 7);
  } else {
    if (startPosition + 8 >= 63) {
      //   promotion
    }
    if (board[startPosition + 8] === 0)
      validMoves.moves.push(startPosition + 8);
    // if first move
    if (Math.floor(startPosition / 8) === 1 && board[startPosition + 16] === 0)
      validMoves.moves.push(startPosition + 16);

    // kills
    if (
      board[startPosition + 9] !== 0 &&
      getPieceType(startPosition + 9).color !== piece.color
    )
      validMoves.kills.push(startPosition + 9);
    if (
      board[startPosition + 7] !== 0 &&
      getPieceType(startPosition + 7).color !== piece.color
    )
      validMoves.kills.push(startPosition + 7);
  }
  return validMoves;
};

const knightMoves = (startPosition) => {
  let validMoves = [];
  let values = [6, 10, 15, 17];
  for (let value of values) {
    // countiue statements if piece is too near to side of board so as to prevent invalid moves
    if (startPosition % 8 === 1 && value === 6) continue;
    if (startPosition % 8 === 0 && (value === 6 || value === 15)) continue;
    if (startPosition % 8 === 6 && value === 10) continue;
    if (startPosition % 8 === 7 && (value === 10 || value === 17)) continue;
    if (startPosition + value <= 63) validMoves.push(startPosition + value);
  }
  for (let value of values) {
    // countiue statements if piece is too near to side of board so as to prevent invalid moves
    if (startPosition % 8 === 6 && value === 6) continue;
    if (startPosition % 8 === 7 && (value === 6 || value === 15)) continue;
    if (startPosition % 8 === 1 && value === 10) continue;
    if (startPosition % 8 === 0 && (value === 10 || value === 17)) continue;
    if (startPosition - value >= 0) validMoves.push(startPosition - value);
  }
  return validMoves;
};
