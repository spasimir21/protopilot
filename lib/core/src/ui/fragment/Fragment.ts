import './patches';

class Fragment extends Comment {
  constructor(readonly nodes: Node[]) {
    super();
    for (const node of nodes) (node as any).fragmentParent = this;
  }

  insertNodes() {
    if (this.parentNode == null) return;
    const boundary = this.nextSibling;
    for (const node of this.nodes) this.parentNode.insertBefore(node, boundary);
  }

  removeNodes() {
    if (this.parentNode == null) return;
    for (const node of this.nodes) (this.parentNode as any).removeChild(node, true); // Check patches to see the meaning of the second parameter
  }

  override appendChild<T extends Node>(node: T) {
    if ((node as any) === this) return node;
    this.addNode(node);
    if (this.parentNode == null) return node;
    this.parentNode.insertBefore(node, this.nodes[this.nodes.length - 1]?.nextSibling);
    return node;
  }

  addNode(node: Node) {
    (node as any).fragmentParent = this;
    this.nodes.push(node);
  }

  removeNode(node: Node) {
    if ((node as any).fragmentParent === this) (node as any).fragmentParent = null;
    const index = this.nodes.indexOf(node);
    if (index != -1) this.nodes.splice(index, 1);
  }

  replaceNode(child: Node, ...nodes: Node[]) {
    nodes = nodes.filter(node => node != this);

    if ((child as any).fragmentParent === this) (child as any).fragmentParent = null;
    for (const node of nodes) (node as any).fragmentParent = this;

    const index = this.nodes.indexOf(child);
    if (index != -1) this.nodes.splice(index, 1, ...nodes);
  }

  removeChildAtIndex(index: number) {
    const node = this.nodes.splice(index, 1)[0];
    if ((node as any)?.fragmentParent === this) (node as any).fragmentParent = null;
    if (this.parentNode) this.parentNode.removeChild(node);
  }
}

export { Fragment };
