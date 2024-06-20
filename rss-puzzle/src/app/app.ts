import { BaseComponent } from './components/base-components';
import { MyLocalStorage } from './local-storage/local-storage';
import Container from './page-wrapper';

class App {
  constructor(
    private pageWrapper: BaseComponent,
    private root: HTMLElement
  ) {}

  public start() {
    this.root.append(this.pageWrapper.getNode());
    this.checkIsUser();
  }

  private checkIsUser() {
    const user = MyLocalStorage.getData();
    if (user.firstname && user.surname) {
      const startPage = this.pageWrapper.getChildren()[1];
      startPage.addClass('visible');
      startPage.addClass('no-login');
    }
  }
}

const body = document.querySelector('body') as HTMLBodyElement;
export default new App(Container, body);
