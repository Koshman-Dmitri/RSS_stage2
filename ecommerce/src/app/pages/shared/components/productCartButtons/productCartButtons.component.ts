import { CartResponse } from 'globalTypes/api.type';
import { Button } from 'globalTypes/elements.type';
import { generateUpdateEvent, getCartId } from 'pages/pageWrapper.helpers';
import { getCustomerIdFromLS } from 'pages/profile/profile.helpers';
import { apiService } from 'services/api.service';
import { LocalStorageService } from 'services/localStorage.service';
import { alertModal } from 'shared/alert/alert.component';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';
import { button } from 'shared/tags/tags.component';

import styles from './productCartButtons.module.scss';

export class ProductCartButtons extends BaseComponent {
  private readonly addToCard: Button;

  private readonly removeFromCart: Button;

  private lineItemId?: string;

  constructor(
    private readonly sku: string | undefined,
    isHiddenRemoveFromCart: boolean = false,
    gettingCart?: CartResponse,
  ) {
    super({ className: styles.productCartButtons });

    this.addToCard = button({
      className: styles.addToCardBtn,
      text: 'Add to cart',
      onclick: () => this.addToCartHandler(),
      disabled: true,
    });

    this.removeFromCart = button({
      className: styles.removeFromCardBtn,
      text: 'Remove from cart',
      onclick: () => this.removeFromCartHandler(),
      disabled: true,
    });

    if (isHiddenRemoveFromCart) {
      this.removeFromCart.addClass(styles.hide);
    }

    this.appendChildren([this.addToCard, this.removeFromCart]);

    this.setCartButtonsVisibility(gettingCart);
  }

  private async setCartButtonsVisibility(cart?: CartResponse): Promise<void> {
    const cartId = getCartId();
    let isProductInCart: boolean = Boolean(cartId);

    if (cartId) {
      const currentCart = cart ?? (await apiService.getCart(cartId));
      const product = currentCart.body.lineItems.find(({ variant }) => variant.sku === this.sku);

      isProductInCart = Boolean(product);

      this.lineItemId = product?.id;
    }

    this.addToCard.setProps({ disabled: isProductInCart });
    this.removeFromCart.setProps({ disabled: !isProductInCart });
  }

  private async addToCartHandler(): Promise<void> {
    if (!this.sku) return;

    const cartId = getCartId();

    loader.open();

    try {
      let newCart: CartResponse | undefined;

      if (cartId) {
        const cart = await apiService.getCart(cartId);
        newCart = await apiService.addProductToCart(cartId, cart.body.version, this.sku);
      } else {
        const customerId = getCustomerIdFromLS();
        if (customerId) {
          newCart = await apiService.createCustomerCart(customerId);
        } else {
          newCart = await apiService.createAnonymousCart(crypto.randomUUID());
        }

        const newCartId = newCart.body.id;
        const cart = await apiService.getCart(newCartId);

        LocalStorageService.saveData('cartId', newCartId);

        newCart = await apiService.addProductToCart(newCartId, cart.body.version, this.sku);
      }

      await this.setCartButtonsVisibility(newCart);
      alertModal.showAlert('success', 'The product has been added to Cart');
      generateUpdateEvent(newCart.body);
    } catch (error) {
      alertModal.showAlert('error', (error as Error).message);
    } finally {
      loader.close();
    }
  }

  private async removeFromCartHandler(): Promise<void> {
    const cartId = getCartId();

    if (cartId && this.lineItemId) {
      loader.open();

      try {
        const cart = await apiService.getCart(cartId);

        const newCart = await apiService.removeProductFromCart(
          cartId,
          cart.body.version,
          this.lineItemId,
        );

        this.setCartButtonsVisibility(newCart);
        generateUpdateEvent(newCart.body);

        alertModal.showAlert('success', 'The product has been removed from Cart');
      } catch (error) {
        alertModal.showAlert('error', (error as Error).message);
      } finally {
        loader.close();
      }
    } else {
      alertModal.showAlert('error', 'No such product in cart');
    }
  }
}
