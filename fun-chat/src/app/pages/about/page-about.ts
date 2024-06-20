import { BaseComponent } from '../../components/base-components';
import { VoidCallback } from '../../utils/types';
import './page-about-style.css';

class PageAbout extends BaseComponent {
  constructor(buttonBackHandler: VoidCallback) {
    super({ className: 'about' }, new BaseComponent({ tag: 'h2', className: 'about__title', text: 'Fun Chat' }));
    const description = new BaseComponent({ tag: 'p', className: 'about__description' });
    description.getNode().innerHTML = `<span class="description__accent">By Koshman-Dmitri</span><br><br>Lorem ipsum, dolor sit amet consectetur adipisicing elit. <span class="description__accent">Fun</span> Quaerat
    voluptates <span class="description__accent">WebSocket protocol</span> voluptate, corrupti quibusdam molestias
    laborum deserunt unde, assumenda, <span class="description__accent">Chat</span> delectus impedit
    <span class="description__accent">Incredible</span> beatae cum facere
    <span class="description__accent">Help</span> inventore ipsam praesentium ullam? In, error
    <span class="description__accent">So Fun</span> asperiores.`;
    const buttonBack = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'about__button',
      text: 'Back',
      onclick: () => buttonBackHandler(),
    });
    this.appendChildren([description, buttonBack]);
  }
}

export const CreatePageAbout = (buttonBackHandler: VoidCallback) => new PageAbout(buttonBackHandler);
