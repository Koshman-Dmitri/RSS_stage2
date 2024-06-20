import { isNonNullable } from '../../utils/guards';
import AppController from '../controller/controller';
import { AppView } from '../view/appView';

class App {
    controller;
    view;

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    public start() {
        const sourceMain: HTMLDivElement | null = document.querySelector('.sources');
        isNonNullable(sourceMain);
        sourceMain.addEventListener('click', (e: MouseEvent): void =>
            this.controller.getNews(e, (data) => this.view.drawNews(data))
        );
        this.controller.getSources((data) => this.view.drawSources(data));
    }
}

export default App;
