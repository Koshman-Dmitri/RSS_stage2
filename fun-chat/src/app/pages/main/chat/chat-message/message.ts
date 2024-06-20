import { BaseComponent } from '../../../../components/base-components';
import './message-style.css';

export type MessageProps = {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
};

export type MessageDirection = 'in' | 'out';

export class ChatMessage {
  public node: BaseComponent | null;

  private nodeText: HTMLElement | null;

  private nodeEdit: HTMLElement | null;

  private nodeStatus: HTMLElement | null;

  public nodeDirection: MessageDirection;

  private readonly rightClickHandler: (id: string, top: number) => void;

  public id: string;

  public from: string;

  private to: string;

  public text: string;

  private datetime: number;

  public status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };

  constructor(props: MessageProps, direction: MessageDirection, rightClickHandler: (id: string, top: number) => void) {
    this.node = null;
    this.nodeStatus = null;
    this.id = props.id;
    this.from = props.from;
    this.to = props.to;
    this.text = props.text;
    this.datetime = props.datetime;
    this.status = {
      isDelivered: props.status.isDelivered,
      isReaded: props.status.isReaded,
      isEdited: props.status.isEdited,
    };
    this.nodeText = new BaseComponent({ className: 'message__text', text: props.text }).getNode();
    this.nodeEdit = new BaseComponent({
      tag: 'span',
      className: 'message__edit',
      text: props.status.isEdited ? 'Edited' : '',
    }).getNode();

    let statusText;
    if (this.status.isReaded) {
      statusText = 'Read';
    } else {
      statusText = this.status.isDelivered ? 'Delivered' : 'Sent';
    }
    this.nodeStatus = new BaseComponent({
      tag: 'span',
      className: 'message__status',
      text: direction === 'in' ? '' : statusText,
    }).getNode();

    this.nodeDirection = direction;
    this.rightClickHandler = rightClickHandler;
  }

  public render(): BaseComponent {
    const node = new BaseComponent(
      { className: `message ${this.nodeDirection}` },
      new BaseComponent(
        { className: 'message__header' },
        new BaseComponent({
          tag: 'span',
          className: 'message__username',
          text: this.from,
        }),
        new BaseComponent({ tag: 'span', className: 'message__data', text: this.makeDate(this.datetime) })
      ),
      this.nodeText,
      new BaseComponent({ className: 'message__footer' }, this.nodeEdit, this.nodeStatus)
    );

    if (node.containsClass('out')) {
      node.getNode().oncontextmenu = (e) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        this.rightClickHandler(this.id, target.offsetTop);
      };
    }

    this.node = node;
    return node;
  }

  public editMessage(newText: string): void {
    if (this.nodeText) this.nodeText.textContent = newText;
  }

  public changeStatusToDelivered(): void {
    if (this.nodeStatus && !this.status.isDelivered) {
      this.nodeStatus.textContent = 'Delivered';
      this.status.isDelivered = true;
    }
  }

  public changeStatusToRead(): void {
    if (this.nodeStatus && !this.status.isReaded) {
      if (this.nodeDirection === 'out') this.nodeStatus.textContent = 'Read';
      this.status.isReaded = true;
    }
  }

  public changeStatusToEdited(): void {
    if (this.nodeEdit && !this.status.isEdited) {
      this.nodeEdit.textContent = 'Edited';
      this.status.isEdited = true;
    }
  }

  private makeDate(datetime: number): string {
    const date = new Date(datetime);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${d}.${m}.${y}, ${h}:${min}:${s}`;
  }
}

export const CreateChatMessage = (
  props: MessageProps,
  direction: MessageDirection,
  rightClickHandler: (id: string, top: number) => void
) => new ChatMessage(props, direction, rightClickHandler);
