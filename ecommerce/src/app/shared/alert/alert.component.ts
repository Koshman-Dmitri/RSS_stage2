import { Span } from 'globalTypes/elements.type';
import { BaseComponent } from 'shared/base/base.component';
import { div, span } from 'shared/tags/tags.component';
import { capitalizeFirstLetter } from 'utils/strings.util';

import styles from './alert.module.scss';

class Alert extends BaseComponent {
  private readonly infoTitle: Span;

  private readonly infoText: Span;

  constructor() {
    super({
      className: styles.alert,
      onanimationend: () => {
        this.getNode().className = styles.alert;
      },
    });

    this.infoTitle = span({ className: styles.infoTitle });
    this.infoText = span({ className: styles.infoText });

    this.append(
      div(
        { className: styles.wrapper },
        div({ className: styles.info }, this.infoTitle, this.infoText),
      ),
    );
  }

  public showAlert(type: 'success' | 'error' | 'attention', text: string): void {
    if (this.containsClass(styles.show)) this.getNode().className = styles.alert;

    setTimeout(() => {
      this.infoTitle.setText(capitalizeFirstLetter(type));
      this.infoText.setText(text);

      this.addClass(styles[type]);
      this.addClass(styles.show);
    }, 10);
  }
}

export const alertModal = new Alert();
