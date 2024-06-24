import { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

class CustomTokenCache implements TokenCache {
  public cache: TokenStore;

  constructor() {
    this.cache = {
      token: '',
      expirationTime: 0,
      refreshToken: undefined,
    };
  }

  public set(newCache: TokenStore): void {
    this.cache = newCache;
  }

  public get(): TokenStore {
    return this.cache;
  }

  public resetCache(): void {
    this.cache = {
      token: '',
      expirationTime: 0,
      refreshToken: undefined,
    };
  }
}

export const tokenCache = new CustomTokenCache();
