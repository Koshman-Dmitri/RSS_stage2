import { FormFieldsProps } from 'pages/shared/components/formField/formField.types';

export const LOGIN_PROPS = {
  email: {
    name: 'login-email',
    type: 'text',
    labelName: 'E-mail',
    placeholder: 'Enter your email',
    maxLength: 30,
    pattern: '^[\\w\\-]+@([\\w\\-]+\\.)+[a-z]{2,4}$',
    required: true,
    errorText: '❌ Enter correct email. No whitespaces allowed',
    autocomplete: 'username',
  },
  password: {
    name: 'login-password',
    type: 'password',
    labelName: 'Password',
    placeholder: 'Enter your password',
    maxLength: 30,
    pattern: '(?=^[a-zA-Zа-яА-ЯёЁ\\d]{8,}$)(?=.*\\d)(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ]).*',
    required: true,
    errorText:
      '❌ At least one lowercase, uppercase letter and digit. Only letters and digits. Min 8 chars',
    autocomplete: 'current-password',
  },
} as const satisfies FormFieldsProps;

export const LOGIN_API_ERROR_TEXT = {
  email: '❌ Login failed: No such user',
  password: '❌ Login failed: Wrong password',
} as const;
