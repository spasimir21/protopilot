import { createJavascriptEditor } from '../../../../../../../codeEditor/codeEditor';
import { ArrayType, DataTypeEnum } from '../../../../../../editorInput/DataType';
import defineComponent from './functionEditor.view.html';
import { Effect, State } from '@uixjs/reactivity';
import { FunctionItem } from '../../../../Item';
import { Controller, Prop } from '@uixjs/core';
import { EditorView } from 'codemirror';

const ArgumentNamesType: ArrayType = {
  type: DataTypeEnum.Array,
  valueType: { type: DataTypeEnum.String }
};

class FunctionEditorController extends Controller<{ item: FunctionItem }> {
  ArgumentNamesType = ArgumentNamesType;

  @Prop
  item: FunctionItem;

  @State
  editorContainer: HTMLDivElement;
  @State
  editor: EditorView;

  @Effect<FunctionEditorController>($ => $.editorContainer)
  setupCodeEditor(editorContainer: HTMLDivElement) {
    this.editor = createJavascriptEditor(editorContainer);

    this.editor.dom.querySelector('.cm-content')?.addEventListener('keyup', () => {
      this.item.code = this.editor.state.doc.toString();
    });

    this.editor.dispatch({
      changes: { from: 0, to: this.editor.state.doc.length, insert: this.item.code }
    });
  }
}

const functionEditorComponent = defineComponent({
  name: 'function-editor',
  controller: FunctionEditorController
});

export default functionEditorComponent;
export { functionEditorComponent };
