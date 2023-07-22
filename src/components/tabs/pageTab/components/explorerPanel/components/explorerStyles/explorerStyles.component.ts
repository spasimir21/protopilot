import { PageTabState, getPageTabState } from '../../../../PageTabState';
import { Item, ItemType, createItem } from '../../../../Item';
import { PageData, getPageData } from '../../../../PageData';
import defineComponent from './explorerStyles.view.html';
import { Controller, Inject } from '@uixjs/core';

class ExplorerStylesController extends Controller {
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
      ...createItem(ItemType.Style, 'Style'),
      style: []
    } as any);
  }
}

const explorerStylesComponent = defineComponent({
  name: 'explorer-styles',
  controller: ExplorerStylesController
});

export default explorerStylesComponent;
export { explorerStylesComponent };
