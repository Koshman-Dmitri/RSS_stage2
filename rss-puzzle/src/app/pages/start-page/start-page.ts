import { BaseComponent } from '../../components/base-components';
import Button from '../../components/button';
import { MyLocalStorage } from '../../local-storage/local-storage';
import { LoginForm } from '../login-page/form';
import './style.css';

class StartPageClass extends BaseComponent {
  private LoginForm;

  constructor(callback: () => void) {
    super(
      { className: 'start-page' },
      new BaseComponent(
        {
          className: 'start-page__wrapper',
        },
        new BaseComponent({
          tag: 'h1',
          className: 'app__title',
          text: 'English Puzzle',
        }),
        new BaseComponent({
          tag: 'h2',
          className: 'app__subtitle',
        }),
        new BaseComponent({
          tag: 'p',
          className: 'app__description',
          text: 'Click on words, collect phrases',
        }),
        new BaseComponent({
          tag: 'p',
          className: 'app__description',
          text: 'Words can be drag and drop. Select tooltips in the menu',
        }),
        new Button({
          className: 'button button_start',
          text: 'Start',
          onClick: () => {
            callback();
            this.addClass('invisible');
            setTimeout(() => {
              this.removeClass('visible');
            }, 600);
          },
        })
      )
    );

    this.LoginForm = LoginForm(() => this.showStartPage());
    this.append(this.LoginForm);
    this.setPersonalName();
  }

  private showStartPage() {
    this.setPersonalName();
    this.addClass('visible');
  }

  private setPersonalName() {
    const { firstname, surname } = MyLocalStorage.getData();
    const greeting = this.children[0].getChildren()[1];
    greeting.text(`Hello, ${firstname} ${surname}!`);
  }
}

export const StartPage = (callback: () => void) => new StartPageClass(callback);
