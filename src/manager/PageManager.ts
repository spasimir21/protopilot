import { Project, getProject } from '../components/root/project';
import { Effect, Reactive, State } from '@uixjs/reactivity';
import { createContextValue } from '@uixjs/core';
import { id } from '../helpers/id';
import _fs from 'fs';

// Looks ugly but it is required in order to support Electron, Parcel and TypeScript all at the same time
const fs = (window as any).require('fs') as typeof _fs;

interface Page {
  id: string;
  name: string;
  route: string;
}

@Reactive
class PageManager {
  @State
  pages: Page[] = [];

  @State
  loaded: boolean = false;

  project: Project;

  constructor(private readonly context: any) {
    this.project = getProject(this.context);

    fs.readFile(this.project.file('./pages.json'), (err, data) => {
      this.loaded = true;

      if (err != null) return;
      this.pages = JSON.parse(data.toString());
    });
  }

  @Effect
  save() {
    if (!this.loaded) return;
    fs.writeFile(this.project.file('./pages.json'), JSON.stringify(this.pages), () => {});
  }

  getPage(id: string) {
    return this.pages.find(page => page.id === id);
  }

  getPageIndex(id: string) {
    return this.pages.findIndex(page => page.id === id);
  }

  addPage(data: Omit<Page, 'id'>) {
    this.pages.push({ ...data, id: id() });
  }

  deletePage(id: string) {
    const pageIndex = this.getPageIndex(id);
    if (pageIndex !== -1) this.pages.splice(pageIndex, 1);
  }
}

const [providePageManager, getPageManager] = createContextValue<PageManager>('pageManager');

export { PageManager, Page, providePageManager, getPageManager };
