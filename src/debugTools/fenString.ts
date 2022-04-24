export const fenToBoard = (fenString: string) => {
  const [
    positions,
    whosMoveNext,
    castlingRights,
    enPassant,
    halfMove,
    fullMove,
  ] = fenString.split(" ");

  const nextPlayer: pieceColors = whosMoveNext as pieceColors;

  if (fenString.split(" ").length !== 6) throw new Error("invalid fen string");

  const flags: Flags = {
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

  for (let char of castlingRights) {
    inner: switch (char) {
      case "-":
        break;
      case "K":
        flags.restrictions.castling.whiteKingSide = true;
        break inner;
      case "k":
        flags.restrictions.castling.blackKingSide = true;
        break inner;
      case "Q":
        flags.restrictions.castling.whiteQueenSide = true;
        break inner;
      case "q":
        flags.restrictions.castling.blackQueenSide = true;
        break inner;
      default:
        throw new Error("invalid character in castling rights");
    }
  }

  const chars = "abcdefgh";
  if (enPassant !== "-")
    flags.enPassantSquare =
      chars.indexOf(enPassant[0]) + 8 * (8 - Number(enPassant[1]));

  let stringCursor = 0,
    boardCursor = 0,
    board = new Array(64);

  while (stringCursor < positions.length && boardCursor < 64) {
    let currentLetter = positions[stringCursor] as string | number;
    if (isNaN(Number(currentLetter)) && currentLetter !== "/") {
      let color =
        positions[stringCursor].toUpperCase() === positions[stringCursor]
          ? "w"
          : "b";
      board[boardCursor] = {
        color,
        piece: positions[stringCursor].toLowerCase(),
      };
      stringCursor++;
      boardCursor++;
      continue;
    }
    if (!isNaN(Number(currentLetter))) {
      stringCursor++;
      for (let i = 0; i < currentLetter; i++) {
        board[boardCursor] = null;
        boardCursor++;
      }
      continue;
    }
    stringCursor++;
  }

  return {
    board,
    nextPlayer,
    flags,
    halfMove: Number(halfMove),
    fullMove: Number(fullMove),
  };
};
