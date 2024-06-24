import 'swiper/css/bundle';

import { Div } from 'globalTypes/elements.type';
import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import { SWIPER_CLASSES } from './slider.consts';
import styles from './slider.module.scss';

export class Slider {
  public static init(): Swiper {
    return new Swiper(`.${SWIPER_CLASSES.swiper}`, {
      speed: 600,
      modules: [Navigation, Pagination],
      navigation: {
        nextEl: `.${SWIPER_CLASSES.buttonNext}`,
        prevEl: `.${SWIPER_CLASSES.buttonPrev}`,
        disabledClass: `${SWIPER_CLASSES.swiperButtonDisabled} ${styles.navigationDisabled}`,
      },
      pagination: {
        el: `.${SWIPER_CLASSES.pagination}`,
        clickable: true,
        bulletActiveClass: styles.sliderBullet,
      },
    });
  }

  public static getSliderWrapper(...sliders: BaseComponent[]): Div {
    return div(
      { className: SWIPER_CLASSES.swiper },
      div(
        { className: SWIPER_CLASSES.swiperWrapper },
        ...sliders.map((slide) => {
          const slideElem = div({ className: SWIPER_CLASSES.swiperSlide }, slide);
          slideElem.addClass(styles.slide);

          return slideElem;
        }),
      ),
      div({ className: `${SWIPER_CLASSES.pagination} ${styles.pagination}` }),
      div({
        className: `${SWIPER_CLASSES.buttonPrev} ${styles.sliderButtonPrev}`,
      }),
      div({
        className: `${SWIPER_CLASSES.buttonNext} ${styles.sliderButtonNext}`,
      }),
    );
  }
}
