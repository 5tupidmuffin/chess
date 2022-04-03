// for rook and queen
export const slidingMoves = (startPosition, board, flags) => {
  const moves = [];
  const self = board[startPosition];
  //horizontal moves
  for (let i = startPosition + 1; i % 8 !== 0; i++) {
    if (board[i] !== null || i > 63) {
      if (i > 63) break;
      if (board[i].color !== self.color) {
        moves.push({ to: i, flags });
      }
      break;
    }
    moves.push({ to: i, flags });
  }
  for (let i = startPosition - 1; i % 8 !== 7; i--) {
    if (board[i] !== null || i < 0) {
      if (i < 0) break;
      if (board[i].color !== self.color) {
        moves.push({ to: i, flags });
      }
      break;
    }
    moves.push({ to: i, flags });
  }

  //vertical moves
  for (let i = startPosition + 8; i <= 63; i += 8) {
    if (board[i] !== null) {
      if (board[i].color !== self.color) {
        moves.push({ to: i, flags });
      }
      break;
    }
    moves.push({ to: i, flags });
  }
  for (let i = startPosition - 8; i >= 0; i -= 8) {
    if (board[i] !== null) {
      if (board[i].color !== self.color) {
        moves.push({ to: i, flags });
      }
      break;
    }
    moves.push({ to: i, flags });
  }

  const rooksStart = [0, 7, 56, 63];
  if (self.piece == "r" && rooksStart.includes(startPosition)) {
    if ([0, 56].includes(startPosition)) {
      const label = self.color === "w" ? "whiteQueenSide" : "blackQueenSide";
      return moves.map((move) => ({ ...move, [label]: false }));
    }

    if ([7, 63].includes(startPosition)) {
      const label = self.color === "w" ? "whiteKingSide" : "blackKingSide";
      return moves.map((move) => ({ ...move, [label]: false }));
    }
  }

  return moves;
};

// bishop and queen
export const diagonalMoves = (startPosition, board, flags) => {
  const moves = [];
  const self = board[startPosition];
  //   upper moves
  for (let i = startPosition - 9; i >= 0; i -= 9) {
    if (board[i] !== null || i % 8 === 7) {
      if (board[i]?.color !== self.color && i % 8 !== 7) {
        moves.push({ to: i, flags });
      }
      break;
    }
    moves.push({ to: i, flags });
  }
  for (let i = startPosition - 7; i > 0; i -= 7) {
    if (board[i] !== null || i % 8 === 0) {
      if (board[i]?.color !== self.color && i % 8 !== 0) {
        moves.push({ to: i, flags });
      }
      break;
    }
    moves.push({ to: i, flags });
  }
  //   lower moves
  for (let i = startPosition + 9; i < 64; i += 9) {
    if (board[i] !== null || i % 8 === 0) {
      if (board[i]?.color !== self.color && i % 8 !== 0) {
        moves.push({ to: i, flags });
      }
      break;
    }
    moves.push({ to: i, flags });
  }
  for (let i = startPosition + 7; i < 64; i += 7) {
    if (board[i] !== null || i % 8 === 7) {
      if (board[i]?.color !== self.color && i % 8 !== 7) {
        moves.push({ to: i, flags });
      }
      break;
    }
    moves.push({ to: i, flags });
  }
  return moves;
};

export const pawnMoves = (startPosition, board, flags) => {
  /*
        TODO:
        _ implement en passant
        - implement promotion
    */

  const promotionPieces = ["q", "r", "b", "n"];
  const promotionMoves = (to) => {
    const promos = [];
    for (let piece of promotionPieces) {
      promos.push({
        to,
        flags,
        promotion: { piece, color: self.color },
      });
    }
    return promos;
  };

  const self = board[startPosition];
  let moves = [];
  if (self.color === "w") {
    if (startPosition - 8 < 8) {
      //   promotion
      moves = moves.concat(promotionMoves(startPosition - 8));
    }
    if (board[startPosition - 8] === null && !(startPosition - 8 < 8))
      moves.push({ to: startPosition - 8, flags });
    // if first move
    if (
      Math.floor(startPosition / 8) === 6 &&
      board[startPosition - 8] === null &&
      board[startPosition - 16] === null
    )
      moves.push({
        to: startPosition - 16,
        flags,
        enPassantSquare: startPosition - 16,
      });

    // kills
    if (
      board[startPosition - 9] !== null &&
      board[startPosition - 9]?.color !== self.color &&
      Math.floor(startPosition / 8) - 1 === Math.floor((startPosition - 9) / 8)
    ) {
      if (startPosition - 9 < 8) {
        moves.concat(promotionMoves(startPosition - 9));
      } else {
        moves.push({ to: startPosition - 9, flags });
      }
    }
    if (
      board[startPosition - 7] !== null &&
      board[startPosition - 7]?.color !== self.color &&
      Math.floor(startPosition / 8) - 1 === Math.floor((startPosition - 7) / 8)
    ) {
      if (startPosition - 7 < 8) {
        moves.concat(promotionMoves(startPosition - 7));
      } else {
        moves.push({ to: startPosition - 7, flags });
      }
    }

    // en passant
    if (Math.floor(startPosition / 8) === 3) {
      // left
      if (
        startPosition - 1 === flags.enPassantSquare && // if a pawn exists on the side
        board[startPosition - 1].color !== self.color &&
        Math.floor(startPosition / 8) === 3 && // check if its in the corrent rank
        Math.floor((startPosition - 1) / 8) === 3 // check if the opponent's pawn is in current rank
      ) {
        moves.push({
          to: startPosition - 9,
          flags,
          enPassantKill: startPosition - 1,
        });
      }

      // right
      if (
        startPosition + 1 === flags.enPassantSquare &&
        board[startPosition + 1].color !== self.color &&
        Math.floor(startPosition / 8) === 3 &&
        Math.floor((startPosition + 1) / 8) === 3
      ) {
        moves.push({
          to: startPosition - 7,
          flags,
          enPassantKill: startPosition + 1,
        });
      }
    }
  } else {
    if (startPosition + 8 >= 56) {
      //   promotion
      moves = moves.concat(promotionMoves(startPosition + 8));
    }
    if (board[startPosition + 8] === null && !(startPosition + 8 >= 56))
      moves.push({ to: startPosition + 8, flags });
    // if first move
    if (
      Math.floor(startPosition / 8) === 1 &&
      board[startPosition + 8] === null &&
      board[startPosition + 16] === null
    ) {
      moves.push({
        to: startPosition + 16,
        flags,
        enPassantSquare: startPosition + 16,
      });
    }

    // kills
    if (
      board[startPosition + 9] !== null &&
      board[startPosition + 9]?.color !== self.color &&
      Math.floor(startPosition / 8) + 1 === Math.floor((startPosition + 9) / 8)
    ) {
      if (startPosition + 9 >= 56) {
        moves.concat(promotionMoves(startPosition + 9));
      } else {
        moves.push({ to: startPosition + 9, flags });
      }
    }

    if (
      board[startPosition + 7] !== null &&
      board[startPosition + 7]?.color !== self.color &&
      Math.floor(startPosition / 8) + 1 === Math.floor((startPosition + 7) / 8)
    ) {
      if (startPosition + 7 >= 56) {
        moves.concat(promotionMoves(startPosition + 7));
      } else {
        moves.push({ to: startPosition + 7, flags });
      }
    }

    // en passant
    if (Math.floor(startPosition / 8) === 4) {
      // left
      if (
        startPosition - 1 === flags.enPassantSquare &&
        board[startPosition - 1]?.color !== self.color &&
        Math.floor(startPosition / 8) === 4 &&
        Math.floor((startPosition - 1) / 8) === 4
      ) {
        moves.push({
          to: startPosition + 7,
          flags,
          enPassantKill: startPosition - 1,
        });
      }

      if (
        startPosition + 1 === flags.enPassantSquare &&
        board[startPosition + 1]?.color !== self.color &&
        Math.floor(startPosition / 8) === 4 &&
        Math.floor((startPosition + 1) / 8) === 4
      ) {
        moves.push({
          to: startPosition + 9,
          flags,
          enPassantKill: startPosition + 1,
        });
      }
    }
  }
  return moves;
};

export const knightMoves = (startPosition, board, flags) => {
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
        moves.push({ to: startPosition + value, flags });
        continue;
      } else {
        if (board[startPosition + value].color !== self.color)
          moves.push({ to: startPosition + value, flags });
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
        moves.push({ to: startPosition - value, flags });
        continue;
      } else {
        if (board[startPosition - value].color !== self.color)
          moves.push({ to: startPosition - value, flags });
        continue;
      }
    }
  }
  return moves;
};

export const kingMoves = (startPosition, board, flags) => {
  const moves = [];

  const self = board[startPosition];
  let values = [1, -1, 8, -8, 7, -7, 9, -9];

  for (let value of values) {
    const position = startPosition + value;
    if (position <= 63 && position >= 0) {
      if (board[position] === 0) {
        const queenSide =
            self.color === "w" ? "whiteQueenSide" : "blackQueenSide",
          kingSide = self.color === "w" ? "whiteKingSide" : "blackKingSide";

        const newCastling = {
          [queenSide]: false,
          [kingSide]: false,
        };

        moves.push({
          to: position,
          flags,
          ...newCastling,
        });
        continue;
      }
      if (board[position]?.color !== self.color) {
        const queenSide =
            self.color === "w" ? "whiteQueenSide" : "blackQueenSide",
          kingSide = self.color === "w" ? "whiteKingSide" : "blackKingSide";

        const newCastling = {
          [queenSide]: false,
          [kingSide]: false,
        };

        moves.push({
          to: position,
          flags,
          ...newCastling,
        });
      }
    }
  }

  // check castling eligibility
  if (self.color === "w") {
    if (
      !flags.restrictions.castling.whiteKingSide &&
      !flags.restrictions.castling.whiteQueenSide
    )
      return moves;
  } else {
    if (
      !flags.restrictions.castling.blackKingSide &&
      !flags.restrictions.castling.blackQueenSide
    )
      return moves;
  }

  // castling
  let rooks = self.color === "w" ? [63, 56] : [0, 7];
  let kingAtStart =
    self.color === "w" ? startPosition === 60 : startPosition === 4;
  out: for (let position of rooks) {
    if (!kingAtStart) break; // if king isnt on the start position no castling
    if (
      board[position] === null ||
      (board[position]?.type?.toLowerCase() !== "r" &&
        board[position]?.color !== self.color)
    )
      continue;

    // can the rooks reach king
    if (position === 63 || position === 7) {
      // rooks on the right side of board
      if (self.color === "w") {
        if (!flags.restrictions.castling.whiteKingSide) continue out;
      } else {
        if (!flags.restrictions.castling.blackKingSide) continue out;
      }
      for (let i = position - 1; i > startPosition; i--) {
        if (board[i] !== null) continue out; // continue outer loop
      }

      const label = position === 63 ? "whiteKingSide" : "blackKingSide";

      const newCastling = {
        ...flags.restrictions.castling,
        [label]: false,
      };

      moves.push({
        from: startPosition,
        to: startPosition + 2,
        castling: { from: position, to: startPosition + 1 },
        flags: { ...flags, restrictions: newCastling },
      });
    }

    if (position === 0 || position === 56) {
      // rooks on the left side of board
      if (self.color === "w") {
        if (!flags.restrictions.castling.whiteQueenSide) continue out;
      } else {
        if (!flags.restrictions.castling.blackQueenSide) continue out;
      }
      for (let i = position + 1; i < startPosition; i++) {
        if (board[i] !== null) continue out; // continue outer loop
      }

      const label = position === 56 ? "whiteQueenSide" : "blackQueenSide";

      const newCastling = {
        ...flags.restrictions.castling,
        [label]: false,
      };

      moves.push({
        from: startPosition,
        to: startPosition - 2,
        castling: { from: position, to: startPosition - 1 },
        flags: { ...flags, restrictions: newCastling },
      });
    }
  }
  return moves;
};
