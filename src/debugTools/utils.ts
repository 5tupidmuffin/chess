export const showIndexOfPlace = (board: NodeList) => {
  board.forEach((box: HTMLElement, index) => {
    const el = <HTMLElement>document.createElement("p");
    el.classList.add("notation", "debugLabel");
    el.textContent = index.toString();
    box.onmouseover = () => {
      box.appendChild(el);
    };
    box.onmouseleave = () => {
      box.removeChild(el);
    };
  });
};
