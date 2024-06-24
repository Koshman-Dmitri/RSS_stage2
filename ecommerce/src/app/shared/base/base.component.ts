import { Props } from './base.types';

export class BaseComponent<T extends HTMLElement = HTMLElement> {
  private readonly node: T;

  private readonly children: BaseComponent[] = [];

  constructor(props: Props<T>, ...children: BaseComponent[]) {
    const node = document.createElement(props.tag ?? 'div') as T;

    if (props.text) node.textContent = props.text;

    this.node = node;
    this.setProps(props);

    if (children) this.appendChildren(children);
  }

  public getNode(): T {
    return this.node;
  }

  public getId(): string {
    return this.node.id;
  }

  public getChildren(): BaseComponent[] {
    return this.children;
  }

  public getText(): string | null {
    return this.node.textContent;
  }

  public setAttribute(attribute: string, value: string): void {
    this.node.setAttribute(attribute, value);
  }

  public getAttribute(attribute: string): string | null {
    return this.node.getAttribute(attribute);
  }

  public setText(text: string): void {
    this.node.textContent = text;
  }

  public setProps(props: Props<T>): void {
    Object.assign(this.node, props);
  }

  public addListener(
    event: string,
    listener: (evt?: Event) => void,
    options?: AddEventListenerOptions | boolean,
  ): void {
    this.node.addEventListener(event, listener, options);
  }

  public append(child: BaseComponent): void {
    this.children.push(child);
    this.node.append(child.node);
  }

  public appendChildren(children: BaseComponent[]): void {
    children.forEach((child) => this.append(child));
  }

  public addClass(className: string): void {
    this.node.classList.add(className);
  }

  public toggleClass(className: string): void {
    this.node.classList.toggle(className);
  }

  public containsClass(className: string): boolean {
    return this.node.classList.contains(className);
  }

  public removeClass(className: string): void {
    this.node.classList.remove(className);
  }

  public removeAttribute(attribute: string): void {
    this.node.removeAttribute(attribute);
  }

  public removeListener(
    event: string,
    listener: (evt?: Event) => void,
    options?: AddEventListenerOptions | boolean,
  ): void {
    this.node.removeEventListener(event, listener, options);
  }

  public destroyChildren(): void {
    this.children.forEach((child) => child.destroy());
    this.children.length = 0;
  }

  public destroy(): void {
    this.node.remove();
  }
}
