import { SortType } from 'globalTypes/api.type';
import { Div } from 'globalTypes/elements.type';
import { div, img } from 'shared/tags/tags.component';

import arrowIcon from './images/arrowIcon.png';
import styles from './productsFilters.module.scss';

export function clearSortTypeClasses(sortField: Div): void {
  sortField.removeClass(styles.asc);
  sortField.removeClass(styles.desc);
}

export function getSortType(sortField: Div, neighborSortField: Div): SortType | undefined {
  clearSortTypeClasses(neighborSortField);

  let sortType: SortType | undefined;

  if (sortField.containsClass(styles.asc)) {
    sortField.removeClass(styles.asc);
    sortField.addClass(styles.desc);
    sortType = 'desc';
  } else if (sortField.containsClass(styles.desc)) {
    sortField.removeClass(styles.desc);
  } else {
    sortField.addClass(styles.asc);
    sortType = 'asc';
  }

  return sortType;
}

export function getSortField(text: string): Div {
  const sortImage = img({
    className: styles.icon,
    src: arrowIcon,
    alt: 'arrow-icon',
  });

  sortImage.addClass(styles.arrowIcon);

  const sortField = div({ className: styles.sortField, text }, sortImage);

  return sortField;
}
