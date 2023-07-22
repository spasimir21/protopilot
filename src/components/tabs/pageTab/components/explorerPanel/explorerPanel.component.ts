import explorerFunctionsComponent from './components/explorerFunctions/explorerFunctions.component';
import explorerElementsComponent from './components/explorerElements/explorerElements.component';
import explorerAssetsComponent from './components/explorerAssets/explorerAssets.component';
import explorerStatesComponent from './components/explorerStates/explorerStates.component';
import explorerStylesComponent from './components/explorerStyles/explorerStyles.component';
import explorerTypesComponent from './components/explorerTypes/explorerTypes.component';
import explorerItemComponent from './components/explorerItem/explorerItem.component';
import { PageTabState, getPageTabState } from '../../PageTabState';
import defineComponent from './explorerPanel.view.html';
import { PageData, getPageData } from '../../PageData';
import { Controller, Inject } from '@uixjs/core';

class ExplorerPanelController extends Controller {
  @Inject(getPageData)
  pageData: PageData;

  @Inject(getPageTabState)
  pageTabState: PageTabState;

  deselect() {
    this.pageTabState.currentItem = null;
  }
}

const explorerPanelComponent = defineComponent({
  name: 'explorer-panel',
  controller: ExplorerPanelController,
  dependencies: [
    explorerItemComponent,
    explorerAssetsComponent,
    explorerTypesComponent,
    explorerStatesComponent,
    explorerElementsComponent,
    explorerStylesComponent,
    explorerFunctionsComponent
  ]
});

export default explorerPanelComponent;
export { explorerPanelComponent };
