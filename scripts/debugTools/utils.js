export const showIndexOfPlace = (board) => {
  board.forEach((box, index) => {
    const el = document.createElement("p");
    el.textContent = index;
    box.onmouseover = () => {
      box.appendChild(el);
    };
    box.onmouseleave = () => {
      box.removeChild(el);
    };
  });
};
