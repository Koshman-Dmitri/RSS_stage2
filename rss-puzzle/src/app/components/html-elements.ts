import { BaseComponent, Props } from './base-components';

export const Input = (props: Partial<HTMLInputElement>) =>
  new BaseComponent<HTMLInputElement>({ ...props, tag: 'input' });

export const Label = (props: Partial<HTMLLabelElement> & Partial<Props>) =>
  new BaseComponent<HTMLLabelElement>({ ...props, tag: 'label' });

export const Select = (props: Partial<HTMLSelectElement> & Partial<Props>) =>
  new BaseComponent<HTMLSelectElement>({ ...props, tag: 'select' });

export const Img = (props: Partial<HTMLImageElement> & Partial<Props>) =>
  new BaseComponent<HTMLImageElement>({ ...props, tag: 'img' });

export const Span = (props: Partial<HTMLSpanElement> & Partial<Props>) =>
  new BaseComponent<HTMLSpanElement>({ ...props, tag: 'span' });

export const Option = (props: Partial<HTMLOptionElement> & Partial<Props>) =>
  new BaseComponent<HTMLOptionElement>({ ...props, tag: 'option' });
