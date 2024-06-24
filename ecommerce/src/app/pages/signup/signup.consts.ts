import { LOGIN_PROPS } from 'pages/login/login.consts';
import { FormFieldsProps } from 'pages/shared/components/formField/formField.types';

import { CountriesProps } from './sigup.types';

export const COMMON_ERROR_VISIBLE_TIME = 4000;

export const USER_AVAILABLE_AGE = 13;

export const SIGNUP_PROPS = {
  ...LOGIN_PROPS,
  firstName: {
    name: 'firstName',
    type: 'text',
    labelName: 'First name',
    placeholder: 'Enter your first name',
    maxLength: 30,
    pattern: '^(?! )(?!.* $)([a-zA-Zа-яА-ЯёЁ\\s]+)$',
    required: true,
    errorText:
      '❌ At least one symbol. Only letters allowed. Don`t leave leading or trailing whitespace',
  },
  lastName: {
    name: 'lastName',
    type: 'text',
    labelName: 'Last name',
    placeholder: 'Enter your last name',
    maxLength: 30,
    pattern: '^(?! )(?!.* $)([a-zA-Zа-яА-ЯёЁ\\s]+)$',
    required: true,
    errorText:
      '❌ At least one symbol. Only letters allowed. Don`t leave leading or trailing whitespace',
  },
  birthDate: {
    name: 'birth',
    type: 'date',
    labelName: 'Date of birth',
    max: '9999-12-31',
    required: true,
    errorText: '❌ The service is available to users over 13 years old',
  },
  addressStreet: {
    name: 'street',
    type: 'text',
    labelName: 'Street',
    placeholder: 'Enter your street',
    maxLength: 30,
    pattern: '^(?! )(?!.* $).+$',
    required: true,
    errorText: '❌ Min 1 symbol. Don`t leave whitespace on the edges',
  },
  addressCity: {
    name: 'city',
    type: 'text',
    labelName: 'City',
    placeholder: 'Enter your city',
    maxLength: 30,
    pattern: '^(?! )(?!.* $)([a-zA-Zа-яА-ЯёЁ\\s]+)$',
    required: true,
    errorText: '❌ Min 1 symbol. Only letters. Don`t leave whitespace on the edges',
  },
  addressPostalCode: {
    name: 'postal-code',
    type: 'text',
    labelName: 'Postal code',
    placeholder: 'Enter your postal code',
    maxLength: 30,
    required: true,
    errorText: '❌ Belarus postal code must have 6 digits, starting with "2"',
  },
} as const satisfies FormFieldsProps;

export const COUNTRIES_PROPS = {
  BY: {
    country: 'BY',
    title: 'Belarus',
    pattern: '^2\\d{5}$',
    errorText: '❌ Belarus postal code must have 6 digits, starting with "2"',
  },
  UA: {
    country: 'UA',
    title: 'Ukraine',
    pattern: '^\\d{5}$',
    errorText: '❌ Ukraine postal code must have exactly 5 digits',
  },
} as const satisfies CountriesProps;

export const SIGNUP_API_ERROR_TEXT = {
  existedEmail: '❌ Signup failed: this email has already exist. Try another email',
  emptyEmail: '❌ Email should not be empty',
  emptyPassword: '❌ Password should not be empty',
  emptyDateOfBirth: '❌ Please enter valid date of birth',
  badCountryValue: '❌ Invalid country value',
  serverInternalError: '❌ Signup failed: Technical issues. Try again later',
} as const;
