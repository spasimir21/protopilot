import { FunctionItem, StateItem } from './pageTab/Item';
import { toCamelCase } from '../../helpers/naming';
import { PageData } from './pageTab/PageData';

const $OLD_STATE = Symbol('$OLD_STATE');

function compileFunction(item: FunctionItem) {
  const getFunction = new Function(`
    async function ${toCamelCase(item.name)}(${item.argumentNames.join(', ')}) {
      const $ = this;
      ${item.code}
    }

    return ${toCamelCase(item.name)};
  `);

  return getFunction() as (...args: any[]) => Promise<any>;
}

function createRunningContext(pageData: PageData) {
  const $: any = { [$OLD_STATE]: {} };

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
