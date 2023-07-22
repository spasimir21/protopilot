import { DataTypeEnum, EnumType } from '../../../editorInput/DataType';
import { Computed, Reactive } from '@uixjs/reactivity';
import { createContextValue } from '@uixjs/core';
import { PageData } from '../PageData';
import { AssetItem } from '../Item';
import _fs from 'fs';

const fs = (window as any).require('fs') as typeof _fs;

function loadAsset(path: string, asset: AssetItem) {
  fs.readFile(path, (err, assetData) => {
    if (err != null) return;

    const blob = new Blob([assetData.buffer], { type: asset.assetType });

    const assetUrl = URL.createObjectURL(blob);

    if (asset.url != null && asset.url.startsWith('blob:')) URL.revokeObjectURL(asset.url);

    asset.url = assetUrl;
  });
}

@Reactive
class AssetProvider {
  constructor(private readonly pageData: PageData) {}

  @Computed
  get assetNames() {
    if (this.pageData.assets.children == null) return [];
    return (this.pageData.assets.children as AssetItem[]).map(asset => asset.name);
  }

  getAsset(name: string) {
    if (this.pageData.assets.children == null) return null;
    return (this.pageData.assets.children as AssetItem[]).find(asset => asset.name === name)?.url;
  }

  cleanup() {
    for (const asset of (this.pageData.assets?.children ?? []) as AssetItem[]) {
      if (asset.url == null || !asset.url.startsWith('blob:')) continue;
      URL.revokeObjectURL(asset.url);
    }
  }
}

const [provideAssetProvider, getAssetProvider] = createContextValue<AssetProvider>('assetProvider');

const AssetEnumType: EnumType = {
  type: DataTypeEnum.Enum as const,
  getValues: context => ['None', ...(getAssetProvider(context)?.assetNames ?? [])]
};

export { AssetProvider, provideAssetProvider, getAssetProvider, AssetEnumType, loadAsset };
