import { BaseComponent } from 'shared/base/base.component';
import { h2, img } from 'shared/tags/tags.component';

import image from './images/section-bg.jpg';
import styles from './sectionTitle.module.scss';

export class SectionTitle extends BaseComponent {
  constructor(title: string) {
    super({ className: styles.sectionWrapper });

    this.appendChildren([
      img({ className: styles.sectionImage, src: image, alt: 'section-bg' }),
      h2(title, styles.sectionTitle),
    ]);
  }
}
