import { ElementItem, ElementType } from '../../../../components/tabs/pageTab/Item';
import { toCamelCase, toKebabCase } from '../../../../helpers/naming';
import { CssClassAllocator } from '../../../CssClassAllocator';
import { exportStyle, exportStyles } from '../../../style';
import { ProjectData } from '../../../projectData';
import { alterFunctionCode } from '../function';
import { indentCode } from '../../../indent';

type Page = ProjectData['pages'][number];

const SELF_CLOSING_TAGS = new Set(['img', 'input']);

const TAG_FOR_ELEMENT_TYPE: Record<ElementType, string> = {
  [ElementType.Page]: 'div',
  [ElementType.Group]: 'div',
  [ElementType.Link]: 'a',
  [ElementType.Paragraph]: 'p',
  [ElementType.Image]: 'img',
  [ElementType.Input]: 'input',
  [ElementType.Button]: 'button',
  [ElementType.Each]: 'each'
};

function exportElement(
  element: ElementItem,
  addStyle: (name: string, style: [string, string][]) => string,
  getStyleRef: (name: string) => string,
  getAsset: (asset: string) => string
): string {
  const tagName = TAG_FOR_ELEMENT_TYPE[element.elementType];

  const classes: string[] = [];

  if (element.style.length > 0) classes.push(addStyle(element.name, element.style));

  for (const ref of element.styleReferences) classes.push(getStyleRef(ref));

  const attributes: Record<string, string> = {};

  switch (element.elementType) {
    case ElementType.Page:
      classes.push('page');
      attributes['ref'] = '$.page';
      break;
    case ElementType.Image:
      attributes['attr:src'] = getAsset(element.properties?.asset);
      break;
    case ElementType.Link:
      attributes['href'] = element.properties?.location;
      break;
    case ElementType.Input:
      attributes['placeholder'] = element.properties?.placeholder;
      attributes['type'] = element.properties?.type;
      break;
    case ElementType.Each:
      attributes['_'] = `${element.properties?.item} : ${element.properties?.array}`;
      break;
  }

  if (classes.length > 0) attributes['class'] = classes.join(' ');

  for (const modifier of element.modifiers) {
    switch (modifier.type) {
      case 'Event':
        attributes[`@${modifier.event}`] = `$.${toCamelCase(modifier.function)}($)`;
        break;
      case 'Input':
        attributes[`:${modifier.input}!`] = modifier.value;
        break;
      case 'Style':
        attributes[`#${modifier.property.replace(/\-(.)/g, (_: string, char: string) => char.toUpperCase())}`] =
          modifier.value;
        break;
    }
  }

  const openingTag = `<${tagName} ${Object.keys(attributes)
    .map(name => `${name}="${attributes[name]}"`)
    .join(' ')}`;

  if (SELF_CLOSING_TAGS.has(tagName)) return openingTag + ' />';

  if (element.children == null || element.children.length == 0)
    return `${openingTag}>${alterFunctionCode(element.text)}</${tagName}>`;

  return `${openingTag}>
${indentCode(element.children.map(child => exportElement(child, addStyle, getStyleRef, getAsset)).join('\n'), 1)}
</${tagName}>`;
}

function exportView(
  page: Page,
  globalCssClasses: Record<string, string>,
  globalAssets: Record<string, string>,
  componentAssets: Record<string, string>
) {
  const componentNameKebabCase = toKebabCase(page.name) + '-page';
  const componentNameCamelCase = toCamelCase(page.name) + 'Page';

  const cssAllocator = new CssClassAllocator();

  const { code: componentStylesCode, classes: componentStyleClasses } = exportStyles(page.data.styles.children);

  let styleCode = `[${componentNameKebabCase}] {
  display: block;
  width: 100%;
  height: 100%;
}

${componentStylesCode}
`;

  const assetImports: Record<string, string> = {};

  const addStyle = (name: string, style: [string, string][]) => {
    const cls = cssAllocator.allocate(name);

    styleCode += '\n' + exportStyle(cls, style) + '\n';

    return cls;
  };

  const getStyleRef = (name: string) =>
    name in componentStyleClasses ? componentStyleClasses[name] : globalCssClasses[name];

  const getAsset = (name: string) => {
    const camelCaseName = toCamelCase(name);

    if (name in assetImports) return camelCaseName;

    assetImports[name] =
      name in componentAssets ? `./assets/${componentAssets[name]}` : `../../assets/${globalAssets[name]}`;

    return camelCaseName;
  };

  let viewCode = `<link rel="stylesheet" href="./${componentNameCamelCase}.style.scss" scoped />

${exportElement(page.data.pageElement, addStyle, getStyleRef, getAsset)}
`;

  viewCode =
    `<!-- prettier-ignore -->
<insert>
${indentCode(
  Object.keys(assetImports)
    .map(assetName => `import ${toCamelCase(assetName)} from '${assetImports[assetName]}';`)
    .join('\n'),
  1
)}
</insert>

` + viewCode;

  return {
    view: viewCode,
    style: styleCode
  };
}

export { exportView };
