import { StateItem } from '../../../components/tabs/pageTab/Item';
import { toCamelCase } from '../../../helpers/naming';
import { exportType } from '../../type';

const exportState = (state: StateItem) =>
  `@State
${toCamelCase(state.name)}: ${exportType(state.dataType)} = ${JSON.stringify(state.value)};`;

export { exportState };
