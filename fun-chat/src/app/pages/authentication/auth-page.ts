import { ChatAPI } from '../../API/ChatAPI';
import { BaseComponent } from '../../components/base-components';
import { CreatePopupError } from '../../components/popup-error';
import { VoidCallback } from '../../utils/types';
import './auth-page-style.css';

class AuthPage extends BaseComponent {
  private readonly InputName: BaseComponent<HTMLInputElement>;

  private readonly InputPassword: BaseComponent<HTMLInputElement>;

  private readonly ButtonSubmit: BaseComponent<HTMLButtonElement>;

  private readonly ButtonAbout: BaseComponent<HTMLButtonElement>;

  constructor(showMainPage: VoidCallback, showAboutPage: VoidCallback) {
    super({ tag: 'form', className: 'authorization-form' });
    this.InputName = new BaseComponent<HTMLInputElement>({
      tag: 'input',
      className: 'auth-form__input',
      id: 'name',
      name: 'name',
      type: 'text',
      placeholder: 'Enter name',
      maxLength: 18,
      pattern: '[a-zA-Z0-9]{4,}',
      title: 'Letters or digits min 4 characters in length',
      autocomplete: 'off',
      required: true,
    });
    this.InputPassword = new BaseComponent<HTMLInputElement>({
      tag: 'input',
      className: 'auth-form__input',
      id: 'password',
      name: 'password',
      type: 'text',
      placeholder: 'Enter password',
      pattern: '(?=^[a-zA-Z\\d]{6,}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*',
      title: 'Lowercase AND uppercase letters AND digits. Min 6 characters',
      autocomplete: 'off',
      required: true,
    });
    this.ButtonSubmit = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'auth-form__button',
      type: 'submit',
      text: 'Enter chat',
      onclick: (e) => this.submitHandler(e),
    });
    this.ButtonAbout = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'auth-form__button',
      type: 'button',
      text: 'About',
      onclick: () => showAboutPage(),
    });
    this.appendChildren([
      new BaseComponent(
        { tag: 'fieldset' },
        new BaseComponent({ tag: 'legend', className: 'auth-form__title', text: 'Authorization' }),
        new BaseComponent(
          { className: 'auth-form__input-wrapper' },
          new BaseComponent<HTMLLabelElement>({
            tag: 'label',
            className: 'auth-form__label',
            htmlFor: 'name',
            text: 'Nickname:',
          }),
          this.InputName
        ),
        new BaseComponent(
          { className: 'auth-form__input-wrapper' },
          new BaseComponent<HTMLLabelElement>({
            tag: 'label',
            className: 'auth-form__label',
            htmlFor: 'password',
            text: 'Password:',
          }),
          this.InputPassword
        )
      ),
      this.ButtonAbout,
      this.ButtonSubmit,
    ]);
    this.addEventListener('successLogin', () => this.successLoginHandler(showMainPage));
    this.addEventListener('failedLogin', (e) => this.failedLoginHandler(e));
  }

  private submitHandler(e: Event): void {
    if (this.InputName.getNode().checkValidity() && this.InputPassword.getNode().checkValidity()) {
      e.preventDefault();
      ChatAPI.authUser(this.InputName.getNode().value, this.InputPassword.getNode().value);
    } else {
      this.InputName.addClass('error');
      this.InputPassword.addClass('error');
    }
  }

  private successLoginHandler(callback: VoidCallback): void {
    sessionStorage.setItem('curUserName', JSON.stringify(this.InputName.getNode().value));
    sessionStorage.setItem('curUserPassword', JSON.stringify(this.InputPassword.getNode().value));
    this.InputName.getNode().value = '';
    this.InputPassword.getNode().value = '';
    this.InputName.removeClass('error');
    this.InputPassword.removeClass('error');
    callback();
  }

  private failedLoginHandler(e?: Event): void {
    const event = e as CustomEvent;
    if (event.detail.error === 'incorrect password') {
      this.append(CreatePopupError('Incorrect password'));
    } else {
      this.append(CreatePopupError('A user with this login has already authorized'));
    }
    this.ButtonSubmit.setAttribute('disabled', 'true');
    this.ButtonAbout.setAttribute('disabled', 'true');
    setTimeout(() => {
      this.ButtonSubmit.removeAttribute('disabled');
      this.ButtonAbout.removeAttribute('disabled');
    }, 1500);
  }
}

export const CreateAuthPage = (showMainPage: VoidCallback, showAboutPage: VoidCallback) =>
  new AuthPage(showMainPage, showAboutPage);
