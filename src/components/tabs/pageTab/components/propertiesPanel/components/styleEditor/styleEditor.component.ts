import editorInputComponent from '../../../../../../editorInput/editorInput.component';
import { createCssEditor } from '../../../../../../../codeEditor/codeEditor';
import { PageTabState, getPageTabState } from '../../../../PageTabState';
import { ElementItem, ItemType, StyleItem } from '../../../../Item';
import { toKebabCase } from '../../../../../../../helpers/naming';
import { Controller, Inject, Prop } from '@uixjs/core';
import defineComponent from './styleEditor.view.html';
import { Effect, State } from '@uixjs/reactivity';
import { EditorView } from 'codemirror';

const PROP_REGEX = /([a-zA-Z0-9-]+?)\s*:\s*(.+?);/gm;

class StyleEditorController extends Controller<{ item: ElementItem | StyleItem }> {
  @Prop
  item: ElementItem | StyleItem;

  @State
  editorContainer: HTMLDivElement;
  @State
  editor: EditorView;

  @Inject(getPageTabState)
  pageTabState: PageTabState;

  @Effect<StyleEditorController>($ => $.editorContainer)
  setupCodeEditor(editorContainer: HTMLDivElement) {
    this.editor = createCssEditor(editorContainer);

    this.editor.dom.querySelector('.cm-content')?.addEventListener('keyup', () => {
      if (this.item == null) return;

      const source = this.editor.state.doc.toString();
      const style: [string, string][] = [];

      for (const match of source.matchAll(PROP_REGEX) ?? []) style.push([match[1], match[2]]);

      const lengthDelta = style.length - this.item.style.length;
      if (lengthDelta > 0) {
        for (let i = 0; i < lengthDelta; i++) this.item.style.push(['', '']);
      } else if (lengthDelta < 0) {
        for (let i = 0; i > lengthDelta; i--) this.item.style.pop();
      }

      for (let i = 0; i < style.length; i++) {
        if (this.item.style[i][0] !== style[i][0]) this.item.style[i][0] = style[i][0];
        if (this.item.style[i][1] !== style[i][1]) this.item.style[i][1] = style[i][1];
      }
    });
  }

  @Effect<StyleEditorController>($ => [$.pageTabState.usingCodeForStyles, $.editor, $.item, $.item?.name])
  updateCodeEditor() {
    if (!this.pageTabState.usingCodeForStyles || this.editor == null || this.item == null) return;

    const selector = (this.item.type === ItemType.Element ? '#' : '.') + toKebabCase(this.item.name);

    let source = `${selector} {\n`;
    for (const [prop, value] of this.item.style ?? []) source += `  ${prop}: ${value};\n`;
    source += '}';

    this.editor.dispatch({
      changes: { from: 0, to: this.editor.state.doc.length, insert: source }
    });
  }

  switchEditorType() {
    this.pageTabState.usingCodeForStyles = !this.pageTabState.usingCodeForStyles;
  }

  addStyleProperty() {
    this.item.style.push(['property', 'value']);
  }

  removeStyleProperty(index: number) {
    this.item.style.splice(index, 1);
  }
}

const styleEditorComponent = defineComponent({
  name: 'style-editor',
  controller: StyleEditorController,
  dependencies: [editorInputComponent]
});

export default styleEditorComponent;
export { styleEditorComponent };
