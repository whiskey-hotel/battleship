import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
// import Player from './modules/player';
import * as elementBuilder from './modules/elementBuilder';
import header from './components/header';
import { gameboard, enemyGameboard } from './components/gameboard';

const main: HTMLElement = elementBuilder.newElement({
  element: 'div',
  elementID: 'main',
});
const headerModel: HTMLElement = header();
const boardModel: HTMLElement = gameboard();
const enemyBoardModel: HTMLElement = enemyGameboard();

const model = {
  headerModel,
  boardModel,
  enemyBoardModel,
};

elementBuilder.moduleRender(model, main);
elementBuilder.sendToBody(main);
