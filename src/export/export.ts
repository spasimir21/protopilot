import { createExportedProject } from './exportedProject';
import { Exporter } from './exporters/exporters';
import { ProjectData } from './projectData';
import _fs from 'fs/promises';
import _path from 'path';

// Looks ugly but it is required in order to support Electron, Parcel and TypeScript all at the same time
const fs = (window as any).require('fs/promises') as typeof _fs;
const path = (window as any).require('path') as typeof _path;

async function exportProject(projectData: ProjectData, projectDir: string, exportDir: string, exporter: Exporter) {
  if (!exporter.active || exporter.export == null) return;

  await fs.cp(path.join('./templates', exporter.id), exportDir, { recursive: true });

  const exportedProject = createExportedProject(projectDir, exportDir);

  await exporter.export(projectData, exportedProject);
}

export { exportProject };
