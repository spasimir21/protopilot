import { getStyleProvider } from '../../components/tabs/pageTab/providers/StyleProvider';
import { ElementItem } from '../../components/tabs/pageTab/Item';
import { effect } from '@uixjs/reactivity';

function previewStyle(element: HTMLElement, _data: any, item: ElementItem) {
  const styleProvider = getStyleProvider(_data.context);

  return effect(() => {
    let style = '';

    for (const [prop, value] of item.style) {
      style += `${prop}: ${value};`;
    }

    for (const styleRef of item.styleReferences) {
      const styleProps = styleProvider.getStyle(styleRef);
      if (styleProps == null) continue;

      for (const [prop, value] of styleProps) {
        style += `${prop}: ${value};`;
      }
    }

    element.setAttribute('style', style);
  }).cleanup;
}

export { previewStyle };
