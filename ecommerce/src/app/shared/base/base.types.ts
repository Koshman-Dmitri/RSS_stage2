export type Props<T extends HTMLElement = HTMLElement> = Partial<
  Omit<T, 'style' | 'dataset' | 'classList' | 'children' | 'tagName' | 'textContent'>
> & {
  text?: string;
  tag?: keyof HTMLElementTagNameMap;
};
