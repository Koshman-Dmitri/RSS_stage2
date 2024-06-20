import { ChatAPI } from '../../../API/ChatAPI';
import { BaseComponent } from '../../../components/base-components';
import { CreateListUser } from './list-element/list-element';
import './user-list-style.css';

type UserData = {
  login: string;
  isLogined: boolean;
};

class UserList extends BaseComponent {
  private readonly Filter: BaseComponent<HTMLInputElement>;

  private readonly List: BaseComponent;

  private activeUsers: UserData[];

  private inactiveUsers: UserData[];

  constructor() {
    super({ tag: 'aside', className: 'chat__users' });
    this.activeUsers = [];
    this.inactiveUsers = [];
    this.Filter = new BaseComponent<HTMLInputElement>({
      tag: 'input',
      className: 'chat__filter',
      type: 'text',
      name: 'find-user',
      placeholder: 'Find...',
      autocomplete: 'off',
      oninput: () => this.filterUser(),
    });
    this.List = new BaseComponent({ tag: 'ul', className: 'users__list' });
    this.appendChildren([this.Filter, this.List]);
    ChatAPI.getAuthUsers();
    ChatAPI.getUnauthUsers();
    this.addEventListener('createUserList', (e) => this.createList(e));
    this.addEventListener('updateUserInList', (e) => this.updateUser(e));
  }

  private createList(e?: Event): void {
    const event = e as CustomEvent;
    if (event.detail.type === 'USER_ACTIVE') {
      const curUser = JSON.parse(sessionStorage.getItem('curUserName') as string);
      this.activeUsers = event.detail.data.filter((user: UserData) => user.login !== curUser);
    }
    if (event.detail.type === 'USER_INACTIVE') {
      this.inactiveUsers = event.detail.data;
    }
    this.List.deleteChildren();
    this.List.appendChildren([
      ...this.activeUsers.map((user: UserData) => CreateListUser(user.login, 'online')),
      ...this.inactiveUsers.map((user: UserData) => CreateListUser(user.login, 'offline')),
    ]);

    if (event.detail.type === 'USER_INACTIVE') this.getEveryUsersHistory();
  }

  private updateUser(e?: Event): void {
    const event = e as CustomEvent;
    if (event.detail.type === 'USER_EXTERNAL_LOGIN') {
      const user = this.List.getChildren().find((el) => el.getNode().getAttribute('data-name') === event.detail.login);
      if (user) {
        user.removeClass('offline');
        user.addClass('online');
      } else {
        ChatAPI.getAuthUsers();
        ChatAPI.getUnauthUsers();
      }
    }
    if (event.detail.type === 'USER_EXTERNAL_LOGOUT') {
      const user = this.List.getChildren().find((el) => el.getNode().getAttribute('data-name') === event.detail.login);
      user?.removeClass('online');
      user?.addClass('offline');
    }
  }

  private filterUser(): void {
    const name = this.Filter.getNode().value.toLowerCase();
    this.List.getChildren().forEach((user) => {
      if (user.getNode().getAttribute('data-name')?.toLowerCase().includes(name)) {
        user.removeClass('hidden');
      } else {
        user.addClass('hidden');
      }
    });
  }

  private getEveryUsersHistory(): void {
    const users = [...this.activeUsers, ...this.inactiveUsers];
    users.forEach((user) => ChatAPI.getMessages(user.login, 'init'));
  }
}

export const CreateUserList = () => new UserList();
