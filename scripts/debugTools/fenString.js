export const fenToBoard = (fenString) => {
  let stringCursor = 0,
    boardCursor = 0,
    board = new Array(64);

  while (stringCursor < fenString.length && boardCursor < 64) {
    let currentLetter = fenString[stringCursor];
    if (isNaN(Number(currentLetter)) && currentLetter !== "/") {
      let color =
        fenString[stringCursor].toUpperCase() === fenString[stringCursor]
          ? "w"
          : "b";
      board[boardCursor] = {
        color,
        piece: fenString[stringCursor].toLowerCase(),
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

  return board;
};
