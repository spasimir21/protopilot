const indentCode = (code: string, levels: number) =>
  code
    .split('\n')
    .map(line => '  '.repeat(levels) + line)
    .join('\n');

export { indentCode };
