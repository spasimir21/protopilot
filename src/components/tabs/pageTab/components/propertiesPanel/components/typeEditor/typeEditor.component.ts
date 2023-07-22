import typeInputComponent from '../../../../../../editorInput/typeInput/typeInput.component';
import defineComponent from './typeEditor.view.html';
import { Controller, Prop } from '@uixjs/core';
import { TypeItem } from '../../../../Item';

class TypeEditorController extends Controller<{ item: TypeItem }> {
  @Prop
  item: TypeItem;
}

const typeEditorComponent = defineComponent({
  name: 'type-editor',
  controller: TypeEditorController,
  dependencies: [typeInputComponent]
});

export default typeEditorComponent;
export { typeEditorComponent };
