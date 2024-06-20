import { BaseComponent } from '../components/base-components';
import './style.css';

type Callback = () => void;

class Navigation extends BaseComponent {
  private readonly ButtonGarage: BaseComponent<HTMLButtonElement>;

  private readonly ButtonWinners: BaseComponent<HTMLButtonElement>;

  constructor(garageCallback: Callback, winnersCallback: Callback) {
    super({ tag: 'nav', className: 'nav' });
    this.ButtonGarage = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'button',
      text: 'To Garage',
      onclick: () => garageCallback(),
    });
    this.ButtonWinners = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'button',
      text: 'To Winners',
      onclick: () => winnersCallback(),
    });
    this.appendChildren([this.ButtonGarage, this.ButtonWinners]);
  }
}

export const Nav = (garageCallback: Callback, winnersCallback: Callback) =>
  new Navigation(garageCallback, winnersCallback);
