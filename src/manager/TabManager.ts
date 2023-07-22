import { Registry, UixComponent, context, createContextValue } from '@uixjs/core';
import { Reactive, State, reactive } from '@uixjs/reactivity';
import { id } from '../helpers/id';

interface Tab {
  id: string;
  title: string;
  canClose: boolean;
  modified: boolean;
  data: any;
  component: UixComponent;
}

interface TabConfig {
  title: string;
  canClose: boolean;
  modified: boolean;
  data: any;
  component: { name: string; registry?: Registry };
}

@Reactive
class TabManager {
  @State
  tabs: Tab[] = [];

  @State
  currentTab: Tab | null;

  constructor(private readonly context: any, private readonly registry: Registry) {}

  openTab(tabConfig: TabConfig) {
    const registry = tabConfig.component.registry ?? this.registry;
    const component = document.createElement(
      `${registry.registryNamespace}--${tabConfig.component.name}`
    ) as UixComponent;
    component.isControlled = true;

    const tab = reactive({ id: id(), ...tabConfig, component });

    component.context = context(component.context, this.context);
    provideTab(component.context, tab);

    this.tabs.push(tab);

    return tab;
  }

  hasTab(tab: Tab) {
    return this.tabs.some(t => t.id === tab.id);
  }

  closeTab(tab: Tab) {
    if (!tab.canClose) return -1;

    const tabIndex = this.tabs.findIndex(t => t === tab);
    if (tabIndex !== -1) this.tabs.splice(tabIndex, 1);

    tab.component.kill();

    return tabIndex;
  }

  cleanup() {
    for (const tab of this.tabs) tab.component.kill();
  }
}

const [provideTabManager, getTabManager] = createContextValue<TabManager>('tabManager');
const [provideTab, getTab] = createContextValue<Tab>('tab');

export { TabManager, Tab, TabConfig, provideTabManager, getTabManager, provideTab, getTab };
