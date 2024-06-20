import { ChatAPI } from '../../../API/ChatAPI';
import { BaseComponent } from '../../../components/base-components';
import { Delimeter } from '../../../components/delimeter/delimeter';
import { UnreadStorage } from '../storage/unread';
import { ChatMessage, CreateChatMessage, MessageDirection, MessageProps } from './chat-message/message';
import './chat-style.css';

class Chat extends BaseComponent {
  private readonly Reciever: BaseComponent;

  private readonly RecieverStatus: BaseComponent;

  private readonly MainWindow: BaseComponent;

  private readonly StartMessage: BaseComponent;

  private readonly Form: BaseComponent<HTMLFormElement>;

  private readonly MsgInput: BaseComponent<HTMLInputElement>;

  private readonly CancelEditBtn: BaseComponent;

  private readonly SendBtn: BaseComponent<HTMLButtonElement>;

  private readonly Delimeter: BaseComponent;

  private readonly PopupMenu: BaseComponent;

  private currentReciever: string;

  private currentMessages: ChatMessage[];

  private chosenMsgId: string;

  private inputEditMode: boolean;

  constructor() {
    super({ tag: 'aside', className: 'chat__window' });
    this.currentReciever = '';
    this.currentMessages = [];
    this.Reciever = new BaseComponent({ tag: 'span', className: 'reciever__name' });
    this.RecieverStatus = new BaseComponent({ className: 'reciever__status' });
    this.StartMessage = new BaseComponent({
      tag: 'label',
      className: 'chat__start-message',
      text: 'Choose user to send a message...',
    });
    this.MainWindow = new BaseComponent({ className: 'window__main' });
    this.MainWindow.getNode().onclick = () => {
      this.doReadenStatus();
      if (this.MainWindow.getChildren().includes(this.PopupMenu)) this.hideContextMenu();
    };
    this.MainWindow.getNode().onwheel = () => this.doReadenStatus();
    this.MainWindow.append(this.StartMessage);
    this.Form = new BaseComponent<HTMLFormElement>({ tag: 'form', className: 'window__footer' });
    this.MsgInput = new BaseComponent<HTMLInputElement>({
      tag: 'input',
      className: 'message-input',
      type: 'text',
      placeholder: 'Your message',
      disabled: true,
      oninput: () => {
        if (this.MsgInput.getNode().value.length > 0) {
          this.SendBtn.removeAttribute('disabled');
        } else {
          this.SendBtn.setAttribute('disabled', 'true');
        }
      },
    });
    this.CancelEditBtn = new BaseComponent({
      tag: 'label',
      className: 'cancel-edit hidden',
      text: 'X',
      onclick: () => this.cancelEdit(),
    });
    this.SendBtn = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'message-button-send',
      type: 'submit',
      disabled: true,
      onclick: (e) => {
        this.doReadenStatus();
        this.sendMsgHandler(e);
      },
    });
    this.Form.appendChildren([this.MsgInput, this.CancelEditBtn, this.SendBtn]);
    this.Delimeter = Delimeter;
    this.appendChildren([
      new BaseComponent({ className: 'window__header' }, this.Reciever, this.RecieverStatus),
      this.MainWindow,
      this.Form,
    ]);
    this.PopupMenu = new BaseComponent(
      { className: 'popup-context' },
      new BaseComponent({ tag: 'span', text: 'Edit', onclick: () => this.editMessage() }),
      new BaseComponent({ tag: 'span', text: 'Delete', onclick: () => this.deleteMessage() })
    );
    this.chosenMsgId = '';
    this.inputEditMode = false;
    this.addEventListener('renderChat', (e) => this.renderChat(e));
    this.addEventListener('updateRecieverStatus', (e) => this.changeRecieverStatus(e));
    this.addEventListener('newMessage', (e) => this.messageHandler(e));
    this.addEventListener('updateMessageStatus', (e) => this.updateMsgStatus(e));
    this.addEventListener('updateMessageText', (e) => this.updateMsgText(e));
    this.addEventListener('deleteMessage', (e) => this.updateDeletedMsg(e));
    this.addEventListener('mainWindowClick', () => {
      if (this.MainWindow.getChildren().includes(this.PopupMenu)) this.hideContextMenu();
    });
  }

  private renderChat(e?: Event): void {
    const event = e as CustomEvent;
    this.currentReciever = event.detail.from;
    this.updateReciever(event.detail.from);
    this.MsgInput.removeAttribute('disabled');
    this.MsgInput.getNode().value = '';
    this.SendBtn.setAttribute('disabled', 'true');
    if (this.inputEditMode) this.cancelEdit();
    this.updateChat(event.detail.data);
  }

  private updateReciever(user: string): void {
    this.Reciever.text(user);
    const node = document.querySelector(`.list__user[data-name='${user}']`);
    if (node?.classList.contains('online')) {
      this.RecieverStatus.text('Online');
      this.RecieverStatus.addClass('reciever__status_online');
      this.RecieverStatus.removeClass('reciever__status_offline');
    } else {
      this.RecieverStatus.text('Offline');
      this.RecieverStatus.addClass('reciever__status_offline');
      this.RecieverStatus.removeClass('reciever__status_online');
    }
  }

  private updateChat(array: MessageProps[]): void {
    this.MainWindow.deleteChildren();
    this.MainWindow.getChildren().length = 0;
    this.currentMessages.length = 0;
    if (array.length === 0) {
      this.MainWindow.append(this.StartMessage);
      this.StartMessage.text('Text your first message');
      return;
    }

    let hasDelimeter = false;
    array.forEach((props) => {
      const direction: MessageDirection = props.to === this.currentReciever ? 'out' : 'in';
      const newMsg = CreateChatMessage(props, direction, this.showContextMenu.bind(this));
      this.currentMessages.push(newMsg);
      if (props.from === this.currentReciever && !props.status.isReaded && !hasDelimeter) {
        hasDelimeter = true;
        this.MainWindow.append(this.Delimeter);
      }
      this.MainWindow.append(newMsg.render());
    });

    let scrollDistance;
    const offset = Number.parseInt(getComputedStyle(this.MainWindow.getNode()).paddingTop, 10);
    if (hasDelimeter) {
      scrollDistance = this.Delimeter.getNode().offsetTop - offset;
    } else {
      scrollDistance =
        this.MainWindow.getChildren()[this.MainWindow.getChildren().length - 1].getNode().offsetTop - offset;
    }
    this.MainWindow.getNode().scrollTo({ top: scrollDistance, behavior: 'smooth' });
  }

  private changeRecieverStatus(e?: Event): void {
    const event = e as CustomEvent;
    if (event.detail.login !== this.currentReciever) return;
    if (event.detail.type === 'USER_EXTERNAL_LOGIN') {
      this.RecieverStatus.text('Online');
      this.RecieverStatus.addClass('reciever__status_online');
      this.RecieverStatus.removeClass('reciever__status_offline');
    }
    if (event.detail.type === 'USER_EXTERNAL_LOGOUT') {
      this.RecieverStatus.text('Offline');
      this.RecieverStatus.addClass('reciever__status_offline');
      this.RecieverStatus.removeClass('reciever__status_online');
    }
  }

  private sendMsgHandler(e: Event) {
    e.preventDefault();
    const text = this.MsgInput.getNode().value;
    if (this.inputEditMode) {
      this.cancelEdit();
      ChatAPI.setMessageEdited(this.chosenMsgId, text);
      this.chosenMsgId = '';
    } else {
      ChatAPI.sendMessage(this.currentReciever, text);
    }
    this.MsgInput.getNode().value = '';
    this.SendBtn.setAttribute('disabled', 'true');
  }

  private messageHandler(e?: Event): void {
    const event = e as CustomEvent;
    const props: MessageProps = event.detail.data;
    if (props.to === this.currentReciever || props.from === this.currentReciever) {
      if (this.MainWindow.getChildren().includes(this.StartMessage)) {
        this.StartMessage.deleteNode();
        const index = this.MainWindow.getChildren().findIndex((el) => el === this.StartMessage);
        this.MainWindow.getChildren().splice(index, 1);
      }

      const direction: MessageDirection = props.to === this.currentReciever ? 'out' : 'in';
      if (direction === 'in') this.addDelimeter();
      const newMsg = CreateChatMessage(props, direction, this.showContextMenu.bind(this));
      this.MainWindow.append(newMsg.render());
      this.currentMessages.push(newMsg);
      // Scroll
      let scrollDistance = 0;
      if (this.MainWindow.getChildren().find((el) => el.containsClass('delimeter'))) {
        const offset = Number.parseInt(getComputedStyle(this.MainWindow.getNode()).paddingTop, 10);
        scrollDistance = this.Delimeter.getNode().offsetTop - offset;
      } else {
        scrollDistance = this.MainWindow.getChildren()[this.MainWindow.getChildren().length - 1].getNode().offsetTop;
      }
      this.MainWindow.getNode().scrollTo({ top: scrollDistance, behavior: 'smooth' });
    }
  }

  private addDelimeter(): void {
    if (!this.MainWindow.getChildren().find((el) => el.containsClass('delimeter'))) {
      this.MainWindow.append(this.Delimeter);
    }
  }

  private removeDelimeter(): void {
    if (this.MainWindow.getChildren().find((el) => el.containsClass('delimeter'))) {
      this.Delimeter.deleteNode();
      const index = this.MainWindow.getChildren().findIndex((el) => el === this.Delimeter);
      this.MainWindow.getChildren().splice(index, 1);
      const scroll = this.MainWindow.getChildren()[this.MainWindow.getChildren().length - 1].getNode().offsetTop;
      this.MainWindow.getNode().scrollTo({ top: scroll, behavior: 'smooth' });
    }
  }

  private doReadenStatus(): void {
    if (this.MainWindow.getChildren().find((el) => el.containsClass('delimeter'))) {
      this.removeDelimeter();

      if (this.currentReciever) {
        document
          .querySelector(`.list__user[data-name='${this.currentReciever}']`)!
          .dispatchEvent(new Event('resetUnreadCounter'));
      }

      const unreadMessages = this.currentMessages.filter(
        (mes) => mes.from === this.currentReciever && !mes.status.isReaded
      );
      unreadMessages.forEach((unreadMsg) => ChatAPI.setMessageRead(unreadMsg.id));
    }
  }

  private updateMsgStatus(e?: Event): void {
    const event = e as CustomEvent;
    if (event.detail.type === 'delivered') {
      const m = this.currentMessages.find((msg) => msg.id === event.detail.messageId);
      m?.changeStatusToDelivered();
    }
    if (event.detail.type === 'read') {
      const m = this.currentMessages.find((msg) => msg.id === event.detail.messageId);
      m?.changeStatusToRead();
      UnreadStorage.deleteMessage(event.detail.messageId);
    }
    if (event.detail.type === 'edited') {
      const m = this.currentMessages.find((msg) => msg.id === event.detail.messageId);
      m?.changeStatusToEdited();
    }
  }

  private showContextMenu(id: string, top: number): void {
    this.PopupMenu.getNode().style.top = `${top + 6}px`;
    this.MainWindow.append(this.PopupMenu);
    this.chosenMsgId = id;
  }

  private hideContextMenu(): void {
    this.PopupMenu.getNode().remove();
    const index = this.MainWindow.getChildren().findIndex((el) => el === this.PopupMenu);
    this.MainWindow.getChildren().splice(index, 1);
  }

  private editMessage(): void {
    const message = this.currentMessages.find((msg) => msg.id === this.chosenMsgId);
    this.MsgInput.getNode().value = message?.text as string;
    this.MsgInput.getNode().focus();
    this.CancelEditBtn.removeClass('hidden');
    this.SendBtn.removeAttribute('disabled');
    this.inputEditMode = true;
  }

  private cancelEdit(): void {
    this.MsgInput.getNode().value = '';
    this.CancelEditBtn.addClass('hidden');
    this.SendBtn.setAttribute('disabled', 'true');
    this.inputEditMode = false;
  }

  private updateMsgText(e?: Event): void {
    const event = e as CustomEvent;
    const editMessage = this.currentMessages.find((msg) => msg.id === event.detail.messageId);
    editMessage?.editMessage(event.detail.newText);
    this.updateMsgStatus(e);
  }

  private deleteMessage(): void {
    ChatAPI.deleteMessage(this.chosenMsgId);
  }

  private updateDeletedMsg(e?: Event): void {
    const event = e as CustomEvent;
    const delitedMsg = this.currentMessages.find((msg) => msg.id === event.detail.messageId);
    if (delitedMsg) {
      delitedMsg.node?.deleteNode();
      const index = this.MainWindow.getChildren().findIndex((el) => el === delitedMsg.node);
      this.MainWindow.getChildren().splice(index, 1);

      const delitedMsgIndex = this.currentMessages.findIndex((msg) => msg.id === event.detail.messageId);
      if (delitedMsgIndex !== -1) this.currentMessages.splice(delitedMsgIndex, 1);
      if (this.inputEditMode) this.cancelEdit();

      if (this.MainWindow.getChildren()[this.MainWindow.getChildren().length - 1] === this.Delimeter) {
        this.Delimeter.deleteNode();
        this.MainWindow.getChildren().pop();
      }

      if (this.MainWindow.getChildren().length === 0) {
        this.StartMessage.text('Text your first message');
        this.MainWindow.append(this.StartMessage);
      }

      if (!delitedMsg.status.isReaded) {
        const listUser = document.querySelector(`.list__user[data-name='${delitedMsg.from}']`);
        if (listUser) listUser.dispatchEvent(new Event('unwrittenWasDeleted'));
        UnreadStorage.deleteMessage(event.detail.messageId);
      }
    } else {
      const unreadMsg = UnreadStorage.findMessage(event.detail.messageId);
      const listUser = document.querySelector(`.list__user[data-name='${unreadMsg?.from}']`);
      if (listUser) listUser.dispatchEvent(new Event('unwrittenWasDeleted'));
    }
  }
}

export const CreateChat = () => new Chat();
