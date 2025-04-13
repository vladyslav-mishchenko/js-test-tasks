import { el, els, ev, rev } from './dom.js';

/*
html for each letter in editing mode
*/
export function htmlElement(inner) {
  const span = document.createElement('span');
  span.setAttribute('class', 'e');
  span.innerText = inner;
  return span;
}

/*
html for selected element
*/
export function htmlElementSelected() {
  const span = document.createElement('span');
  span.setAttribute('class', 'selected');
  return span;
}

/*
html for moveable element with selected text
*/
export function htmlMobileSelected(toClone) {
  // clone from .selected element
  const mobile = toClone.cloneNode(true);

  mobile.classList.remove('selected');
  mobile.classList.add('mobile');

  const close = document.createElement('span');
  close.setAttribute('class', 'close');

  const line1 = document.createElement('span');
  const line2 = document.createElement('span');
  line1.setAttribute('class', 'line line-1');
  line2.setAttribute('class', 'line line-2');

  close.appendChild(line1);
  close.appendChild(line2);

  mobile.appendChild(close);

  const marker = document.createElement('span');
  marker.setAttribute('class', 'marker');

  mobile.appendChild(marker);

  return mobile;
}

/*
html for inseted element
*/
export function htmlInsertedElement(inner) {
  const inserted = document.createElement('span');
  inserted.setAttribute('class', 'inserted');
  inserted.innerHTML = inner.innerText;

  return inserted;
}
