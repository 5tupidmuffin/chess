const piecesValue = {
  k: 5000,
  q: 2000,
  r: 800,
  b: 600,
  n: 500,
  p: 200,
};

/* 
    quicksort but for moves
    algo based on psuedocode from https://en.wikipedia.org/wiki/Quicksort
*/
const moveSort = (moves: Moves, low: number, high: number): void => {
  if (low >= high || low < 0) return;
  const p = partition(moves, low, high);

  moveSort(moves, low, p - 1);
  moveSort(moves, p + 1, high);
};

const partition = (moves: Moves, low: number, high: number): number => {
  let i = low - 1;

  for (let j = low; j < high; j++) {
    // a kill from low value piece to high value piece || a kill exists
    if (
      (moves[j]?.kill &&
        piecesValue[moves[j].piece.piece] <=
          piecesValue[moves[j].kill.piece]) ||
      moves[j]?.kill
    ) {
      i += 1;
      swap(moves, i, j);
    }
  }

  i += 1;
  swap(moves, i, high);
  return i;
};

const swap = (array: Moves, idx1: number, idx2: number): void => {
  let temp = array[idx1];
  array[idx1] = array[idx2];
  array[idx2] = temp;
};

export default moveSort;
