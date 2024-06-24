import { BaseAddress } from '@commercetools/platform-sdk';
import { Addresses } from 'globalConsts/api.const';
import { Button, Input, Select } from 'globalTypes/elements.type';
import { DELETE_ADDRESS } from 'pages/profile/profile.consts';
import { FormField } from 'pages/shared/components/formField/formField.component';
import formFieldStyles from 'pages/shared/components/formField/formField.module.scss';
import { COUNTRIES_PROPS, SIGNUP_PROPS } from 'pages/signup/signup.consts';
import { BaseComponent } from 'shared/base/base.component';
import { button, input, option, select, td } from 'shared/tags/tags.component';

import styles from './tableRow.module.scss';
import { TableRowProps } from './tableRow.types';

export class TableRow extends BaseComponent {
  public readonly defaultField: Input;

  public readonly cityField: FormField;

  public readonly streetField: FormField;

  public readonly postalCodeField: FormField;

  public readonly typeField: Select;

  public readonly countryField: Select;

  public readonly deleteBtn: Button;

  public isDefaultAddress: boolean;

  public addressId: string;

  public type: string;

  constructor(
    props: TableRowProps,
    removeRow: (id: string) => void,
    defaultHandler: (id: string) => void,
  ) {
    super({ tag: 'tr', className: `${styles.row} ${formFieldStyles.error}` });

    this.addressId = props.addressId;
    this.type = props.type;
    this.isDefaultAddress =
      props.type === Addresses.BILLING
        ? props.addressId === props.defaultBilAddress
        : props.addressId === props.defaultShipAddress;

    if (this.isDefaultAddress) this.addClass(styles.default);

    this.defaultField = input({
      className: styles.formCheckbox,
      type: 'checkbox',
      checked: this.isDefaultAddress,
      onclick: () => {
        this.isDefaultAddress = !this.isDefaultAddress;
        if (this.isDefaultAddress) {
          this.addClass(styles.default);
          defaultHandler(props.addressId);
        } else {
          this.removeClass(styles.default);
        }
      },
    });

    this.cityField = new FormField(SIGNUP_PROPS.addressCity, props.city);
    this.cityField.removeLabelText();

    this.streetField = new FormField(SIGNUP_PROPS.addressStreet, props.street);
    this.streetField.removeLabelText();

    this.postalCodeField = new FormField(SIGNUP_PROPS.addressPostalCode, props.postalCode);
    this.postalCodeField.removeLabelText();
    this.postalCodeField.addListener('input', () => this.isPostalCodeValid());

    this.typeField = select(
      {
        className: styles.select,
        name: 'type',
        onchange: () => this.typeChangeHandler(),
      },
      option({
        value: Addresses.BILLING,
        text: 'Billing',
        selected: props.type === Addresses.BILLING,
      }),
      option({
        value: Addresses.SHIPPING,
        text: 'Shipping',
        selected: props.type === Addresses.SHIPPING,
      }),
    );

    this.countryField = select(
      {
        className: styles.select,
        name: 'country',
        onchange: () => this.isPostalCodeValid(),
      },
      option({
        value: COUNTRIES_PROPS.BY.country,
        text: COUNTRIES_PROPS.BY.country,
        selected: props.country === 'BY',
      }),
      option({
        value: COUNTRIES_PROPS.UA.country,
        text: COUNTRIES_PROPS.UA.country,
        selected: props.country === 'UA',
      }),
    );

    this.deleteBtn = button({
      className: styles.deleteButton,
      text: 'X',
      type: 'button',
      onclick: () => removeRow(props.addressId),
    });

    this.appendChildren([
      td({}, this.defaultField),
      td({}, this.typeField),
      td({}, this.cityField),
      td({}, this.streetField),
      td({}, this.postalCodeField),
      td({}, this.countryField),
      td({}, this.deleteBtn),
    ]);
  }

  private isPostalCodeValid(): boolean {
    const countryValue = this.countryField.getNode().value;
    if (!(countryValue in COUNTRIES_PROPS)) return false;

    const postalCodeValue = this.postalCodeField.value;
    const country = COUNTRIES_PROPS[countryValue as keyof typeof COUNTRIES_PROPS];

    this.postalCodeField.setPattern(`${country.pattern}`);
    this.postalCodeField.setErrorText(`${country.errorText}`);

    return Boolean(postalCodeValue.match(`${country.pattern}`));
  }

  private isAddressTypeValid(): boolean {
    const type = this.typeField.getNode().value;
    return type === Addresses.BILLING || type === Addresses.SHIPPING;
  }

  private typeChangeHandler(): void {
    this.type = this.typeField.getNode().value;
    this.resetDefault();
  }

  public resetDefault(): void {
    this.defaultField.getNode().checked = false;
    this.isDefaultAddress = false;
    this.removeClass(styles.default);
  }

  public isRowAddressValid(): boolean {
    if (this.addressId.startsWith(DELETE_ADDRESS)) return true;

    return (
      this.isAddressTypeValid() &&
      this.streetField.isValid() &&
      this.cityField.isValid() &&
      this.isPostalCodeValid()
    );
  }

  public getAddress(): BaseAddress {
    return {
      city: this.cityField.value,
      streetName: this.streetField.value,
      postalCode: this.postalCodeField.value,
      country: this.countryField.getNode().value,
    };
  }
}
