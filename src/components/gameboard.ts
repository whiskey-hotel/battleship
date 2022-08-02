import { newElement } from '../modules/elementBuilder';

export function gameboard() {
  const boardContatiner = newElement({
    element: 'div',
    elementID: 'boardContainer',
    className: 'd-flex justify-content-center',
  });

  const board = newElement({
    element: 'div',
    elementID: 'board',
    className: 'border border-dark',
    text: 'test 1',
  });

  boardContatiner.appendChild(board);

  return boardContatiner;
}

export function enemyGameboard() {
  const enemyBoardContainer = newElement({
    element: 'div',
    elementID: 'enemyBoardContainer',
    className: 'd-flex justify-content-center',
  });

  const enemyBoard = newElement({
    element: 'div',
    elementID: 'enemyBoard',
    className: 'border border-dark',
    text: 'test 2',
  });

  enemyBoardContainer.appendChild(enemyBoard);

  return enemyBoardContainer;
}
