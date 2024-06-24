import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import { BaseComponent } from 'shared/base/base.component';

import styles from './notFound.module.scss';

export class NotFound extends BaseComponent {
  constructor() {
    super({ className: styles.notFound }, new SectionTitle('Page not found'));
  }
}
