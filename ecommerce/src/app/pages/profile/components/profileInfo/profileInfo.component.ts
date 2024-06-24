import { Customer, CustomerUpdateAction } from '@commercetools/platform-sdk';
import { Addresses } from 'globalConsts/api.const';
import { Button, Div, Form, Table } from 'globalTypes/elements.type';
import { PasswordChange } from 'pages/profile/components/passwordChange/passwordChange.component';
import { TableRow } from 'pages/profile/components/tableRow/tableRow.component';
import { TableRowProps } from 'pages/profile/components/tableRow/tableRow.types';
import { DELETE_ADDRESS, INVALID_DATA_WARNING, NEW_ADDRESS } from 'pages/profile/profile.consts';
import { FormField } from 'pages/shared/components/formField/formField.component';
import formFieldStyles from 'pages/shared/components/formField/formField.module.scss';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import formStyles from 'pages/shared/styles/formElements.module.scss';
import { SIGNUP_PROPS, USER_AVAILABLE_AGE } from 'pages/signup/signup.consts';
import { alertModal } from 'shared/alert/alert.component';
import { BaseComponent } from 'shared/base/base.component';
import { button, div, form, table, td, tr } from 'shared/tags/tags.component';

import {
  addAddressAction,
  addBillingAddressAction,
  addShippingAddressAction,
  changeAddressAction,
  changeBirthAction,
  changeEmailAction,
  deleteAddressAction,
  removeBillingAddressAction,
  removeShippingAddressAction,
  setDefaultBillingAddressAction,
  setDefaultShippingAddressAction,
  setFirstNameAction,
  setLastNameAction,
} from './profileInfo.actions';
import styles from './profileInfo.module.scss';
import { PasswordProps, ProfileInfoProps } from './profileInfo.types';

export class ProfileInfo extends BaseComponent {
  private readonly profileWrapper: Div;

  private readonly userInfoForm: Form;

  private readonly userAddressForm: Form;

  private readonly addressTable: Table;

  private readonly firstNameField: FormField;

  private readonly lastNameField: FormField;

  private readonly emailField: FormField;

  private readonly birthField: FormField;

  private readonly saveChangesBtn: Button;

  private readonly allCustomerData: Customer;

  private readonly addresses: TableRow[];

  private newAddressCounter = 0;

  constructor(
    props: ProfileInfoProps,
    allCustomerData: Customer,
    saveChangesHandler: (actions: CustomerUpdateAction[]) => void,
    cancelEditHandler: () => void,
    passwordUpdateHandler: (data: PasswordProps) => void,
  ) {
    super({ className: sharedStyles.container });
    this.allCustomerData = allCustomerData;
    this.addresses = [];

    this.firstNameField = new FormField(SIGNUP_PROPS.firstName, props.firstName);
    this.lastNameField = new FormField(SIGNUP_PROPS.lastName, props.lastName);
    this.emailField = new FormField(SIGNUP_PROPS.email, props.email);
    this.birthField = new FormField(SIGNUP_PROPS.birthDate, props.dateOfBirth);
    this.birthField.addListener('input', () => this.birthField.isBirthdayValid(USER_AVAILABLE_AGE));

    this.userInfoForm = form(
      {
        className: `${styles.userInfoForm} ${formFieldStyles.error}`,
        oninput: () => {
          this.saveChangesBtn.removeAttribute('disabled');
        },
      },
      this.firstNameField,
      this.lastNameField,
      this.emailField,
      this.birthField,
    );

    this.addressTable = table(
      { className: styles.table },
      tr(
        { className: styles.tableHeader },
        td({ text: 'Default' }),
        td({ text: 'Type' }),
        td({ text: 'City' }),
        td({ text: 'Street' }),
        td({ text: 'Code' }),
        td({ text: 'Country' }),
        td({ text: 'Delete' }),
      ),
    );

    this.userAddressForm = form(
      {
        className: styles.userAddressForm,
        oninput: () => {
          this.saveChangesBtn.removeAttribute('disabled');
        },
      },
      div({ className: styles.tableTitle, text: 'Addresses' }),
      this.addressTable,
      button({
        className: `${formStyles.formButton} ${styles.rowAddBtn}`,
        text: 'Add',
        type: 'button',
        onclick: () => this.addNewRowAddress(),
      }),
    );

    this.profileWrapper = div(
      { className: `${styles.profileWrapper} ${formFieldStyles.noEdit}` },
      this.userInfoForm,
      this.userAddressForm,
    );

    this.saveChangesBtn = button({
      className: `${formStyles.formButton} ${styles.saveEditBtn}`,
      text: 'Save changes',
      type: 'button',
      disabled: true,
      onclick: () => {
        if (this.isProfileInfoValid()) {
          const actions = this.getActionsForApi();
          saveChangesHandler(actions);
        } else {
          alertModal.showAlert('attention', INVALID_DATA_WARNING);
        }
      },
    });

    this.appendChildren([
      this.profileWrapper,
      div(
        { className: styles.btnWrapper },
        button({
          className: `${formStyles.formButton} ${styles.passwordEditBtn}`,
          text: 'Change password',
          type: 'button',
          onclick: () => this.append(new PasswordChange(passwordUpdateHandler)),
        }),
        div(
          { className: styles.saveCancelWrapper },
          this.saveChangesBtn,
          button({
            className: `${formStyles.formButton} ${styles.cancelEditBtn}`,
            text: 'Cancel',
            type: 'button',
            onclick: () => {
              if (this.saveChangesBtn.getAttribute('disabled') === null) {
                cancelEditHandler();
              } else {
                this.stopEdit();
              }
            },
          }),
        ),
        button({
          className: `${formStyles.formButton} ${styles.startEditBtn}`,
          text: 'Edit',
          type: 'button',
          onclick: () => this.startEdit(),
        }),
      ),
    ]);

    this.renderAddresses(props.addresses);
  }

  private startEdit(): void {
    this.profileWrapper.removeClass(formFieldStyles.noEdit);
    this.profileWrapper.addClass(styles.edit);
  }

  private stopEdit(): void {
    this.profileWrapper.addClass(formFieldStyles.noEdit);
    this.profileWrapper.removeClass(styles.edit);
    this.saveChangesBtn.setAttribute('disabled', '');
  }

  private renderAddresses(addresses: TableRowProps[]): void {
    this.addressTable.appendChildren(
      addresses.map((addr) => {
        const customerAddress = new TableRow(
          addr,
          this.deleteRowAddress.bind(this),
          this.defaultHandler.bind(this),
        );
        this.addresses.push(customerAddress);
        return customerAddress;
      }),
    );
  }

  private addNewRowAddress(): void {
    const emptyProps: TableRowProps = {
      type: Addresses.BILLING,
      city: '',
      street: '',
      postalCode: '',
      country: 'BY',
      addressId: NEW_ADDRESS + this.newAddressCounter,
    };
    const newAddress = new TableRow(
      emptyProps,
      this.deleteRowAddress.bind(this),
      this.defaultHandler.bind(this),
    );

    this.addressTable.append(newAddress);
    this.addresses.push(newAddress);
    this.newAddressCounter += 1;
  }

  private deleteRowAddress(id: string): void {
    const delAddr = this.addresses.find((address) => address.addressId === id);

    if (delAddr?.addressId.startsWith(NEW_ADDRESS)) {
      const delAddrIndex = this.addresses.findIndex((address) => address.addressId === id);
      this.addresses.splice(delAddrIndex, 1);
    } else if (delAddr) {
      delAddr.addressId = `${DELETE_ADDRESS}${delAddr?.addressId}`;
    }

    delAddr?.destroy();
    this.saveChangesBtn.removeAttribute('disabled');
  }

  private defaultHandler(id: string): void {
    const defaultAddress = this.addresses.find((address) => address.addressId === id);
    this.addresses
      .filter((addr) => addr.type === defaultAddress?.type)
      .forEach((addr) => {
        if (addr !== defaultAddress) addr.resetDefault();
      });
  }

  private isProfileInfoValid(): boolean {
    return (
      this.firstNameField.isValid() &&
      this.lastNameField.isValid() &&
      this.emailField.isValid() &&
      this.birthField.isBirthdayValid(USER_AVAILABLE_AGE) &&
      this.addresses.every((addr) => addr.isRowAddressValid())
    );
  }

  public getActionsForApi(customer?: Customer): CustomerUpdateAction[] {
    const addrToAdd = this.addresses.filter((addr) => addr.addressId.startsWith(NEW_ADDRESS));

    // If there are new addresses to add
    if (addrToAdd.length && !customer) {
      const addressActionsArr: CustomerUpdateAction[] = addrToAdd.map((addr) => {
        const address = addr.getAddress();
        return addAddressAction(address);
      });

      return addressActionsArr;
    }

    const addressActionsArr: CustomerUpdateAction[][] = this.addresses.map((addr, index) => {
      const actions: CustomerUpdateAction[] = [];
      const address = addr.getAddress();

      if (addr.addressId.startsWith(DELETE_ADDRESS)) {
        const originalAddrId = addr.addressId.replace(DELETE_ADDRESS, '');
        actions.push(deleteAddressAction(originalAddrId));
      } else if (!addr.addressId.startsWith(NEW_ADDRESS)) {
        actions.push(changeAddressAction(addr.addressId, address));
      }

      if (!addr.addressId.startsWith(DELETE_ADDRESS)) {
        // If new addresses had been added and IDs were assigned, use data from customer attribute
        // otherwise the data will be taken from the original addresses
        const useId = customer ? customer.addresses[index].id : addr.addressId;
        const dataArr = customer || this.allCustomerData;

        actions.push(
          addr.type === Addresses.BILLING
            ? addBillingAddressAction(useId)
            : addShippingAddressAction(useId),
        );

        if (addr.type === Addresses.BILLING && dataArr.shippingAddressIds?.includes(useId!)) {
          actions.push(removeShippingAddressAction(useId));
        }

        if (addr.type === Addresses.SHIPPING && dataArr.billingAddressIds?.includes(useId!)) {
          actions.push(removeBillingAddressAction(useId));
        }

        if (addr.isDefaultAddress) {
          actions.push(
            addr.type === Addresses.BILLING
              ? setDefaultBillingAddressAction(useId)
              : setDefaultShippingAddressAction(useId),
          );
        }
      }

      return actions;
    });

    return [
      setFirstNameAction(this.firstNameField.value),
      setLastNameAction(this.lastNameField.value),
      changeEmailAction(this.emailField.value),
      changeBirthAction(this.birthField.value),
      // Clear default addresses to reassign them later if needed
      setDefaultBillingAddressAction(undefined),
      setDefaultShippingAddressAction(undefined),
      ...addressActionsArr.flat(),
    ];
  }
}
