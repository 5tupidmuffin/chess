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
      return kingMoves(startPosition);
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
  let validMoves = {
    moves: [],
    kills: [],
  };
  const self = getPieceType(startPosition);
  let values = [6, 10, 15, 17];
  for (let value of values) {
    // countiue statements if piece is too near to side of board so as to prevent invalid moves
    if (startPosition % 8 === 1 && value === 6) continue;
    if (startPosition % 8 === 0 && (value === 6 || value === 15)) continue;
    if (startPosition % 8 === 6 && value === 10) continue;
    if (startPosition % 8 === 7 && (value === 10 || value === 17)) continue;
    if (startPosition + value <= 63) {
      if (board[startPosition + value] === 0) {
        validMoves.moves.push(startPosition + value);
        continue;
      } else {
        if (getPieceType(startPosition + value).color !== self.color)
          validMoves.kills.push(startPosition + value);
        continue;
      }
    }
  }
  for (let value of values) {
    // countiue statements if piece is too near to side of board so as to prevent invalid moves
    if (startPosition % 8 === 6 && value === 6) continue;
    if (startPosition % 8 === 7 && (value === 6 || value === 15)) continue;
    if (startPosition % 8 === 1 && value === 10) continue;
    if (startPosition % 8 === 0 && (value === 10 || value === 17)) continue;
    if (startPosition - value >= 0) {
      if (board[startPosition - value] === 0) {
        validMoves.moves.push(startPosition - value);
        continue;
      } else {
        if (getPieceType(startPosition - value).color !== self.color)
          validMoves.kills.push(startPosition - value);
        continue;
      }
    }
  }
  return validMoves;
};

const kingMoves = (startPosition) => {
  let validMoves = {
    moves: [],
    kills: [],
  };

  const self = getPieceType(startPosition);
  let values = [1, -1, 8, -8, 7, -7, 9, -9];

  for (let value of values) {
    const position = startPosition + value;
    if (position <= 63 && position >= 0) {
      if (board[position] === 0) {
        validMoves.moves.push(position);
        continue;
      }
      if (getPieceType(position).color !== self.color) {
        validMoves.kills.push(position);
      }
    }
  }

  // castling
  let rooks = self.color === "white" ? [63, 56] : [0, 7];
  let kingAtStart =
    self.color === "white" ? startPosition === 60 : startPosition === 4;
  out: for (let position of rooks) {
    if (!kingAtStart) break; // if king isnt on the start position no castling
    if (
      board[position] === 0 ||
      (getPieceType(position).type !== "rook" &&
        getPieceType(position).color !== self.color)
    )
      continue;

    // can the rooks reach king
    if (position === 63 || position === 7) {
      // rooks on the right side of board
      for (let i = position - 1; i > startPosition; i--) {
        if (board[i] !== 0) continue out; // continue outer loop
      }
      validMoves.moves.push(startPosition + 2);
    }

    if (position === 0 || position === 56) {
      // rooks on the left side of board
      for (let i = position + 1; i < startPosition; i++) {
        if (board[i] !== 0) continue out; // continue outer loop
      }
      validMoves.moves.push(startPosition - 2);
    }
  }

  return validMoves;
};
