import { PageManager, providePageManager } from '../../manager/PageManager';
import { Controller, Provide } from '@uixjs/core';
import { Dependency, Effect, State } from '@uixjs/reactivity';
import defineComponent from './root.view.html';
import { Project, loadProject, provideProject } from './project';
import projectSelectorComponent from '../projectSelector/projectSelector.component';

class RootController extends Controller {
  @State
  project: Project = null as any;

  init() {
    this.openProject = this.openProject.bind(this);
  }

  openProject(path: string): void {
    loadProject(path).then(project => {
      this.project = project;
      provideProject(this.context, this.project);
    });
  }

  @Effect
  updateTitle() {
    document.title = this.project ? `ProtoPilot - ${this.project.name}` : 'ProtoPilot';
  }
}

const rootComponent = defineComponent({
  name: 'root',
  controller: RootController,
  dependencies: [
    projectSelectorComponent,
    {
      name: 'tab-selector',
      load: () => import('../tabSelector/tabSelector.component')
    }
  ]
});

export default rootComponent;
export { rootComponent };
