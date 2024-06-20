import { BaseComponent } from './components/base-components';
import { CreateAuthPage } from './pages/authentication/auth-page';
import { CreateMain } from './pages/main/main';
import { CreatePageAbout } from './pages/about/page-about';
import { CreatePageNotFound } from './pages/not-found/not-found';
import './app-style.css';

class App {
  constructor(private root: BaseComponent) {
    window.addEventListener('hashchange', () => this.routing());
  }

  public start(): void {
    this.routing();
  }

  private showMain(): void {
    this.root.deleteChildren();
    this.root.append(
      CreateMain(
        () => this.routeFromUI('#login'),
        () => this.routeFromUI('#about'),
        () => this.routeFromUI('#main')
      )
    );
  }

  private showLoginPage(): void {
    this.root.deleteChildren();
    this.root.append(
      CreateAuthPage(
        () => this.routeFromUI('#main'),
        () => this.routeFromUI('#about')
      )
    );
  }

  private showAboutPage(): void {
    this.root.deleteChildren();
    this.root.append(CreatePageAbout(this.backHandler.bind(this)));
  }

  private showNotFoundPage(): void {
    this.root.deleteChildren();
    this.root.append(CreatePageNotFound(this.backHandler.bind(this)));
  }

  private backHandler(): void {
    window.history.back();
  }

  private routeFromUI(url: string): void {
    window.history.pushState(null, '', url);
    this.routing();
  }

  private routing(): void {
    let route = window.location.hash;
    if (route === '' || route === '#login' || route === '#main') {
      route = this.checkIsAuth();
    }

    switch (route) {
      case '#login':
        this.showLoginPage();
        break;
      case '#about':
        this.showAboutPage();
        break;
      case '#main':
        this.showMain();
        break;
      default:
        this.showNotFoundPage();
        break;
    }
  }

  private checkIsAuth(): string {
    if (sessionStorage.getItem('curUserName') && sessionStorage.getItem('curUserPassword')) {
      window.history.replaceState(null, '', '#main');
      return '#main';
    }
    window.history.replaceState(null, '', '#login');
    return '#login';
  }
}

const body = document.querySelector('body') as HTMLBodyElement;
const Root = new BaseComponent({ className: 'container' });
body.append(Root.getNode());

export default new App(Root);
