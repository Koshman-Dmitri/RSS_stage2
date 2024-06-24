import { CustomerChangePassword } from '@commercetools/platform-sdk';
import { TableRowProps } from 'pages/profile/components/tableRow/tableRow.types';

export type ProfileInfoProps = {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  addresses: TableRowProps[];
};

export type PasswordProps = Pick<CustomerChangePassword, 'currentPassword' | 'newPassword'>;
