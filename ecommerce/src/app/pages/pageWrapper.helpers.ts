import { Cart, LocalizedString, ProductVariant } from '@commercetools/platform-sdk';
import {
  ProductsAttributes,
  ProductsBrands,
  ProductsCategories,
  ProductsColors,
} from 'globalConsts/api.const';
import { Anchor } from 'globalTypes/elements.type';
import { CustomerLoginData } from 'interfaces/api.interface';
import headerStyles from 'pages/header/header.module.scss';
import { BreadcrumbPath } from 'pages/shared/components/breadcrumbs/breadcrumbs.interfaces';
import { apiService } from 'services/api.service';
import { LocalStorageService } from 'services/localStorage.service';
import { routingService } from 'services/routing.service';
import { alertModal } from 'shared/alert/alert.component';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';
import { a } from 'shared/tags/tags.component';
import { tokenCache } from 'utils/tokenCache.util';

import { NO_SERVICE_AVAILABLE } from './cart/cart.consts';
import { PagesPaths, PRODUCTS_CATEGORIES_KEYS } from './pageWrapper.consts';

export function redirectToMain(): void {
  routingService.navigate(PagesPaths.HOME);
}

export function getNavLink(
  title: string,
  path: string,
  className: string,
  ...children: BaseComponent[]
): Anchor {
  const homeLink = a({ text: title, href: path, className }, ...children);
  homeLink.setAttribute('data-navigo', '');

  return homeLink;
}

export function isLogined(): boolean {
  return Boolean(LocalStorageService.getData('token'));
}

export function saveTokensToLS(): void {
  if (tokenCache.cache.refreshToken) {
    LocalStorageService.saveData('refreshToken', tokenCache.cache.refreshToken);
  }

  LocalStorageService.saveData('token', tokenCache.cache.token);
}

export function isIncorrectCategoryPath(category: ProductsCategories): boolean {
  return !PRODUCTS_CATEGORIES_KEYS.includes(category);
}

export function getCategoryPath(category: ProductsCategories): string {
  return `${PagesPaths.CATALOG}/${category}`;
}

export function getProductPath(
  category: ProductsCategories,
  slug: LocalizedString,
  color?: ProductsColors,
): string {
  return `${getCategoryPath(category)}/${slug.en}/${color}`;
}

export function getCategoryBreadcrumbPath(category: ProductsCategories): BreadcrumbPath {
  return { name: category, path: getCategoryPath(category) };
}

export function getDiscountPercent(price: number, discount: number): string {
  return String(Math.round((1 - discount / price) * 100));
}

export function getProductName(name: LocalizedString): string {
  return name.en;
}

export function getProductDescription(description?: LocalizedString): string | undefined {
  return description?.en;
}

export function getProductPrice(masterVariant: ProductVariant): number | undefined {
  const priceInCent = masterVariant.prices?.[0].value.centAmount;

  return priceInCent ? priceInCent / 100 : priceInCent;
}

export function getProductDiscount(masterVariant: ProductVariant): number | undefined {
  const discountInCent = masterVariant.prices?.[0].discounted?.value.centAmount;

  return discountInCent ? discountInCent / 100 : discountInCent;
}

export function getPriceWithCurrency(price?: number): string {
  return new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(price ?? 0);
}

export function getProductBrand(masterVariant: ProductVariant): ProductsBrands | undefined {
  return masterVariant.attributes?.find(({ name }) => name === ProductsAttributes.BRAND)?.value;
}

export function getProductColor(masterVariant: ProductVariant): ProductsColors | undefined {
  return masterVariant.attributes?.find(({ name }) => name === ProductsAttributes.COLOR)?.value
    .label;
}

export function getCartId(): string | null {
  return LocalStorageService.getData('cartId');
}

export function getLoginDataWithCart(loginData: CustomerLoginData): CustomerLoginData {
  const cartId = getCartId();
  const loginDataWithCart = loginData;

  if (cartId) loginDataWithCart.anonymousCart = { typeId: 'cart', id: cartId };

  return loginDataWithCart;
}

export function generateUpdateEvent(cart?: Cart): void {
  const header = document.querySelector(`.${headerStyles.header}`);
  if (!header) return;

  header.dispatchEvent(
    new CustomEvent('updateCartCounter', {
      detail: {
        totalQuantity: cart && cart.totalLineItemQuantity ? cart.totalLineItemQuantity : 0,
      },
    }),
  );
}

export async function initCartCounter(): Promise<void> {
  const cartId = getCartId();

  if (cartId) {
    try {
      loader.open();

      const cart = await apiService.getCart(cartId);
      generateUpdateEvent(cart.body);
    } catch (error) {
      alertModal.showAlert('error', NO_SERVICE_AVAILABLE);
    } finally {
      loader.close();
    }
  }
}

export function successLogin(title: string, customerId: string, cart?: Cart): void {
  saveTokensToLS();
  LocalStorageService.saveData('customerId', customerId);

  if (cart) {
    LocalStorageService.saveData('cartId', cart.id);
    initCartCounter();
  }

  redirectToMain();
  alertModal.showAlert('success', title);
}
