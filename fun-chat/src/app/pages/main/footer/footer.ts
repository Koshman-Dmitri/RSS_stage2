import { BaseComponent } from '../../../components/base-components';
import './footer-style.css';

class Footer extends BaseComponent {
  constructor() {
    super(
      { tag: 'footer', className: 'footer' },
      new BaseComponent<HTMLLinkElement>({
        tag: 'a',
        className: 'footer__link link_git',
        href: 'https://github.com/Koshman-Dmitri',
        target: '_blank',
        title: 'GitHub',
        text: 'Koshman-Dmitri',
      }),
      new BaseComponent(
        { className: 'rs-school__wrapper' },
        new BaseComponent<HTMLLinkElement>({
          tag: 'a',
          className: 'link_rs-school',
          href: 'https://rs.school/',
          target: '_blank',
          title: 'RS.School',
        }),
        new BaseComponent<HTMLLinkElement>({
          tag: 'p',
          className: 'rs-school__title',
          text: 'RS School',
        })
      ),

      new BaseComponent<HTMLTimeElement>({ tag: 'time', dateTime: '2024', text: 'Created in 2024' })
    );
  }
}

export const CreateFooter = () => new Footer();
