import { BaseComponent } from '../components/base-components';
import { STORE } from '../store/store';
import './paggination-style.css';

type Callback = () => void;

class WinnersPagination extends BaseComponent {
  private readonly BtnPrev: BaseComponent<HTMLButtonElement>;

  private readonly BtnNext: BaseComponent<HTMLButtonElement>;

  constructor(rerender: Callback) {
    super({});
    this.BtnPrev = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'button button_prev',
      text: 'Prev',
      onclick: () => {
        STORE.winnersPage -= 1;
        rerender();
      },
    });
    this.BtnNext = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'button button_next',
      text: 'Next',
      onclick: () => {
        STORE.winnersPage += 1;
        rerender();
      },
    });
    this.appendChildren([this.BtnPrev, this.BtnNext]);
  }

  public updatePagination() {
    if (STORE.totalWinnersPages > 1 && STORE.winnersPage > 1) {
      this.BtnPrev.removeAttribute('disabled');
    } else {
      this.BtnPrev.setAttribute('disabled', 'true');
    }
    if (STORE.totalWinnersPages > 1 && STORE.winnersPage < STORE.totalWinnersPages) {
      this.BtnNext.removeAttribute('disabled');
    } else {
      this.BtnNext.setAttribute('disabled', 'true');
    }
  }
}

export const CreatePaggination = (rerender: Callback) => new WinnersPagination(rerender);
