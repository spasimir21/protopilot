import { ElementItem } from '../components/tabs/pageTab/Item';
import { effect, state } from '@uixjs/reactivity';

function previewText(element: HTMLElement, _data: any, item: ElementItem) {
  const textGetter = state(null as (() => string) | null);
  const runningContext = _data.runningContext;

  const textNode = document.createTextNode('');

  element.replaceWith(textNode);

  const cleanup1 = effect(
    () => runningContext.$,
    $ => {
      if ($ == null) {
        textGetter.value = null;
        return;
      }

      const getInterpolatedText = new Function('$', `return \`${item.text}\`;`);

      textGetter.value = () => {
        try {
          return getInterpolatedText($);
        } catch (err) {
          return '';
        }
      };
    }
  ).cleanup;

  const cleanup2 = effect(() => {
    textNode.textContent = textGetter.value != null ? textGetter.value() : item.text;
  }).cleanup;

  return () => {
    cleanup1();
    cleanup2();
  };
}

export { previewText };
