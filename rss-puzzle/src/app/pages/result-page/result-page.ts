import { BaseComponent } from '../../components/base-components';
import Button from '../../components/button';
import { Img, Span } from '../../components/html-elements';
import './style.css';

type Props = {
  picSrc: string;
  picName: string;
  picAuthor: string;
  picYear: string;
  known: string[][];
  unknown: string[][];
};

type Callback = () => void;

class CreateResultPage extends BaseComponent {
  private readonly AudioPlayer: BaseComponent<HTMLAudioElement>;

  private readonly KnownList: BaseComponent;

  private readonly UnknownList: BaseComponent;

  constructor({ ...props }: Props, callback: Callback) {
    super({ className: 'overlay' });
    this.addEventListener('click', (e) => {
      if (e?.target === e?.currentTarget) {
        this.AudioPlayer.getNode().pause();
        this.deleteNode();
      }
    });

    this.AudioPlayer = new BaseComponent<HTMLAudioElement>({
      tag: 'audio',
      src: '',
    });

    this.KnownList = new BaseComponent(
      {
        tag: 'ul',
        className: 'result__known',
      },
      ...props.known.map((el) => {
        return new BaseComponent(
          { tag: 'li' },
          Span({
            className: 'audio-url',
            text: '🔊',
            onclick: () => this.playAudio(el[1]),
          }),
          Span({ className: 'result__sentence', text: el[0] })
        );
      })
    );

    this.UnknownList = new BaseComponent(
      {
        tag: 'ul',
        className: 'result__unknown',
      },
      ...props.unknown.map((el) => {
        return new BaseComponent(
          { tag: 'li' },
          Span({
            className: 'audio-url',
            text: '🔊',
            onclick: () => this.playAudio(el[1]),
          }),
          Span({ className: 'result__sentence', text: el[0] })
        );
      })
    );

    this.appendChildren([
      new BaseComponent(
        { className: 'result-page' },
        Img({
          className: 'result__image',
          src: props.picSrc,
          alt: props.picName,
          width: 133,
          height: 75,
        }),
        new BaseComponent({
          tag: 'p',
          className: 'result__image-desc',
          text: `${props.picName} (${props.picYear}) by ${props.picAuthor}`,
        }),
        new BaseComponent(
          { className: 'result-table__wrapper' },
          new BaseComponent({
            tag: 'h3',
            className: 'result__title unknown',
            innerHTML: `I dont know<span class="result__num">${props.unknown.length}</span>`,
          }),
          this.UnknownList,
          new BaseComponent({
            tag: 'h3',
            className: 'result__title known',
            innerHTML: `I know<span class="result__num">${props.known.length}</span>`,
          }),
          this.KnownList
        ),
        new Button({
          className: 'button result-page__button',
          text: 'Continue',
          onClick: () => {
            this.AudioPlayer.getNode().pause();
            callback();
            this.deleteNode();
          },
        })
      ),
    ]);
  }

  private playAudio(src: string) {
    this.AudioPlayer.getNode().src = src;
    this.AudioPlayer.getNode().play();
  }
}

export const ResultPage = (props: Props, callback: Callback) =>
  new CreateResultPage(props, callback);
