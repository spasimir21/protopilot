import { GroupItem, ItemType, ElementItem, ElementType, createItem } from './Item';
import { createContextValue } from '@uixjs/core';
import { createElementItem } from './Element';

interface PageData {
  styles: GroupItem;
  assets: GroupItem;
  types: GroupItem;
  functions: GroupItem;
  states: GroupItem;
  pageElement: ElementItem;
}

const getDefaultPageData: (context: any) => PageData = context => {
  const data = {
    styles: createItem(ItemType.Group, 'Styles') as GroupItem,
    assets: createItem(ItemType.Group, 'Assets') as GroupItem,
    types: createItem(ItemType.Group, 'Types') as GroupItem,
    functions: createItem(ItemType.Group, 'Functions') as GroupItem,
    states: createItem(ItemType.Group, 'States') as GroupItem,
    pageElement: context == null ? (null as any) : createElementItem(ElementType.Page, context)
  };

  if (data.pageElement) {
    // @ts-ignore
    data.pageElement.properties.width = 412;
    // @ts-ignore
    data.pageElement.properties.height = 915;
  }

  return data;
};

const [providePageData, getPageData] = createContextValue<PageData>('pageData');

export { PageData, providePageData, getPageData, getDefaultPageData };
