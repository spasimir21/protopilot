function toKebabCase(name: string) {
  return name
    .replace(/(\s+[a-z])/g, match => match.trim().toUpperCase())
    .replace(/\s+/g, '')
    .split(/(?=[A-Z ]+)/)
    .map(part => part.toLowerCase())
    .join('-');
}

function toCamelCase(name: string) {
  name = name.replace(/\s+/g, '');
  return name.charAt(0).toLowerCase() + name.substring(1);
}

export { toKebabCase, toCamelCase };
