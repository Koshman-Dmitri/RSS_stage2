import { ChatAPI } from '../../../API/ChatAPI';
import { BaseComponent } from '../../../components/base-components';
import { VoidCallback } from '../../../utils/types';
import './header-style.css';

class Header extends BaseComponent {
  private UserName: BaseComponent;

  private readonly ButtonAbout: BaseComponent<HTMLButtonElement>;

  private readonly ButtonLogout: BaseComponent<HTMLButtonElement>;

  constructor(showAboutPage: VoidCallback) {
    super({ tag: 'header', className: 'header' });
    const name = JSON.parse(sessionStorage.getItem('curUserName') as string);
    this.UserName = new BaseComponent({ tag: 'span', className: 'username', text: name });
    this.ButtonAbout = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'link_about',
      text: '?',
      onclick: () => showAboutPage(),
    });
    this.ButtonLogout = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'header__button_logout',
      text: 'Logout',
      onclick: () => ChatAPI.logout(),
    });
    this.appendChildren([
      new BaseComponent(
        { className: 'title-wrapper' },
        new BaseComponent({ tag: 'h1', className: 'header__title', text: 'Fun Chat' }),
        this.ButtonAbout
      ),
      this.UserName,
      this.ButtonLogout,
    ]);
  }
}

export const CreateHeader = (showAboutPage: VoidCallback) => new Header(showAboutPage);
