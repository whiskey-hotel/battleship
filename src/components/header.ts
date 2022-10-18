import { newElement } from '../modules/elementBuilder';

export default function header(): HTMLElement {
  const headerContainer: HTMLElement = newElement({
    element: 'header',
    className: 'test test2',
    elementID: 'headerContainer',
  });

  const headerText: HTMLElement = newElement({
    element: 'h1',
    className: 'header',
    elementID: 'header',
    text: 'Battleship!!',
  });

  headerContainer.appendChild(headerText);

  return headerContainer;
}
