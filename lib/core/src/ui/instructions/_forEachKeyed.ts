import { TrackStack, effect, reactive } from '@uixjs/reactivity';
import { View, ViewInstance, viewToElement } from '../view';
import { Fragment } from '../fragment/Fragment';
import { scope } from '../../scope';

type Key = any;

function _forEachKeyed(
  placeholder: HTMLElement,
  parentEls: Record<string, HTMLElement>,
  data: any,
  iteratorKey: string,
  getValues: () => any[],
  getKey: (item: any) => Key,
  entryView: View<any>,
  emptyView: View<any> | null
) {
  const viewInstances: Map<Key, ViewInstance<any>> = new Map();
  const viewElements: Map<Key, ChildNode> = new Map();
  let keys: Key[] = [];

  const emptyViewInstance = emptyView ? emptyView.instantiate(data, parentEls) : null;
  const fragment = new Fragment([]);

  const emptyViewElement = emptyViewInstance ? viewToElement(emptyViewInstance) : document.createComment('');

  let currentMounted = placeholder as ChildNode;
  currentMounted.replaceWith(document.createComment(''), currentMounted);

  const effectCleanup = effect(() => {
    const array = getValues();

    const newKeys = new Array<Key>(array.length);
    for (let i = 0; i < array.length; i++) newKeys[i] = getKey(array[i]);

    TrackStack.push();
    const keysToCleanup = new Set<Key>(viewInstances.keys());
    for (let i = 0; i < array.length; i++) {
      const key = newKeys[i];

      keysToCleanup.delete(key);
      if (viewInstances.has(key)) continue;

      const viewInstance = entryView.instantiate(
        scope(reactive({ [iteratorKey]: array[i], [iteratorKey + 'Key']: key }), data),
        parentEls
      );

      viewInstances.set(key, viewInstance);
      viewElements.set(key, viewToElement(viewInstance));
    }

    const tempSwapPlaceholders: Map<Key, Comment> = new Map();
    for (let i = 0; i < newKeys.length; i++) {
      const newKey = newKeys[i];
      const key = keys[i];

      if (key == null) {
        fragment.appendChild(viewElements.get(newKey) as any);
        continue;
      }

      if (newKey !== key) {
        tempSwapPlaceholders.set(newKey, document.createComment(''));
        (viewElements.get(newKey) as any).replaceWith(tempSwapPlaceholders.get(newKey));

        if (tempSwapPlaceholders.has(key)) (tempSwapPlaceholders.get(key) as any).replaceWith(viewElements.get(newKey));
        else (viewElements.get(key) as any).replaceWith(viewElements.get(newKey));
      }
    }

    for (const key of tempSwapPlaceholders.keys()) (tempSwapPlaceholders.get(key) as any).remove();

    for (const key of keysToCleanup) {
      (viewElements.get(key) as any).remove();
      (viewInstances.get(key) as any).cleanup();

      viewElements.delete(key);
      viewInstances.delete(key);
    }
    keys = newKeys;

    const newMounted = array.length === 0 ? emptyViewElement : fragment;
    currentMounted.replaceWith(newMounted);
    currentMounted = newMounted;
    TrackStack.pop();
  }).cleanup;

  return () => {
    effectCleanup();

    while (fragment.nodes.length > 0) fragment.removeChildAtIndex(0);
    for (const key of viewInstances.keys()) (viewInstances.get(key) as any).cleanup();
    if (emptyViewInstance) emptyViewInstance.cleanup();
  };
}

export { _forEachKeyed };
