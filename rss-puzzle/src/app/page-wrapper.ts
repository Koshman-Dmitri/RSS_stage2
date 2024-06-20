import { BaseComponent } from './components/base-components';
import { MainPage } from './pages/main-page/game-page';
import { StartPage } from './pages/start-page/start-page';

const Main = MainPage();

function initMain(): void {
  Main.initGame();
}

const Start = StartPage(initMain);

const Container = new BaseComponent({ className: 'container' }, Main, Start);

export default Container;
