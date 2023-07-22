import typeInputComponent from '../../../../../../editorInput/typeInput/typeInput.component';
import editorInputComponent from '../../../../../../editorInput/editorInput.component';
import defineComponent from './stateEditor.view.html';
import { Controller, Prop } from '@uixjs/core';
import { StateItem } from '../../../../Item';

class StateEditorController extends Controller<{ item: StateItem }> {
  @Prop
  item: StateItem;
}

const stateEditorComponent = defineComponent({
  name: 'state-editor',
  controller: StateEditorController,
  dependencies: [editorInputComponent, typeInputComponent]
});

export default stateEditorComponent;
export { stateEditorComponent };
