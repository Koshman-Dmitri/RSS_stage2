import isNotNullable from '../utils/isNotNullable';

export type Props<T extends HTMLElement = HTMLElement> = T & {
  tag: string;
  className: string;
  text: string;
};

type ChildType = BaseComponent | HTMLElement | null;

export class BaseComponent<T extends HTMLElement = HTMLElement> {
  protected node: T;

  protected children: BaseComponent[] = [];

  constructor(props: Partial<Props<T>>, ...children: ChildType[]) {
    const node = document.createElement(props.tag ?? 'div') as T;
    Object.assign(node, props);
    if (props.text) node.textContent = props.text;
    this.node = node;
    if (children) this.appendChildren(children);
  }

  public getNode() {
    return this.node;
  }

  public getChildren() {
    return this.children;
  }

  public append(child: BaseComponent | HTMLElement) {
    if (child instanceof BaseComponent) {
      this.node.append(child.getNode());
      this.children.push(child);
    } else {
      this.node.append(child);
    }
  }

  public appendChildren(children: ChildType[]): void {
    children.filter(isNotNullable).forEach((child) => {
      this.append(child);
    });
  }

  public text(text: string): void {
    this.node.textContent = text;
  }

  public addClass(className: string): void {
    this.node.classList.add(className);
  }

  public removeClass(className: string): void {
    this.node.classList.remove(className);
  }

  public toggleClass(className: string): void {
    this.node.classList.toggle(className);
  }

  public containsClass(className: string): boolean {
    return this.node.classList.contains(className);
  }

  public setAttribute(attr: string, value: string): void {
    this.node.setAttribute(attr, value);
  }

  public removeAttribute(attr: string): void {
    this.node.removeAttribute(attr);
  }

  public addEventListener(
    event: string,
    listener: (event?: Event) => void,
    options = false
  ): void {
    this.node.addEventListener(event, listener, options);
  }

  public removeEventListener(
    event: string,
    listener: () => void,
    options = false
  ): void {
    this.node.removeEventListener(event, listener, options);
  }

  public deleteChildren(): void {
    this.children.forEach((child) => {
      child.deleteNode();
    });
    this.children.length = 0;
  }

  public deleteNode(): void {
    this.deleteChildren();
    this.node.remove();
  }
}
