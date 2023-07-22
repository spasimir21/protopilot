import { DataTypeEnum } from '../../../editorInput/DataTypeEnum';
import { Computed, Reactive } from '@uixjs/reactivity';
import { createContextValue } from '@uixjs/core';
import { PageData } from '../PageData';
import { TypeItem } from '../Item';

const NUM_REGEX = /^\d+$/g;

const DEFAULT_TYPES = Object.keys(DataTypeEnum).filter(key => !key.startsWith('_') && key.match(NUM_REGEX) == null);

@Reactive
class TypeProvider {
  constructor(private readonly pageData: PageData) {}

  @Computed
  get typeNames() {
    const types = (this.pageData.types.children as TypeItem[]).map(type => type.name);
    types.unshift(...DEFAULT_TYPES);
    return types;
  }

  getType(name: string) {
    return (this.pageData.types.children as TypeItem[]).find(type => type.name === name)?.dataType;
  }
}

const [provideTypeProvider, getTypeProvider] = createContextValue<TypeProvider>('typeProvider');

const TypeEnumType = {
  type: DataTypeEnum.Enum as const,
  getValues: (context: any) => getTypeProvider(context)?.typeNames ?? []
};

export { TypeProvider, provideTypeProvider, getTypeProvider, TypeEnumType };
