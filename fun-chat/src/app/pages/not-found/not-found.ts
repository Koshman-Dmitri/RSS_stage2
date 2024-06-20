import { BaseComponent } from '../../components/base-components';
import { VoidCallback } from '../../utils/types';
import './not-found-style.css';

class PageNotFound extends BaseComponent {
  constructor(buttonBackHandler: VoidCallback) {
    super({ className: 'page-not-found' });
    const title = new BaseComponent({ tag: 'h2', className: 'not-found__title', innerText: '404 \n Not found' });
    const description = new BaseComponent({
      tag: 'p',
      className: 'not-found__description',
      text: 'Make sure that the hash matches the URL (#login, #main, #about)',
    });
    const buttonBack = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'not-found__button',
      text: 'Back',
      onclick: () => buttonBackHandler(),
    });
    this.appendChildren([title, description, buttonBack]);
  }
}

export const CreatePageNotFound = (buttonBackHandler: VoidCallback) => new PageNotFound(buttonBackHandler);
