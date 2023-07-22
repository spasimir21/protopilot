import styleEditorComponent from '../styleEditor/styleEditor.component';
import defineComponent from './styleEditorPanel.view.html';
import { Controller, Prop } from '@uixjs/core';
import { StyleItem } from '../../../../Item';

class StyleEditorPanelController extends Controller<{ item: StyleItem }> {
  @Prop
  item: StyleItem;
}

const styleEditorPanelComponent = defineComponent({
  name: 'style-editor-panel',
  controller: StyleEditorPanelController,
  dependencies: [styleEditorComponent]
});

export default styleEditorPanelComponent;
export { styleEditorPanelComponent };
