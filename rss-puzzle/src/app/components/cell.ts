import { BaseComponent } from './base-components';

interface Props {
  className?: string;
  text?: string;
  height?: number;
}

export class PuzzleCell extends BaseComponent {
  protected height;

  constructor({ className, text, height }: Props) {
    super({ className, text });
    if (height) {
      this.height = height;
      this.getNode().style.height = `${height}px`;
    }
    if (className !== 'row__cell_empty') {
      this.setAttribute('draggable', 'true');
    }
  }
}
