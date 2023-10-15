import { createContextValue } from '@uixjs/core';
import _fs from 'fs/promises';
import _path from 'path';

// Looks ugly but it is required in order to support Electron, Parcel and TypeScript all at the same time
const fs = (window as any).require('fs/promises') as typeof _fs;
const path = (window as any).require('path') as typeof _path;

interface Project {
  path: string;
  name: string;
  file(filename: string): string;
}

const [provideProject, getProject] = createContextValue<Project>('project');

async function loadProject(projectPath: string) {
  const buffer = await fs.readFile(path.join(projectPath, './project.json'));
  const projectDetails = JSON.parse(buffer.toString());
  return {
    path: projectPath,
    ...projectDetails,
    file: (filename: string) => path.join(projectPath, filename)
  } as Project;
}

export { Project, provideProject, getProject, loadProject };
