export const fenToBoard = (fenString) => {
  const pieceTable = {
    // white pieces
    K: 20,
    Q: 29,
    B: 24,
    N: 23,
    R: 25,
    P: 21,
    // black pieces
    k: 10,
    q: 19,
    b: 14,
    n: 13,
    r: 15,
    p: 11,
  };

  let stringCursor = 0,
    boardCursor = 0,
    board = [];

  while (stringCursor < fenString.length && boardCursor < 64) {
    let currentLetter = fenString[stringCursor];
    if (isNaN(Number(currentLetter)) && currentLetter !== "/") {
      board[boardCursor] = pieceTable[currentLetter];
      stringCursor++;
      boardCursor++;
      continue;
    }
    if (!isNaN(Number(currentLetter))) {
      stringCursor++;
      for (let i = 0; i < currentLetter; i++) {
        board[boardCursor] = 0;
        boardCursor++;
      }
      continue;
    }
    stringCursor++;
  }

  return board;
};
