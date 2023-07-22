import { autocompletion } from '@codemirror/autocomplete';
import { javascript } from '@codemirror/lang-javascript';
import { basicSetup, EditorView } from 'codemirror';
import { css } from '@codemirror/lang-css';

type LanguageSupport = typeof css; // Type is hidden by codemirror

function createEditor(parent: HTMLElement, languageSupport: LanguageSupport) {
  const editor = new EditorView({
    extensions: [basicSetup, autocompletion(), languageSupport()],
    parent
  });

  return editor;
}

const createJavascriptEditor = (parent: HTMLElement) => createEditor(parent, javascript);
const createCssEditor = (parent: HTMLElement) => createEditor(parent, css);

export { createJavascriptEditor, createCssEditor };
