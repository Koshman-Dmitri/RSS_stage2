import { PRODUCTS_CATEGORIES_IDS } from 'globalConsts/api.const';

export const PRODUCTS_CATEGORIES_KEYS = Object.keys(PRODUCTS_CATEGORIES_IDS);

export const enum CatalogParams {
  CATEGORY = 'category',
  SLUG = 'slug',
  COLOR = 'color',
}

export const enum PagesPaths {
  HOME = '',
  MAIN = 'main',
  CATALOG = 'catalog',
  ABOUT = 'about',
  SIGNUP = 'signup',
  LOGIN = 'login',
  PROFILE = 'profile',
  CATEGORY = `${PagesPaths.CATALOG}/:${CatalogParams.CATEGORY}`,
  PRODUCT = `${PagesPaths.CATEGORY}/:${CatalogParams.SLUG}/:${CatalogParams.COLOR}`,
  CART = 'cart',
}
