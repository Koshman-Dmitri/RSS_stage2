import { LocalizedString, ProductProjection, ProductVariant } from '@commercetools/platform-sdk';
import { ProductsCategories } from 'globalConsts/api.const';
import { CartResponse } from 'globalTypes/api.type';
import { Div } from 'globalTypes/elements.type';
import {
  getDiscountPercent,
  getNavLink,
  getPriceWithCurrency,
  getProductBrand,
  getProductColor,
  getProductDescription,
  getProductDiscount,
  getProductName,
  getProductPath,
  getProductPrice,
} from 'pages/pageWrapper.helpers';
import { ProductCartButtons } from 'pages/shared/components/productCartButtons/productCartButtons.component';
import productsStyles from 'pages/shared/styles/products.module.scss';
import { div, h3, img } from 'shared/tags/tags.component';

import styles from './category.module.scss';

function getProductCard(
  category: ProductsCategories,
  variant: ProductVariant,
  slug: LocalizedString,
  name: LocalizedString,
  description?: LocalizedString,
  cart?: CartResponse,
): Div {
  const price = getProductPrice(variant) ?? 0;
  const discount = getProductDiscount(variant);
  const color = getProductColor(variant);

  const cardPrices = div(
    { className: styles.cardPrices },
    div({ text: getPriceWithCurrency(discount ?? price) }),
  );

  const productCard = div(
    { className: styles.productCard },
    getNavLink(
      '',
      getProductPath(category, slug, color),
      styles.productCardLink,
      img({
        className: styles.cardImg,
        src: variant.images?.[0].url ?? '',
        alt: 'product-card-img',
      }),
      h3(`${getProductName(name)} (${color})`, styles.cardName),
      h3(`${getProductBrand(variant)}`, styles.cardName),
      div({ className: styles.cardDescription, text: getProductDescription(description) }),
      cardPrices,
    ),
    new ProductCartButtons(variant.sku, true, cart),
  );

  if (discount) {
    cardPrices.append(
      div({
        className: productsStyles.discountPrice,
        text: getPriceWithCurrency(price),
      }),
    );
    productCard.append(
      div({
        className: productsStyles.discountLabel,
        text: `-${getDiscountPercent(price, discount)}%`,
      }),
    );
  }

  return productCard;
}

export function getProducts(
  category: ProductsCategories,
  products: ProductProjection[],
  cart?: CartResponse,
): Div[] {
  return products.reduce<Div[]>(
    (productsCards, { slug, name, description, masterVariant, variants }) => {
      if (masterVariant.isMatchingVariant) {
        productsCards.push(getProductCard(category, masterVariant, slug, name, description, cart));
      } else {
        const matchingVariants = variants.filter(({ isMatchingVariant }) => isMatchingVariant);

        if (matchingVariants.length) {
          productsCards.push(
            getProductCard(category, matchingVariants[0], slug, name, description, cart),
          );
        }
      }

      return productsCards;
    },
    [],
  );
}
