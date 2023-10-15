import { DataType, ObjectType } from '../../editorInput/DataType';
import { id } from '../../../helpers/id';

enum ItemType {
  Group,
  State,
  Type,
  Asset,
  Style,
  Function,
  Element
}

interface BaseItem {
  id: string;
  type: ItemType;
  name: string;
  children?: Item[];
}

enum ElementType {
  Page,
  Group,
  Link,
  Paragraph,
  Image,
  Input,
  Button,
  Each
}

interface ElementItem extends BaseItem {
  type: ItemType.Element;
  elementType: ElementType;
  modifiers: any[];
  styleReferences: string[];
  style: [string, string][];
  properties?: Record<string, any>;
  text: string;
  children?: ElementItem[];
  domElement: HTMLElement | null;
}

interface StateItem extends BaseItem {
  type: ItemType.State;
  dataType: DataType;
  value: any;
}

interface TypeItem extends BaseItem {
  type: ItemType.Type;
  dataType: DataType;
}

interface AssetItem extends BaseItem {
  type: ItemType.Asset;
  assetType: string;
  url: string;
}

interface StyleItem extends BaseItem {
  type: ItemType.Style;
  style: [string, string][];
}

interface FunctionItem extends BaseItem {
  type: ItemType.Function;
  argumentNames: string[];
  code: string;
}

interface GroupItem<T extends Item = Item> extends BaseItem {
  type: ItemType.Group;
  children: T[];
}

type Item = GroupItem | TypeItem | ElementItem | StateItem | AssetItem | StyleItem | FunctionItem;

function createItem(type: ItemType, name: string): BaseItem {
  const item: BaseItem = {
    id: id(),
    type,
    name
  };

  if (type === ItemType.Group) item.children = [];

  return item;
}

export {
  ItemType,
  Item,
  createItem,
  TypeItem,
  StateItem,
  GroupItem,
  AssetItem,
  StyleItem,
  ElementItem,
  ElementType,
  FunctionItem
};
