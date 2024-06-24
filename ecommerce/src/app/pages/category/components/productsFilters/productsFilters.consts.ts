import { ProductsBrands, ProductsColors } from 'globalConsts/api.const';
import { FormFieldsProps } from 'pages/shared/components/formField/formField.types';

export const PRODUCTS_FILTERS_PROPS = {
  priceFrom: {
    name: 'price-from',
    type: 'number',
    placeholder: 'From',
  },
  priceTo: {
    name: 'price-to',
    type: 'number',
    placeholder: 'To',
  },
  search: {
    name: 'search',
    type: 'text',
    placeholder: 'Search',
  },
} as const satisfies FormFieldsProps;

export const PRODUCTS_BRANDS_VALUES = Object.values(ProductsBrands);
export const PRODUCTS_COLORS_VALUES = Object.values(ProductsColors);
