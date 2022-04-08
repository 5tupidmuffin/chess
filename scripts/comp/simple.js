const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const doRandomMove = (moves) => {
  let moveIndex = getRandomInt(moves.length - 1);
  return moves[moveIndex];
};

export default doRandomMove;
