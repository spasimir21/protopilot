import { effect } from '@uixjs/reactivity';

function bindInput<T>(
  element: HTMLInputElement,
  key: string,
  delayed: boolean,
  getter: () => T,
  setter: (value: T) => void
) {
  element.addEventListener(delayed ? 'change' : 'input', () => setter((element as any)[key]));

  return effect(() => {
    try {
      (element as any)[key] = getter();
    } catch (err) {}
  }).cleanup;
}

export { bindInput };
