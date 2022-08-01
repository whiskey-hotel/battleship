import 'bootstrap';
// import Player from './modules/player';
import * as elementBuilder from './modules/elementBuilder';
import header from './components/header';

const main: HTMLElement = elementBuilder.newElement({
  element: 'div',
  elementID: 'main',
});
const headerModel: HTMLElement = header();

const model = {
  headerModel,
};

elementBuilder.moduleRender(model, main);
elementBuilder.sendToBody(main);
