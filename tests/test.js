// simple script to perform simple tests
import Chess from "../scripts/apis/chess";

let total = 0,
  passed = 0,
  failed = 0;

// test function
const PerformTest = (title, testFunc, expected) => {
  total++;
  try {
    let result = testFunc();
    for (let i = 0; i < expected.length; i++) {
      if (result[i] !== expected[i]) {
        console.log(
          `❌ ${title}: Failed - result:${result[i]}, expected:${expected[i]}`
        );
        failed++;
        return;
      }
    }
    passed++;
    console.log(`✅ ${title}: Passed`);
  } catch (e) {
    let msg = e.message;
    if (msg === expected) {
      console.log(`✅ ${title}: Passed`);
      passed++;
    } else {
      console.log(`❌ ${title}: Failed - result:${msg}, expected:${expected}`);
      failed++;
    }
  }
};

// https://www.chessprogramming.org/Perft_Results
export const moveGenerationTest = (depth, fen) => {
  const perftInstance = new Chess(fen);
  for (let i = 1; i <= depth; i++) {
    let start = Date.now();
    let possibleMoves = perftTest(i, perftInstance);
    let timeTaken = ((Date.now() - start) / 1000).toFixed(2);
    console.log(
      `depth: ${i} | possiblePositions: ${possibleMoves} | timeTaken: ${timeTaken}`
    );
  }
};

export const perftTest = (depth, chessInstance = new Chess(), flag = true) => {
  if (depth === 0) return 1;
  if (typeof chessInstance === "string")
    chessInstance = new Chess(chessInstance);
  let moves = chessInstance.generateMoves();
  let numberOfMoves = 0;

  for (let move of moves) {
    chessInstance.doThisMove(move);
    let pMoves = perftTest(depth - 1, chessInstance, false);
    if (flag) console.log(move.notation, pMoves);
    numberOfMoves += pMoves;
    chessInstance.undoLastMove();
  }

  return numberOfMoves;
};

const tests = () => {
  PerformTest(
    "BoardGeneration With Fen",
    () => {
      const t1 = new Chess(
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
      );
      return [t1.board[0].piece, t1.board[63].color, t1.flags.enPassantSquare];
    },
    ["r", "w", null]
  );

  PerformTest(
    "castling white king Check",
    () => {
      const t1 = new Chess(
        "rnbqkbnr/pppppppp/8/8/3PPPNB/8/PPPPP3/RNBQK2R w KQkq - 0 1"
      );
      t1.doThisMove({
        from: 60,
        to: 62,
        flags: t1.flags,
        castling: { from: 63, to: 61 },
        whiteKingSide: false,
        whiteQueenSide: false,
      });
      return [
        t1.board[62].piece,
        t1.board[61].piece,
        t1.flags.restrictions.castling.whiteKingSide,
        t1.flags.restrictions.castling.whiteQueenSide,
      ];
    },
    ["k", "r", false, false]
  );

  PerformTest(
    "castling white king Undo Check",
    () => {
      const t1 = new Chess(
        "rnbqkbnr/pppppppp/8/8/3PPPNB/8/PPPPP3/RNBQK2R w KQkq - 0 1"
      );
      t1.doThisMove({
        from: 60,
        to: 62,
        flags: t1.flags,
        castling: { from: 63, to: 61 },
      });
      t1.undoLastMove();
      return [
        t1.board[60].piece,
        t1.board[63].piece,
        t1.flags.restrictions.castling.whiteKingSide,
        t1.flags.restrictions.castling.whiteQueenSide,
      ];
    },
    ["k", "r", true, true]
  );

  PerformTest(
    "castling rook moved",
    () => {
      const t1 = new Chess(
        "rnbqkbnr/pppppppp/8/8/3PPPNB/8/PPPPP3/RNBQK2R w KQkq - 0 1"
      );
      t1.doThisMove({
        from: 63,
        to: 55,
        flags: t1.flags,
        piece: { color: "w", piece: "r" },
        whiteKingSide: false,
      });
      return [t1.board[55].piece, t1.flags.restrictions.castling.whiteKingSide];
    },
    ["r", false]
  );

  PerformTest(
    "castling rook moved undo",
    () => {
      const t1 = new Chess(
        "rnbqkbnr/pppppppp/8/8/3PPPNB/8/PPPPP3/RNBQK2R w KQkq - 0 1"
      );
      t1.doThisMove({
        from: 63,
        to: 55,
        flags: t1.flags,
        piece: { color: "w", piece: "r" },
        whiteKingSide: false,
      });
      t1.undoLastMove();
      return [t1.board[63].piece, t1.flags.restrictions.castling.whiteKingSide];
    },
    ["r", true]
  );

  PerformTest(
    "white king not in check",
    () => {
      const t1 = new Chess(
        "rnb1kbnr/pppppppp/8/8/8/7q/PPPPP3/RNBQK2R w KQkq - 0 1"
      );
      return [t1.isInCheck("w")];
    },
    [false]
  );

  PerformTest(
    "white king in check",
    () => {
      const t1 = new Chess(
        "rnb1kbnr/pppppppp/8/8/7q/8/PPPPP3/RNBQK2R w KQkq - 0 1"
      );
      return [t1.isInCheck("w")];
    },
    [true]
  );

  PerformTest(
    "enPassant Kills",
    () => {
      const t1 = new Chess(
        "rnb1kbnr/ppp1pppp/8/3pP3/8/7q/PPPP4/RNBQK2R w KQkq 27 0 1"
      );
      t1.doThisMove({
        from: 28,
        to: 19,
        flags: t1.flags,
        piece: { color: "w", piece: "p" },
        enPassantKill: 27,
      });
      return [t1.board[19].piece, t1.board[27], t1.flags.enPassantSquare];
    },
    ["p", null, null]
  );

  PerformTest(
    "enPassant Kills Undo",
    () => {
      const t1 = new Chess(
        "rnb1kbnr/ppp1pppp/8/3pP3/8/7q/PPPP4/RNBQK2R w KQkq 27 0 1"
      );
      t1.doThisMove({
        from: 28,
        to: 19,
        flags: t1.flags,
        piece: { color: "w", piece: "p" },
        enPassantKill: 27,
      });
      t1.undoLastMove();
      return [t1.board[28].piece, t1.board[27].piece, t1.flags.enPassantSquare];
    },
    ["p", "p", 27]
  );

  PerformTest(
    "No of Possible Moves at initial Position",
    () => {
      const t1 = new Chess(
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
      );
      return [t1.generateMoves().length];
    },
    [20]
  );

  PerformTest(
    "King in check Possible Moves Count",
    () => {
      const t1 = new Chess(
        "rnb1kbnr/ppp1pppp/8/3pP3/7q/4Q3/PPPP4/RNB1K2R w KQkq - 0 1"
      );
      return [t1.generateMoves().length];
    },
    [6]
  );

  PerformTest(
    "White king in staleMate",
    () => {
      const t1 = new Chess("8/8/2q5/3r4/4K3/5r2/6q1/8 w KQkq - 0 1");
      return [t1.isStaleMate("w"), t1.isCheckMate("w")];
    },
    [true, false]
  );

  PerformTest(
    "White king in CheckMate",
    () => {
      const t1 = new Chess("8/8/2q3b1/3r4/4K3/5r2/6q1/8 w KQkq - 0 1");
      return [t1.isStaleMate("w"), t1.isCheckMate("w")];
    },
    [false, true]
  );

  let start = Date.now();
  console.log(perftTest(5));
  console.log(
    `time taken for calculation: ${((Date.now() - start) / 1000).toFixed(
      2
    )} seconds`
  );

  console.log(`
    Total Tests Performed - ${total}
    Failed Tests          - ${failed}
    Passed Tests          - ${passed}  
  `);
};

tests();
