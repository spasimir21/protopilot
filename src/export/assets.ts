import { AssetItem } from '../components/tabs/pageTab/Item';
import { ExportedProject } from './exportedProject';

async function exportAssets(assets: AssetItem[], dirname: string, exportedProject: ExportedProject) {
  const assetFiles: Record<string, string> = {};

  for (const asset of assets) assetFiles[asset.name] = await exportedProject.exportAsset(asset, dirname);

  return assetFiles;
}

export { exportAssets };
