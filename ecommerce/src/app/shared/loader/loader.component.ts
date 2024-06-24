import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';

import { onErrorEventHandler } from './loader.helpers';
import styles from './loader.module.scss';

class Loader extends BaseComponent {
  constructor() {
    super({ className: styles.loader }, div({ className: styles.loaderIcon }));
  }

  public open(): void {
    if (this.containsClass(styles.show)) return;

    this.addClass(styles.show);

    document.body.addEventListener('keydown', onErrorEventHandler);
  }

  public close(): void {
    this.removeClass(styles.show);

    document.body.removeEventListener('keydown', onErrorEventHandler);
  }
}

export const loader = new Loader();
