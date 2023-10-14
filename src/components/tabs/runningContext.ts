import { FunctionItem, StateItem } from './pageTab/Item';
import { toCamelCase } from '../../helpers/naming';
import { PageData } from './pageTab/PageData';
import { getTabManager } from '../../manager/TabManager';
import { getPageManager } from '../../manager/PageManager';

const $OLD_STATE = Symbol('$OLD_STATE');

function compileFunction(item: FunctionItem) {
  const getFunction = new Function(`
    function ${toCamelCase(item.name)}(${item.argumentNames.join(', ')}) {
      const $ = this;
      ${item.code}
    }

    return ${toCamelCase(item.name)};
  `);

  return getFunction() as (...args: any[]) => Promise<any>;
}

function goto(path: string, context: any) {
  const pageManager = getPageManager(context);
  const tabManager = getTabManager(context);

  const page = pageManager.pages.find(page => page.name === path || page.route === path);
  if (page == null) return;

  const tab =
    tabManager.tabs.find(tab => tab.data === page.id) ??
    tabManager.openTab({
      title: `Page - ${page.name}`,
      canClose: true,
      modified: false,
      data: page.id,
      component: { name: 'page-tab' }
    });

  if (tabManager.currentTab) tabManager.currentTab.component.shared.shouldStop = true;
  tab.component.shared.shouldStart = true;

  tabManager.currentTab = tab;
}

function createRunningContext(pageData: PageData, context: any) {
  const $: any = { [$OLD_STATE]: {}, goto: (path: string) => goto(path, context) };

  for (const state of (pageData.states.children ?? []) as StateItem[]) {
    $[$OLD_STATE][state.name] = JSON.stringify(state.value);

    Object.defineProperty($, toCamelCase(state.name), {
      get: () => state.value,
      set: value => (state.value = value),
      configurable: false
    });
  }

  for (const func of (pageData.functions.children ?? []) as FunctionItem[]) {
    $[toCamelCase(func.name)] = compileFunction(func);
  }

  return $;
}

export { createRunningContext, $OLD_STATE };
