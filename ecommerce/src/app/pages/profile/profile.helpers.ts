import { Customer } from '@commercetools/platform-sdk';
import { Addresses } from 'globalConsts/api.const';
import { ProfileInfoProps } from 'pages/profile/components/profileInfo/profileInfo.types';
import { LocalStorageService } from 'services/localStorage.service';

export function makeProfileProps(data: Customer): ProfileInfoProps {
  const customerAddresses = data.addresses.map((addr) => {
    const address = {
      type: data.billingAddressIds?.includes(addr.id!) ? Addresses.BILLING : Addresses.SHIPPING,
      city: addr.city,
      street: addr.streetName,
      postalCode: addr.postalCode,
      country: addr.country,
      addressId: addr.id,
      defaultBilAddress: '',
      defaultShipAddress: '',
    };

    if (data.defaultBillingAddressId) address.defaultBilAddress = data.defaultBillingAddressId;
    if (data.defaultShippingAddressId) address.defaultShipAddress = data.defaultShippingAddressId;

    return address;
  });

  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    dateOfBirth: data.dateOfBirth,
    addresses: customerAddresses,
  } as ProfileInfoProps;
}

export function getCustomerIdFromLS(): string | null {
  return LocalStorageService.getData('customerId');
}
