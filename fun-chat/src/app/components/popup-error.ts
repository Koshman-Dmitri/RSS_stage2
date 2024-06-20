import { BaseComponent } from './base-components';
import './popup-error-style.css';

class PopupError extends BaseComponent {
  constructor(text: string) {
    super(
      { className: 'overlay' },
      new BaseComponent({ className: 'popup-auth-error' }, new BaseComponent({ tag: 'span', text }))
    );
    setTimeout(() => this.deleteNode(), 1500);
  }
}

export const CreatePopupError = (text: string) => new PopupError(text);
