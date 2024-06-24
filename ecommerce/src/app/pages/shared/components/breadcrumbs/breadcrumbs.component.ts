import { Anchor, Div } from 'globalTypes/elements.type';
import { PagesPaths } from 'pages/pageWrapper.consts';
import { getNavLink } from 'pages/pageWrapper.helpers';
import { catalogNavLink } from 'pages/shared/components/navLinks/navLinks.component';
import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';
import { capitalizeFirstLetter } from 'utils/strings.util';

import { BreadcrumbPath } from './breadcrumbs.interfaces';
import styles from './breadcrumbs.module.scss';

export class Breadcrumbs extends BaseComponent {
  constructor(private readonly paths: BreadcrumbPath[] = []) {
    super({ className: styles.breadcrumbs });

    this.addBreadcrumbs();
  }

  private addBreadcrumbs(): void {
    const catalogBreadcrumb = catalogNavLink(styles.breadcrumbLink);

    const defaultBreadcrumbs = [
      getNavLink('Home', PagesPaths.HOME, styles.breadcrumbLink),
      div({ text: '/' }),
      catalogBreadcrumb,
    ];

    if (!this.paths.length) {
      catalogBreadcrumb.addClass(styles.active);
    }

    const breadcrumbs = this.paths.reduce<(Div | Anchor)[]>((acc, { name, path }, index) => {
      const breadcrumbsLink = getNavLink(capitalizeFirstLetter(name), path, styles.breadcrumbLink);

      if (index === this.paths.length - 1) {
        breadcrumbsLink.addClass(styles.active);
      }

      acc.push(div({ text: '/' }), breadcrumbsLink);

      return acc;
    }, defaultBreadcrumbs);

    this.appendChildren(breadcrumbs);
  }
}
