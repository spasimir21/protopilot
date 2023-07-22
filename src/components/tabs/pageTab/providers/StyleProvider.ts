import { DataTypeEnum, EnumType } from '../../../editorInput/DataType';
import { Computed, Reactive } from '@uixjs/reactivity';
import { createContextValue } from '@uixjs/core';
import { PageData } from '../PageData';
import { StyleItem } from '../Item';

@Reactive
class StyleProvider {
  constructor(private readonly pageData: PageData) {}

  @Computed
  get styleNames() {
    if (this.pageData.styles.children == null) return [];
    return (this.pageData.styles.children as StyleItem[]).map(style => style.name);
  }

  getStyle(name: string) {
    if (this.pageData.styles.children == null) return null;
    return (this.pageData.styles.children as StyleItem[]).find(style => style.name === name)?.style;
  }
}

const [provideStyleProvider, getStyleProvider] = createContextValue<StyleProvider>('styleProvider');

const StyleEnumType: EnumType = {
  type: DataTypeEnum.Enum as const,
  getValues: context => getStyleProvider(context)?.styleNames ?? []
};

export { StyleProvider, provideStyleProvider, getStyleProvider, StyleEnumType };
