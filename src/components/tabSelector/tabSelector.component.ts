import { Tab, TabManager, provideTabManager } from '../../manager/TabManager';
import { Controller, Provide, createContextValue } from '@uixjs/core';
import { Dependency, reactive } from '@uixjs/reactivity';
import defineComponent from './tabSelector.view.html';
import { PageData, getDefaultPageData } from '../tabs/pageTab/PageData';

const [provideGlobalPageData, getGlobalPageData] = createContextValue<PageData>('globalPageData');

@Provide(provideGlobalPageData, $ => $.globalPageData)
@Provide(provideTabManager, $ => $.tabManager)
class TabSelectorController extends Controller {
  @Dependency<TabSelectorController>($ => new TabManager($.context, $.component.registry))
  tabManager: TabManager;

  globalPageData: PageData = reactive(getDefaultPageData(null));

  postInit() {
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
