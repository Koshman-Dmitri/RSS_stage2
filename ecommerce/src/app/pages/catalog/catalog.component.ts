import { ProductsCategories } from 'globalConsts/api.const';
import { Breadcrumbs } from 'pages/shared/components/breadcrumbs/breadcrumbs.component';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { div, h3 } from 'shared/tags/tags.component';

import { getCategory } from './catalog.helpers';
import styles from './catalog.module.scss';
import bedsImage from './images/bedsImage.jpg';
import chairsImage from './images/chairsImage.jpg';
import sofasImage from './images/sofasImage.jpg';

export class Catalog extends BaseComponent {
  constructor() {
    super(
      { className: styles.catalog },
      new SectionTitle('Catalog'),
      new Breadcrumbs(),
      div(
        { className: sharedStyles.container },
        div(
          { className: styles.categoriesWrapper },
          h3('Select category'),
          div(
            { className: styles.categories },
            getCategory(ProductsCategories.CHAIRS, chairsImage),
            getCategory(ProductsCategories.SOFAS, sofasImage),
            getCategory(ProductsCategories.BEDS, bedsImage),
          ),
        ),
      ),
    );
  }
}
