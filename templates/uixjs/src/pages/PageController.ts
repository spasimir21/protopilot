import { GlobalState, getGlobalState } from '../globalState';
import { Router, getRouter } from '@uixjs/router';
import { Controller, Inject } from '@uixjs/core';

class PageController extends Controller {
  @Inject(getRouter)
  router: Router;

  @Inject(getGlobalState)
  globalState: GlobalState;

$GLOBAL_STATE$

$GLOBAL_FUNCTIONS$

  goto($: any, path: string) {
    this.router.goto({ path });
  }
}

export { PageController };
