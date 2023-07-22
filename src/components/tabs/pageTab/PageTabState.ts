import { createContextValue } from '@uixjs/core';
import { Item } from './Item';

interface PageTabState {
  usingCodeForStyles: boolean;
  currentItem: Item | null;
  hoveredItem: Item | null;
  runningContext: any;
}

const [providePageTabState, getPageTabState] = createContextValue<PageTabState>('pageTabState');

export { PageTabState, providePageTabState, getPageTabState };
