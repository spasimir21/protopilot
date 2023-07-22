import { ElementItem } from '../components/tabs/pageTab/Item';
import { previewStyleRef } from './preview/styleRef';
import { previewStyle } from './preview/style';
import { previewEvent } from './preview/event';
import { previewInput } from './preview/input';
import { effect } from '@uixjs/reactivity';

const MODIFIER_FUNCTIONS: Record<
  string,
  (element: HTMLElement, _data: any, item: ElementItem, modifier: any, $: any) => (() => void) | void
> = {
  Event: previewEvent,
  Input: previewInput,
  Style: previewStyleRef
};

function previewElement(element: HTMLElement, _data: any, item: ElementItem) {
  let modifierCleanups: ((() => void) | void)[] = [];
  const runningContext = _data.runningContext;

  item.domElement = element;

  const styleCleanup = previewStyle(element, _data, item);

  const effectCleanup = effect(
    () => runningContext.$,
    $ => {
      if ($ == null) {
        for (const cleanup of modifierCleanups) if (cleanup) cleanup();
        modifierCleanups = [];

        return;
      }

      modifierCleanups = item.modifiers.map(modifier =>
        MODIFIER_FUNCTIONS[modifier.type](element, _data, item, modifier, $)
      );
    }
  ).cleanup;

  return () => {
    effectCleanup();
    for (const cleanup of modifierCleanups) if (cleanup) cleanup();
    styleCleanup();
    item.domElement = null;
  };
}

export { previewElement };
