import { Cart, CartUpdateAction, LineItem } from '@commercetools/platform-sdk';
import { generateUpdateEvent, getProductColor } from 'pages/pageWrapper.helpers';

import { CartItem } from './components/cartItem/cartItem.component';
import { CartItemProps } from './components/cartItem/cartItem.types';

export function makeCartItemProps(data: Cart): CartItemProps[] {
  return data.lineItems.map((item) => {
    return {
      id: item.id,
      imageSrc: item.variant.images![0].url,
      name: `${item.name.en} (${getProductColor(item.variant)})`,
      quantity: String(item.quantity),
      originPricePerOne: item.price.discounted
        ? item.price.discounted.value.centAmount
        : item.price.value.centAmount,
      promoPricePerOne: item.discountedPricePerQuantity.length
        ? item.discountedPricePerQuantity[0].discountedPrice.value.centAmount
        : undefined,
      subtotal: item.totalPrice.centAmount,
    } as CartItemProps;
  });
}

export function centToDollar(centAmount: number): string {
  return (centAmount / 100).toLocaleString('en-US', { currency: 'USD', style: 'currency' });
}

export function makeCartClearActions(cartItems: CartItem[]): CartUpdateAction[] {
  return cartItems.map((item) => {
    return {
      action: 'removeLineItem',
      lineItemId: item.id,
    } as CartUpdateAction;
  });
}

export function calculateOriginPrice(data: LineItem[]): number {
  return data.reduce((sum, item) => {
    const originPricePerOne = item.price.discounted
      ? item.price.discounted.value.centAmount
      : item.price.value.centAmount;

    return originPricePerOne * item.quantity + sum;
  }, 0);
}

export function updateCounter(cart: Cart): void {
  if (cart.totalLineItemQuantity) {
    generateUpdateEvent(cart);
  } else {
    generateUpdateEvent();
  }
}
