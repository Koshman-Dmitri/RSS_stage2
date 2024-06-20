import { MessageProps } from '../chat/chat-message/message';

class CreateUnreadStorage {
  private store: MessageProps[];

  constructor() {
    this.store = [];
  }

  public addMessage(props: MessageProps): void {
    this.store.push(props);
  }

  public deleteMessage(id: string): void {
    const index = this.store.findIndex((el) => el.id === id);
    if (index !== -1) this.store.splice(index, 1);
  }

  public findMessage(id: string): MessageProps | undefined {
    return this.store.find((msg) => msg.id === id);
  }
}

export const UnreadStorage = new CreateUnreadStorage();
