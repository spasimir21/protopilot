import { DataTypeEnum } from '../../../editorInput/DataTypeEnum';
import { Computed, Reactive } from '@uixjs/reactivity';
import { createContextValue } from '@uixjs/core';
import { PageData } from '../PageData';
import { TypeItem } from '../Item';
import { getGlobalPageData } from '../../../tabSelector/tabSelector.component';

const NUM_REGEX = /^\d+$/g;

const DEFAULT_TYPES = Object.keys(DataTypeEnum).filter(key => !key.startsWith('_') && key.match(NUM_REGEX) == null);

@Reactive
class TypeProvider {
  private readonly globalPageData: PageData;

  constructor(private readonly pageData: PageData, context: any) {
    this.globalPageData = getGlobalPageData(context);
  }

  @Computed
  get typeNames() {
    const types = (this.pageData.types.children as TypeItem[]).map(type => type.name);
    types.unshift(...DEFAULT_TYPES);
    if (this.globalPageData !== this.pageData)
      types.push(...(this.globalPageData.types.children as TypeItem[]).map(type => type.name));
    return types;
  }

  getType(name: string) {
    return (
      (this.pageData.types.children as TypeItem[]).find(type => type.name === name)?.dataType ??
      (this.globalPageData.types.children as TypeItem[]).find(type => type.name === name)?.dataType
    );
  }
}

const [provideTypeProvider, getTypeProvider] = createContextValue<TypeProvider>('typeProvider');

const TypeEnumType = {
  type: DataTypeEnum.Enum as const,
  getValues: (context: any) => getTypeProvider(context)?.typeNames ?? []
};

export { TypeProvider, provideTypeProvider, getTypeProvider, TypeEnumType };
