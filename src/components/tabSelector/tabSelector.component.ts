import { Tab, TabManager, provideTabManager } from '../../manager/TabManager';
import { PageManager, providePageManager } from '../../manager/PageManager';
import { PageData, getDefaultPageData } from '../tabs/pageTab/PageData';
import { Controller, Provide, createContextValue } from '@uixjs/core';
import { Dependency, reactive } from '@uixjs/reactivity';
import defineComponent from './tabSelector.view.html';

const [provideGlobalPageData, getGlobalPageData] = createContextValue<PageData>('globalPageData');

@Provide(provideGlobalPageData, $ => $.globalPageData)
@Provide(providePageManager, $ => $.pageManager)
@Provide(provideTabManager, $ => $.tabManager)
class TabSelectorController extends Controller {
  @Dependency<TabSelectorController>($ => new TabManager($.context, $.component.registry))
  tabManager: TabManager;

  @Dependency<TabSelectorController>($ => new PageManager($.context))
  pageManager: PageManager;

  globalPageData: PageData = reactive(getDefaultPageData(null));

  postInit() {
    this.tabManager.openTab({
      title: 'Export',
      modified: false,
      canClose: false,
      data: null,
      component: { name: 'export-tab' }
    });

    this.tabManager.currentTab = this.tabManager.openTab({
      title: 'Pages',
      modified: false,
      canClose: false,
      data: null,
      component: { name: 'pages-tab' }
    });

    this.tabManager.openTab({
      title: 'Global',
      modified: false,
      canClose: false,
      data: '_global',
      component: { name: 'page-tab' }
    });

    // this.tabManager.currentTab = this.tabManager.openTab({
    //   title: 'Page - Login',
    //   modified: false,
    //   canClose: true,
    //   data: '_lvwljj3',
    //   component: { name: 'page-tab' }
    // });
  }

  closeTab(tab: Tab) {
    if (!tab.canClose) return;

    const index = this.tabManager.closeTab(tab);

    if (this.tabManager.currentTab !== tab) return;

    const newIndex = Math.min(index, this.tabManager.tabs.length - 1);
    this.tabManager.currentTab = this.tabManager.tabs[newIndex];
  }

  saveTab(tab: Tab) {
    if (!tab.modified) return;
    (tab.component.controller as any).save();
  }
}

const tabSelectorComponent = defineComponent({
  name: 'tab-selector',
  controller: TabSelectorController
});

export default tabSelectorComponent;
export { tabSelectorComponent, getGlobalPageData };
