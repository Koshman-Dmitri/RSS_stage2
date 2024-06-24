import { CustomerUpdateAction, ErrorResponse } from '@commercetools/platform-sdk';
import { ClientResponse } from '@commercetools/sdk-client-v2';
import { Addresses } from 'globalConsts/api.const';
import { Form, Span } from 'globalTypes/elements.type';
import { NewCustomer } from 'interfaces/api.interface';
import { getLoginDataWithCart, successLogin } from 'pages/pageWrapper.helpers';
import { FormField } from 'pages/shared/components/formField/formField.component';
import formFieldStyles from 'pages/shared/components/formField/formField.module.scss';
import { loginNavLink } from 'pages/shared/components/navLinks/navLinks.component';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import formStyles from 'pages/shared/styles/formElements.module.scss';
import { AddressForm } from 'pages/signup/components/addressForm/addressForm.component';
import { apiService } from 'services/api.service';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';
import { button, div, form, input, label, span } from 'shared/tags/tags.component';

import {
  COMMON_ERROR_VISIBLE_TIME,
  SIGNUP_API_ERROR_TEXT,
  SIGNUP_PROPS,
  USER_AVAILABLE_AGE,
} from './signup.consts';
import styles from './signup.module.scss';

export class Signup extends BaseComponent {
  private readonly signupForm: Form;

  private readonly emailField: FormField;

  private readonly passwordField: FormField;

  private readonly firstNameField: FormField;

  private readonly lastNameField: FormField;

  private readonly birthField: FormField;

  private readonly commonTextError: Span;

  private readonly bilAddressForm: AddressForm;

  private readonly shipAddressForm: AddressForm;

  private isSameAddress: boolean = false;

  constructor() {
    super({ className: styles.signupPage });

    this.emailField = new FormField(SIGNUP_PROPS.email);
    this.passwordField = new FormField(SIGNUP_PROPS.password);
    this.firstNameField = new FormField(SIGNUP_PROPS.firstName);
    this.lastNameField = new FormField(SIGNUP_PROPS.lastName);

    this.birthField = new FormField(SIGNUP_PROPS.birthDate);
    this.birthField.addListener('input', () => this.birthField.isBirthdayValid(USER_AVAILABLE_AGE));

    this.bilAddressForm = new AddressForm(Addresses.BILLING);
    this.shipAddressForm = new AddressForm(Addresses.SHIPPING);

    this.commonTextError = span({ className: styles.commonErrorText, text: 'Error text' });

    this.signupForm = form(
      { className: styles.signupFormWrapper },
      div(
        { className: styles.userWrapper },
        this.emailField,
        this.passwordField,
        this.firstNameField,
        this.lastNameField,
        this.birthField,
      ),
      div({ className: styles.formText, text: 'Addresses' }),
      label(
        {
          className: styles.checkboxLabel,
          text: 'Set the same for both',
        },
        input({
          className: styles.formCheckbox,
          type: 'checkbox',
          name: 'sameAddress',
          onclick: () => this.sameAddressHandler(),
        }),
      ),
      div({ className: styles.hr }),
      div({ className: styles.addressWrapper }, this.bilAddressForm, this.shipAddressForm),
      this.commonTextError,
      button({
        className: formStyles.formButton,
        text: 'Signup',
        type: 'submit',
        onclick: (event) => this.submitHandler(event),
      }),
    );

    this.appendChildren([
      new SectionTitle('Create An Account'),
      div(
        { className: sharedStyles.container },
        this.signupForm,
        span(
          { className: formStyles.formFooter, text: 'Already have an account? ' },
          loginNavLink(formStyles.formFooterLink),
        ),
      ),
    ]);
  }

  private submitHandler(event: Event): void {
    event.preventDefault();

    if (
      this.emailField.isValid() &&
      this.passwordField.isValid() &&
      this.firstNameField.isValid() &&
      this.lastNameField.isValid() &&
      this.birthField.isBirthdayValid(USER_AVAILABLE_AGE) &&
      this.bilAddressForm.isValid() &&
      this.shipAddressForm.isValid()
    ) {
      this.sendSignup();
    } else {
      this.signupForm.addClass(formFieldStyles.error);
    }
  }

  private sendSignup(): void {
    loader.open();

    apiService
      .signupCustomer(this.getNewCustomerFromForm())
      .then(() =>
        apiService.loginCustomer(
          getLoginDataWithCart({
            email: this.emailField.value,
            password: this.passwordField.value,
          }),
        ),
      )
      .then((data) => {
        const { id, version, addresses } = data.body.customer;
        const actions: CustomerUpdateAction[] = [
          {
            action: 'addBillingAddressId',
            addressId: addresses[0].id,
          },
          {
            action: 'addShippingAddressId',
            addressId: addresses[1].id,
          },
        ];

        apiService
          .updateCustomerInfo(id, version, actions)
          .then(() => successLogin('Signed up successfully', id, data.body.cart));
      })
      .catch((res) => this.showSignupErrors(res))
      .finally(() => {
        loader.close();
      });
  }

  private showSignupErrors(res: ClientResponse<ErrorResponse>): void {
    if (!res.body?.errors?.length) return;

    const { code, message, detailedErrorMessage } = res.body.errors[0];

    switch (code) {
      case 'InvalidOperation':
        if (message === 'The provided value is not a valid email') {
          this.emailField.showApiError(SIGNUP_API_ERROR_TEXT.emptyEmail);
        } else if (message === `'password' should not be empty.`) {
          this.passwordField.showApiError(SIGNUP_API_ERROR_TEXT.emptyPassword);
        }
        break;

      case 'InvalidJsonInput':
        if (String(detailedErrorMessage).startsWith('dateOfBirth')) {
          this.birthField.showApiError(SIGNUP_API_ERROR_TEXT.emptyDateOfBirth);
        }
        if (String(detailedErrorMessage).startsWith('addresses')) {
          this.showCommonError(SIGNUP_API_ERROR_TEXT.badCountryValue);
        }
        break;

      case 'DuplicateField':
        this.emailField.showApiError(SIGNUP_API_ERROR_TEXT.existedEmail);
        break;

      default:
        this.showCommonError(SIGNUP_API_ERROR_TEXT.serverInternalError);
    }
  }

  private getNewCustomerFromForm(): NewCustomer {
    const newCustomer: NewCustomer = {
      email: this.emailField.value,
      password: this.passwordField.value,
      firstName: this.firstNameField.value,
      lastName: this.lastNameField.value,
      dateOfBirth: this.birthField.value,
      addresses: [],
    };

    newCustomer.addresses.push(this.bilAddressForm.getAddress(), this.shipAddressForm.getAddress());

    if (this.bilAddressForm.getDefaultAddress()) {
      newCustomer.defaultBillingAddress = 0;
    }

    if (this.shipAddressForm.getDefaultAddress()) {
      newCustomer.defaultShippingAddress = 1;
    }

    return newCustomer;
  }

  private sameAddressHandler(): void {
    this.isSameAddress = !this.isSameAddress;
    this.copyAddress();

    const bilFieldset = this.bilAddressForm.getAddressFieldset();
    const shipFieldset = this.shipAddressForm.getAddressFieldset();

    if (this.isSameAddress) {
      shipFieldset.setAttribute('disabled', '');
      bilFieldset.addListener('input', this.copyAddress);
    } else {
      shipFieldset.removeAttribute('disabled');
      bilFieldset.removeListener('input', this.copyAddress);
    }
  }

  private copyAddress = (): void => {
    this.shipAddressForm.streetFieldValue = this.bilAddressForm.streetFieldValue;
    this.shipAddressForm.cityFieldValue = this.bilAddressForm.cityFieldValue;
    this.shipAddressForm.postalCodeFieldValue = this.bilAddressForm.postalCodeFieldValue;
    this.shipAddressForm.countryFieldValue = this.bilAddressForm.countryFieldValue;
  };

  private showCommonError(errorText: string): void {
    this.commonTextError.addClass(styles.visible);
    this.commonTextError.setText(errorText);
    setTimeout(() => this.commonTextError.removeClass(styles.visible), COMMON_ERROR_VISIBLE_TIME);
  }
}
