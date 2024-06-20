import { BaseComponent } from './base-components';

interface Props {
  className?: string;
  text?: string;
  type?: string;
  disabled?: boolean;
  onClick?: (event?: Event) => void;
}

export default class Button extends BaseComponent {
  protected onClick;

  constructor({ className, text, type, disabled, onClick }: Props) {
    super({ tag: 'button', className, text });
    if (onClick) {
      this.onClick = onClick;
      this.addEventListener('click', this.onClick);
    }
    if (type) this.setAttribute('type', type);
    if (disabled) this.setAttribute('disabled', '');
  }

  deleteNode() {
    if (this.onClick) this.removeEventListener('click', this.onClick);
    super.deleteNode();
  }
}
