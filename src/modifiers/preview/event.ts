import { ElementItem } from '../../components/tabs/pageTab/Item';
import { toCamelCase } from '../../helpers/naming';

function previewEvent(element: HTMLElement, _data: any, item: ElementItem, modifier: any, $: any) {
  const listener = () => $[toCamelCase(modifier.function)]();

  element.addEventListener(modifier.event, listener);

  return () => element.removeEventListener(modifier.event, listener);
}

export { previewEvent };
