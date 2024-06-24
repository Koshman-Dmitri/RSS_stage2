import { CartResourceIdentifier } from '@commercetools/platform-sdk';
import {
  Addresses,
  ProductsBrands,
  ProductsCategories,
  ProductsColors,
} from 'globalConsts/api.const';
import { Country, SortType, SortValue } from 'globalTypes/api.type';

export interface CustomerLoginData {
  email: string;
  password: string;
  anonymousCart?: CartResourceIdentifier;
}

export interface NewCustomer extends CustomerLoginData {
  firstName: string;
  lastName: string;
  dateOfBirth: string; //* format (YYYY-MM-DD), for example: "2018-10-12"
  addresses: NewAddress[];
  defaultBillingAddress?: number; //* index in addresses field
  defaultShippingAddress?: number; //* index in addresses field
}

export interface NewAddress {
  key: Addresses;
  streetName: string;
  city: string;
  postalCode: string;
  country: Country;
}

export interface SortProps {
  value: SortValue;
  direction: SortType;
}

export interface FilterProps {
  slug?: string;
  category?: ProductsCategories;
  price?: {
    from?: number; // in dollars
    to?: number; // in dollars
  };
  brands?: ProductsBrands[];
  colors?: ProductsColors[];
}

export interface FilteredProductsProps {
  filterProps?: FilterProps;
  sortProps?: SortProps;
  searchText?: string;
  pageNumber?: number;
}
