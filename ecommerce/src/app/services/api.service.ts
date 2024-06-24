import {
  ByProjectKeyRequestBuilder,
  Cart,
  CartUpdateAction,
  Customer,
  CustomerChangePassword,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  CustomerUpdateAction,
  DiscountCode,
  ProductProjectionPagedSearchResponse,
  Project,
} from '@commercetools/platform-sdk';
import { TokenCache } from '@commercetools/sdk-client-v2';
import { PRODUCTS_CATEGORIES_IDS, PRODUCTS_COUNT_ON_PAGE } from 'globalConsts/api.const';
import { ApiClientResponse } from 'globalTypes/api.type';
import { CustomerLoginData, FilteredProductsProps, NewCustomer } from 'interfaces/api.interface';
import { clientBuild } from 'utils/clientBuild.util';
import { getQueryFilterString } from 'utils/strings.util';
import { tokenCache } from 'utils/tokenCache.util';

export class ApiService {
  public apiRoot: ByProjectKeyRequestBuilder;

  public tokenCache: TokenCache;

  constructor() {
    this.apiRoot = clientBuild.apiRoot;
    this.tokenCache = tokenCache;
  }

  public getProject(): ApiClientResponse<Project> {
    return this.apiRoot.get().execute();
  }

  public getCustomers(): ApiClientResponse<CustomerPagedQueryResponse> {
    return this.apiRoot.customers().get().execute();
  }

  public loginCustomer(newCustomer: CustomerLoginData): ApiClientResponse<CustomerSignInResult> {
    this.apiRoot = clientBuild.getApiRootByPasswordFlow(newCustomer);

    return this.apiRoot.login().post({ body: newCustomer }).execute();
  }

  public getCustomerByEmail(customerEmail: string): ApiClientResponse<CustomerPagedQueryResponse> {
    return this.apiRoot
      .customers()
      .get({ queryArgs: { where: `email="${customerEmail}"` } })
      .execute();
  }

  public getCustomerById(customerId: string): ApiClientResponse<Customer> {
    return this.apiRoot.customers().withId({ ID: customerId }).get().execute();
  }

  public signupCustomer(newCustomer: NewCustomer): ApiClientResponse<CustomerSignInResult> {
    return this.apiRoot.me().signup().post({ body: newCustomer }).execute();
  }

  public logout(): void {
    this.apiRoot = clientBuild.getApiRootByAnonymousFlow();
  }

  public getFilteredProducts({
    filterProps,
    sortProps,
    searchText,
    pageNumber,
  }: FilteredProductsProps): ApiClientResponse<ProductProjectionPagedSearchResponse> {
    const { slug, category, price, brands, colors } = filterProps ?? {};

    const queryFilter: string[] = [];
    const querySort: string[] = [];

    if (slug) {
      queryFilter.push(`slug.en: "${slug}"`);
    }

    if (category) {
      queryFilter.push(`categories.id: "${PRODUCTS_CATEGORIES_IDS[category]}"`);
    }

    if (price) {
      queryFilter.push(
        `variants.price.centAmount: range (${price.from ? price.from * 100 : 0} to ${price.to ? price.to * 100 : '*'})`,
      );
    }

    if (brands && brands.length) {
      queryFilter.push(`variants.attributes.brand: ${getQueryFilterString(brands)}`);
    }

    if (colors && colors.length) {
      queryFilter.push(`variants.attributes.color.label: ${getQueryFilterString(colors)}`);
    }

    if (sortProps?.value === 'name') {
      querySort.push(`name.en ${sortProps.direction}`);
    } else if (sortProps?.value === 'price') {
      querySort.push(`price ${sortProps.direction}`);
    }

    return this.apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          markMatchingVariants: true,
          filter: queryFilter,
          sort: querySort.length ? querySort : ['name.en asc'],
          fuzzy: false,
          offset: (pageNumber ?? 0) * PRODUCTS_COUNT_ON_PAGE,
          limit: PRODUCTS_COUNT_ON_PAGE,
          'text.en': searchText,
        },
      })
      .execute();
  }

  public updateCustomerInfo(
    customerId: string,
    version: number,
    data: CustomerUpdateAction[],
  ): ApiClientResponse<Customer> {
    return this.apiRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version,
          actions: [...data],
        },
      })
      .execute();
  }

  public updateCustomerPassword(data: CustomerChangePassword): ApiClientResponse<Customer> {
    return this.apiRoot.customers().password().post({ body: data }).execute();
  }

  public updatePasswordFlowCredentials(credentials: CustomerLoginData): ApiClientResponse<Project> {
    tokenCache.resetCache();
    this.apiRoot = clientBuild.getApiRootByPasswordFlow(credentials);
    return this.apiRoot.get().execute();
  }

  public getCart(cartId: string): ApiClientResponse<Cart> {
    return this.apiRoot.carts().withId({ ID: cartId }).get().execute();
  }

  public createCustomerCart(customerId: string): ApiClientResponse<Cart> {
    return this.apiRoot
      .carts()
      .post({ body: { customerId, currency: 'USD' } })
      .execute();
  }

  public createAnonymousCart(anonymousId: string): ApiClientResponse<Cart> {
    return this.apiRoot
      .carts()
      .post({ body: { currency: 'USD', anonymousId } })
      .execute();
  }

  public async addProductToCart(
    cartId: string,
    version: number,
    sku: string,
  ): ApiClientResponse<Cart> {
    return this.apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          actions: [{ action: 'addLineItem', sku }],
          version,
        },
      })
      .execute();
  }

  public async removeProductFromCart(
    cartId: string,
    version: number,
    lineItemId: string,
  ): ApiClientResponse<Cart> {
    return this.apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          actions: [{ action: 'removeLineItem', lineItemId }],
          version,
        },
      })
      .execute();
  }

  public clearCart(
    cartId: string,
    version: number,
    actions: CartUpdateAction[],
  ): ApiClientResponse<Cart> {
    return this.apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: { actions, version },
      })
      .execute();
  }

  public changeProductQuantity(
    cartId: string,
    version: number,
    lineItemId: string,
    quantity: number,
  ): ApiClientResponse<Cart> {
    return this.apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          actions: [{ action: 'changeLineItemQuantity', lineItemId, quantity }],
          version,
        },
      })
      .execute();
  }

  public getPromocode(id: string): ApiClientResponse<DiscountCode> {
    return this.apiRoot.discountCodes().withId({ ID: id }).get().execute();
  }

  public usePromocode(cartId: string, version: number, promocode: string): ApiClientResponse<Cart> {
    return this.apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          actions: [{ action: 'addDiscountCode', code: promocode }],
          version,
        },
      })
      .execute();
  }

  public abortPromocode(cartId: string, version: number, codeId: string): ApiClientResponse<Cart> {
    return this.apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          actions: [
            {
              action: 'removeDiscountCode',
              discountCode: {
                id: codeId,
                typeId: 'discount-code',
              },
            },
          ],
          version,
        },
      })
      .execute();
  }
}

export const apiService = new ApiService();
