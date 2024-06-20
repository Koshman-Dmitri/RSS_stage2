import { BaseComponent } from '../base-components';
import './connection-error-msg.css';

class ConnectionErrorMsg extends BaseComponent {
  constructor() {
    super(
      { className: 'connection-error__overlay' },
      new BaseComponent(
        { className: 'connection-error__wrapper' },
        new BaseComponent({ className: 'loader' }),
        new BaseComponent(
          { className: 'connection-error__message' },
          new BaseComponent({ tag: 'p', text: 'Connection error' }),
          new BaseComponent({ tag: 'p', text: 'Trying to reconnect' })
        )
      )
    );
  }
}

export const CreateConnectionErrorMsg = () => new ConnectionErrorMsg();
