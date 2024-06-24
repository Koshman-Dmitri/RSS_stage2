import './tags.scss';

import {
  Anchor,
  Button,
  Div,
  Fieldset,
  Form,
  Heading,
  Image,
  Input,
  Label,
  LI,
  Option,
  Select,
  Span,
  Table,
  TD,
  TR,
  UL,
} from 'globalTypes/elements.type';
import { BaseComponent } from 'shared/base/base.component';

import { TagProps } from './tags.types';

export const h1 = (text: string, className: string = ''): Heading =>
  new BaseComponent({ tag: 'h1', className, text });

export const h2 = (text: string, className: string = ''): Heading =>
  new BaseComponent({ tag: 'h2', className, text });

export const h3 = (text: string, className: string = ''): Heading =>
  new BaseComponent({ tag: 'h3', className, text });

export const button = (props: TagProps<HTMLButtonElement>, ...children: BaseComponent[]): Button =>
  new BaseComponent({ ...props, tag: 'button' }, ...children);

export const label = (props: TagProps<HTMLLabelElement>, ...children: BaseComponent[]): Label =>
  new BaseComponent({ ...props, tag: 'label' }, ...children);

export const input = (props: TagProps<HTMLInputElement>): Input =>
  new BaseComponent({ ...props, tag: 'input' });

export const div = (props: TagProps<HTMLDivElement>, ...children: BaseComponent[]): Div =>
  new BaseComponent(props, ...children);

export const a = (props: TagProps<HTMLAnchorElement>, ...children: BaseComponent[]): Anchor =>
  new BaseComponent({ ...props, tag: 'a' }, ...children);

export const span = (props: TagProps<HTMLSpanElement>, ...children: BaseComponent[]): Span =>
  new BaseComponent({ ...props, tag: 'span' }, ...children);

export const form = (props: TagProps<HTMLFormElement>, ...children: BaseComponent[]): Form =>
  new BaseComponent({ ...props, tag: 'form' }, ...children);

export const fieldset = (
  props: TagProps<HTMLFieldSetElement>,
  ...children: BaseComponent[]
): Fieldset => new BaseComponent({ ...props, tag: 'fieldset' }, ...children);

export const select = (props: TagProps<HTMLSelectElement>, ...children: BaseComponent[]): Select =>
  new BaseComponent({ ...props, tag: 'select' }, ...children);

export const option = (props: TagProps<HTMLOptionElement>): Option =>
  new BaseComponent({ ...props, tag: 'option' });

export const img = (props: TagProps<HTMLImageElement>): Image =>
  new BaseComponent({ ...props, tag: 'img' });

export const ul = (props: TagProps<HTMLUListElement>, ...children: BaseComponent[]): UL =>
  new BaseComponent({ ...props, tag: 'ul' }, ...children);

export const li = (props: TagProps<HTMLLIElement>, ...children: BaseComponent[]): LI =>
  new BaseComponent({ ...props, tag: 'li' }, ...children);

export const table = (props: TagProps<HTMLTableElement>, ...children: BaseComponent[]): Table =>
  new BaseComponent({ ...props, tag: 'table' }, ...children);

export const tr = (props: TagProps<HTMLTableRowElement>, ...children: BaseComponent[]): TR =>
  new BaseComponent({ ...props, tag: 'tr' }, ...children);

export const td = (props: TagProps<HTMLTableCellElement>, ...children: BaseComponent[]): TD =>
  new BaseComponent({ ...props, tag: 'td' }, ...children);
