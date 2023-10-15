import { toKebabCase } from '../helpers/naming';

class CssClassAllocator {
  private readonly classes: Set<string> = new Set();

  constructor(public readonly prefix?: string) {}

  allocate(name: string) {
    let kebabCaseName = toKebabCase(name);
    if (this.prefix) kebabCaseName = `${this.prefix}-${kebabCaseName}`;

    if (!this.classes.has(kebabCaseName)) {
      this.classes.add(kebabCaseName);
      return kebabCaseName;
    }

    let i = 1;
    while (this.classes.has(`${kebabCaseName}-${i}`)) i++;

    this.classes.add(`${kebabCaseName}-${i}`);
    return `${kebabCaseName}-${i}`;
  }
}

export { CssClassAllocator };
