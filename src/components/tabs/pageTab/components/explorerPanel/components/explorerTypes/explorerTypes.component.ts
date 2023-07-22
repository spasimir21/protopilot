import { PageTabState, getPageTabState } from '../../../../PageTabState';
import { Item, ItemType, TypeItem, createItem } from '../../../../Item';
import { DataTypeEnum } from '../../../../../../editorInput/DataType';
import { PageData, getPageData } from '../../../../PageData';
import defineComponent from './explorerTypes.view.html';
import { Controller, Inject } from '@uixjs/core';

class ExplorerTypesController extends Controller {
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
      ...createItem(ItemType.Type, 'Type'),
      dataType: { type: DataTypeEnum.String }
    } as any);
  }
}

const explorerTypesComponent = defineComponent({
  name: 'explorer-types',
  controller: ExplorerTypesController
});

export default explorerTypesComponent;
export { explorerTypesComponent };
