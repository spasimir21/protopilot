function _event(
  element: HTMLElement,
  eventType: string,
  callback: (event: Event) => void,
  options?: AddEventListenerOptions
) {
  element.addEventListener(eventType, callback, options);

  return () => element.removeEventListener(eventType, callback);
}

export { _event };
