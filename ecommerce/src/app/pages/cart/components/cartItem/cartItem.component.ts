import { Div, Input } from 'globalTypes/elements.type';
import { centToDollar } from 'pages/cart/cart.helpers';
import cartStyles from 'pages/cart/cart.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { button, div, img, input } from 'shared/tags/tags.component';

import { MAX_PRODUCTS_QUANTITY_TO_ORDER, OVERQUANTITY_TEXT_ERROR } from './cartItem.consts';
import styles from './cartItem.module.scss';
import { CartItemProps } from './cartItem.types';

export class CartItem extends BaseComponent {
  private readonly quantity: Input;

  private readonly quantityError: Div;

  private readonly subtotalWrapper: Div;

  private readonly subtotalOrigin: Div;

  private readonly subtotalPromo: Div;

  private readonly promoprice: Div;

  private readonly sellPrice: number;

  private readonly quantityCallback: (id: string, quantity: number) => void;

  public readonly id: string;

  constructor(
    props: CartItemProps,
    removeHandler: (id: string) => void,
    quantityHandler: (id: string, quantity: number) => void,
  ) {
    super({ className: cartStyles.cartItem });
    this.id = props.id;
    this.sellPrice = props.originPricePerOne;
    this.quantityCallback = quantityHandler;

    this.promoprice = div({ className: styles.promoPrice });

    const priceWrapper = div(
      { className: styles.priceWrapper },
      div({ className: styles.originPrice, text: centToDollar(props.originPricePerOne) }),
      this.promoprice,
    );

    this.quantity = input({
      className: styles.quantity,
      type: 'text',
      value: props.quantity,
      autocomplete: 'off',
      onchange: () => this.changeQuantityHandler(),
      oninput: () => {
        this.quantity.getNode().value = this.quantity.getNode().value.replace(/\D/g, '');
      },
    });

    this.subtotalOrigin = div({
      className: styles.subtotalOrigin,
      text: centToDollar(props.subtotal),
    });

    this.subtotalPromo = div({
      className: styles.subtotalPromo,
      text: centToDollar(props.subtotal),
    });

    this.subtotalWrapper = div(
      { className: styles.subtotalWrapper },
      div({ className: styles.subtotalText, text: 'Subtotal:' }),
      div({ className: styles.subtotalPrice }, this.subtotalOrigin, this.subtotalPromo),
    );

    this.quantityError = div({ className: styles.quantityError });

    const quantityContent = div(
      { className: styles.quantityContent },
      button({
        className: styles.quantityButton,
        text: '-',
        onclick: () => this.changeQuantityHandler('minus'),
      }),
      this.quantity,
      button({
        className: styles.quantityButton,
        text: '+',
        onclick: () => this.changeQuantityHandler('plus'),
      }),
    );

    if (props.promoPricePerOne) {
      this.showPromoPrice(props.promoPricePerOne);
      this.updateSubtotal(props.subtotal, +props.quantity);
    }

    this.appendChildren([
      div(
        { className: styles.cartContent },
        img({ className: styles.itemImage, src: props.imageSrc, alt: 'image' }),
        div({ className: styles.itemName, text: props.name }),
        priceWrapper,
        div({ className: styles.quantityWrapper }, quantityContent, this.quantityError),
      ),
      div(
        { className: styles.itemFooter },
        button({
          className: styles.removeButton,
          text: 'Remove from Cart',
          onclick: () => removeHandler(props.id),
        }),
        this.subtotalWrapper,
      ),
    ]);
  }

  private changeQuantityHandler(action?: 'plus' | 'minus'): void {
    let quantity = Number(this.quantity.getNode().value);

    if (action === 'plus') quantity += 1;
    if (action === 'minus') quantity -= 1;
    this.quantity.setProps({ value: String(quantity) });

    if (quantity >= MAX_PRODUCTS_QUANTITY_TO_ORDER) {
      this.quantityError.setText(OVERQUANTITY_TEXT_ERROR);
    } else {
      this.quantityError.setText('');
      this.quantityCallback(this.id, quantity);
    }
  }

  public showPromoPrice(promoPrice: number): void {
    this.addClass(styles.promo);
    this.promoprice.setText(centToDollar(promoPrice));
  }

  public hidePromoPrice(): void {
    this.removeClass(styles.promo);
  }

  public updateSubtotal(subtotalPromo: number, quantity: number): void {
    this.subtotalOrigin.setText(centToDollar(this.sellPrice * quantity));
    this.subtotalPromo.setText(centToDollar(subtotalPromo));
  }

  public updateQuantity(quantity: number, subtotal: number): void {
    this.quantity.setProps({ value: String(quantity) });
    this.updateSubtotal(subtotal, quantity);
  }
}
