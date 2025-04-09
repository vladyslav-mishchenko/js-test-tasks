import { el, els, ev, rev } from './dom.js';

const sourcetext = el('#sourcetext');
const targettext = el('#targettext');
const enterbtn = el('#enterbtn');

let sourceTextDefault = '';
let coordinates = null;

// element:event:function
ev(enterbtn, 'click', enterText);

function enterText() {
  targettext.innerHTML = sourcetext.value;
  sourceTextDefault = sourcetext.value;
  sourcetext.value = '';
  ev(targettext, 'selectstart', selectStart);
}

function selectStart() {
  ev(targettext, 'mouseup', textSelectionComplete);
}

function textSelectionComplete() {
  surroundSelectedText();
  targetTextToHTML();
  selectedMobileBlock();

  coordinates = buildCoordinates();

  rev(targettext, 'selectstart', selectStart);
  rev(targettext, 'mouseup', textSelectionComplete);
}

function surroundSelectedText() {
  const selection = window.getSelection();

  if (!selection.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);

  const span = document.createElement('span');
  span.setAttribute('class', 'selected');

  range.surroundContents(span);
}

function elementHTML(string) {
  const str = string.textContent;

  const elements = [];

  for (let i = 0; i < str.length; i++) {
    const span = document.createElement('span');
    span.setAttribute('class', 'e');
    span.innerText = str[i];

    elements.push(span);
  }

  return elements;
}

function targetTextToHTML() {
  const nodes = targettext.childNodes;
  const nodesArray = [];

  for (let i = 0; i < nodes.length; i++) {
    // 1:element node type
    if (nodes[i].nodeType == 1) {
      nodesArray.push(nodes[i]);
    }

    // 3:text node type
    if (nodes[i].nodeType == 3) {
      const elements = elementHTML(nodes[i]);
      for (let i = 0; i < elements.length; i++) {
        nodesArray.push(elements[i]);
      }
    }
  }

  targettext.innerHTML = '';

  for (let i = 0; i < nodesArray.length; i++) {
    targettext.appendChild(nodesArray[i]);
  }
}

function selectedMobileBlock() {
  const selected = el('#targettext > .selected');

  const mobile = selected.cloneNode(true);
  mobile.classList.remove('selected');
  mobile.classList.add('mobile');

  const close = document.createElement('span');
  close.setAttribute('class', 'close');

  // close selections and go back to default source text
  ev(close, 'mouseup', toDefaultText);
  ev(close, 'mousedown', (e) => {
    e.stopPropagation();
  });

  // move selected element
  ev(mobile, 'mousedown', moveSelected);

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

  const parentTop = targettext.getBoundingClientRect().top;
  const parentLeft = targettext.getBoundingClientRect().left;

  mobile.style.top = selected.getBoundingClientRect().top - parentTop + 'px';
  mobile.style.left = selected.getBoundingClientRect().left - parentLeft + 'px';

  targettext.appendChild(mobile);
}

function toDefaultText(e) {
  e.stopPropagation();
  targettext.innerHTML = sourceTextDefault;
  ev(targettext, 'selectstart', selectStart);
}

function moveSelected(e) {
  const mobile = el('.mobile');
  let target = null;

  let shiftX = e.clientX - mobile.getBoundingClientRect().left;
  let shiftY = e.clientY - mobile.getBoundingClientRect().top;

  const parentTop = targettext.getBoundingClientRect().top;
  const parentLeft = targettext.getBoundingClientRect().left;

  ev(document, 'mousemove', move);
  ev(mobile, 'mouseup', actionAfterMove);

  function move(e) {
    // moving(e.pageX, e.pageY);
    moving(e.clientX, e.clientY);
  }

  function moving(x, y) {
    let coordinateX = x - parentLeft - shiftX;
    let coordinateY = y - parentTop - shiftY;

    mobile.style.top = coordinateY + 'px';
    mobile.style.left = coordinateX + 'px';

    target = lookingForTarget(coordinateX, coordinateY, coordinates);
  }

  function actionAfterMove() {
    rev(document, 'mousemove', move);

    if (typeof target !== 'undefined') {
      const selected = el('#targettext > .selected');

      if (selected.innerText.length > 1) {
        insertBeforeTargetPosition();
      } else {
        changePositionsElements();
      }
    }
  }

  function insertBeforeTargetPosition() {
    const selected = el('#targettext > .selected');
    const targetText = el('#targettext');
    const targetTextElements = els('#targettext > span');

    const targetElement = targetTextElements[target];

    const inserted = document.createElement('span');
    inserted.setAttribute('class', 'inserted');
    inserted.innerHTML = selected.innerText;

    targetText.insertBefore(inserted, targetElement);

    el('#targettext > .mobile').remove();
    el('#targettext > .selected').remove();

    const modifiedText = targetText.innerText;

    el('#targettext').innerHTML = modifiedText;
    ev(targettext, 'selectstart', selectStart);
  }

  function changePositionsElements() {
    const selected = el('#targettext > .selected');
    const targetText = el('#targettext');
    const targetTextElements = els('#targettext > span');

    const targetElement = targetTextElements[target];

    const textSelectedElement = selected.innerText;
    const textTargetElement = targetElement.innerText;

    el('#targettext > .mobile').remove();
    el('#targettext > .selected').innerHTML = textTargetElement;
    el('#targettext > .target').innerHTML = textSelectedElement;

    const modifiedText = targetText.innerText;

    el('#targettext').innerHTML = modifiedText;
    ev(targettext, 'selectstart', selectStart);
  }
}

function buildCoordinates() {
  const elements = els('#targettext > span');
  const text = el('#targettext');

  let coordinatesArray = [];

  let top = '';
  let left = '';
  let offsetWidth = '';
  let offsetHeight = '';
  let cssclass = '';
  let item = '';

  const parentTop = text.getBoundingClientRect().top;
  const parentLeft = text.getBoundingClientRect().left;

  for (let i = 0; i < elements.length; i++) {
    top = elements[i].getBoundingClientRect().top - parentTop;
    left = elements[i].getBoundingClientRect().left - parentLeft;
    offsetWidth = elements[i].offsetWidth;
    offsetHeight = elements[i].offsetHeight;
    cssclass = elements[i].getAttribute('class');
    item = i;

    if (elements[i].classList == 'e') {
      const coordinate = {
        top: top,
        height: top + offsetHeight,
        left: left,
        width: left + offsetWidth,
        cssClass: cssclass,
        item: item,
      };
      coordinatesArray.push(coordinate);
    }
  }

  return coordinatesArray;
}

function lookingForTarget(x, y, coordinatesArray) {
  let targetItem = null;
  for (let i = 0; i < coordinatesArray.length; i++) {
    if (
      y >= coordinatesArray[i].top &&
      y <= coordinatesArray[i].height &&
      x >= coordinatesArray[i].left &&
      x <= coordinatesArray[i].width
    ) {
      targetItem = coordinatesArray[i].item;
      hoverTarget(targetItem);
      return targetItem;
    }
  }
}

function hoverTarget(target) {
  const elements = els('#targettext > span');
  const selected = el('#targettext > .selected');

  // different target hovering
  if(selected.innerText.length > 1){
    elements[target].classList.add('target', 'letters');
  }else{
    elements[target].classList.add('target', 'letter');
  }

  for (let i = 0; i < elements.length; i++) {
    if (target != i) {
      elements[i].classList.remove('target', 'letter', 'letters');
    }
  }
}
