$IMPORT_TYPES$
import { createContextValue } from '@uixjs/core';

interface GlobalState {
$TYPES$
}

function createGlobalState(): GlobalState {
  return {
$VALUES$
  };
}

const [provideGlobalState, getGlobalState] = createContextValue<GlobalState>('globalState');

export { provideGlobalState, getGlobalState, createGlobalState, GlobalState };
