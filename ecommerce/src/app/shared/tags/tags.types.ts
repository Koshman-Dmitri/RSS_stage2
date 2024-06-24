import { Props } from 'shared/base/base.types';

export type TagProps<T extends HTMLElement = HTMLElement> = Omit<Props<T>, 'tag'>;
