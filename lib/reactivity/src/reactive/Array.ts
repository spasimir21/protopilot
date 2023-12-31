import { SubscribableNode } from '../nodes/SubscribableNode';
import { $IS_REACTIVE, $RAW } from '../flags';
import { TrackStack } from '../TrackStack';
import { reactive } from '../reactive';
import { isEqual } from '../equal';

const NUMBER_REGEXP = /^\d+$/;

interface ArrayAndNodes {
  array: any[];
  nodes: {
    index: Record<string, SubscribableNode>;
    $length: SubscribableNode;
  };
}

function _push(this: ArrayAndNodes, ...items: any[]) {
  if (items.length !== 0) this.nodes.$length.emitChange();
  return this.array.push(...items.map(reactive));
}

function _pop(this: ArrayAndNodes) {
  if (this.array.length !== 0) this.nodes.$length.emitChange();
  return this.array.pop();
}

function _unshift(this: ArrayAndNodes, ...items: any[]) {
  const result = this.array.unshift(...items.map(reactive));
  for (const prop in this.nodes.index) this.nodes.index[prop].emitChange();
  if (items.length !== 0) this.nodes.$length.emitChange();
  return result;
}

function _shift(this: ArrayAndNodes) {
  const result = this.array.shift();
  for (const prop in this.nodes.index) this.nodes.index[prop].emitChange();
  if (this.array.length !== 0) this.nodes.$length.emitChange();
  return result;
}

function _splice(this: ArrayAndNodes, start: number, deleteCount: number, ...items: any[]) {
  const result = this.array.splice(start, deleteCount, ...items.map(reactive));
  if (deleteCount != items.length) this.nodes.$length.emitChange();
  for (let i = start; i < this.array.length; i++) if (i in this.nodes.index) this.nodes.index[i].emitChange();
  return result;
}

function makeArrayReactive(array: any[]): any {
  const nodes = {
    index: {} as Record<string, SubscribableNode>,
    $length: new SubscribableNode()
  };

  const _functionThis = { array, nodes };
  const functions = {
    push: _push.bind(_functionThis),
    pop: _pop.bind(_functionThis),
    unshift: _unshift.bind(_functionThis),
    shift: _shift.bind(_functionThis),
    splice: _splice.bind(_functionThis)
  };

  for (let i = 0; i < array.length; i++) array[i] = reactive(array[i]);

  const proxy = new Proxy(array, {
    get(target, prop) {
      if (prop === $IS_REACTIVE) return true;
      if (prop === $RAW) return target;

      if (prop in functions) return (functions as any)[prop];

      if (prop === 'length') {
        nodes.$length.track();
        return Reflect.get(target, prop);
      }

      if (TrackStack.isTracking && typeof prop === 'string' && prop.match(NUMBER_REGEXP) != null) {
        if (nodes.index[prop] == null) nodes.index[prop] = new SubscribableNode();
        nodes.index[prop].track();
      }

      return Reflect.get(target, prop);
    },
    set(target, prop, newValue) {
      if (prop === $RAW || prop === $IS_REACTIVE) return true;

      const oldValue = Reflect.get(target, prop);

      const didSet = Reflect.set(target, prop, reactive(newValue));

      if (typeof prop !== 'string' || !didSet || isEqual(oldValue, newValue)) return didSet;

      if (nodes.index[prop] != null) nodes.index[prop].emitChange();

      return didSet;
    }
  });

  return proxy;
}

export { makeArrayReactive };
