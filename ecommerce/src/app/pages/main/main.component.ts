import sharedStyles from 'pages/shared/styles/common.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { div, h1 } from 'shared/tags/tags.component';

import { Promocode } from './components/promocode/promocode.component';
import {
  BEDS_PROMO_TEXT,
  BEDS_PROMOCODE,
  CHAIRS_PROMO_TEXT,
  CHAIRS_PROMOCODE,
} from './components/promocode/promocode.consts';
import styles from './main.module.scss';

export class Main extends BaseComponent {
  constructor() {
    super(
      { className: styles.main },
      div(
        { className: sharedStyles.container },
        h1('Welcome to The Furniture Store', styles.mainTitle),
        new Promocode(CHAIRS_PROMO_TEXT, CHAIRS_PROMOCODE),
        new Promocode(BEDS_PROMO_TEXT, BEDS_PROMOCODE),
      ),
    );
  }
}
