import { StyleItem } from '../components/tabs/pageTab/Item';
import { CssClassAllocator } from './CssClassAllocator';
import { indentCode } from './indent';

function exportStyle(cls: string, style: [string, string][]) {
  return `.${cls} {
${indentCode(style.map(prop => `${prop[0]}: ${prop[1]};`).join('\n'), 1)}
}`;
}

function exportStyles(styles: StyleItem[], prefix?: string) {
  const cssAllocator = new CssClassAllocator(prefix);
  const classes: Record<string, string> = {};

  let code = '';

  for (const style of styles) {
    const cls = cssAllocator.allocate(style.name);
    classes[style.name] = cls;

    code += '\n\n' + exportStyle(cls, style.style);
  }

  return {
    code: code.slice(2),
    classes
  };
}

export { exportStyles, exportStyle };
