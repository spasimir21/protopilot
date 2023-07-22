import { PageTabState, getPageTabState } from '../../../../PageTabState';
import { Item, ItemType, createItem } from '../../../../Item';
import { PageData, getPageData } from '../../../../PageData';
import defineComponent from './explorerAssets.view.html';
import { Controller, Inject } from '@uixjs/core';

class ExplorerAssetsController extends Controller {
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
      ...createItem(ItemType.Asset, 'Asset'),
      assetType: '',
      url: ''
    } as any);
  }
}

const explorerAssetsComponent = defineComponent({
  name: 'explorer-assets',
  controller: ExplorerAssetsController
});

export default explorerAssetsComponent;
export { explorerAssetsComponent };
