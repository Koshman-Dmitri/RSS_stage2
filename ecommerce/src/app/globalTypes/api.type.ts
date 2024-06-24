import { Cart, ClientResponse } from '@commercetools/platform-sdk';

export type ApiClientResponse<T> = Promise<ClientResponse<T>>;

export type CartResponse = ClientResponse<Cart>;

export type Country = 'BY' | 'UA';

export type SortType = 'asc' | 'desc';

export type SortValue = 'name' | 'price';
