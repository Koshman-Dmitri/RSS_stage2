import { Addresses } from 'globalConsts/api.const';
import { Country } from 'globalTypes/api.type';

export type TableRowProps = {
  type: Addresses;
  city: string;
  street: string;
  postalCode: string;
  country: Country;
  addressId: string;
  defaultBilAddress?: string;
  defaultShipAddress?: string;
};
