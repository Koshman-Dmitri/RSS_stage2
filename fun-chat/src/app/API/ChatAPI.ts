import { BaseComponent } from '../components/base-components';
import { CreateConnectionErrorMsg } from '../components/connection-error/connection-error-msg';
import {
  AuthRequest,
  DeleteMsg,
  GetAuth,
  GetMsg,
  GetUnauth,
  LogoutRequest,
  SendMsg,
  SetMsgEdit,
  SetMsgRead,
} from './types';

class API {
  private errorMsg: BaseComponent;

  public socket: WebSocket;

  constructor() {
    this.errorMsg = CreateConnectionErrorMsg();
    this.showErrorMsg();
    this.socket = new WebSocket('ws://localhost:4000');
    this.connect();
  }

  private showErrorMsg(): void {
    const body = document.querySelector('body');
    body?.append(this.errorMsg.getNode());
    body?.addEventListener('keydown', this.onErrorEventHandler);
  }

  private hideErrorMsg(): void {
    this.errorMsg.getNode().remove();
    const body = document.querySelector('body');
    body?.removeEventListener('keydown', this.onErrorEventHandler);
  }

  private onErrorEventHandler(e: KeyboardEvent): void {
    if (e.key === 'Tab') e.preventDefault();
  }

  private connect() {
    this.socket = new WebSocket('ws://localhost:4000');
    this.socket.onopen = () => this.openHandler();
    this.socket.onclose = () => this.closeHandler();
    this.socket.onerror = () => this.errorHandler();
    this.socket.onmessage = (e) => this.messageHandler(e);
  }

  private openHandler(): void {
    this.hideErrorMsg();
    if (sessionStorage.getItem('curUserName') && sessionStorage.getItem('curUserPassword')) {
      const username = JSON.parse(sessionStorage.getItem('curUserName') as string);
      const userpassword = JSON.parse(sessionStorage.getItem('curUserPassword') as string);
      this.authUser(username, userpassword);
    }
  }

  private closeHandler(): void {
    this.showErrorMsg();
    setTimeout(() => this.connect(), 500);
  }

  private messageHandler(e: MessageEvent): void {
    const data = JSON.parse(e.data);
    switch (data.type) {
      case 'USER_LOGIN': {
        const loginForm = document.querySelector('.authorization-form');
        const funChat = document.querySelector('.fun-chat');
        if (loginForm) loginForm.dispatchEvent(new Event('successLogin'));
        else if (funChat) funChat.dispatchEvent(new Event('successLogin'));
        break;
      }
      case 'USER_LOGOUT': {
        sessionStorage.removeItem('curUserName');
        sessionStorage.removeItem('curUserPassword');
        const funChat = document.querySelector('.fun-chat');
        if (funChat) funChat.dispatchEvent(new Event('successLogout'));
        break;
      }
      case 'USER_ACTIVE':
      case 'USER_INACTIVE': {
        const chatUsers = document.querySelector('.chat__users');
        if (chatUsers)
          chatUsers.dispatchEvent(
            new CustomEvent('createUserList', {
              detail: {
                type: data.type,
                data: data.payload.users,
              },
            })
          );
        break;
      }
      case 'USER_EXTERNAL_LOGIN':
      case 'USER_EXTERNAL_LOGOUT': {
        const chatUsers = document.querySelector('.chat__users');
        if (chatUsers)
          chatUsers.dispatchEvent(
            new CustomEvent('updateUserInList', {
              detail: {
                type: data.type,
                login: data.payload.user.login,
              },
            })
          );
        const chatWindow = document.querySelector('.chat__window');
        if (chatWindow)
          chatWindow.dispatchEvent(
            new CustomEvent('updateRecieverStatus', {
              detail: {
                type: data.type,
                login: data.payload.user.login,
              },
            })
          );
        break;
      }
      case 'MSG_FROM_USER':
        if (data.id.startsWith('init')) {
          document.querySelector(`.list__user[data-name='${data.id.slice(4)}']`)!.dispatchEvent(
            new CustomEvent('drawUnreadCounter', {
              detail: {
                data: data.payload.messages,
              },
            })
          );
        } else {
          document.querySelector('.chat__window')!.dispatchEvent(
            new CustomEvent('renderChat', {
              detail: {
                from: data.id,
                data: data.payload.messages,
              },
            })
          );
        }
        break;
      case 'MSG_SEND': {
        const chatWindow = document.querySelector('.chat__window');
        if (chatWindow)
          chatWindow.dispatchEvent(
            new CustomEvent('newMessage', {
              detail: {
                data: data.payload.message,
              },
            })
          );
        if (data.id === null) {
          const { from } = data.payload.message;
          const listUser = document.querySelector(`.list__user[data-name='${from}']`);
          if (listUser)
            listUser.dispatchEvent(
              new CustomEvent('newMessage', {
                detail: {
                  data: data.payload.message,
                },
              })
            );
        }
        break;
      }
      case 'MSG_DELIVER': {
        const chatWindow = document.querySelector('.chat__window');
        if (chatWindow)
          chatWindow.dispatchEvent(
            new CustomEvent('updateMessageStatus', {
              detail: {
                type: 'delivered',
                messageId: data.payload.message.id,
              },
            })
          );
        break;
      }
      case 'MSG_READ': {
        const chatWindow = document.querySelector('.chat__window');
        if (chatWindow)
          chatWindow.dispatchEvent(
            new CustomEvent('updateMessageStatus', {
              detail: {
                type: 'read',
                messageId: data.payload.message.id,
              },
            })
          );
        break;
      }
      case 'MSG_EDIT': {
        const chatWindow = document.querySelector('.chat__window');
        if (chatWindow)
          chatWindow.dispatchEvent(
            new CustomEvent('updateMessageText', {
              detail: {
                type: 'edited',
                messageId: data.payload.message.id,
                newText: data.payload.message.text,
              },
            })
          );
        break;
      }
      case 'MSG_DELETE': {
        const chatWindow = document.querySelector('.chat__window');
        if (chatWindow)
          chatWindow.dispatchEvent(
            new CustomEvent('deleteMessage', {
              detail: {
                messageId: data.payload.message.id,
              },
            })
          );
        break;
      }
      case 'ERROR': {
        const form = document.querySelector('form');
        const funChat = document.querySelector('.fun-chat');
        // Auth error
        if (data.id === 'USER_LOGIN') {
          if (form)
            form.dispatchEvent(
              new CustomEvent('failedLogin', {
                detail: { error: data.payload.error },
              })
            );
        }
        // Logout error
        if (data.id === 'USER_LOGOUT') {
          if (funChat)
            funChat.dispatchEvent(
              new CustomEvent('failedLogout', {
                detail: { error: data.payload.error },
              })
            );
        }
        break;
      }
      default:
        break;
    }
  }

  private errorHandler(): void {
    console.error('Connection lost. Trying to reconnect');
  }

  public authUser(username: string, userpassword: string): void {
    const message: AuthRequest = {
      id: 'USER_LOGIN',
      type: 'USER_LOGIN',
      payload: {
        user: {
          login: username,
          password: userpassword,
        },
      },
    };
    this.socket.send(JSON.stringify(message));
  }

  public logout(): void {
    const username = JSON.parse(sessionStorage.getItem('curUserName') as string);
    const userpassword = JSON.parse(sessionStorage.getItem('curUserPassword') as string);
    const message: LogoutRequest = {
      id: 'USER_LOGOUT',
      type: 'USER_LOGOUT',
      payload: {
        user: {
          login: username,
          password: userpassword,
        },
      },
    };
    this.socket.send(JSON.stringify(message));
  }

  public getAuthUsers(): void {
    const message: GetAuth = {
      id: 'USER_ACTIVE',
      type: 'USER_ACTIVE',
      payload: null,
    };
    this.socket.send(JSON.stringify(message));
  }

  public getUnauthUsers(): void {
    const message: GetUnauth = {
      id: 'USER_INACTIVE',
      type: 'USER_INACTIVE',
      payload: null,
    };
    this.socket.send(JSON.stringify(message));
  }

  public getMessages(from: string, init?: string): void {
    const message: GetMsg = {
      id: init === 'init' ? `init${from}` : from,
      type: 'MSG_FROM_USER',
      payload: {
        user: {
          login: from,
        },
      },
    };
    this.socket.send(JSON.stringify(message));
  }

  public sendMessage(recipient: string, msg: string): void {
    const message: SendMsg = {
      id: 'MSG_SEND',
      type: 'MSG_SEND',
      payload: {
        message: {
          to: recipient,
          text: msg,
        },
      },
    };
    this.socket.send(JSON.stringify(message));
  }

  public setMessageRead(id: string): void {
    const message: SetMsgRead = {
      id: 'MSG_READ',
      type: 'MSG_READ',
      payload: {
        message: {
          id,
        },
      },
    };
    this.socket.send(JSON.stringify(message));
  }

  public setMessageEdited(id: string, text: string): void {
    const message: SetMsgEdit = {
      id: 'MSG_EDIT',
      type: 'MSG_EDIT',
      payload: {
        message: {
          id,
          text,
        },
      },
    };
    this.socket.send(JSON.stringify(message));
  }

  public deleteMessage(id: string): void {
    const message: DeleteMsg = {
      id: 'MSG_DELETE',
      type: 'MSG_DELETE',
      payload: {
        message: {
          id,
        },
      },
    };
    this.socket.send(JSON.stringify(message));
  }
}

export const ChatAPI = new API();
