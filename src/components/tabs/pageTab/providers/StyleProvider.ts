import { getGlobalPageData } from '../../../tabSelector/tabSelector.component';
import { DataTypeEnum, EnumType } from '../../../editorInput/DataType';
import { Computed, Reactive } from '@uixjs/reactivity';
import { createContextValue } from '@uixjs/core';
import { PageData } from '../PageData';
import { StyleItem } from '../Item';

@Reactive
class StyleProvider {
  private readonly globalPageData: PageData;

  constructor(private readonly pageData: PageData, context: any) {
    this.globalPageData = getGlobalPageData(context);
  }

  @Computed
  get styleNames() {
    const globalStyleNames = (this.globalPageData.styles.children as StyleItem[]).map(f => f.name);
    if (this.globalPageData === this.pageData) return globalStyleNames;

    const pageStyles = (this.pageData.styles.children as StyleItem[]).map(f => f.name);
    return [...pageStyles, ...globalStyleNames];
  }

  getStyle(name: string) {
    if (this.pageData.styles.children == null) return null;
    return (
      (this.pageData.styles.children as StyleItem[]).find(style => style.name === name)?.style ??
      (this.globalPageData.styles.children as StyleItem[]).find(style => style.name === name)?.style
    );
  }
}

const [provideStyleProvider, getStyleProvider] = createContextValue<StyleProvider>('styleProvider');

const StyleEnumType: EnumType = {
  type: DataTypeEnum.Enum as const,
  getValues: context => getStyleProvider(context)?.styleNames ?? []
};

export { StyleProvider, provideStyleProvider, getStyleProvider, StyleEnumType };
