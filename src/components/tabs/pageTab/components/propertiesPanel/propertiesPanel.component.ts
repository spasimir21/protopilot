import styleEditorPanelComponent from './components/styleEditorPanel/styleEditorPanel.component';
import functionEditorComponent from './components/functionEditor/functionEditor.component';
import elementEditorComponent from './components/elementEditor/elementEditor.component';
import assetEditorComponent from './components/assetEditor/assetEditor.component';
import stateEditorComponent from './components/stateEditor/stateEditor.component';
import typeEditorComponent from './components/typeEditor/typeEditor.component';
import { PageTabState, getPageTabState } from '../../PageTabState';
import defineComponent from './propertiesPanel.view.html';
import { Controller, Inject } from '@uixjs/core';

class PropertiesPanelController extends Controller {
  @Inject(getPageTabState)
  pageTabState: PageTabState;
}

const propertiesPanelComponent = defineComponent({
  name: 'properties-panel',
  controller: PropertiesPanelController,
  dependencies: [
    elementEditorComponent,
    stateEditorComponent,
    typeEditorComponent,
    assetEditorComponent,
    styleEditorPanelComponent,
    functionEditorComponent
  ]
});

export default propertiesPanelComponent;
export { propertiesPanelComponent };
