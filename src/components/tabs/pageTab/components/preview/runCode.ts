function runGetter(code: string, defaultValue: any, $: any) {
  try {
    return new Function('$', `return ${code};`)($);
  } catch (err) {
    return defaultValue;
  }
}

export { runGetter };
