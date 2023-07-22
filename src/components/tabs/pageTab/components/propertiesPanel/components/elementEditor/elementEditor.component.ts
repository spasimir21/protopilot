import { ArrayType, DataTypeEnum, createDynamicType } from '../../../../../../editorInput/DataType';
import editorInputComponent from '../../../../../../editorInput/editorInput.component';
import { FunctionEnumType } from '../../../../providers/FunctionProvider';
import styleEditorComponent from '../styleEditor/styleEditor.component';
import { StyleEnumType } from '../../../../providers/StyleProvider';
import defineComponent from './elementEditor.view.html';
import { ModifierType } from '../../../../Element';
import { ElementItem } from '../../../../Item';
import { Controller, Prop } from '@uixjs/core';
import { State } from '@uixjs/reactivity';

const StyleReferencesType: ArrayType = {
  type: DataTypeEnum.Array,
  valueType: StyleEnumType
};

const ModifiersType: ArrayType = {
  type: DataTypeEnum.Array,
  valueType: ModifierType
};

class ElementEditorController extends Controller<{ item: ElementItem }> {
  StyleReferencesType = StyleReferencesType;
  ModifiersType = ModifiersType;

  @Prop
  item: ElementItem;

  @State
  modifier = null;
}

const elementEditorComponent = defineComponent({
  name: 'element-editor',
  controller: ElementEditorController,
  dependencies: [editorInputComponent, styleEditorComponent]
});

export default elementEditorComponent;
export { elementEditorComponent };
