import { ElementItem } from '../../components/tabs/pageTab/Item';
import { effect } from '@uixjs/reactivity';

function previewInput(element: HTMLElement, _data: any, item: ElementItem, modifier: any, $: any) {
  const oldValue = (element as any)[modifier.input];

  const setter = new Function('$', 'value', `${modifier.value} = value;`);
  const getter = new Function('$', `return ${modifier.value};`);

  const listener = () => setter($, (element as any)[modifier.input]);

  element.addEventListener('input', listener);

  const effectCleanup = effect(() => {
    try {
      (element as any)[modifier.input] = getter($);
    } catch (err) {}
  }).cleanup;

  return () => {
    effectCleanup();
    element.removeEventListener('input', listener);
    (element as any)[modifier.input] = oldValue;
  };
}

export { previewInput };
