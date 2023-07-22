import { Fragment } from './Fragment';

function patch<T extends new (...args: any) => any>(
  constructor: T,
  funcName: string,
  func: (this: InstanceType<T>, original: (...args: any[]) => any, ...args: any[]) => any
) {
  const original = (constructor as any).prototype[funcName];
  (constructor as any).prototype[funcName] = function (...args: any[]) {
    return func.call(this, original ? original.bind(this) : null, ...args);
  };
}

patch(Element, 'appendChild', function (appendChild, node: Node) {
  const result = appendChild(node);

  if (node instanceof Fragment) node.insertNodes();

  return result;
});

patch(Element, 'insertBefore', function (insertBefore, node: Node, child: Node) {
  const result = insertBefore(node, child);

  if (node instanceof Fragment) node.insertNodes();

  return result;
});

patch(Element, 'removeChild', function (removeChild, child: Node, skipFragmentParentCheck: boolean) {
  if (!skipFragmentParentCheck && (child as any).fragmentParent != null)
    (child as any).fragmentParent.removeNode(child);

  if (child instanceof Fragment) child.removeNodes();

  try {
    removeChild(child);
  } catch (err) {}
});

function removePatch(this: Node) {
  if (this.parentNode != null) this.parentNode.removeChild(this);
}

patch(CharacterData, 'remove', removePatch);
patch(Element, 'remove', removePatch);

function replaceWithPatch(this: Node, _: any, ...nodes: Node[]) {
  if (nodes.length === 0 || (nodes.length === 1 && nodes[0] === this)) return;

  if ((this as any).fragmentParent != null) (this as any).fragmentParent.replaceNode(this, ...nodes);

  if (this.parentNode == null) return;

  const sibling = this.nextSibling;
  const parent = this.parentNode;

  if (this instanceof Fragment) this.removeNodes();

  parent.replaceChild(nodes[0], this);

  if (nodes[0] instanceof Fragment) nodes[0].insertNodes();

  for (let i = 1; i < nodes.length; i++) parent.insertBefore(nodes[i], sibling);
}

patch(CharacterData, 'replaceWith', replaceWithPatch);
patch(Element, 'replaceWith', replaceWithPatch);
