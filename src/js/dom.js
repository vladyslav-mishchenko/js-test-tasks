export function el(el) {
    return document.querySelector(el);
}

export function els(elements) {
    return document.querySelectorAll(elements);
}

export function ev(element, event, fn) {
    if (element != null) {
        element.addEventListener(event, fn);
    }
}