import { Div } from 'globalTypes/elements.type';
import githubIcon from 'pages/about/images/githubIcon.png';
import { a, div, img } from 'shared/tags/tags.component';

import styles from './about.module.scss';

export function getMember(
  photo: string,
  name: string,
  role: string,
  description: string,
  githubLink: string,
): Div {
  return div(
    { className: styles.member },
    img({ className: styles.memberPhoto, src: photo, alt: 'photo' }),
    a(
      { className: styles.githubLink, href: githubLink, target: 'blank' },
      div({ text: name }),
      img({ className: styles.githubIcon, src: githubIcon }),
    ),
    div({ className: styles.memberRole, text: role }),
    div({ className: styles.memberDescription, text: description }),
  );
}
