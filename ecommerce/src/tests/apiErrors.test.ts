import { Addresses } from 'globalConsts/api.const';
import { NewAddress, NewCustomer } from 'interfaces/api.interface';
import { apiService } from 'services/api.service';
import { describe, expect, test } from 'vitest';

describe('check signup api errors', () => {
  const billingAddress: NewAddress = {
    key: Addresses.BILLING,
    streetName: 'street',
    city: 'city',
    postalCode: '200000',
    country: 'BY',
  };

  const shippingAddress: NewAddress = {
    ...billingAddress,
    key: Addresses.SHIPPING,
  };

  const newCustomer: NewCustomer = {
    email: 'test@mail.ru',
    password: 'Qwerty123',
    firstName: 'First',
    lastName: 'Last',
    dateOfBirth: '2000-10-12',
    addresses: [billingAddress, shippingAddress],
  };

  test('check empty email', () => {
    expect.assertions(1);

    return apiService
      .signupCustomer({ ...newCustomer, email: '' })
      .catch((error) =>
        expect((error as Error).message).toBe('The provided value is not a valid email'),
      );
  });

  test('check empty password', () => {
    expect.assertions(1);

    return apiService
      .signupCustomer({ ...newCustomer, password: '' })
      .catch((error) => expect((error as Error).message).toBe("'password' should not be empty."));
  });

  test('check invalid date', () => {
    expect.assertions(1);

    return apiService
      .signupCustomer({ ...newCustomer, dateOfBirth: '' })
      .catch((error) =>
        expect((error as Error).message).toBe('Request body does not contain valid JSON.'),
      );
  });

  test('check existing customer', () => {
    expect.assertions(1);

    return apiService
      .signupCustomer({ ...newCustomer })
      .catch((error) =>
        expect((error as Error).message).toBe(
          'There is already an existing customer with the provided email.',
        ),
      );
  });
});

describe('check login api errors', () => {
  test('check invalid credentials', () => {
    expect.assertions(1);

    return apiService
      .loginCustomer({
        email: 'non-exist@mail.ru',
        password: 'Qwerty123',
      })
      .catch((error) =>
        expect((error as Error).message).toBe(
          'Customer account with the given credentials not found.',
        ),
      );
  });
});
