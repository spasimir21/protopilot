import { AssetItem, ItemType } from '../../../../Item';
import defineComponent from './assetEditor.view.html';
import { Controller, Prop } from '@uixjs/core';
import _fs from 'fs';

const fs = (window as any).require('fs') as typeof _fs;

class AssetEditorController extends Controller<{ item: AssetItem }> {
  @Prop
  item: AssetItem;

  onFile(event: InputEvent) {
    if (this.item.type !== ItemType.Asset) return;

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file == null) return;

    const blob = new Blob([file], { type: file.type });

    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);

    reader.addEventListener(
      'load',
      () => {
        if (!(reader.result instanceof ArrayBuffer)) return;

        fs.writeFile(`./project/assets/${this.item.id}`, Buffer.from(reader.result), () => {});
      },
      { once: true }
    );

    const assetUrl = URL.createObjectURL(blob);

    if (this.item.url != null && this.item.url.startsWith('blob:')) URL.revokeObjectURL(this.item.url);

    this.item.url = assetUrl;
    this.item.assetType = file.type;
  }
}

const assetEditorComponent = defineComponent({
  name: 'asset-editor',
  controller: AssetEditorController
});

export default assetEditorComponent;
export { assetEditorComponent };
