import { board } from "./main.js";

export const getPieceType = (startPosition) => {
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

// for rook and queen
export const slidingMoves = (startPosition, board) => {
  const moves = [];
  const self = board[startPosition];
  //horizontal moves
  for (let i = startPosition + 1; i % 8 !== 0; i++) {
    if (board[i] !== null || i > 63) {
      if (i > 63) break;
      if (board[i].color !== self.color) {
        moves.push(i);
      }
      break;
    }
    moves.push(i);
  }
  for (let i = startPosition - 1; i % 8 !== 7; i--) {
    if (board[i] !== null || i < 0) {
      if (i < 0) break;
      if (board[i].color !== self.color) {
        moves.push(i);
      }
      break;
    }
    moves.push(i);
  }

  //vertical moves
  for (let i = startPosition + 8; i <= 63; i += 8) {
    if (board[i] !== null) {
      if (board[i].color !== self.color) {
        moves.push(i);
      }
      break;
    }
    moves.push(i);
  }
  for (let i = startPosition - 8; i >= 0; i -= 8) {
    if (board[i] !== null) {
      if (board[i].color !== self.color) {
        moves.push(i);
      }
      break;
    }
    moves.push(i);
  }

  return moves;
};

// bishop and queen
export const diagonalMoves = (startPosition, board) => {
  const moves = [];
  const self = board[startPosition];
  //   upper moves
  for (let i = startPosition - 9; i >= 0; i -= 9) {
    if (board[i] !== null || i % 8 === 7) {
      if (board[i]?.color !== self.color && i % 8 !== 7) {
        moves.push(i);
      }
      break;
    }
    moves.push(i);
  }
  for (let i = startPosition - 7; i > 0; i -= 7) {
    if (board[i] !== null || i % 8 === 0) {
      if (board[i]?.color !== self.color && i % 8 !== 0) {
        moves.push(i);
      }
      break;
    }
    moves.push(i);
  }
  //   lower moves
  for (let i = startPosition + 9; i < 64; i += 9) {
    if (board[i] !== null || i % 8 === 0) {
      if (board[i]?.color !== self.color && i % 8 !== 0) {
        moves.push(i);
      }
      break;
    }
    moves.push(i);
  }
  for (let i = startPosition + 7; i < 64; i += 7) {
    if (board[i] !== null || i % 8 === 7) {
      if (board[i]?.color !== self.color && i % 8 !== 7) {
        moves.push(i);
      }
      break;
    }
    moves.push(i);
  }
  return moves;
};

export const pawnMoves = (startPosition, board, flags) => {
  /*
        TODO:
        _ implement en passant
        - implement promotion
    */

  const self = board[startPosition];
  const moves = [];
  if (self.color === "w") {
    if (startPosition - 8 < 0) {
      //   promotion
    }
    if (board[startPosition - 8] === null) moves.push(startPosition - 8);
    // if first move
    if (
      Math.floor(startPosition / 8) === 6 &&
      board[startPosition - 8] === null &&
      board[startPosition - 16] === null
    )
      moves.push({
        to: startPosition - 16,
        enPassantSquare: startPosition - 16,
      });

    // kills
    if (
      board[startPosition - 9] !== null &&
      board[startPosition - 9].color !== self.color &&
      Math.floor(startPosition / 8) - 1 === Math.floor((startPosition - 9) / 8)
    )
      moves.push(startPosition - 9);
    if (
      board[startPosition - 7] !== null &&
      board[startPosition - 7].color !== self.color &&
      Math.floor(startPosition / 8) - 1 === Math.floor((startPosition - 7) / 8)
    )
      moves.push(startPosition - 7);

    // en passant
    if (Math.floor(startPosition / 8) === 3) {
      // left
      if (
        startPosition - 1 === flags.enPassantSquare && // if a pawn exists on the side
        board[startPosition - 1].color !== self.color &&
        Math.floor(startPosition / 8) === 3 && // check if its in the corrent rank
        Math.floor((startPosition - 1) / 8) === 3 // check if the opponent's pawn is in current rank
      ) {
        moves.push({ to: startPosition - 9, enPassantKill: startPosition - 1 });
      }

      // right
      if (
        startPosition + 1 === flags.enPassantSquare &&
        board[startPosition + 1].color !== self.color &&
        Math.floor(startPosition / 8) === 3 &&
        Math.floor((startPosition + 1) / 8) === 3
      ) {
        moves.push({ to: startPosition - 7, enPassantKill: startPosition + 1 });
      }
    }
  } else {
    if (startPosition + 8 >= 63) {
      //   promotion
    }
    if (board[startPosition + 8] === null) moves.push(startPosition + 8);
    // if first move
    if (
      Math.floor(startPosition / 8) === 1 &&
      board[startPosition + 8] === null &&
      board[startPosition + 16] === null
    )
      moves.push({
        to: startPosition + 16,
        enPassantSquare: startPosition + 16,
      });

    // kills
    if (
      board[startPosition + 9] !== null &&
      board[startPosition + 9].color !== self.color &&
      Math.floor(startPosition / 8) + 1 === Math.floor((startPosition + 9) / 8)
    )
      moves.push(startPosition + 9);
    if (
      board[startPosition + 7] !== null &&
      board[startPosition + 7].color !== self.color &&
      Math.floor(startPosition / 8) + 1 === Math.floor((startPosition + 7) / 8)
    )
      moves.push(startPosition + 7);

    // en passant
    if (Math.floor(startPosition / 8) === 4) {
      // left
      if (
        startPosition - 1 === flags.enPassantSquare &&
        board[startPosition - 1].color !== self.color &&
        Math.floor(startPosition / 8) === 4 &&
        Math.floor((startPosition - 1) / 8) === 4
      ) {
        moves.push({ to: startPosition + 7, enPassantKill: startPosition - 1 });
      }

      if (
        startPosition + 1 === flags.enPassantSquare &&
        board[startPosition + 1].color !== self.color &&
        Math.floor(startPosition / 8) === 4 &&
        Math.floor((startPosition + 1) / 8) === 4
      ) {
        moves.push({ to: startPosition + 9, enPassantKill: startPosition + 1 });
      }
    }
  }
  return moves;
};

export const knightMoves = (startPosition, board) => {
  const moves = [];
  const self = board[startPosition];
  let values = [6, 10, 15, 17];
  for (let value of values) {
    // countiue statements if piece is too near to side of board so as to prevent invalid moves
    if (startPosition % 8 === 1 && value === 6) continue;
    if (startPosition % 8 === 0 && (value === 6 || value === 15)) continue;
    if (startPosition % 8 === 6 && value === 10) continue;
    if (startPosition % 8 === 7 && (value === 10 || value === 17)) continue;
    if (startPosition + value <= 63) {
      if (board[startPosition + value] === null) {
        moves.push(startPosition + value);
        continue;
      } else {
        if (board[startPosition + value].color !== self.color)
          moves.push(startPosition + value);
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
      if (board[startPosition - value] === null) {
        moves.push(startPosition - value);
        continue;
      } else {
        if (board[startPosition - value].color !== self.color)
          moves.push(startPosition - value);
        continue;
      }
    }
  }
  return moves;
};

export const kingMoves = (startPosition, restrictions) => {
  let validMoves = {
    moves: [],
    kills: [],
    castling: {},
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

  if (!restrictions?.castling?.[self.color].canCastle) return validMoves;

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
      if (!restrictions?.castling?.[self.color]?.right) continue out;
      for (let i = position - 1; i > startPosition; i--) {
        if (board[i] !== 0) continue out; // continue outer loop
      }
      validMoves.moves.push(startPosition + 2);
      validMoves.castling[startPosition + 2] = {
        side: "right",
        rook: position,
      };
    }

    if (position === 0 || position === 56) {
      // rooks on the left side of board
      if (!restrictions?.castling?.[self.color]?.left) continue out;
      for (let i = position + 1; i < startPosition; i++) {
        if (board[i] !== 0) continue out; // continue outer loop
      }
      validMoves.moves.push(startPosition - 2);
      validMoves.castling[startPosition - 2] = {
        side: "left",
        rook: position,
      };
    }
  }

  return validMoves;
};
