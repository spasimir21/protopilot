import { DataTypeEnum, EnumType } from '../../../editorInput/DataType';
import { Computed, Reactive } from '@uixjs/reactivity';
import { createContextValue } from '@uixjs/core';
import { FunctionItem } from '../Item';
import { PageData } from '../PageData';

@Reactive
class FunctionProvider {
  constructor(private readonly pageData: PageData) {}

  @Computed
  get functionNames() {
    return (this.pageData.functions.children as FunctionItem[]).map(f => f.name);
  }

  getFunction(name: string) {
    if (this.pageData.functions.children == null) return null;
    return (this.pageData.functions.children as FunctionItem[]).find(f => f.name === name);
  }
}

const [provideFunctionProvider, getFunctionProvider] = createContextValue<FunctionProvider>('functionProvider');

const FunctionEnumType: EnumType = {
  type: DataTypeEnum.Enum as const,
  getValues: context => getFunctionProvider(context)?.functionNames ?? []
};

export { FunctionProvider, provideFunctionProvider, getFunctionProvider, FunctionEnumType };
