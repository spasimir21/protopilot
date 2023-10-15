import { ExportedProject } from '../../../exportedProject';
import { toCamelCase } from '../../../../helpers/naming';
import { ProjectData } from '../../../projectData';
import { exportController } from './controller';
import { exportAssets } from '../../../assets';
import { exportView } from './view';

type Page = ProjectData['pages'][number];

async function exportPage(
  page: Page,
  projectData: ProjectData,
  exportedProject: ExportedProject,
  globalAssets: Record<string, string>,
  globalCssClasses: Record<string, string>
) {
  const componentNameCamelCase = toCamelCase(page.name) + 'Page';

  await exportedProject.mkdir(`./src/pages/${componentNameCamelCase}`);
  await exportedProject.mkdir(`./src/pages/${componentNameCamelCase}/assets`);

  const componentAssets = await exportAssets(
    page.data.assets.children,
    `./src/pages/${componentNameCamelCase}/assets`,
    exportedProject
  );

  await exportedProject.write(
    `./src/pages/${componentNameCamelCase}/${componentNameCamelCase}.component.ts`,
    exportController(page, projectData)
  );

  const { view, style } = exportView(page, globalCssClasses, globalAssets, componentAssets);

  await exportedProject.write(`./src/pages/${componentNameCamelCase}/${componentNameCamelCase}.view.html`, view);
  await exportedProject.write(`./src/pages/${componentNameCamelCase}/${componentNameCamelCase}.style.scss`, style);
}

export { exportPage };
