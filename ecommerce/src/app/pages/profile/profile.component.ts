import {
  Customer,
  CustomerChangePassword,
  CustomerUpdateAction,
} from '@commercetools/platform-sdk';
import { Div } from 'globalTypes/elements.type';
import { saveTokensToLS } from 'pages/pageWrapper.helpers';
import { ProfileInfo } from 'pages/profile/components/profileInfo/profileInfo.component';
import {
  PasswordProps,
  ProfileInfoProps,
} from 'pages/profile/components/profileInfo/profileInfo.types';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import { apiService } from 'services/api.service';
import { alertModal } from 'shared/alert/alert.component';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';
import { div } from 'shared/tags/tags.component';

import {
  FAIL_PASSWORD_UPDATE,
  FAIL_USER_UPDATE,
  NO_USER_ERROR,
  SUCCESS_PASSWORD_UPDATE,
  SUCCESS_USER_UPDATE,
} from './profile.consts';
import { getCustomerIdFromLS, makeProfileProps } from './profile.helpers';
import styles from './profile.module.scss';

export class Profile extends BaseComponent {
  private readonly contentWrapper: Div;

  private profileInfo: ProfileInfo | null;

  constructor() {
    super({ className: styles.profilePage }, new SectionTitle('Profile'));
    this.profileInfo = null;

    this.contentWrapper = div({});
    this.append(this.contentWrapper);
    this.getCustomer();
  }

  private getCustomer(): void {
    this.contentWrapper.destroyChildren();
    this.profileInfo = null;
    loader.open();

    const customerId = getCustomerIdFromLS();

    if (customerId) {
      apiService
        .getCustomerById(customerId)
        .then((data) => {
          const props = makeProfileProps(data.body);
          this.render(props, data.body);
        })
        .finally(() => {
          loader.close();
        });
    } else {
      this.showNoUserError();
    }
  }

  private render(customerProps: ProfileInfoProps, data: Customer): void {
    this.profileInfo = new ProfileInfo(
      customerProps,
      data,
      this.saveChangesHandler.bind(this),
      this.cancelEditHandler.bind(this),
      this.passwordUpdateHandler.bind(this),
    );
    this.contentWrapper.append(this.profileInfo);
  }

  private showNoUserError(): void {
    this.contentWrapper.append(div({ className: styles.noUserError, text: NO_USER_ERROR }));
    loader.close();
  }

  private cancelEditHandler(): void {
    this.getCustomer();
  }

  private async saveChangesHandler(actions: CustomerUpdateAction[]): Promise<void> {
    let version;
    let currentActions = actions.slice();

    const actionAddAddr = currentActions.filter((obj) => obj.action === 'addAddress');
    const customerId = getCustomerIdFromLS();

    if (customerId) {
      loader.open();
      const customer = await apiService.getCustomerById(customerId);
      version = customer.body.version;

      if (actionAddAddr.length > 0) {
        const updatedInfo = await apiService.updateCustomerInfo(customerId, version, actionAddAddr);
        version = updatedInfo.body.version;

        if (this.profileInfo) currentActions = this.profileInfo.getActionsForApi(updatedInfo.body);
      }

      try {
        await apiService.updateCustomerInfo(customerId, version, currentActions);
        alertModal.showAlert('success', SUCCESS_USER_UPDATE);
        this.getCustomer();
      } catch (error) {
        loader.close();
        alertModal.showAlert('error', FAIL_USER_UPDATE);
      }
    } else {
      this.contentWrapper.destroyChildren();
      this.profileInfo = null;
      this.showNoUserError();
    }
  }

  private async passwordUpdateHandler(password: PasswordProps): Promise<void> {
    loader.open();

    const customerId = getCustomerIdFromLS();
    if (customerId) {
      const data = await apiService.getCustomerById(customerId);

      const body: CustomerChangePassword = {
        id: data.body.id,
        version: data.body.version,
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      };

      try {
        await apiService.updateCustomerPassword(body);
        await apiService.updatePasswordFlowCredentials({
          email: data.body.email,
          password: password.newPassword,
        });
        saveTokensToLS();
        alertModal.showAlert('success', SUCCESS_PASSWORD_UPDATE);
      } catch {
        alertModal.showAlert('error', FAIL_PASSWORD_UPDATE);
      } finally {
        loader.close();
      }
    } else {
      this.contentWrapper.destroyChildren();
      this.profileInfo = null;
      this.showNoUserError();
    }
  }
}
