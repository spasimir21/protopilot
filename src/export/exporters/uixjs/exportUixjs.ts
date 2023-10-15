import { exportGlobalAssets, exportGlobalTypes, fillGlobalState, fillGlobalStyles } from './globalData';
import { toCamelCase, toKebabCase, toKebabCaseSimple } from '../../../helpers/naming';
import { ExportedProject } from '../../exportedProject';
import { Page } from '../../../manager/PageManager';
import { ProjectData } from '../../projectData';
import { indentCode } from '../../indent';
import { exportPage } from './page/page';

const template_registerPage = (page: Page) => {
  const camelName = toCamelCase(page.name);

  return indentCode(
    `registry.components.register({
  name: '${toKebabCase(page.name)}-page',
  load: () => import('./pages/${camelName}Page/${camelName}Page.component')
});`,
    1
  );
};

const template_registerRoute = (page: Page) =>
  indentCode(
    `{
  name: '${toCamelCase(page.name)}',
  path: '${page.route}',
  component: { component: '${toKebabCase(page.name)}-page', registry }
}`,
    2
  );

async function exportUixjs(projectData: ProjectData, exportedProject: ExportedProject) {
  const projectNameKebabCase = toKebabCaseSimple(projectData.name);
  const projectNameCamelCase = toCamelCase(projectData.name);

  await exportedProject.replaceInFile('./package.json', {
    project_name: projectNameKebabCase
  });

  await exportedProject.replaceInFile('./index.html', {
    project_title: projectData.name,
    project_namespace: projectNameKebabCase
  });

  await exportedProject.replaceInFile('./src/main.ts', {
    project_namespace: projectNameCamelCase
  });

  await exportedProject.replaceInFile('./src/pages.ts', {
    pages: projectData.pages.map(template_registerPage).join('\n\n')
  });

  await exportedProject.replaceInFile('./src/router.ts', {
    routes: projectData.pages.map(template_registerRoute).join(',\n')
  });

  await exportGlobalTypes(projectData, exportedProject);

  await fillGlobalState(projectData, exportedProject);

  const globalAssets = await exportGlobalAssets(projectData, exportedProject);

  const globalCssClasses = await fillGlobalStyles(projectData, exportedProject);

  for (const page of projectData.pages)
    await exportPage(page, projectData, exportedProject, globalAssets, globalCssClasses);
}

export { exportUixjs };
