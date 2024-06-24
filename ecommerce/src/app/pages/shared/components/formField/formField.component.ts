import { Div, Input, Span } from 'globalTypes/elements.type';
import { BaseComponent } from 'shared/base/base.component';
import { div, input, span } from 'shared/tags/tags.component';

import styles from './formField.module.scss';
import { FormFieldProps } from './formField.types';

export class FormField extends BaseComponent {
  private readonly textValue: Div;

  private readonly input: Input;

  private readonly errorText: Span;

  private passwordButton?: Div;

  constructor(
    private readonly props: FormFieldProps,
    textValue?: string,
  ) {
    super({ tag: 'label', className: styles.formLabel, text: props.labelName });

    this.input = input({ ...props, className: styles.formInput });
    this.errorText = span({ className: styles.formErrorText, text: props.errorText });
    this.textValue = div({ className: styles.textValue, text: textValue });
    if (textValue) this.value = textValue;

    this.appendChildren([this.textValue, this.input, this.errorText]);

    if (props.type === 'password') this.addPasswordButton();
  }

  public get value(): string {
    return this.input.getNode().value || '';
  }

  public set value(text: string) {
    this.input.getNode().value = text;
  }

  public isValid(): boolean {
    return Boolean(this.value.match(this.props.pattern || ''));
  }

  public isBirthdayValid(validAge: number): boolean {
    const birth = new Date(this.value);
    birth.setHours(0);

    const validationDate = new Date();
    validationDate.setFullYear(new Date().getFullYear() - validAge);

    if (birth < validationDate) {
      this.removeAttribute('area-invalid');
      return true;
    }

    this.setAttribute('area-invalid', 'true');
    return false;
  }

  public setErrorText(text: string): void {
    this.errorText.setText(text);
  }

  public setPattern(pattern: string): void {
    this.input.setAttribute('pattern', pattern);
  }

  public showApiError(errorText: string): void {
    this.addClass(styles.apiError);
    this.setErrorText(errorText);

    this.input.addListener(
      'input',
      () => {
        this.removeClass(styles.apiError);
        this.setErrorText(this.props.errorText || '');
      },
      { once: true },
    );
  }

  public removeLabelText(): void {
    this.getNode().removeChild(this.getNode().firstChild!);
  }

  private addPasswordButton(): void {
    this.passwordButton = div({
      className: styles.btnPassVis,
      onclick: () => this.togglePasswordVisibility(),
    });

    this.append(this.passwordButton);
  }

  private togglePasswordVisibility(): void {
    this.passwordButton?.toggleClass(styles.open);

    const newType = this.input.getAttribute('type') === 'password' ? 'text' : 'password';

    this.input.setAttribute('type', newType);
  }
}
