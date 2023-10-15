import { DataType, DataTypeEnum } from '../components/editorInput/DataType';
import { toCamelCase, toPascalCase } from '../helpers/naming';
import { TypeItem } from '../components/tabs/pageTab/Item';

function exportType(dataType: DataType): string {
  switch (dataType.type) {
    case DataTypeEnum.String:
      return 'string';
    case DataTypeEnum.Number:
      return 'number';
    case DataTypeEnum.Boolean:
      return 'boolean';
    case DataTypeEnum.Enum:
      return dataType.values ? `(${dataType.values.map(value => `'${value}'`).join(' | ')})` : 'any';
    case DataTypeEnum.Array:
      return `${exportType(dataType.valueType)}[]`;
    case DataTypeEnum.Dictionary:
      return `Record<string, ${exportType(dataType.valueType)}>`;
    case DataTypeEnum.Object:
      return `{ ${dataType.types.map(([key, type]) => `${toCamelCase(key)}: ${exportType(type)};`).join(' ')} }`;
    case DataTypeEnum._Reference:
      return toPascalCase(dataType.referenceName);
    default:
      return 'any';
  }
}

function exportTypeDefinition(type: TypeItem) {
  return `type ${toPascalCase(type.name)} = ${exportType(type.dataType)};`;
}

export { exportType, exportTypeDefinition };
