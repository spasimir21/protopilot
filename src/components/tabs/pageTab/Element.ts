import { DataTypeEnum, ObjectType, createDynamicType, initializeData } from '../../editorInput/DataType';
import { ItemType, ElementItem, ElementType, createItem } from './Item';
import { FunctionEnumType } from './providers/FunctionProvider';
import { AssetEnumType } from './providers/AssetProvider';

interface ElementTypeInfo {
  type: ElementType;
  name: string;
  propertiesType?: ObjectType;
}

const ModifierType = createDynamicType({
  Event: [
    ['Event', { type: DataTypeEnum.String }],
    ['Function', FunctionEnumType]
  ],
  Input: [
    ['Input', { type: DataTypeEnum.String }],
    ['Value', { type: DataTypeEnum.String }]
  ],
  Style: [
    ['Property', { type: DataTypeEnum.String }],
    ['Value', { type: DataTypeEnum.String }]
  ]
});

const ElementTypeInfo: Record<ElementType, ElementTypeInfo> = {
  [ElementType.Page]: {
    type: ElementType.Page,
    name: 'Page',
    propertiesType: {
      type: DataTypeEnum.Object,
      types: [
        ['Width', { type: DataTypeEnum.Number }],
        ['Height', { type: DataTypeEnum.Number }],
        ['Background', AssetEnumType]
      ]
    }
  },
  [ElementType.Group]: {
    type: ElementType.Group,
    name: 'Group'
  },
  [ElementType.Paragraph]: {
    type: ElementType.Paragraph,
    name: 'Paragraph'
  },
  [ElementType.Link]: {
    type: ElementType.Link,
    name: 'Link',
    propertiesType: {
      type: DataTypeEnum.Object,
      types: [['Location', { type: DataTypeEnum.String }]]
    }
  },
  [ElementType.Image]: {
    type: ElementType.Image,
    name: 'Image',
    propertiesType: {
      type: DataTypeEnum.Object,
      types: [['Asset', AssetEnumType]]
    }
  },
  [ElementType.Input]: {
    type: ElementType.Input,
    name: 'Input',
    propertiesType: {
      type: DataTypeEnum.Object,
      types: [
        ['Type', { type: DataTypeEnum.String }],
        ['Placeholder', { type: DataTypeEnum.String }]
      ]
    }
  },
  [ElementType.Button]: {
    type: ElementType.Button,
    name: 'Button'
  },
  [ElementType.Each]: {
    type: ElementType.Each,
    name: 'Each',
    propertiesType: {
      type: DataTypeEnum.Object,
      types: [
        ['Preview Count', { type: DataTypeEnum.Number }],
        ['Item', { type: DataTypeEnum.String }],
        ['Array', { type: DataTypeEnum.String }]
      ]
    }
  }
};

function createElementItem(type: ElementType, context: any): ElementItem {
  const typeInfo = ElementTypeInfo[type];

  const element = {
    ...createItem(ItemType.Element, typeInfo.name),
    elementType: typeInfo.type,
    modifiers: [],
    styleReferences: [],
    style: [],
    text: '',
    domElement: null
  } as any;

  if (typeInfo.propertiesType) element.properties = initializeData(typeInfo.propertiesType, context);

  return element;
}

export { ElementTypeInfo, createElementItem, ModifierType };
