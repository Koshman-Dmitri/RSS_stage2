import sharedStyles from 'pages/shared/styles/common.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';

import styles from './footer.module.scss';

export class Footer extends BaseComponent {
  constructor() {
    super(
      { tag: 'footer', className: styles.footer },
      div(
        { className: sharedStyles.container },
        div({ className: styles.text, text: '2024 RS School. eCommerce-Application' }),
      ),
    );
  }
}
