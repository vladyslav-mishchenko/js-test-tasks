import { el, els, ev, rev } from './dom.js';

const sourcetext = el('#sourcetext');
const targettext = el('#targettext');
const enterbtn = el('#enterbtn');

let sourceTextDefault = "";

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
  appendHTMLChildesIntoTarget();
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

  let a = [];

  for (let i = 0; i < str.length; i++) {
    const span = document.createElement('span');
    span.setAttribute('class', 'e');
    span.innerText = str[i];

    a.push(span);
  }

  return a;
}

function targetTextToHTML() {
  const nodes = targettext.childNodes;
  let nodesArray = [];

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

function selectedMobileBlock(){
    const selected = el('#targettext > .selected');

    const mobile = selected.cloneNode(true);
    mobile.classList.remove('selected');
    mobile.classList.add('mobile');

    const close = document.createElement('span');
    close.setAttribute('class', 'close');

    // close selections and go back to default source text
    ev(close, 'mouseup', toDefaultText);
    ev(close, 'mousedown', (e) => {e.stopPropagation();});

    // move selected element
    ev(mobile, 'mousedown', moveSelected);
    ev(mobile, 'mouseup', actionAfterMove);

    const line1 = document.createElement('span');
    const line2 = document.createElement('span');
    line1.setAttribute('class', 'line line-1');
    line2.setAttribute('class', 'line line-2');

    close.appendChild(line1);
    close.appendChild(line2);

    mobile.appendChild(close);

    const parentTop = targettext.getBoundingClientRect().top;
    const parentLeft = targettext.getBoundingClientRect().left;

    mobile.style.top = (selected.getBoundingClientRect().top - parentTop) + 'px';
    mobile.style.left = (selected.getBoundingClientRect().left - parentLeft) + 'px';

    targettext.appendChild(mobile);
}

function appendHTMLChildesIntoTarget() {
  surroundSelectedText();
  targetTextToHTML();
  selectedMobileBlock();
}

function toDefaultText(e){
    e.stopImmediatePropagation();
    targettext.innerHTML = sourceTextDefault;
    ev(targettext, 'selectstart', selectStart);
}

function moveSelected(){
    console.log('move');
}

function actionAfterMove(){
    console.log('after move');
}
