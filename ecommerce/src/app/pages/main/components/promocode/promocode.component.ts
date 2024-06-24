import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';

import { copyPromocode } from './promocode.helpers';
import styles from './promocode.module.scss';

export class Promocode extends BaseComponent {
  constructor(promotext: string, promocode: string) {
    super(
      { className: styles.promocode },
      div({ className: styles.promoText, innerHTML: promotext }),
      div(
        { className: styles.promoWrapper },
        div({ className: styles.title, text: 'Promo code' }),
        div({
          className: styles.code,
          text: promocode,
          onclick: copyPromocode,
        }),
        div({ className: styles.cover }),
      ),
    );
  }
}
