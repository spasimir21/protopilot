import { PageManager, providePageManager } from '../../manager/PageManager';
import tabSelectorComponent from '../tabSelector/tabSelector.component';
import { Controller, Provide } from '@uixjs/core';
import { Dependency } from '@uixjs/reactivity';
import defineComponent from './root.view.html';

@Provide(providePageManager, $ => $.pageManager)
class RootController extends Controller {
  @Dependency
  pageManager: PageManager = new PageManager();
}

const rootComponent = defineComponent({
  name: 'root',
  controller: RootController,
  dependencies: [tabSelectorComponent]
});

export default rootComponent;
export { rootComponent };
