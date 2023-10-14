import { DataTypeEnum, EnumType } from '../../../editorInput/DataType';
import { Computed, Reactive } from '@uixjs/reactivity';
import { createContextValue } from '@uixjs/core';
import { FunctionItem } from '../Item';
import { PageData } from '../PageData';
import { getGlobalPageData } from '../../../tabSelector/tabSelector.component';

@Reactive
class FunctionProvider {
  private readonly globalPageData: PageData;

  constructor(private readonly pageData: PageData, context: any) {
    this.globalPageData = getGlobalPageData(context);
  }

  @Computed
  get functionNames() {
    const globalFunctionNames = (this.globalPageData.functions.children as FunctionItem[]).map(f => f.name);
    if (this.globalPageData === this.pageData) return globalFunctionNames;

    const pageFunctions = (this.pageData.functions.children as FunctionItem[]).map(f => f.name);
    return [...pageFunctions, ...globalFunctionNames];
  }

  getFunction(name: string) {
    if (this.pageData.functions.children == null) return null;
    return (
      (this.pageData.functions.children as FunctionItem[]).find(f => f.name === name) ??
      (this.globalPageData.functions.children as FunctionItem[]).find(f => f.name === name)
    );
  }
}

const [provideFunctionProvider, getFunctionProvider] = createContextValue<FunctionProvider>('functionProvider');

const FunctionEnumType: EnumType = {
  type: DataTypeEnum.Enum as const,
  getValues: context => getFunctionProvider(context)?.functionNames ?? []
};

export { FunctionProvider, provideFunctionProvider, getFunctionProvider, FunctionEnumType };
