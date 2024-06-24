import { Image } from '@commercetools/platform-sdk';
import { Div } from 'globalTypes/elements.type';
import { Slider } from 'shared/slider/slider.component';
import { div, img } from 'shared/tags/tags.component';

import styles from './product.module.scss';

export function getSlider(images: Image[] = [], className?: string): Div {
  const slider = div(
    {},
    Slider.getSliderWrapper(
      ...images.map(({ url }) =>
        img({ className: styles.sliderImage, src: url, alt: 'slider-image' }),
      ),
    ),
  );

  if (className) slider.addClass(className);

  return slider;
}
