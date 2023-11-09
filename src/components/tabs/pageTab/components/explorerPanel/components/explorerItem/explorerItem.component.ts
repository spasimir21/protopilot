import { PageTabState, getPageTabState } from '../../../../PageTabState';
import { measureText } from '../../../../../../../helpers/measureText';
import { ElementItem, Item, ItemType } from '../../../../Item';
import { PageData, getPageData } from '../../../../PageData';
import { Controller, Inject, Prop } from '@uixjs/core';
import defineComponent from './explorerItem.view.html';
import { Computed, State } from '@uixjs/reactivity';

function findParentItem(elementItem: ElementItem, itemId: string): ElementItem | null {
  for (const child of elementItem.children ?? []) {
    if (child.id === itemId) return elementItem;
    const foundItem = findParentItem(child, itemId);
    if (foundItem != null) return foundItem;
  }

  return null;
}

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

  @Inject(getPageData)
  pageData: PageData;

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

  shouldAllowDrop() {
    return this.item.type === ItemType.Element;
  }

  onDrop(itemId: string) {
    if (this.item.id === itemId) return;

    const parentItem = findParentItem(this.pageData.pageElement, itemId);
    if (parentItem == null) return;

    const parentChildren = parentItem.children ?? [];

    const index = parentChildren.findIndex(child => child.id === itemId);

    const item = parentChildren[index];
    if (findParentItem(item, this.item.id) != null) return;

    parentChildren.splice(index, 1);

    (this.item.children ?? []).unshift(item);
  }

  afterViewInit(): void {
    if (this.item.type === ItemType.Element) this.component.setAttribute('draggable', 'true');
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
