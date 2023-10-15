import { AssetItem } from '../components/tabs/pageTab/Item';
import { toCamelCase } from '../helpers/naming';
import _fs from 'fs/promises';
import _path from 'path';

// Looks ugly but it is required in order to support Electron, Parcel and TypeScript all at the same time
const fs = (window as any).require('fs/promises') as typeof _fs;
const path = (window as any).require('path') as typeof _path;

interface ExportedProject {
  write(filename: string, content: string): Promise<void>;
  mkdir(dirname: string): Promise<void>;
  replaceInFile(filename: string, values: Record<string, string>): Promise<void>;
  exportAsset(asset: AssetItem, dirname: string): Promise<string>;
}

function createExportedProject(projectDir: string, exportDir: string): ExportedProject {
  return {
    write: (filename, content) => fs.writeFile(path.join(exportDir, filename), content),
    mkdir: dirname => fs.mkdir(path.join(exportDir, dirname)),
    replaceInFile: async (filename, values) => {
      const filePath = path.join(exportDir, filename);

      let text = (await fs.readFile(filePath)).toString();
      for (const key in values) text = text.replaceAll(`$${key.toUpperCase()}$`, values[key]);

      await fs.writeFile(filePath, text);
    },
    exportAsset: async (asset, dirname) => {
      let extension = asset.assetType.split('/').pop() as string;
      extension = (extension.match(/^\w+/) as string[])[0];

      const filename = `${toCamelCase(asset.name)}.${extension}`;

      await fs.copyFile(path.join(projectDir, `./assets/${asset.id}`), path.join(exportDir, dirname, filename));

      return filename;
    }
  };
}

export { createExportedProject, ExportedProject };
