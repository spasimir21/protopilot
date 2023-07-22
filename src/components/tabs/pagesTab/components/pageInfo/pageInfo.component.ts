import { Page, PageManager, getPageManager } from '../../../../../manager/PageManager';
import { Tab, TabManager, getTabManager } from '../../../../../manager/TabManager';
import defineComponent from './pageInfo.view.html';
import { Controller, Inject } from '@uixjs/core';
import { State } from '@uixjs/reactivity';

class PageInfoController extends Controller<{ pageId: string; openEditModal: (id: string) => void }> {
  pageTab: Tab | null = null;

  @Inject(getPageManager)
  pageManager: PageManager;

  @Inject(getTabManager)
  tabManager: TabManager;

  @State
  page: Page;

  init() {
    this.page = this.pageManager.getPage(this.props.pageId) as Page;
  }

  delete() {
    if (this.pageTab) this.tabManager.closeTab(this.pageTab as Tab);
    this.pageManager.deletePage(this.props.pageId);
    this.pageTab = null;
  }

  openTab() {
    if (this.pageTab != null && !this.tabManager.hasTab(this.pageTab as Tab)) {
      this.pageTab = null;
    }

    if (this.pageTab == null) {
      this.pageTab = this.tabManager.openTab({
        title: `Page - ${this.page.name}`,
        canClose: true,
        modified: false,
        data: this.page.id,
        component: { name: 'page-tab' }
      });
    }

    this.tabManager.currentTab = this.pageTab;
  }
}

const pageInfoComponent = defineComponent({
  name: 'page-info',
  controller: PageInfoController
});

export default pageInfoComponent;
export { pageInfoComponent };
