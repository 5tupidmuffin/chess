interface Window {
  enableDebugTools?: () => boolean;
  disableDebugTools?: () => boolean;
  printBoard?: () => void;
  fenToBoard?: (fen: string) => void;
  memoryRep?: any;
  displayRep?: any;
}

declare type PieceTypes = "k" | "q" | "r" | "b" | "n" | "p";

declare type pieceColors = "w" | "b";

declare interface Piece {
  piece: PieceTypes;
  color: pieceColors;
}

declare interface Kings {
  white: number;
  black: number;
}

declare interface Flags {
  enPassantSquare: number | null;
  restrictions: {
    castling: {
      whiteKingSide: boolean;
      whiteQueenSide: boolean;
      blackKingSide: boolean;
      blackQueenSide: boolean;
    };
  };
}

declare interface Move {
  piece: Piece;
  from: number;
  to: number;
  flags: Flags;
  kill?: Piece;
  promotion?: Piece;
  enPassantSquare?: number;
  enPassantKill?: number;
  whiteKingSide?: boolean;
  whiteQueenSide?: boolean;
  blackKingSide?: boolean;
  blackQueenSide?: boolean;
  castling?: {
    from: number;
    to: number;
  };
}

declare interface rawMove {
  [key: string]: any;
}

declare type Moves = Array<Move>;

declare type rawMoves = Array<rawMove>;

declare type MemoryBoard = Array<Piece>;
