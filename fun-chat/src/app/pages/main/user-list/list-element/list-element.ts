import { ChatAPI } from '../../../../API/ChatAPI';
import { BaseComponent } from '../../../../components/base-components';
import { MessageProps } from '../../chat/chat-message/message';
import { UnreadStorage } from '../../storage/unread';
import './list-element-style.css';

class ListUser extends BaseComponent {
  private readonly userName: string;

  private readonly UnreadCounter: BaseComponent;

  constructor(name: string, status: string) {
    super(
      { tag: 'li', className: `list__user ${status}` },
      new BaseComponent({ className: 'list__user-status' }),
      new BaseComponent({ tag: 'span', className: 'list__user-name', text: name })
    );
    this.userName = name;
    this.UnreadCounter = new BaseComponent({ className: 'list__unwritten', text: '' });
    this.setAttribute('data-name', name);
    this.getNode().onclick = () => ChatAPI.getMessages(name);
    this.addEventListener('drawUnreadCounter', (e) => this.drawUnreadCounter(e));
    this.addEventListener('newMessage', (e) => this.updateCounter('inc', e));
    this.addEventListener('unwrittenWasDeleted', () => this.updateCounter('dec'));
    this.addEventListener('resetUnreadCounter', () => this.deleteCounter());
  }

  private drawUnreadCounter(e?: Event): void {
    const event = e as CustomEvent;
    const props: MessageProps[] = event.detail.data;
    const filtered = props.filter((msg) => msg.from === this.userName && !msg.status.isReaded);
    if (filtered.length) {
      this.UnreadCounter.text(String(filtered.length));
      this.append(this.UnreadCounter);
      filtered.forEach((m) => UnreadStorage.addMessage(m));
    }
  }

  private updateCounter(state: 'inc' | 'dec', e?: Event): void {
    const event = e as CustomEvent;
    if (state === 'inc') {
      UnreadStorage.addMessage(event.detail.data);
    }
    if (!this.getChildren().includes(this.UnreadCounter)) {
      this.append(this.UnreadCounter);
    }
    const current = this.UnreadCounter.getNode().textContent as string;
    if (state === 'inc') this.UnreadCounter.text(`${+current + 1}`);
    if (state === 'dec') {
      this.UnreadCounter.text(`${+current - 1}`);
      if (this.UnreadCounter.getNode().textContent === '0') {
        this.deleteCounter();
      }
    }
  }

  private deleteCounter(): void {
    if (this.getChildren().includes(this.UnreadCounter)) {
      this.UnreadCounter.text('');
      this.UnreadCounter.deleteNode();
      const index = this.getChildren().findIndex((el) => el === this.UnreadCounter);
      this.getChildren().splice(index, 1);
    }
  }
}

export const CreateListUser = (name: string, status: string) => new ListUser(name, status);
