import { FunctionItem } from '../../../components/tabs/pageTab/Item';
import { toCamelCase } from '../../../helpers/naming';
import { indentCode } from '../../indent';

const alterFunctionCode = (code: string) =>
  code.replace(/\$\s*\.\s*([a-zA-Z0-9_$]+)\s*\(/g, (_, name) => `$.${name}($, `);

const exportFunction = (func: FunctionItem) =>
  `${toCamelCase(func.name)}(${['$', ...func.argumentNames].map(arg => `${arg}: any`).join(', ')}) {
${indentCode(alterFunctionCode(func.code), 1)}
}`;

export { exportFunction, alterFunctionCode };
