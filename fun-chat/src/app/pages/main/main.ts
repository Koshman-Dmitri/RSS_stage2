import { BaseComponent } from '../../components/base-components';
import { CreateHeader } from './header/header';
import { CreateFooter } from './footer/footer';
import { VoidCallback } from '../../utils/types';
import { CreatePopupError } from '../../components/popup-error';
import { CreateUserList } from './user-list/user-list';
import { CreateChat } from './chat/chat';
import './main-style.css';

class Main extends BaseComponent {
  private readonly Header: BaseComponent;

  private readonly UserList: BaseComponent;

  private readonly Chat: BaseComponent;

  private readonly Footer: BaseComponent;

  constructor(showLoginPage: VoidCallback, showAboutPage: VoidCallback, showMainPage: VoidCallback) {
    super({ className: 'fun-chat', onclick: () => this.Chat.getNode().dispatchEvent(new Event('mainWindowClick')) });
    this.Header = CreateHeader(showAboutPage);
    this.UserList = CreateUserList();
    this.Chat = CreateChat();
    const mainSection = new BaseComponent({ tag: 'main', className: 'chat' }, this.UserList, this.Chat);
    this.Footer = CreateFooter();
    this.appendChildren([this.Header, mainSection, this.Footer]);
    this.addEventListener('successLogin', showMainPage);
    this.addEventListener('successLogout', showLoginPage);
    this.addEventListener('failedLogout', (e) => this.failedLogoutHandler(e));
  }

  private failedLogoutHandler(e?: Event): void {
    const event = e as CustomEvent;
    if (event.detail.error === 'a user with this login is already authorized') {
      this.append(CreatePopupError('A user with this login is already authorized'));
    } else {
      this.append(CreatePopupError('Take your hands off the storage!'));
    }
  }
}

export const CreateMain = (showLoginPage: VoidCallback, showAboutPage: VoidCallback, showMainPage: VoidCallback) =>
  new Main(showLoginPage, showAboutPage, showMainPage);
