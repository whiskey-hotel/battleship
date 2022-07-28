/* eslint-disable object-curly-newline */
function newElement({
  element = '',
  className = '',
  elementID = '',
  text = '',
  href = '',
  src = '',
  alt = '',
}) {
  const DOMelement = document.createElement(element);
  if (className) DOMelement.classList = className;
  if (elementID) DOMelement.id = elementID;
  if (text) DOMelement.textContent = text;
  if (element === 'a' && href) DOMelement.href = href;
  if (element === 'img' && src) DOMelement.src = src;
  if (element === 'img' && alt) DOMelement.src = alt;

  return DOMelement;
}

function sendToBody(HTML) {
  return document.body.appendChild(HTML);
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function moduleRender(obj, parentNode) {
  removeAllChildNodes(parentNode);
  Object.keys(obj).forEach((x) => parentNode.appendChild(obj[x]));
}

const closeWindow = (element) => {
  document.body.removeChild(element);
};

export { newElement, sendToBody, removeAllChildNodes, moduleRender, closeWindow };
