import { toCamelCase, toPascalCase } from '../../../helpers/naming';
import { StateItem } from '../../../components/tabs/pageTab/Item';
import { exportType, exportTypeDefinition } from '../../type';
import { ExportedProject } from '../../exportedProject';
import { ProjectData } from '../../projectData';
import { exportAssets } from '../../assets';
import { exportFunction } from './function';
import { exportStyles } from '../../style';
import { indentCode } from '../../indent';

async function exportGlobalTypes(projectData: ProjectData, exportedProject: ExportedProject) {
  let code = '';

  const types = projectData.globalPageData.types.children;
  for (const type of types) {
    code += exportTypeDefinition(type) + '\n\n';
  }

  code += `export { ${types.map(type => toPascalCase(type.name)).join(', ')} };\n`;

  await exportedProject.write('./src/types.ts', code);
}

// prettier-ignore
const template_importGlobalTypes = (projectData: ProjectData, levels: number = 2) =>
  `import { ${projectData.globalPageData.types.children
    .map(type => toPascalCase(type.name))
    .join(', ')} } from '${levels === 0 ? '.' : new Array(levels).fill('..').join('/')}/types';`;

const template_stateGetterAndSetter = (state: StateItem) => {
  const name = toCamelCase(state.name);

  return `get ${name}() {
  return this.globalState.${name};
}

set ${name}(value: GlobalState['${name}']) {
  this.globalState.${name} = value;
}`;
};

async function fillGlobalState(projectData: ProjectData, exportedProject: ExportedProject) {
  exportedProject.replaceInFile('./src/globalState.ts', {
    import_types: template_importGlobalTypes(projectData, 0),
    types: indentCode(
      projectData.globalPageData.states.children
        .map(state => `${toCamelCase(state.name)}: ${exportType(state.dataType)};`)
        .join('\n'),
      1
    ),
    values: indentCode(
      projectData.globalPageData.states.children
        .map(state => `${toCamelCase(state.name)}: ${JSON.stringify(state.value)}`)
        .join(',\n'),
      2
    )
  });

  exportedProject.replaceInFile('./src/pages/PageController.ts', {
    global_state: indentCode(
      projectData.globalPageData.states.children.map(template_stateGetterAndSetter).join('\n\n'),
      1
    ),
    global_functions: indentCode(projectData.globalPageData.functions.children.map(exportFunction).join('\n\n'), 1)
  });
}

async function exportGlobalAssets(projectData: ProjectData, exportedProject: ExportedProject) {
  return await exportAssets(projectData.globalPageData.assets.children, './src/assets', exportedProject);
}

async function fillGlobalStyles(projectData: ProjectData, exportedProject: ExportedProject) {
  const { code, classes } = exportStyles(projectData.globalPageData.styles.children, 'global');

  exportedProject.replaceInFile('./style/global.scss', {
    global_classes: code
  });

  return classes;
}

export { exportGlobalTypes, template_importGlobalTypes, fillGlobalState, exportGlobalAssets, fillGlobalStyles };
