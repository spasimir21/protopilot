import { Exporter } from '../../../export/exporters/exporters';
import { getProjectData } from '../../../export/projectData';
import { toKebabCaseSimple } from '../../../helpers/naming';
import { Project, getProject } from '../../root/project';
import { exportProject } from '../../../export/export';
import defineComponent from './exportTab.view.html';
import { Controller, Inject } from '@uixjs/core';
import _fs from 'fs/promises';
import _path from 'path';

// @ts-ignore
import uixjsIcon from './assets/uixjs.png';
// @ts-ignore
import reactIcon from './assets/react.png';
// @ts-ignore
import vueIcon from './assets/vue.png';
// @ts-ignore
import svelteIcon from './assets/svelte.png';
// @ts-ignore
import angularIcon from './assets/angular.png';

// Looks ugly but it is required in order to support Electron, Parcel and TypeScript all at the same time
const path = (window as any).require('path') as typeof _path;
const dialog = (window as any).require('node-file-dialog');

const ICONS = {
  uixjs: uixjsIcon,
  react: reactIcon,
  vue: vueIcon,
  svelte: svelteIcon,
  angular: angularIcon
};

class ExportTabController extends Controller {
  @Inject(getProject)
  project: Project;

  ICONS = ICONS;

  async export(exporter: Exporter) {
    if (!exporter.active) return;

    const [directory] = (await dialog({ type: 'directory' })) as string[];

    const exportDir = path.join(directory, toKebabCaseSimple(this.project.name));

    const projectData = await getProjectData(this.context);

    exportProject(projectData, this.project.path, exportDir, exporter);
  }
}

const exportTabComponent = defineComponent({
  name: 'export-tab',
  controller: ExportTabController
});

export default exportTabComponent;
export { exportTabComponent };
