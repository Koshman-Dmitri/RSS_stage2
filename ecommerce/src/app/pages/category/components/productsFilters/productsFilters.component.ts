import { ProductsAttributes, ProductsBrands, ProductsColors } from 'globalConsts/api.const';
import { SortValue } from 'globalTypes/api.type';
import { Div, Form, Input } from 'globalTypes/elements.type';
import { SortProps } from 'interfaces/api.interface';
import { Category } from 'pages/category/category.component';
import { BaseComponent } from 'shared/base/base.component';
import { button, div, form, img, input, label } from 'shared/tags/tags.component';
import { capitalizeFirstLetter } from 'utils/strings.util';

import filterIcon from './images/filterIcon.png';
import searchIcon from './images/searchIcon.png';
import selectArrowIcon from './images/selectArrowIcon.png';
import sortIcon from './images/sortIcon.png';
import {
  PRODUCTS_BRANDS_VALUES,
  PRODUCTS_COLORS_VALUES,
  PRODUCTS_FILTERS_PROPS,
} from './productsFilters.consts';
import { clearSortTypeClasses, getSortField, getSortType } from './productsFilters.helpers';
import styles from './productsFilters.module.scss';

export class ProductsFilters extends BaseComponent {
  private readonly priceFromInput: Input;

  private readonly priceToInput: Input;

  private readonly inputOptions: Record<ProductsAttributes, Input[]>;

  private readonly multipleSelects: Record<ProductsAttributes, Div>;

  private readonly nameSortField: Div;

  private readonly priceSortField: Div;

  private readonly searchInput: Input;

  private readonly filterFieldForm: Form;

  private selectFields: Div[] = [];

  private sortProps?: SortProps;

  constructor(private readonly parent: Category) {
    super({ className: styles.productsFilters });

    this.inputOptions = { color: [], brand: [] };

    this.multipleSelects = {
      color: div({ className: styles.multipleSelect }),
      brand: div({ className: styles.multipleSelect }),
    };

    this.priceFromInput = input({
      className: styles.priceInput,
      ...PRODUCTS_FILTERS_PROPS.priceFrom,
    });

    this.priceToInput = input({
      className: styles.priceInput,
      ...PRODUCTS_FILTERS_PROPS.priceTo,
    });

    this.filterFieldForm = form(
      { className: styles.filterFieldForm },
      label(
        { className: styles.filterFieldLabel },
        img({ className: styles.icon, src: filterIcon, alt: 'filter-icon' }),
        div(
          { className: styles.filterField, text: 'Price' },
          this.priceFromInput,
          this.priceToInput,
        ),
      ),
      this.getMultipleSelectField(ProductsAttributes.BRAND),
      this.getMultipleSelectField(ProductsAttributes.COLOR),
      button({
        className: styles.submitFilterBtn,
        type: 'submit',
        text: 'Apply',
        onclick: (event) => this.submitFilter(event),
      }),
      button({
        className: styles.resetFilterBtn,
        type: 'reset',
        text: 'Reset',
        onclick: () => this.resetFilters(),
      }),
    );

    this.nameSortField = getSortField('Name');
    this.priceSortField = getSortField('Price');

    this.setSubmitFilter(this.nameSortField, this.priceSortField, 'name');
    this.setSubmitFilter(this.priceSortField, this.nameSortField, 'price');

    this.searchInput = input({
      className: styles.searchInput,
      ...PRODUCTS_FILTERS_PROPS.search,
      onkeydown: (event) => this.submitSearch(event),
    });

    this.appendChildren([
      this.filterFieldForm,
      div(
        { className: styles.filterField },
        img({ className: styles.icon, src: sortIcon, alt: 'sort-icon' }),
        this.nameSortField,
        this.priceSortField,
      ),
      label(
        {
          className: styles.filterField,
          onclick: (event) => {
            if (event.target !== this.searchInput.getNode()) this.submitSearch();
          },
        },
        img({ className: styles.icon, src: searchIcon, alt: 'sort-icon' }),
        this.searchInput,
      ),
    ]);

    window.onclick = (event): void => this.hideSelectFields(event);

    this.fillFilters();
  }

  private setSubmitFilter(mainSortField: Div, neighborSortField: Div, sortValue: SortValue): void {
    mainSortField.addListener('click', () => {
      const sortType = getSortType(mainSortField, neighborSortField);

      this.sortProps = sortType ? { value: sortValue, direction: sortType } : undefined;

      this.submitFilter();
    });
  }

  private hideSelectFields(event: MouseEvent): void {
    this.selectFields.forEach((selectField) => {
      if (!event.composedPath().includes(selectField.getNode())) {
        selectField.removeClass(styles.show);
      }
    });
  }

  private getMultipleSelectField(optionsType: ProductsAttributes): Div {
    const multipleSelect = this.multipleSelects[optionsType];

    multipleSelect.addClass(styles[optionsType]);

    const selectIcon = img({
      className: styles.icon,
      src: selectArrowIcon,
      alt: 'select-array-icon',
    });
    selectIcon.addClass(styles.selectIcon);

    const multipleSelectField = div(
      { className: styles.filterField },
      div(
        {
          className: styles.filterFieldTitle,
          text: capitalizeFirstLetter(optionsType),
          onclick: (event) => {
            if (!event.composedPath().includes(multipleSelect.getNode())) {
              multipleSelectField.toggleClass(styles.show);
            }
          },
        },
        selectIcon,
        multipleSelect,
      ),
    );

    this.selectFields.push(multipleSelectField);

    return multipleSelectField;
  }

  private fillFilters(): void {
    PRODUCTS_BRANDS_VALUES.forEach((option) => {
      this.addOptionToMultipleSelect(ProductsAttributes.BRAND, option);
    });

    PRODUCTS_COLORS_VALUES.forEach((option) => {
      this.addOptionToMultipleSelect(ProductsAttributes.COLOR, option);
    });
  }

  private addOptionToMultipleSelect(optionsType: ProductsAttributes, option: string): void {
    const inputOption = input({
      className: styles.selectCheckbox,
      value: option,
      type: 'checkbox',
    });

    this.inputOptions[optionsType].push(inputOption);

    this.multipleSelects[optionsType].append(
      label({ className: styles.multipleSelectLabel, text: option }, inputOption),
    );
  }

  private resetFilters(): void {
    this.parent.setProducts({});
    this.searchInput.setProps({ value: '' });

    clearSortTypeClasses(this.nameSortField);
    clearSortTypeClasses(this.priceSortField);
  }

  private submitFilter(event?: MouseEvent): void {
    event?.preventDefault();

    const toInputValue = this.priceToInput.getNode().value;

    const fromValue = Number(this.priceFromInput.getNode().value);
    let toValue: number | undefined;

    if (toInputValue) {
      toValue = Number(toInputValue);
    }

    const brands = this.getFilteredOptions<ProductsBrands>(ProductsAttributes.BRAND);
    const colors = this.getFilteredOptions<ProductsColors>(ProductsAttributes.COLOR);

    if (fromValue || toValue || brands.length || colors.length) {
      this.searchInput.setProps({ value: '' });

      this.parent.setProducts({
        filterProps: {
          price: { from: fromValue, to: toValue },
          brands,
          colors,
        },
        sortProps: this.sortProps,
      });
    } else {
      this.parent.setProducts({ sortProps: this.sortProps, searchText: this.getSearchText() });
    }
  }

  private getFilteredOptions<T extends ProductsBrands | ProductsColors>(
    optionsType: ProductsAttributes,
  ): T[] {
    return this.inputOptions[optionsType].reduce<T[]>((products, inputOption) => {
      const node = inputOption.getNode();

      if (node.checked) products.push(node.value as T);

      return products;
    }, []);
  }

  private submitSearch(event?: KeyboardEvent): void {
    if (event && event.key !== 'Enter') return;

    const searchText = this.getSearchText();

    if (!searchText) return;

    this.filterFieldForm.getNode().reset();
    this.parent.setProducts({ sortProps: this.sortProps, searchText });
  }

  private getSearchText(): string {
    return this.searchInput.getNode().value;
  }
}
