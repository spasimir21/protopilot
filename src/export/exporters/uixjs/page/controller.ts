import { toCamelCase, toKebabCase, toPascalCase } from '../../../../helpers/naming';
import { template_importGlobalTypes } from '../globalData';
import { exportTypeDefinition } from '../../../type';
import { ProjectData } from '../../../projectData';
import { exportFunction } from '../function';
import { indentCode } from '../../../indent';
import { exportState } from '../state';

type Page = ProjectData['pages'][number];

function exportController(page: Page, projectData: ProjectData) {
  const componentNamePascalCase = toPascalCase(page.name) + 'Page';
  const componentNameKebabCase = toKebabCase(page.name) + '-page';
  const componentNameCamelCase = toCamelCase(page.name) + 'Page';

  return `${template_importGlobalTypes(projectData)}
import defineComponent from './${componentNameCamelCase}.view.html';
import { PageController } from '../PageController';
import { State } from '@uixjs/reactivity';

${page.data.types.children.map(exportTypeDefinition).join('\n\n')}
  
class ${componentNamePascalCase}Controller extends PageController {
  page: HTMLDivElement;

${indentCode(page.data.states.children.map(exportState).join('\n\n'), 1)}

  override onFirstMount() {
    this.page.dispatchEvent(new CustomEvent('run'));
  }

${indentCode(page.data.functions.children.map(exportFunction).join('\n\n'), 1)}
}
    
const ${componentNameCamelCase}Component = defineComponent({
  name: '${componentNameKebabCase}',
  controller: ${componentNamePascalCase}Controller
});
    
export default ${componentNameCamelCase}Component;
export { ${componentNameCamelCase}Component }; 
`;
}

export { exportController };
