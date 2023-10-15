import propertiesPanelComponent from './components/propertiesPanel/propertiesPanel.component';
import modalComponent, { ModalController, provideModal } from '../../modal/modal.component';
import addElementModalComponent from './modals/addElementModal/addElementModal.component';
import { FunctionProvider, provideFunctionProvider } from './providers/FunctionProvider';
import explorerPanelComponent from './components/explorerPanel/explorerPanel.component';
import { Controller, Inject, Provide, Shared, UixComponent, scope } from '@uixjs/core';
import { Page, PageManager, getPageManager } from '../../../manager/PageManager';
import { AssetProvider, provideAssetProvider } from './providers/AssetProvider';
import { StyleProvider, provideStyleProvider } from './providers/StyleProvider';
import { TypeProvider, provideTypeProvider } from './providers/TypeProvider';
import { getGlobalPageData } from '../../tabSelector/tabSelector.component';
import { PageData, getDefaultPageData, providePageData } from './PageData';
import { deserializePageData, serializePageData } from '../serialization';
import previewComponent from './components/preview/preview.component';
import { $OLD_STATE, createRunningContext } from '../runningContext';
import { PageTabState, providePageTabState } from './PageTabState';
import { Dependency, Effect, State } from '@uixjs/reactivity';
import { Tab, getTab } from '../../../manager/TabManager';
import defineComponent from './pageTab.view.html';
import { StateItem } from './Item';
import _fs from 'fs';
import { Project, getProject } from '../../root/project';

const fs = (window as any).require('fs') as typeof _fs;

@Provide(provideFunctionProvider, $ => $.functionProvider)
@Provide(provideAssetProvider, $ => $.assetProvider)
@Provide(provideStyleProvider, $ => $.styleProvider)
@Provide(provideTypeProvider, $ => $.typeProvider)
@Provide(providePageTabState, $ => $.state)
@Provide(providePageData, $ => $.pageData)
class PageTabController extends Controller {
  @State
  modalComponent: UixComponent;
  @State
  modal: ModalController;
  @State
  pageData: PageData;
  @State
  loaded: boolean = false;

  @State
  state: PageTabState = {
    usingCodeForStyles: false,
    currentItem: null,
    hoveredItem: null,
    runningContext: null,
    isGlobalPage: true
  };

  @Dependency<PageTabController>($ => new TypeProvider($.pageData, $.context))
  typeProvider: TypeProvider;

  @Dependency<PageTabController>($ => new AssetProvider($.pageData, $.context))
  assetProvider: AssetProvider;

  @Dependency<PageTabController>($ => new StyleProvider($.pageData, $.context))
  styleProvider: StyleProvider;

  @Dependency<PageTabController>($ => new FunctionProvider($.pageData, $.context))
  functionProvider: FunctionProvider;

  page: Page;

  @Inject(getTab)
  tab: Tab;

  @Inject(getPageManager)
  pageManager: PageManager;

  @Inject(getGlobalPageData)
  globalPageData: PageData;

  @Inject(getProject)
  project: Project;

  @Shared
  shouldStart: boolean;

  @Shared
  shouldStop: boolean;

  init() {
    this.state.isGlobalPage = this.tab.data === '_global';

    this.pageData = this.state.isGlobalPage ? getGlobalPageData(this.context) : getDefaultPageData(this.context);

    this.page = this.pageManager.getPage(this.tab.data) as Page;
    if (!this.state.isGlobalPage) this.pageData.pageElement.name = `${this.page.name} Page`;

    this.tab.modified = true;

    this.load();
  }

  postInit() {
    // this.state.currentItem = this.pageData.pageElement;
  }

  afterViewInit() {
    this.modal = this.modalComponent.controller as ModalController;
    provideModal(this.context, this.modal);
  }

  save() {
    fs.writeFile(
      this.project.file(`./pages/${this.tab.data}.json`),
      JSON.stringify(serializePageData(this.pageData)),
      () => {}
    );

    // this.tab.modified = false;
  }

  load() {
    fs.readFile(this.project.file(`./pages/${this.tab.data}.json`), (err, data) => {
      this.loaded = true;

      if (err != null) return;

      const serializedPageData = JSON.parse(data.toString());

      const pageData = deserializePageData(serializedPageData, this.project);

      this.pageData.styles = pageData.styles;
      this.pageData.assets = pageData.assets;
      this.pageData.types = pageData.types;
      this.pageData.functions = pageData.functions;
      this.pageData.states = pageData.states;
      this.pageData.pageElement = pageData.pageElement;
    });
  }

  @Effect
  startIfNeeded() {
    if (!this.shouldStart || !this.loaded) return;
    if (this.state.runningContext == null) this.runButtonPressed();
    this.shouldStart = false;
  }

  @Effect
  stopIfNeeded() {
    if (!this.shouldStop || !this.loaded) return;
    if (this.state.runningContext != null) this.runButtonPressed();
    this.shouldStop = false;
  }

  @Effect
  updateTabTitle() {
    if (this.state.isGlobalPage) return;
    this.tab.title = `Page - ${this.page.name}`;
    this.pageData.pageElement.name = `${this.page.name} Page`;
  }

  runButtonPressed() {
    if (this.state.runningContext != null) {
      const oldContext = this.state.runningContext;
      this.state.runningContext = null;

      setTimeout(() => {
        for (const state of (this.pageData.states.children ?? []) as StateItem[])
          state.value = JSON.parse(oldContext[$OLD_STATE][state.name]);
      }, 0);

      return;
    }

    const globalRunningContext = createRunningContext(this.globalPageData, this.context);
    const currentRunningContext = createRunningContext(this.pageData, this.context);
    const runningContext = scope(currentRunningContext, globalRunningContext);

    this.state.runningContext = runningContext;

    (window as any).$ = runningContext.$;

    setTimeout(() => {
      (this.pageData.pageElement.domElement as HTMLElement).dispatchEvent(new CustomEvent('run'));
    }, 100);
  }
}

const pageTabComponent = defineComponent({
  name: 'page-tab',
  controller: PageTabController,
  dependencies: [
    modalComponent,
    addElementModalComponent,
    previewComponent,
    explorerPanelComponent,
    propertiesPanelComponent
  ]
});

export default pageTabComponent;
export { pageTabComponent };
