import { FormFieldsProps } from 'pages/shared/components/formField/formField.types';

export const PASSWORD_CHANGE_PROPS: FormFieldsProps = {
  currentPassword: {
    name: 'current-password',
    type: 'password',
    labelName: 'Current password',
    placeholder: 'Current password',
    maxLength: 30,
    pattern: '(?=^[a-zA-Zа-яА-ЯёЁ\\d]{8,}$)(?=.*\\d)(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ]).*',
    required: true,
    autocomplete: 'current-password',
    errorText:
      '❌ At least one lowercase, uppercase letter and digit. Only letters and digits. Min 8 chars',
  },
  newPassword: {
    name: 'new-password',
    type: 'password',
    labelName: 'New password',
    placeholder: 'New password',
    autocomplete: 'new-password',
    maxLength: 30,
    pattern: '(?=^[a-zA-Zа-яА-ЯёЁ\\d]{8,}$)(?=.*\\d)(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ]).*',
    required: true,
    errorText:
      '❌ At least one lowercase, uppercase letter and digit. Only letters and digits. Min 8 chars',
  },
  confirmPassword: {
    name: 'confirm-password',
    type: 'password',
    labelName: 'Confirm password',
    placeholder: 'Confirm password',
    autocomplete: 'new-password',
    maxLength: 30,
    errorText: '❌ Passwords do NOT match',
  },
};
