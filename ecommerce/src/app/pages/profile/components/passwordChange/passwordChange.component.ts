import { Button, Div, Form } from 'globalTypes/elements.type';
import { PasswordProps } from 'pages/profile/components/profileInfo/profileInfo.types';
import { FormField } from 'pages/shared/components/formField/formField.component';
import formFieldStyles from 'pages/shared/components/formField/formField.module.scss';
import formStyles from 'pages/shared/styles/formElements.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { button, div, form } from 'shared/tags/tags.component';

import { PASSWORD_CHANGE_PROPS } from './passwordChange.consts';
import styles from './passwordChange.module.scss';

export class PasswordChange extends BaseComponent {
  private readonly passwordForm: Form;

  private readonly currentPasswordField: FormField;

  private readonly newPasswordField: FormField;

  private readonly confirmPasswordField: FormField;

  private readonly saveBtn: Button;

  private readonly closeBtn: Button;

  private readonly message: Div;

  constructor(updatePasswordHandler: (data: PasswordProps) => void) {
    super({ className: styles.overlay });

    this.currentPasswordField = new FormField(PASSWORD_CHANGE_PROPS.currentPassword);
    this.currentPasswordField.addListener(
      'input',
      () => this.currentPasswordField.addClass(formFieldStyles.selfError),
      { once: true },
    );

    this.newPasswordField = new FormField(PASSWORD_CHANGE_PROPS.newPassword);
    this.newPasswordField.addListener(
      'input',
      () => this.newPasswordField.addClass(formFieldStyles.selfError),
      { once: true },
    );
    this.newPasswordField.addListener('input', () => {
      if (this.confirmPasswordField.value.length !== 0) this.comparePassword();
    });

    this.confirmPasswordField = new FormField(PASSWORD_CHANGE_PROPS.confirmPassword);
    this.confirmPasswordField.addListener('input', () => this.comparePassword());

    this.closeBtn = button({
      className: `${formStyles.formButton} ${styles.closeBtn}`,
      text: 'X',
      type: 'button',
      onclick: () => this.closeModal(),
    });

    this.saveBtn = button({
      className: `${formStyles.formButton} ${styles.saveBtn}`,
      text: 'Save and close',
      type: 'submit',
      disabled: true,
      onclick: (e) => {
        e.preventDefault();
        if (this.checkValidity()) {
          updatePasswordHandler({
            currentPassword: this.currentPasswordField.value,
            newPassword: this.newPasswordField.value,
          });
          this.closeModal();
        }
      },
    });

    this.message = div({
      className: `${styles.message} ${styles.hidden}`,
      text: '❌ Current and new passwords are the same',
    });

    this.passwordForm = form(
      {
        className: styles.passwordWrapper,
        oninput: () => {
          if (this.checkValidity()) {
            this.saveBtn.removeAttribute('disabled');
          } else {
            this.saveBtn.setAttribute('disabled', '');
          }
        },
      },
      this.currentPasswordField,
      this.newPasswordField,
      this.confirmPasswordField,
      this.saveBtn,
      this.closeBtn,
      this.message,
    );

    this.append(this.passwordForm);
    this.addListener('mousedown', (e) => {
      if (e?.target === e?.currentTarget) this.closeModal();
    });
  }

  private closeModal(): void {
    this.destroy();
  }

  private comparePassword(): void {
    if (this.newPasswordField.value === this.confirmPasswordField.value) {
      this.confirmPasswordField.removeClass(formFieldStyles.mismatchPassword);
    } else {
      this.confirmPasswordField.addClass(formFieldStyles.mismatchPassword);
    }
  }

  private checkValidity(): boolean {
    if (this.currentPasswordField.value === this.newPasswordField.value) {
      this.message.removeClass(styles.hidden);
    } else {
      this.message.addClass(styles.hidden);
    }

    return (
      this.currentPasswordField.isValid() &&
      this.newPasswordField.isValid() &&
      this.newPasswordField.value === this.confirmPasswordField.value &&
      this.currentPasswordField.value !== this.newPasswordField.value
    );
  }
}
