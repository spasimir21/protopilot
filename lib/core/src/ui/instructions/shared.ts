import { UixComponent } from '../component/Component';
import { effect } from '@uixjs/reactivity';

function shared<T>(uixComponent: UixComponent, key: string, getter: () => T, setter: (value: T) => void) {
  const effectACleanup = effect(() => {
    try {
      uixComponent.shared[key] = getter();
    } catch (err) {}
  }).cleanup;

  const effectBCleanup = effect(() => {
    try {
      setter(uixComponent.shared[key]);
    } catch (err) {}
  }).cleanup;

  return () => {
    effectACleanup();
    effectBCleanup();
  };
}

export { shared };
