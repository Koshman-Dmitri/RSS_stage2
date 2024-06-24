import { apiService } from 'services/api.service';
import { tokenCache } from 'utils/tokenCache.util';
import { describe, expect, test } from 'vitest';

describe('check existing data for LS', () => {
  test('check existing tokens and customerId', () => {
    expect(tokenCache.cache.refreshToken).toBeUndefined();

    return apiService
      .loginCustomer({
        email: 'test@mail.ru',
        password: 'Qwerty123',
      })
      .then((data) => {
        expect(tokenCache.cache.refreshToken).not.toBeUndefined();
        expect(tokenCache.cache.token).not.toBeUndefined();
        expect(data.body.customer.id).not.toBeUndefined();
      });
  });
});
