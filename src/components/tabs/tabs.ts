import { Registry } from '@uixjs/core';

function registerTabComponents(registry: Registry) {
  registry.components.register({
    name: 'pages-tab',
    load: () => import('./pagesTab/pagesTab.component')
  });

  registry.components.register({
    name: 'page-tab',
    load: () => import('./pageTab/pageTab.component')
  });

  registry.components.register({
    name: 'export-tab',
    load: () => import('./exportTab/exportTab.component')
  });
}

export { registerTabComponents };
