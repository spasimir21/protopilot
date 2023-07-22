import { PageTabState, getPageTabState } from '../../../../PageTabState';
import { Item, ItemType, createItem } from '../../../../Item';
import { PageData, getPageData } from '../../../../PageData';
import defineComponent from './explorerFunctions.view.html';
import { Controller, Inject } from '@uixjs/core';

class ExplorerFunctionsController extends Controller {
  @Inject(getPageData)
  pageData: PageData;

  @Inject(getPageTabState)
  pageTabState: PageTabState;

  init() {
    this.addChild = this.addChild.bind(this);
  }

  addChild(item: Item) {
    if (item.children == null) item.children = [];
    item.children.push({
      ...createItem(ItemType.Function, 'Function'),
      argumentNames: [],
      code: ''
    } as any);
  }
}

const explorerFunctionsComponent = defineComponent({
  name: 'explorer-functions',
  controller: ExplorerFunctionsController
});

export default explorerFunctionsComponent;
export { explorerFunctionsComponent };
