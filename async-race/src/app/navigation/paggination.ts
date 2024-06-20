import { BaseComponent } from '../components/base-components';
import { STORE } from '../store/store';
import './paggination-style.css';

type Callback = () => void;

class Pagination extends BaseComponent {
  private readonly BtnPrev: BaseComponent<HTMLButtonElement>;

  private readonly BtnNext: BaseComponent<HTMLButtonElement>;

  constructor(rerender: Callback, showWarnMessage: Callback) {
    super({});
    this.BtnPrev = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'button button_prev',
      text: 'Prev',
      onclick: () => {
        if (STORE.curRacing.length > 0) {
          showWarnMessage();
          return;
        }
        STORE.page -= 1;
        rerender();
      },
    });
    this.BtnNext = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'button button_next',
      text: 'Next',
      onclick: () => {
        if (STORE.curRacing.length > 0) {
          showWarnMessage();
          return;
        }
        STORE.page += 1;
        rerender();
      },
    });
    this.appendChildren([this.BtnPrev, this.BtnNext]);
  }

  public updatePagination() {
    if (STORE.totalPages > 1 && STORE.page > 1) {
      this.BtnPrev.removeAttribute('disabled');
    } else {
      this.BtnPrev.setAttribute('disabled', 'true');
    }
    if (STORE.totalPages > 1 && STORE.page < STORE.totalPages) {
      this.BtnNext.removeAttribute('disabled');
    } else {
      this.BtnNext.setAttribute('disabled', 'true');
    }
  }
}

export const CreatePaggination = (rerender: Callback, showWarnMessage: Callback) =>
  new Pagination(rerender, showWarnMessage);
