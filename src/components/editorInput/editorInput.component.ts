import { ArrayType, DataType, DataTypeEnum, DictionaryType, initializeData } from './DataType';
import { TypeProvider, getTypeProvider } from '../tabs/pageTab/providers/TypeProvider';
import typeInputComponent from './typeInput/typeInput.component';
import { Computed, Effect, State } from '@uixjs/reactivity';
import { Controller, Inject, Prop } from '@uixjs/core';
import defineComponent from './editorInput.view.html';

class EditorInputController extends Controller<{ type: DataType; nameFontSize: number }, {}, { value: any }> {
  @Prop('type')
  _realType: DataType;

  @State
  type: DataType;

  @State
  selectInput: HTMLSelectElement | null;

  @Inject(getTypeProvider)
  typeProvider: TypeProvider;

  @Computed
  get nameFontSize() {
    return `${this.props.nameFontSize ?? 18}px`;
  }

  @Effect
  updateType() {
    if (this._realType == null) return;

    if (this._realType.type === DataTypeEnum._Reference) {
      this.type = this.typeProvider.getType(this._realType.referenceName) as DataType;
      return;
    } else if (this._realType.type === DataTypeEnum._Dynamic) {
      const defaultType = this._realType.types[Object.keys(this._realType.types)[0]];
      this.type = this._realType.types[this.shared.value?.type] ?? defaultType;
      return;
    }

    this.type = this._realType;
  }

  @Effect<EditorInputController>($ => $.type?.type)
  initializeValue() {
    const defaultValue = initializeData(this.type, this.context);

    if (
      typeof defaultValue === 'object' &&
      defaultValue != null &&
      !(this.shared.value instanceof defaultValue.constructor)
    ) {
      this.shared.value = defaultValue;
      return;
    }

    if (typeof defaultValue !== typeof this.shared.value) this.shared.value = defaultValue;
  }

  @Effect
  updateSelectOptions(): void {
    if (this.selectInput == null || typeof this.type !== 'object' || this.type.type !== DataTypeEnum.Enum) return;

    const options: string[] = this.type.values ?? (this.type.getValues as any)(this.context);

    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      this.selectInput.options[i] = new Option(option, option, undefined, option === this.shared.value);
    }

    this.shared.value = this.selectInput.value;
  }

  addKey() {
    this.shared.value.push(['key', initializeData((this.type as DictionaryType).valueType, this.context)]);
  }

  addValue() {
    this.shared.value.push(initializeData((this.type as ArrayType).valueType, this.context));
  }

  removeIndex(index: number) {
    this.shared.value.splice(index, 1);
  }
}

const editorInputComponent = defineComponent({
  name: 'editor-input',
  controller: EditorInputController,
  dependencies: [typeInputComponent]
});

export default editorInputComponent;
export { editorInputComponent };
