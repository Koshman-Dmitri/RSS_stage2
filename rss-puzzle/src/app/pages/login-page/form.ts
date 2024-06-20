import { BaseComponent } from '../../components/base-components';
import { Input, Label } from '../../components/html-elements';
import { MyLocalStorage } from '../../local-storage/local-storage';
import Button from '../../components/button';
import './style.css';

type SubmitCallback = () => void;

class FormForLogin extends BaseComponent {
  private readonly InputFirstName: BaseComponent<HTMLInputElement>;

  private readonly InputSurname: BaseComponent<HTMLInputElement>;

  private readonly LabelFirstName: BaseComponent<HTMLLabelElement>;

  private readonly LabelSurname: BaseComponent<HTMLLabelElement>;

  private readonly ErrorMsgFirstName: BaseComponent;

  private readonly ErrorMsgSurname: BaseComponent;

  private readonly LoginButton: Button;

  constructor(callback: SubmitCallback) {
    super({
      tag: 'form',
      className: 'login__form',
      onsubmit: (e?: Event) => {
        e?.preventDefault();
        const userFirstname = this.InputFirstName.getNode().value;
        const userSurname = this.InputSurname.getNode().value;
        MyLocalStorage.setData('firstname', userFirstname);
        MyLocalStorage.setData('surname', userSurname);
        this.InputFirstName.getNode().value = '';
        this.InputSurname.getNode().value = '';
        callback();
      },
    });

    this.InputFirstName = Input({
      className: 'form__input',
      type: 'text',
      id: 'firstname',
      name: 'firstname',
      placeholder: '...',
      required: true,
      maxLength: 16,
      oninput: () => this.checkValidity('first', this.ErrorMsgFirstName),
    });
    this.InputSurname = Input({
      className: 'form__input',
      type: 'text',
      id: 'surname',
      name: 'surname',
      placeholder: '...',
      required: true,
      maxLength: 16,
      oninput: () => this.checkValidity('sur', this.ErrorMsgSurname),
    });
    this.LabelFirstName = Label({
      className: 'label',
      text: 'First Name:',
      htmlFor: 'firstname',
    });
    this.LabelSurname = Label({
      className: 'label',
      text: 'Surname:',
      htmlFor: 'surname',
    });
    this.ErrorMsgFirstName = new BaseComponent({
      className: 'error-message',
      text: '',
    });
    this.ErrorMsgSurname = new BaseComponent({
      className: 'error-message',
      text: '',
    });
    this.LoginButton = new Button({
      className: 'button button_login',
      text: 'Login',
      type: 'submit',
      disabled: true,
    });

    this.appendChildren([
      this.LabelFirstName,
      this.InputFirstName,
      this.ErrorMsgFirstName,
      this.LabelSurname,
      this.InputSurname,
      this.ErrorMsgSurname,
      this.LoginButton,
    ]);
  }

  checkValidity(name: 'first' | 'sur', message: BaseComponent) {
    this.LoginButton.setAttribute('disabled', '');
    const input = name === 'first' ? this.InputFirstName : this.InputSurname;
    const { value } = input.getNode();
    if (!value) return;
    const minSymbols = name === 'first' ? 3 : 4;
    if (value.charCodeAt(0) < 65 || value.charCodeAt(0) > 90) {
      message.text('❌ First letter uppercase required');
      return;
    }
    if (value.length < minSymbols) {
      message.text(`❌ Minimum ${minSymbols} symbols required`);
      return;
    }
    const isValid = value.match(/^[A-Z]{1}[a-zA-Z-]+$/);
    if (!isValid) {
      message.text('❌ Only english or "-"');
    } else {
      message.text('');
      const secondInput =
        name === 'first' ? this.InputSurname : this.InputFirstName;
      const secondMessage =
        name === 'first' ? this.ErrorMsgSurname : this.ErrorMsgFirstName;
      if (
        secondMessage.getNode().textContent?.length === 0 &&
        secondInput.getNode().value.length > 0
      ) {
        this.LoginButton.removeAttribute('disabled');
      } else {
        this.LoginButton.setAttribute('disabled', '');
      }
    }
  }
}

export const LoginForm = (callback: SubmitCallback) =>
  new FormForLogin(callback);
