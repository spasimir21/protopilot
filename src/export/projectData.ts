import { deserializePageData } from '../components/tabs/serialization';
import { Project, getProject } from '../components/root/project';
import { PageData } from '../components/tabs/pageTab/PageData';
import { getPageManager } from '../manager/PageManager';
import _fs from 'fs/promises';

// Looks ugly but it is required in order to support Electron, Parcel and TypeScript all at the same time
const fs = (window as any).require('fs/promises') as typeof _fs;

interface ProjectData {
  name: string;
  globalPageData: PageData;
  pages: {
    id: string;
    name: string;
    route: string;
    data: PageData;
  }[];
}

async function loadPageData(project: Project, id: string) {
  return deserializePageData(
    JSON.parse((await fs.readFile(project.file(`./pages/${id}.json`))).toString()),
    project,
    false
  );
}

async function getProjectData(context: any): Promise<ProjectData> {
  const pageManager = getPageManager(context);
  const project = getProject(context);

  return {
    name: project.name,
    globalPageData: await loadPageData(project, '_global'),
    pages: await Promise.all(
      pageManager.pages.map(async page => ({
        ...page,
        data: await loadPageData(project, page.id)
      }))
    )
  };
}

export { getProjectData, ProjectData };
