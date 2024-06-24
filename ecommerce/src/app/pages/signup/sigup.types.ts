import { Country } from 'globalTypes/api.type';
import { FormFieldProps } from 'pages/shared/components/formField/formField.types';

export type CountriesProps = Record<
  string,
  Partial<FormFieldProps> & { title: string; country: Country }
>;
