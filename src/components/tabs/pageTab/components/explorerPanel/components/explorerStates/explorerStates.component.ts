import { Item, ItemType, StateItem, createItem } from '../../../../Item';
import { PageTabState, getPageTabState } from '../../../../PageTabState';
import { DataTypeEnum } from '../../../../../../editorInput/DataType';
import { PageData, getPageData } from '../../../../PageData';
import defineComponent from './explorerStates.view.html';
import { Controller, Inject } from '@uixjs/core';

class ExplorerStatesController extends Controller {
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
      ...createItem(ItemType.State, 'State'),
      dataType: { type: DataTypeEnum.String },
      value: ''
    } as any);
  }
}

const explorerStatesComponent = defineComponent({
  name: 'explorer-states',
  controller: ExplorerStatesController
});

export default explorerStatesComponent;
export { explorerStatesComponent };
