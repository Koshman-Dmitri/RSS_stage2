import { ProductsCategories, ProductsColors } from 'globalConsts/api.const';

import { CatalogParams } from './pageWrapper.consts';

export type CategoryParams = {
  [CatalogParams.CATEGORY]: ProductsCategories;
};

export type ProductParams = CategoryParams & {
  [CatalogParams.SLUG]: string;
  [CatalogParams.COLOR]: ProductsColors;
};
