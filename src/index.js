import 'bootstrap';
// import Player from './modules/player';
import * as elementBuilder from './modules/elementBuilder';

const main = elementBuilder.newElement({
  element: 'div',
  elementID: 'main',
});

const table = elementBuilder.newElement({
  element: 'div',
  elementID: 'table',
  className: 'container',
});

const test = {
  table,
};

elementBuilder.moduleRender(test, main);

elementBuilder.sendToBody(main);
