import alexPhoto from 'pages/about/images/alexPhoto.jpg';
import dmitriPhoto from 'pages/about/images/dmitriPhoto.png';
import evgenyPhoto from 'pages/about/images/evgenyPhoto.jpg';
import rsSchoolLogo from 'pages/about/images/rsSchoolLogo.jpg';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { a, div, h3, img, span } from 'shared/tags/tags.component';

import { getMember } from './about.helpers';
import styles from './about.module.scss';

export class About extends BaseComponent {
  constructor() {
    super({ className: styles.about }, new SectionTitle('About Us'));

    this.append(
      div(
        { className: sharedStyles.container },
        div(
          { className: styles.teamDetails },
          h3('The Furniture Store Team'),
          div({
            className: styles.teamDescription,
            text: 'Our team has tried to create the magnificent and spectacular the Furniture Store with an attractive and responsible design. We only used TypeScript with some reasonable libraries such as eslint, stylelint, prettier, vitest, navigo and swiper. The CommerceTools SDK was used for the backend. Our application is a full-featured store with various furniture products, a shopping cart and the ability to register users. Our team consists of confident, hard-working and experienced guys, who have done their best to perform a excellent job.',
          }),
          h3('Team members'),
          div(
            { className: styles.members },
            getMember(
              alexPhoto,
              'Alexander',
              'Team-lead',
              'Alexander is our team-lead, who organized the work and helped other members in a difficult situation. He led and controlled the whole process from start to finish, including submit and checking other works.',
              'https://github.com/AlexIHavr',
            ),
            getMember(
              dmitriPhoto,
              'Dmitri',
              'Front-end developer',
              'Dmitri has been working on the most complicated parts of our application as an high-experienced programmer and the leader in the course. The development of registration, login, user profile and shopping cart is his achievement.',
              'https://github.com/Koshman-Dmitri',
            ),
            getMember(
              evgenyPhoto,
              'Evgeny',
              'Front-end developer',
              'Evgeny mostly has been working on integration of the CommerceTools API into all parts of our application. He has created the adaptive API system for easy and fast work with users, products and shopping cart.',
              'https://github.com/Parxommm',
            ),
          ),
          a(
            { className: styles.rsSchoolLink, href: 'https://rs.school/', target: 'blank' },
            img({ className: styles.rsSchoolLogo, src: rsSchoolLogo, alt: 'RSSchool-logo' }),
            span({ text: 'RSSchool' }),
          ),
        ),
      ),
    );
  }
}
