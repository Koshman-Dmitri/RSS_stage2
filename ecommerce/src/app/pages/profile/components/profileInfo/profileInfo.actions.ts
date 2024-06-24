import { BaseAddress, CustomerUpdateAction } from '@commercetools/platform-sdk';

export const addAddressAction = (address: BaseAddress): CustomerUpdateAction => {
  return {
    action: 'addAddress',
    address,
  };
};

export const deleteAddressAction = (addressId: string): CustomerUpdateAction => {
  return {
    action: 'removeAddress',
    addressId,
  };
};

export const changeAddressAction = (
  addressId: string,
  address: BaseAddress,
): CustomerUpdateAction => {
  return {
    action: 'changeAddress',
    addressId,
    address,
  };
};

export const addBillingAddressAction = (addressId: string | undefined): CustomerUpdateAction => {
  return {
    action: 'addBillingAddressId',
    addressId,
  };
};

export const addShippingAddressAction = (addressId: string | undefined): CustomerUpdateAction => {
  return {
    action: 'addShippingAddressId',
    addressId,
  };
};

export const removeBillingAddressAction = (addressId: string | undefined): CustomerUpdateAction => {
  return {
    action: 'removeBillingAddressId',
    addressId,
  };
};

export const setDefaultBillingAddressAction = (
  addressId: string | undefined,
): CustomerUpdateAction => {
  return {
    action: 'setDefaultBillingAddress',
    addressId,
  };
};

export const setDefaultShippingAddressAction = (
  addressId: string | undefined,
): CustomerUpdateAction => {
  return {
    action: 'setDefaultShippingAddress',
    addressId,
  };
};

export const removeShippingAddressAction = (
  addressId: string | undefined,
): CustomerUpdateAction => {
  return {
    action: 'removeShippingAddressId',
    addressId,
  };
};

export const setFirstNameAction = (firstName: string): CustomerUpdateAction => {
  return {
    action: 'setFirstName',
    firstName,
  };
};

export const setLastNameAction = (lastName: string): CustomerUpdateAction => {
  return {
    action: 'setLastName',
    lastName,
  };
};

export const changeEmailAction = (email: string): CustomerUpdateAction => {
  return {
    action: 'changeEmail',
    email,
  };
};

export const changeBirthAction = (dateOfBirth: string): CustomerUpdateAction => {
  return {
    action: 'setDateOfBirth',
    dateOfBirth,
  };
};
