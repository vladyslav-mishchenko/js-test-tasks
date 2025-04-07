import { el, els, ev } from "./dom.js";

const sourcetext = el('#sourcetext');
const targettext = el('#targettext');
const enterbtn = el('#enterbtn');

// element:event:function
ev(enterbtn, 'click', enterText);

function enterText(){
    targettext.innerHTML = sourcetext.value;
    sourcetext.value = "";
}