import { getTypeProvider } from '../tabs/pageTab/providers/TypeProvider';
import { toCamelCase } from '../../helpers/naming';
import { DataTypeEnum } from './DataTypeEnum';

interface PrimitiveType {
  type: DataTypeEnum.String | DataTypeEnum.Number | DataTypeEnum.Boolean | DataTypeEnum._Type;
}

interface EnumType {
  type: DataTypeEnum.Enum;
  values?: string[];
  getValues?: (context: any) => string[];
}

interface ArrayType {
  type: DataTypeEnum.Array;
  valueType: DataType;
}

interface DictionaryType {
  type: DataTypeEnum.Dictionary;
  valueType: DataType;
}

interface ObjectType {
  type: DataTypeEnum.Object;
  types: [string, DataType][];
}

interface ReferenceType {
  type: DataTypeEnum._Reference;
  referenceName: string;
}

interface DynamicType {
  type: DataTypeEnum._Dynamic;
  typeEnumType: EnumType;
  types: Record<string, ObjectType>;
}

function createDynamicType(properties: Record<string, [string, DataType][]>): DynamicType {
  const typeEnumType: EnumType = {
    type: DataTypeEnum.Enum,
    values: Object.keys(properties)
  };

  const types: Record<string, ObjectType> = {};

  for (const key in properties) {
    types[key] = {
      type: DataTypeEnum.Object,
      types: [['Type', typeEnumType], ...properties[key]]
    };
  }

  return {
    type: DataTypeEnum._Dynamic,
    typeEnumType,
    types
  };
}

type DataType = PrimitiveType | EnumType | ArrayType | DictionaryType | ObjectType | ReferenceType | DynamicType;

const DataInitializers: Record<DataTypeEnum, (type: any, context: any) => any> = {
  [DataTypeEnum.String]: () => '',
  [DataTypeEnum.Number]: () => 0,
  [DataTypeEnum.Boolean]: () => false,
  [DataTypeEnum.Enum]: (type: EnumType, context) => (type.values ?? (type as any).getValues(context))[0],
  [DataTypeEnum.Array]: () => [],
  [DataTypeEnum.Dictionary]: () => [],
  [DataTypeEnum.Object]: (type: ObjectType, context) => {
    const object: any = {};
    for (const [key, valueType] of type.types) object[toCamelCase(key)] = initializeData(valueType, context);
    return object;
  },
  [DataTypeEnum._Type]: () => ({ type: DataTypeEnum.String }),
  [DataTypeEnum._Reference]: (type: ReferenceType, context) =>
    initializeData(getTypeProvider(context).getType(type.referenceName) as DataType, context),
  [DataTypeEnum._Dynamic]: (type: DynamicType, context) =>
    initializeData(type.types[initializeData(type.typeEnumType, context)], context)
};

function initializeData(type: DataType, context: any): any {
  if (type == null) return null;
  return DataInitializers[type.type](type, context);
}

export {
  DataTypeEnum,
  DataType,
  PrimitiveType,
  EnumType,
  ArrayType,
  DictionaryType,
  ObjectType,
  ReferenceType,
  DynamicType,
  initializeData,
  DataInitializers,
  createDynamicType
};
