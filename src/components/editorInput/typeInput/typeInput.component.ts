import { TypeEnumType } from '../../tabs/pageTab/providers/TypeProvider';
import { DataType, DataTypeEnum, ObjectType } from '../DataType';
import defineComponent from './typeInput.view.html';
import { Effect, State } from '@uixjs/reactivity';
import { Controller } from '@uixjs/core';

const PrimitiveTypeType: ObjectType = {
  type: DataTypeEnum.Object,
  types: [['Type', TypeEnumType]]
};

const EnumTypeType: ObjectType = {
  type: DataTypeEnum.Object,
  types: [
    ['Type', TypeEnumType],
    [
      'Values',
      {
        type: DataTypeEnum.Array,
        valueType: { type: DataTypeEnum.String }
      }
    ]
  ]
};

const ArrayOrDictionaryTypeType: ObjectType = {
  type: DataTypeEnum.Object,
  types: [
    ['Type', TypeEnumType],
    ['Value Type', { type: DataTypeEnum._Type }]
  ]
};

const ObjectTypeType: ObjectType = {
  type: DataTypeEnum.Object,
  types: [
    ['Type', TypeEnumType],
    [
      'Properties',
      {
        type: DataTypeEnum.Dictionary,
        valueType: { type: DataTypeEnum._Type }
      }
    ]
  ]
};

class TypeInputController extends Controller<{}, {}, { type: DataType }> {
  @State
  typeType: DataType = PrimitiveTypeType;

  @State
  value: any = { type: 'String' };

  @Effect
  updateValue() {
    if (this.shared.type == null) return;

    if (this.shared.type.type === DataTypeEnum._Reference) {
      this.value.type = this.shared.type.referenceName;
      return;
    }

    this.value.type = DataTypeEnum[this.shared.type.type];

    if (this.shared.type?.type === DataTypeEnum.Enum) {
      this.value.values = this.shared.type.values;
    } else if (this.shared.type?.type === DataTypeEnum.Array || this.shared.type?.type === DataTypeEnum.Dictionary) {
      this.value.valueType = this.shared.type.valueType;
    } else if (this.shared.type?.type === DataTypeEnum.Object) {
      this.value.properties = this.shared.type.types;
    }
  }

  @Effect<TypeInputController>($ => $.value.type)
  updateInputType(type: string) {
    if (this.shared.type == null) return;

    if (type === 'Enum') {
      this.typeType = EnumTypeType;
      if (!(this.value.values instanceof Array)) this.value.values = [];
    } else if (type === 'Array' || type === 'Dictionary') {
      this.typeType = ArrayOrDictionaryTypeType;
      if (typeof this.value.valueType !== 'object') this.value.valueType = { type: DataTypeEnum.String };
    } else if (type === 'Object') {
      this.typeType = ObjectTypeType;
      if (!(this.value.properties instanceof Array)) this.value.properties = [];
    } else {
      this.typeType = PrimitiveTypeType;
    }

    if (!(this.value.type in DataTypeEnum)) {
      this.shared.type.type = DataTypeEnum._Reference;
      (this.shared.type as any).referenceName = this.value.type;
      return;
    }

    this.shared.type.type = DataTypeEnum[this.value.type] as any;

    if (this.shared.type.type === DataTypeEnum.Enum) {
      this.shared.type.values = this.value.values;
    } else if (this.shared.type.type === DataTypeEnum.Array || this.shared.type.type === DataTypeEnum.Dictionary) {
      this.shared.type.valueType = this.value.valueType;
    } else if (this.shared.type.type === DataTypeEnum.Object) {
      this.shared.type.types = this.value.properties;
    }
  }
}

const typeInputComponent = defineComponent({
  name: 'type-input',
  controller: TypeInputController
});

export default typeInputComponent;
export { typeInputComponent };
