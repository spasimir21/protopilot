import { PageTabState, getPageTabState } from '../../../../PageTabState';
import { measureText } from '../../../../../../../helpers/measureText';
import { Controller, Inject, Prop } from '@uixjs/core';
import defineComponent from './explorerItem.view.html';
import { Computed, State } from '@uixjs/reactivity';
import { Item } from '../../../../Item';

class ExplorerItemController extends Controller<{
  item: Item;
  parent: Item;
  onAddChild?: (item: Item, parent: Item) => void;
  onRemove?: (item: Item, parent: Item) => void;
  canBeSelected?: (item: Item, parent: Item) => boolean;
  canEditName?: (item: Item, parent: Item) => boolean;
  canHaveChildren?: (item: Item, parent: Item) => boolean;
}> {
  @Prop
  item: Item;
  @Prop
  parent: Item;

  @State
  areChildrenCollapsed: boolean = false;

  @Inject(getPageTabState)
  pageTabState: PageTabState;

  @Computed
  get itemNameWidth() {
    return measureText(this.item.name, 18) + 20;
  }

  @Computed
  get canEditName() {
    if (this.props.canEditName == null) return true;
    return this.props.canEditName(this.item, this.parent);
  }

  @Computed
  get canHaveChildren() {
    if (this.props.canHaveChildren == null) return true;
    return this.props.canHaveChildren(this.item, this.parent);
  }

  @Computed
  get canBeSelected() {
    if (this.props.canBeSelected == null) return true;
    return this.props.canBeSelected(this.item, this.parent);
  }

  select() {
    if (!this.canBeSelected) return;
    this.pageTabState.currentItem = this.item;
  }

  addChild() {
    if (this.props.onAddChild) this.props.onAddChild(this.item, this.parent);
  }

  removeSelf() {
    if (this.parent == null || this.parent.children == null) return;

    if (this.pageTabState.currentItem == this.item) this.pageTabState.currentItem = null;

    if (this.props.onRemove) this.props.onRemove(this.item, this.parent);

    const index = this.parent.children.indexOf(this.item as any);
    if (index != -1) this.parent.children.splice(index, 1);
  }
}

const explorerItemComponent = defineComponent({
  name: 'explorer-item',
  controller: ExplorerItemController
});

export default explorerItemComponent;
export { explorerItemComponent };
