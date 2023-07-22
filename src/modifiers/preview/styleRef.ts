import { ElementItem } from '../../components/tabs/pageTab/Item';
import { styleProperty } from '@uixjs/core';

function previewStyleRef(element: HTMLElement, _data: any, item: ElementItem, modifier: any, $: any) {
  const getter = new Function('$', `return ${modifier.value};`);
  const oldValue = (element as any).style[modifier.property];

  const styleCleanup = styleProperty(element, modifier.property, () => {
    try {
      return getter($);
    } catch (err) {
      return false;
    }
  });

  return () => {
    styleCleanup();
    (element as any).style[modifier.property] = oldValue;
  };
}

export { previewStyleRef };
