import { AssetProvider, getAssetProvider } from '../../providers/AssetProvider';
import { stylesheets as elementStylesheets } from './element.view.html';
import { Effect, State, registerDependency } from '@uixjs/reactivity';
import { PageTabState, getPageTabState } from '../../PageTabState';
import { PageData, getPageData } from '../../PageData';
import defineComponent from './preview.view.html';
import { Controller, Inject } from '@uixjs/core';

function setIntervalInController(controller: any, callback: () => void, delay: number) {
  const intervalId = setInterval(callback, delay);

  registerDependency(controller, {
    dependency: intervalId,
    cleanup: () => clearInterval(intervalId)
  });
}

class PreviewController extends Controller {
  @Inject(getPageData)
  pageData: PageData;

  @Inject(getPageTabState)
  pageTabState: PageTabState;

  @Inject(getAssetProvider)
  assetProvider: AssetProvider;

  @State
  box = { hasElement: false, x: 0, y: 0, width: 0, height: 0 };

  @State
  runningContext = { $: null };

  init() {
    setIntervalInController(this, this.updateBox.bind(this), 100);
  }

  @Effect
  updateRunningContext() {
    this.runningContext.$ = this.pageTabState.runningContext;
  }

  @Effect
  updateBox() {
    const element =
      (this.pageTabState.hoveredItem as any)?.domElement ?? (this.pageTabState.currentItem as any)?.domElement;

    if (element == null) {
      this.box.hasElement = false;
      return;
    }

    const componentRect = this.component.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    this.box.x = elementRect.x - componentRect.x - 3;
    this.box.y = elementRect.y - componentRect.y - 3;

    this.box.width = elementRect.width;
    this.box.height = elementRect.height;

    this.box.hasElement = true;
  }
}

const previewComponent = defineComponent({
  name: 'preview',
  controller: PreviewController,
  stylesheets: elementStylesheets
});

export default previewComponent;
export { previewComponent };
