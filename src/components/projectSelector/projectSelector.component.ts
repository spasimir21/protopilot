import defineComponent from './projectSelector.view.html';
import { toKebabCaseSimple } from '../../helpers/naming';
import { Controller, Prop } from '@uixjs/core';
import { State } from '@uixjs/reactivity';
import _fs from 'fs/promises';
import _path from 'path';

// Looks ugly but it is required in order to support Electron, Parcel and TypeScript all at the same time
const fs = (window as any).require('fs/promises') as typeof _fs;
const path = (window as any).require('path') as typeof _path;
const dialog = (window as any).require('node-file-dialog');

class ProjectSelectorController extends Controller<{ openProject: (path: string) => void }> {
  @Prop
  openProject: (path: string) => void;

  @State
  projectName: string = '';

  // afterViewInit(): void {
  //   this.openProject('./projects/foody-project');
  // }

  async openExistingProject() {
    const [directory] = (await dialog({ type: 'directory' })) as string[];
    this.openProject(directory);
  }

  async createProject() {
    if (this.projectName.trim().length === 0) return;

    const [directory] = (await dialog({ type: 'directory' })) as string[];

    const projectDirectory = path.join(directory, toKebabCaseSimple(`${this.projectName} Project`));

    await fs.mkdir(projectDirectory);
    await fs.mkdir(path.join(projectDirectory, './assets'));
    await fs.mkdir(path.join(projectDirectory, './pages'));

    await fs.writeFile(
      path.join(projectDirectory, './project.json'),
      JSON.stringify({ name: this.projectName.trim() })
    );

    await fs.writeFile(path.join(projectDirectory, './pages.json'), '[]');

    this.openProject(projectDirectory);
  }
}

const projectSelectorComponent = defineComponent({
  name: 'project-selector',
  controller: ProjectSelectorController
});

export default projectSelectorComponent;
export { projectSelectorComponent };
