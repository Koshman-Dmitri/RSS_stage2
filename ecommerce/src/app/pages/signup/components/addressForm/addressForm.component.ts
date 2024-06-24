import { Addresses } from 'globalConsts/api.const';
import { Country } from 'globalTypes/api.type';
import { Fieldset, Select } from 'globalTypes/elements.type';
import { NewAddress } from 'interfaces/api.interface';
import { FormField } from 'pages/shared/components/formField/formField.component';
import formFieldStyles from 'pages/shared/components/formField/formField.module.scss';
import { COUNTRIES_PROPS, SIGNUP_PROPS } from 'pages/signup/signup.consts';
import signupStyles from 'pages/signup/signup.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { fieldset, input, label, option, select, span } from 'shared/tags/tags.component';
import { capitalizeFirstLetter } from 'utils/strings.util';

import styles from './addressForm.module.scss';

export class AddressForm extends BaseComponent {
  public readonly addressFieldset: Fieldset;

  public readonly streetField: FormField;

  public readonly cityField: FormField;

  public readonly postalCodeField: FormField;

  public readonly countryField: Select;

  public isDefaultAddress: boolean = false;

  constructor(private readonly address: Addresses) {
    super({});

    this.streetField = new FormField(SIGNUP_PROPS.addressStreet);
    this.cityField = new FormField(SIGNUP_PROPS.addressCity);

    this.postalCodeField = new FormField(SIGNUP_PROPS.addressPostalCode);
    this.postalCodeField.addListener('input', () => this.isPostalCodeValid());

    this.countryField = select(
      {
        className: styles.select,
        name: address,
        onchange: () => this.isPostalCodeValid(),
      },
      option({ value: COUNTRIES_PROPS.BY.country, text: COUNTRIES_PROPS.BY.title }),
      option({ value: COUNTRIES_PROPS.UA.country, text: COUNTRIES_PROPS.UA.title }),
    );

    this.addressFieldset = fieldset(
      { className: styles.addressFieldset },
      span({ className: signupStyles.formText, text: capitalizeFirstLetter(address) }),
      this.streetField,
      this.cityField,
      this.postalCodeField,
      label({ className: formFieldStyles.formLabel, text: 'Country' }),
      this.countryField,
    );

    this.appendChildren([
      this.addressFieldset,
      label(
        {
          className: signupStyles.checkboxLabel,
          text: 'Set as default address',
        },
        input({
          className: signupStyles.formCheckbox,
          type: 'checkbox',
          name: `default-${address}`,
          onclick: () => {
            this.isDefaultAddress = !this.isDefaultAddress;
          },
        }),
      ),
    ]);
  }

  public isValid(): boolean {
    return this.streetField.isValid() && this.cityField.isValid() && this.isPostalCodeValid();
  }

  public getAddress(): NewAddress {
    return {
      key: this.address,
      streetName: this.streetField.value,
      city: this.cityField.value,
      postalCode: this.postalCodeField.value,
      country: this.countryField.getNode().value as Country,
    };
  }

  public getDefaultAddress(): boolean {
    return this.isDefaultAddress;
  }

  public getAddressFieldset(): Fieldset {
    return this.addressFieldset;
  }

  public get streetFieldValue(): string {
    return this.streetField.value;
  }

  public set streetFieldValue(value: string) {
    this.streetField.value = value;
  }

  public get cityFieldValue(): string {
    return this.cityField.value;
  }

  public set cityFieldValue(value: string) {
    this.cityField.value = value;
  }

  public get postalCodeFieldValue(): string {
    return this.postalCodeField.value;
  }

  public set postalCodeFieldValue(value: string) {
    this.postalCodeField.value = value;
  }

  public get countryFieldValue(): string {
    return this.countryField.getNode().value;
  }

  public set countryFieldValue(value: string) {
    this.countryField.getNode().value = value;
  }

  private isPostalCodeValid(): boolean {
    const postalCodeInput = this.postalCodeField;

    const countryValue = this.countryField.getNode().value;

    if (!(countryValue in COUNTRIES_PROPS)) return false;

    const postalCodeValue = postalCodeInput.value;
    const country = COUNTRIES_PROPS[countryValue as keyof typeof COUNTRIES_PROPS];

    postalCodeInput.setPattern(`${country.pattern}`);
    postalCodeInput.setErrorText(`${country.errorText}`);

    return Boolean(postalCodeValue.match(`${country.pattern}`));
  }
}
