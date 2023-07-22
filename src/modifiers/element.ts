import { effect } from '@uixjs/reactivity';

function element(placeholder: HTMLElement, _data: any, elementGetter: () => HTMLElement) {
  let currentMounted = placeholder;

  return effect(elementGetter, element => {
    currentMounted.replaceWith(element);
    currentMounted = element;
  }).cleanup;
}

export { element };
