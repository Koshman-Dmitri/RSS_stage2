import { CreateGaragePage } from './garage/garage';
import { CreateWinnerPage } from './winners/winners';
import { Nav } from './navigation/nav';
import './style.css';

class App {
  private readonly GaragePage;

  private readonly WinnerPage;

  constructor(private root: HTMLElement) {
    this.GaragePage = CreateGaragePage(() => this.WinnerPage.render());
    this.WinnerPage = CreateWinnerPage();
  }

  public start() {
    this.root.append(Nav(this.showGarage.bind(this), this.showWinners.bind(this)).getNode());
    this.root.append(this.GaragePage.getNode());
  }

  private showGarage() {
    this.WinnerPage.getNode().remove();
    this.root.append(this.GaragePage.getNode());
  }

  private showWinners() {
    this.GaragePage.getNode().remove();
    this.root.append(this.WinnerPage.getNode());
    this.WinnerPage.render();
  }
}

const body = document.querySelector('body') as HTMLBodyElement;
export default new App(body);
