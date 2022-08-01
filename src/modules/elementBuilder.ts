/* eslint-disable object-curly-newline */
function newElement({ element = '', className = '', elementID = '', text = '', href = '', src = '', alt = '' }) {
  const DOMelement: HTMLElement = document.createElement(element);
  if (className) DOMelement.className = className;
  if (elementID) DOMelement.id = elementID;
  if (text) DOMelement.textContent = text;
  if (element === 'a' && href) DOMelement.setAttribute('href', href);
  if (element === 'img' && src) DOMelement.setAttribute('src', src);
  if (element === 'img' && alt) DOMelement.setAttribute('alt', alt);
  return DOMelement;
}
function sendToBody(HTML: HTMLElement) {
  return document.body.appendChild(HTML);
}
function removeAllChildNodes(parent: HTMLElement) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
function moduleRender(obj: object, parentNode: HTMLElement) {
  removeAllChildNodes(parentNode);
  Object.keys(obj).forEach((x) => parentNode.appendChild(obj[x]));
}
const closeWindow = (element: HTMLElement) => {
  document.body.removeChild(element);
};
export { newElement, sendToBody, removeAllChildNodes, moduleRender, closeWindow };
