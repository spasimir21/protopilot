import { effect, reactive } from '@uixjs/reactivity';
import { scope } from '@uixjs/core';

// TODO: Cleanup
function createRunningContextRef(data: any, object: any) {
  const upperRunningContext = data.runningContext;
  const runningContext = reactive({ $: null });

  effect(
    () => upperRunningContext.$,
    upper$ => {
      if (upper$ == null) {
        runningContext.$ = null;
        return;
      }

      runningContext.$ = scope(object, upper$);
    }
  );

  return runningContext;
}

export { createRunningContextRef };
