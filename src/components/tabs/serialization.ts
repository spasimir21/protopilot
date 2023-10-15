import { DataType, DataTypeEnum } from '../editorInput/DataType';
import { loadAsset } from './pageTab/providers/AssetProvider';
import { PageData } from './pageTab/PageData';
import { reactive } from '@uixjs/reactivity';
import { id } from '../../helpers/id';
import {
  AssetItem,
  ElementItem,
  FunctionItem,
  GroupItem,
  ItemType,
  StateItem,
  StyleItem,
  TypeItem
} from './pageTab/Item';
import { Project } from '../root/project';

function unwrap(object: any) {
  return JSON.parse(JSON.stringify(object));
}

function serializeStyle(style: StyleItem) {
  return [style.id, style.name, unwrap(style.style)];
}

function deserializeStyle(style: any): StyleItem {
  return {
    type: ItemType.Style,
    id: style[0],
    name: style[1],
    style: style[2]
  };
}

function serializeAsset(asset: AssetItem) {
  return [asset.id, asset.name, asset.assetType];
}

function deserializeAsset(asset: any, project: Project, loadAssets: boolean): AssetItem {
  const assetItem: AssetItem = reactive({
    type: ItemType.Asset,
    id: asset[0],
    name: asset[1],
    assetType: asset[2],
    url: ''
  });

  if (loadAssets) loadAsset(project.file(`./assets/${assetItem.id}`), assetItem);

  return assetItem;
}

function serializeDataType(type: DataType): any {
  switch (type.type) {
    case DataTypeEnum.Array:
      return [type.type, serializeDataType(type.valueType)];
    case DataTypeEnum.Dictionary:
      return [type.type, serializeDataType(type.valueType)];
    case DataTypeEnum.Enum:
      return [type.type, unwrap(type.values)];
    case DataTypeEnum.Object:
      return [type.type, type.types.map(([key, type]) => [key, serializeDataType(type)])];
    case DataTypeEnum._Reference:
      return [type.type, type.referenceName];
    default:
      return [type.type];
  }
}

function deserializeDataType(type: any): DataType {
  switch (type[0]) {
    case DataTypeEnum.Array:
      return { type: type[0], valueType: deserializeDataType(type[1]) };
    case DataTypeEnum.Dictionary:
      return { type: type[0], valueType: deserializeDataType(type[1]) };
    case DataTypeEnum.Enum:
      return { type: type[0], values: type[1] };
    case DataTypeEnum.Object:
      return { type: type[0], types: type[1].map(([key, type]: [string, any]) => [key, deserializeDataType(type)]) };
    case DataTypeEnum._Reference:
      return { type: type[0], referenceName: type[1] };
    default:
      return { type: type[0] };
  }
}

function serializeType(type: TypeItem) {
  return [type.id, type.name, serializeDataType(type.dataType)];
}

function deserializeType(type: any): TypeItem {
  return {
    type: ItemType.Type,
    id: type[0],
    name: type[1],
    dataType: deserializeDataType(type[2])
  };
}

function serializeFunction(func: FunctionItem) {
  return [func.id, func.name, unwrap(func.argumentNames), func.code];
}

function deserializeFunction(func: any): FunctionItem {
  return {
    type: ItemType.Function,
    id: func[0],
    name: func[1],
    argumentNames: func[2],
    code: func[3]
  };
}

function serializeState(state: StateItem) {
  return [state.id, state.name, serializeDataType(state.dataType), unwrap(state.value)];
}

function deserializeState(state: any): StateItem {
  return {
    type: ItemType.State,
    id: state[0],
    name: state[1],
    dataType: deserializeDataType(state[2]),
    value: state[3]
  };
}

function serializeModifier(modifier: any) {
  switch (modifier.type) {
    case 'Event':
      return [modifier.type, modifier.event, modifier.function];
    case 'Input':
      return [modifier.type, modifier.input, modifier.value];
    case 'Style':
      return [modifier.type, modifier.property, modifier.value];
    default:
      return [modifier.type];
  }
}

function deserializeModifier(modifier: any) {
  switch (modifier[0]) {
    case 'Event':
      return { type: modifier[0], event: modifier[1], function: modifier[2] };
    case 'Input':
      return { type: modifier[0], input: modifier[1], value: modifier[2] };
    case 'Style':
      return { type: modifier[0], property: modifier[1], value: modifier[2] };
    default:
      return { type: modifier[0] };
  }
}

function serializeElement(element: ElementItem): any {
  return [
    element.id,
    element.name,
    element.elementType,
    element.modifiers.map(serializeModifier),
    unwrap(element.styleReferences),
    unwrap(element.style),
    unwrap(element.properties ?? {}),
    element.text,
    (element.children ?? []).map(serializeElement)
  ];
}

function deserializeElement(element: any): ElementItem {
  if (element == null) return null as any;
  return {
    type: ItemType.Element,
    id: element[0],
    name: element[1],
    elementType: element[2],
    modifiers: element[3].map(deserializeModifier),
    styleReferences: element[4],
    style: element[5],
    properties: element[6],
    text: element[7],
    children: element[8].map(deserializeElement),
    domElement: null
  };
}

function serializePageData(data: PageData) {
  return [
    (data.styles.children ?? []).map(serializeStyle as any),
    (data.assets.children ?? []).map(serializeAsset as any),
    (data.types.children ?? []).map(serializeType as any),
    (data.functions.children ?? []).map(serializeFunction as any),
    (data.states.children ?? []).map(serializeState as any),
    data.pageElement ? serializeElement(data.pageElement) : null
  ];
}

function createGroupItem(name: string, children: any[]): GroupItem {
  return {
    id: id(),
    type: ItemType.Group,
    name,
    children
  };
}

function deserializePageData(data: any, project: Project, loadAssets = true): PageData {
  return {
    styles: createGroupItem('Styles', data[0].map(deserializeStyle)),
    assets: createGroupItem(
      'Assets',
      data[1].map((asset: any) => deserializeAsset(asset, project, loadAssets))
    ),
    types: createGroupItem('Types', data[2].map(deserializeType)),
    functions: createGroupItem('Functions', data[3].map(deserializeFunction)),
    states: createGroupItem('States', data[4].map(deserializeState)),
    pageElement: deserializeElement(data[5])
  };
}

export { serializePageData, deserializePageData };
