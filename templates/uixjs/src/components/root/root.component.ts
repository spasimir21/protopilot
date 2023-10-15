import { GlobalState, createGlobalState, provideGlobalState } from '../../globalState';
import { Router, provideRoute, provideRouter } from '@uixjs/router';
import { reactive, registerDependency } from '@uixjs/reactivity';
import { Controller, Provide } from '@uixjs/core';
import defineComponent from './root.view.html';
import { createRouter } from '../../router';

@Provide<RootController>(provideGlobalState, $ => $.globalState)
class RootController extends Controller {
  router: Router = null as any;

  globalState: GlobalState = reactive(createGlobalState());

  override init() {
    this.router = registerDependency(this, createRouter(this.component.registry));
    provideRoute(this.context, this.router.route);
    provideRouter(this.context, this.router);
  }
}

const rootComponent = defineComponent({
  name: 'root',
  controller: RootController
});

export default rootComponent;
export { rootComponent };
