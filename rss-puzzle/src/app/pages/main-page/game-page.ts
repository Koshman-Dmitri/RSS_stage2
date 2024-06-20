import { BaseComponent } from '../../components/base-components';
import { BASE_URL, Github } from '../../github-API/github-API';
import { GameInfo, Level, TouchStartPos } from './types';
import {
  Img,
  Label,
  Select,
  Option,
  Span,
} from '../../components/html-elements';
import Button from '../../components/button';
import { MyLocalStorage } from '../../local-storage/local-storage';
import { shuffleWords } from '../../utils/shuffleWords';
import { PuzzleCell } from '../../components/cell';
import { ResultPage } from '../result-page/result-page';
import './style.css';

const MAX_LEVEL = 6;
const PUZZLE_PIECE_DEEP = 10; // Cutout diameter of puzzle card

class Main extends BaseComponent {
  private curGame: GameInfo;

  private data: Level;

  private puzzles: HTMLElement[][];

  private sentencesArr: string[];

  private isSkipped: boolean;

  private readonly LevelSelector: BaseComponent<HTMLSelectElement>;

  private readonly RoundSelector: BaseComponent<HTMLSelectElement>;

  private readonly HintTranslateBtn: Button;

  private readonly HintAudioBtn: Button;

  private readonly HintPicBtn: Button;

  private readonly Audio: BaseComponent<HTMLAudioElement>;

  private readonly AudioPlayBtn: BaseComponent;

  private readonly TranslatedArea: BaseComponent;

  private readonly Rounds: BaseComponent[] = [];

  private readonly PuzzleImg: BaseComponent<HTMLImageElement>;

  private readonly GameBoard: BaseComponent;

  private readonly GameSource: BaseComponent;

  private readonly ButtonSkip: Button;

  private readonly ButtonContinue: Button;

  private readonly ButtonResult: Button;

  private readonly ButtonCheck: Button;

  private readonly ButtonLogout: Button;

  constructor() {
    super({ className: 'main' });
    this.curGame = {
      curLevel: 1,
      curRound: 0,
      isAudioHint: true,
      isTranslateHint: true,
      isPictureHint: true,
      curSentenceNumber: 0,
      complLevels: [],
      complRounds: [],
      known: [],
      unknown: [],
    };
    this.data = {
      rounds: [],
      roundsCount: 0,
    };
    this.puzzles = [];
    this.sentencesArr = [];
    this.isSkipped = false;
    this.LevelSelector = Select({
      className: 'settings__selector',
      name: 'levels',
      id: 'levels',
      onchange: () =>
        this.roundChangeHandler().then(() => this.createNewRound()),
    });
    for (let i = 1; i <= MAX_LEVEL; i += 1) {
      this.LevelSelector.append(Option({ text: String(i), value: String(i) }));
    }
    this.RoundSelector = Select({
      className: 'settings__selector',
      name: 'rounds',
      id: 'rounds',
      onchange: () =>
        this.roundChangeHandler().then(() => this.createNewRound()),
    });
    this.HintTranslateBtn = new Button({
      className: 'button button_hint button_hint-translate',
      onClick: () => this.showHintTranslate(),
    });
    this.HintAudioBtn = new Button({
      className: 'button button_hint button_hint-audio',
      onClick: () => this.showHintAudio(),
    });
    this.HintPicBtn = new Button({
      className: 'button button_hint button_hint-picture',
      onClick: () => this.showHintPic(),
    });
    this.Audio = new BaseComponent<HTMLAudioElement>({ tag: 'audio', src: '' });
    this.Audio.addEventListener('play', () => {
      this.AudioPlayBtn.addClass('active');
    });
    this.Audio.addEventListener('ended', () => {
      this.AudioPlayBtn.removeClass('active');
    });
    this.AudioPlayBtn = new BaseComponent(
      { className: 'audio-hint', onclick: () => this.playAudio() },
      this.Audio
    );
    this.TranslatedArea = new BaseComponent({ className: 'translate-hint' });
    this.PuzzleImg = Img({
      className: 'level-pic',
      src: '',
      alt: '',
    });
    this.GameBoard = new BaseComponent({ className: 'level-board' });
    this.GameSource = new BaseComponent({ className: 'level-source' });
    this.GameSource.setAttribute('data-section', 'source');
    this.GameSource.addEventListener('click', (e) => {
      this.replaceHandler(e);
      setTimeout(() => {
        this.checkHandler();
      }, 200); // transition duration
    });
    this.addDragNDrop(this.GameSource);
    this.ButtonSkip = new Button({
      className: 'button button_footer visible',
      text: 'I dont know',
      onClick: () => {
        this.isSkipped = true;
        this.ButtonSkip.removeClass('visible');
        this.ButtonCheck.removeClass('visible');
        this.GameSource.addClass('disabled');
        document.querySelector('.puzzle')?.classList.add('disabled');
        document.querySelector('.header')?.classList.add('disabled');
        const curRow =
          this.GameBoard.getChildren()[this.curGame.curSentenceNumber];
        const cellsInRes = curRow
          .getNode()
          .querySelectorAll('.row__cell') as NodeListOf<HTMLDivElement>;
        const cellsInSource = this.GameSource.getNode().querySelectorAll(
          '.row__cell'
        ) as NodeListOf<HTMLDivElement>;
        const delayForRes = cellsInRes.length;
        const delayForSrc = cellsInSource.length;
        // It impossible to shuffle per one execution
        this.changeCards(1); // Shuffle in result for the first time
        // Shuffle second time in result with delay, according children amount
        setTimeout(() => this.changeCards(2), 150 * delayForRes);
        // Shuffle in source block with delay, according children amount
        // at previous step. Source always shuffled from the first time
        setTimeout(() => this.changeCards(3), 150 * 2 * delayForRes);
        setTimeout(
          () => {
            this.ButtonContinue.addClass('visible');
            this.showTranslate();
            this.showAudio();
            this.showPic();
            this.GameSource.removeClass('disabled');
            document.querySelector('.puzzle')?.classList.remove('disabled');
            document.querySelector('.header')?.classList.remove('disabled');
            this.GameBoard.getChildren()
              [this.curGame.curSentenceNumber].getNode()
              .classList.add('disabled');
            this.checkHandler();
          },
          150 * (2 * delayForRes + delayForSrc)
        );
      },
    });
    this.ButtonContinue = new Button({
      className: 'button button_footer',
      text: 'Continue',
      onClick: () => this.continueBtnHandler(),
    });
    this.ButtonResult = new Button({
      className: 'button button_footer button_result',
      text: 'Result',
      onClick: () =>
        this.append(
          ResultPage(
            {
              picSrc: `${BASE_URL}images/${this.data.rounds[this.curGame.curRound].levelData.cutSrc}`,
              picName: this.data.rounds[this.curGame.curRound].levelData.name,
              picAuthor: this.data.rounds[this.curGame.curRound].levelData.name,
              picYear: this.data.rounds[this.curGame.curRound].levelData.year,
              known: this.curGame.known,
              unknown: this.curGame.unknown,
            },
            () => this.initGame()
          )
        ),
    });
    this.ButtonCheck = new Button({
      className: 'button button_footer',
      text: 'Check',
      onClick: () => this.checkBtnHandler(),
    });
    this.ButtonLogout = new Button({
      className: 'button button_footer button_logout visible',
      text: 'Logout',
      onClick: () => {
        MyLocalStorage.deleteData();
        const startPage = document.querySelector('.start-page');
        startPage?.classList.remove('invisible');
        startPage?.classList.remove('no-login');
      },
    });
    for (let i = 1; i <= 10; i += 1) {
      this.Rounds.push(
        new BaseComponent(
          { className: 'game__round' },
          Span({ text: String(i) })
        )
      );
    }

    this.appendChildren([
      new BaseComponent(
        { className: 'header' },
        new BaseComponent(
          { className: 'settings' },
          new BaseComponent(
            { className: 'level__wrapper' },
            Label({
              className: 'settings__label',
              htmlFor: 'levels',
              id: 'levels',
              text: 'Level:',
            }),
            this.LevelSelector
          ),
          new BaseComponent(
            { className: 'round__wrapper' },
            Label({
              className: 'settings__label',
              htmlFor: 'pages',
              id: 'pages',
              text: 'Round:',
            }),
            this.RoundSelector
          )
        ),
        new BaseComponent(
          { className: 'hints' },
          this.HintTranslateBtn,
          this.HintAudioBtn,
          this.HintPicBtn
        )
      ),
      this.AudioPlayBtn,
      this.TranslatedArea,
      new BaseComponent(
        { className: 'game' },
        new BaseComponent(
          { className: 'puzzle__wrapper' },
          new BaseComponent({ className: 'rounds' }, ...this.Rounds),
          new BaseComponent(
            { className: 'puzzle' },
            this.PuzzleImg,
            this.GameBoard
          )
        ),
        this.GameSource
      ),
      new BaseComponent(
        { className: 'buttons-area' },
        this.ButtonSkip,
        this.ButtonContinue,
        this.ButtonResult,
        this.ButtonCheck,
        this.ButtonLogout
      ),
    ]);
  }

  private async determineLevelAndRound() {
    const userInfo = MyLocalStorage.getData();
    let { lastLevel, lastRound } = userInfo;
    if (lastLevel === null || lastRound === null) return;
    this.data = await Github.getWordsForLevel(lastLevel);
    if (this.data.roundsCount - 1 === lastRound) {
      lastLevel += 1;
      if (lastLevel > MAX_LEVEL) lastLevel = 1;
      lastRound = 0;
      this.data = await Github.getWordsForLevel(lastLevel);
    } else {
      lastRound += 1;
    }
    this.curGame.curLevel = lastLevel;
    this.curGame.curRound = lastRound;
    this.curGame.isAudioHint = userInfo.isHintAudio;
    this.curGame.isTranslateHint = userInfo.isHintTranslate;
    this.curGame.isPictureHint = userInfo.isHintPicture;
    this.curGame.complLevels = userInfo.complLevels;
    const userComplRounds = userInfo.complRounds[lastLevel - 1];
    if (userComplRounds) this.curGame.complRounds = userComplRounds;
  }

  public initGame() {
    this.determineLevelAndRound().then(() => this.createNewRound());
  }

  private createNewRound() {
    this.hideFooterBtns();
    this.changeRoundStyle();
    this.curGame.curSentenceNumber = 0;
    const levelRound = this.curGame.curRound;
    this.puzzles = [];
    this.sentencesArr = [];
    this.isSkipped = false;
    this.curGame.unknown = [];
    this.curGame.known = [];
    this.GameSource.getNode().innerHTML = '';
    this.GameSource.removeClass('disabled');
    this.GameBoard.deleteChildren();
    this.PuzzleImg.getNode().src = `${BASE_URL}images/${this.data.rounds[levelRound].levelData.imageSrc}`;
    let imgWidth = 0;
    let imgHeight = 0;
    this.PuzzleImg.getNode().onload = () => {
      imgWidth = this.PuzzleImg.getNode().width;
      imgHeight = this.PuzzleImg.getNode().height;
      this.makePuzzlesForRound(imgWidth, imgHeight);
      this.buildActiveSourceBlock();
      this.buildActiveResultBlock();
      if (this.curGame.isPictureHint) {
        this.HintPicBtn.addClass('active');
        this.showPic();
      } else {
        this.HintPicBtn.removeClass('active');
        this.hidePic();
      }
      this.initFooterBtns();
    };
    this.PuzzleImg.getNode().alt = this.data.rounds[levelRound].levelData.name;
    if (this.curGame.isAudioHint) {
      this.HintAudioBtn.addClass('active');
      this.showAudio();
    } else {
      this.HintAudioBtn.removeClass('active');
      this.hideAudio();
    }
    if (this.curGame.isTranslateHint) {
      this.HintTranslateBtn.addClass('active');
      this.showTranslate();
    } else {
      this.HintTranslateBtn.removeClass('active');
      this.hideTranslate();
    }
    this.updateRoundAmount();
  }

  private makePuzzlesForRound(imgWidth: number, imhHeight: number) {
    const cellHeight =
      this.GameBoard.getNode().clientHeight / this.data.rounds[0].words.length;
    const { levelData, words } = this.data.rounds[this.curGame.curRound];
    const imgPath = `${BASE_URL}images/${levelData.imageSrc}`;
    for (let i = 0; i < words.length; i += 1) {
      this.puzzles.push([]);
      this.sentencesArr.push(words[i].textExample);
      const wordArr = words[i].textExample.split(' ');
      const row = new BaseComponent({ className: 'board__row' });
      row.setAttribute('data-section', 'row');
      this.GameBoard.append(row);
      for (let j = 0; j < wordArr.length; j += 1) {
        const cell = new PuzzleCell({
          className: 'row__cell',
          text: wordArr[j],
          height: cellHeight,
        });
        row.append(cell);
      }
      const rowChildren = row.getChildren();
      for (let j = 0; j < rowChildren.length; j += 1) {
        const child = rowChildren[j].getNode();
        if (j === 0) child.classList.add('first');
        else if (j === rowChildren.length - 1) child.classList.add('last');
        else child.classList.add('center');
        const { offsetTop, offsetLeft } = child;
        child.style.backgroundSize = `${imgWidth}px ${imhHeight}px`;
        child.style.backgroundPosition = `${-offsetLeft}px ${-offsetTop}px`;
        child.style.width = getComputedStyle(child).width;
        child.style.flexGrow = '0';
        const pathOffest =
          parseInt(getComputedStyle(child).width, 10) - PUZZLE_PIECE_DEEP;
        child.style.setProperty('--path-offset', `${pathOffest}px`);
        child.style.setProperty('--img-path', `url(${imgPath})`);
        child.classList.add('withoutHint');
        this.puzzles[i].push(child);
      }
      row.deleteChildren();
    }
  }

  private buildActiveSourceBlock() {
    const curPuzzles = this.puzzles[this.curGame.curSentenceNumber];
    this.GameSource.appendChildren(shuffleWords(curPuzzles));
    const row = this.GameBoard.getChildren()[this.curGame.curSentenceNumber];
    this.GameSource.getNode().addEventListener('touchstart', (e) =>
      this.touchStart(row.getNode(), e)
    );
  }

  private buildActiveResultBlock() {
    const row = this.GameBoard.getChildren()[this.curGame.curSentenceNumber];
    this.puzzles[this.curGame.curSentenceNumber].forEach(() => {
      row.append(new PuzzleCell({ className: 'row__cell_empty' }));
    });
    row.addEventListener('click', (e) => this.replaceHandler(e));
    this.addDragNDrop(row);
    row
      .getNode()
      .addEventListener('touchstart', (e) => this.touchStart(row.getNode(), e));
  }

  private updateRoundAmount() {
    this.RoundSelector.deleteChildren();
    const rounds = this.data.roundsCount;
    for (let i = 1; i <= rounds; i += 1) {
      let className = '';
      if (this.curGame.complRounds.includes(i)) className = 'passed';
      this.RoundSelector.append(
        Option({ text: String(i), value: String(i), className })
      );
    }
    const levelSelOpt = this.LevelSelector.getChildren();
    for (let i = 1; i <= MAX_LEVEL; i += 1) {
      if (this.curGame.complLevels.includes(i)) {
        levelSelOpt[i - 1].addClass('passed');
      } else {
        levelSelOpt[i - 1].removeClass('passed');
      }
    }
    this.LevelSelector.getNode().value = String(this.curGame.curLevel);
    this.RoundSelector.getNode().value = String(this.curGame.curRound + 1);
  }

  private replaceHandler(e?: Event) {
    if (!e?.target) return;
    const target = e.target as HTMLElement;
    if (!target.classList.contains('row__cell')) return;
    const source = target.closest('[data-section]');
    if (!source) return;
    if (
      source.classList.contains('board__row') &&
      source !==
        this.GameBoard.getChildren()[this.curGame.curSentenceNumber].getNode()
    )
      return;
    this.ButtonCheck.removeClass('visible');
    this.ButtonContinue.removeClass('visible');
    this.ButtonSkip.addClass('visible');
    const destination = source.classList.contains('board__row')
      ? this.GameSource
      : this.GameBoard.getChildren()[this.curGame.curSentenceNumber];
    const emptyChild = destination
      .getNode()
      .querySelector('.row__cell_empty') as HTMLDivElement;
    const sourceTopOffset = target.getBoundingClientRect().top;
    const sourceLeftOffset = target.getBoundingClientRect().left;
    const destTopOffset = emptyChild.getBoundingClientRect().top;
    const destLeftOffset = emptyChild.getBoundingClientRect().left;
    const diffTop = destTopOffset - sourceTopOffset;
    const diffLeft = destLeftOffset - sourceLeftOffset;
    const cellHeight =
      this.GameBoard.getNode().clientHeight / this.data.rounds[0].words.length;

    target.style.transform = `translate(${diffLeft}px, ${diffTop}px)`;
    function transitionHelper() {
      target.style.transform = 'unset';
      target.after(
        new PuzzleCell({
          className: 'row__cell_empty',
          height: cellHeight,
        }).getNode()
      );
      emptyChild.replaceWith(target);
      target.removeEventListener('transitionend', transitionHelper);
    }
    target.addEventListener('transitionend', transitionHelper);
  }

  private changeCards(cnt: number) {
    const rightSentence =
      this.sentencesArr[this.curGame.curSentenceNumber].split(' ');
    const curRow = this.GameBoard.getChildren()[this.curGame.curSentenceNumber];

    function changeHandler(cell: HTMLElement, index: number) {
      setTimeout(() => {
        const source = cell;
        const text = cell.textContent as string;
        let childNum;
        if (cnt === 1 || cnt === 3) {
          childNum = rightSentence.lastIndexOf(text);
        } else {
          childNum = rightSentence.indexOf(text);
        }
        rightSentence[childNum] = '';
        const dest = curRow.getNode().childNodes[childNum] as Element;
        if (source === dest) return;
        const sourceTopOffset = source.getBoundingClientRect().top;
        const sourceLeftOffset = source.getBoundingClientRect().left;
        const destTopOffset = dest.getBoundingClientRect().top;
        const destLeftOffset = dest.getBoundingClientRect().left;
        const diffTop = destTopOffset - sourceTopOffset;
        const diffLeft = destLeftOffset - sourceLeftOffset;
        source.style.transform = `translate(${diffLeft}px, ${diffTop}px)`;
        function transitionHelper() {
          source.style.transform = 'unset';
          const destClone = dest.cloneNode(true);
          source.after(destClone);
          dest.replaceWith(source);
          source.removeEventListener('transitionend', transitionHelper);
        }
        source.addEventListener('transitionend', transitionHelper);
      }, 150 * index); // transition duration
    }
    if (cnt === 3) {
      const cellsInSource = this.GameSource.getNode().querySelectorAll(
        '.row__cell'
      ) as NodeListOf<HTMLDivElement>;
      cellsInSource.forEach((cell, index) => changeHandler(cell, index));
    } else {
      const cellsInRes = curRow
        .getNode()
        .querySelectorAll('.row__cell') as NodeListOf<HTMLDivElement>;
      cellsInRes.forEach((cell, index) => changeHandler(cell, index));
    }
  }

  private checkHandler() {
    let counter = 0;
    const rowChildren =
      this.GameBoard.getChildren()[this.curGame.curSentenceNumber].getNode()
        .children;
    for (let i = 0; i < rowChildren.length; i += 1) {
      if (rowChildren[i].classList.contains('row__cell')) counter += 1;
    }
    if (counter === this.puzzles[this.curGame.curSentenceNumber].length) {
      if (this.isResultRight(rowChildren)) {
        // If correct
        this.GameBoard.getChildren()
          [this.curGame.curSentenceNumber].getNode()
          .classList.add('disabled');
        this.GameSource.addClass('disabled');
        this.ButtonCheck.removeClass('visible');
        this.ButtonContinue.addClass('visible');
        this.ButtonSkip.removeClass('visible');
        this.showTranslate();
        this.showAudio();
        this.showPic();
        this.saveResult();
        if (this.curGame.curSentenceNumber === 9) {
          this.showPuzzleImg();
          this.ButtonResult.addClass('visible');
        }
      } else {
        this.ButtonCheck.addClass('visible');
        this.ButtonContinue.removeClass('visible');
        this.ButtonSkip.addClass('visible');
      }
    }
  }

  private isResultRight(row: HTMLCollection): boolean {
    const arr = [];
    for (let i = 0; i < row.length; i += 1) {
      arr.push(row[i].textContent);
    }
    const rightSentence = this.sentencesArr[this.curGame.curSentenceNumber];
    const resultSentence = arr.join(' ');
    return resultSentence === rightSentence;
  }

  private checkBtnHandler() {
    const rowChildren =
      this.GameBoard.getChildren()[this.curGame.curSentenceNumber].getNode()
        .children;
    const rightSentence =
      this.sentencesArr[this.curGame.curSentenceNumber].split(' ');
    for (let i = 0; i < rowChildren.length; i += 1) {
      if (rowChildren[i].textContent === rightSentence[i]) {
        rowChildren[i].classList.add('right');
      } else {
        rowChildren[i].classList.add('wrong');
      }
    }
    setTimeout(() => {
      const cells = document.querySelectorAll('.row__cell');
      cells.forEach((cell) => {
        cell.classList.remove('right');
        cell.classList.remove('wrong');
      });
    }, 2000);
  }

  private continueBtnHandler() {
    if (this.curGame.curSentenceNumber === this.sentencesArr.length - 1) {
      this.initGame();
    } else {
      const row = this.GameBoard.getChildren()[this.curGame.curSentenceNumber];
      row.addClass('disabled');
      this.curGame.curSentenceNumber += 1;
      this.GameSource.getNode().innerHTML = '';
      this.GameSource.removeClass('disabled');
      this.buildActiveSourceBlock();
      this.buildActiveResultBlock();
      this.ButtonContinue.removeClass('visible');
      this.ButtonSkip.addClass('visible');
      if (this.HintTranslateBtn.containsClass('active')) {
        this.showTranslate();
      } else {
        this.hideTranslate();
      }
      if (this.HintAudioBtn.containsClass('active')) {
        this.showAudio();
      } else {
        this.hideAudio();
      }
      if (this.HintPicBtn.containsClass('active')) {
        this.showPic();
      } else {
        this.hidePic();
      }
    }
  }

  private addDragNDrop(element: BaseComponent) {
    element.addEventListener('dragstart', this.dragStart);
    element.addEventListener('dragend', (e) => this.dragEnd(e));
    element.addEventListener('dragenter', this.dragEnter);
    element.addEventListener('dragleave', this.dragLeave);
    element.addEventListener('dragover', this.dragOver);
    element.addEventListener('drop', (e) => {
      this.dragDrop(e);
      this.ButtonCheck.removeClass('visible');
      this.checkHandler();
    });
  }

  private dragStart(e?: Event) {
    const target = e?.target;
    if (!(target instanceof HTMLDivElement)) return;
    target.classList.add('selected');
  }

  private dragEnd(e?: Event) {
    const target = e?.target;
    if (!(target instanceof HTMLDivElement)) return;
    target.classList.remove('selected');
  }

  private dragEnter(e?: Event) {
    const target = e?.target as HTMLDivElement;
    target.classList.add('hovered');
  }

  private dragLeave(e?: Event) {
    const target = e?.target as HTMLDivElement;
    target.classList.remove('hovered');
  }

  private dragOver(e?: Event) {
    e?.preventDefault();
  }

  private dragDrop(e?: Event) {
    const source = document.querySelector('.selected');
    if (!source) return;
    const dest = e?.target as HTMLDivElement;
    dest.classList.remove('hovered');
    if (source === dest) return;
    if (dest.hasAttribute('data-section')) return;
    const destClone = dest.cloneNode(true);
    source.after(destClone);
    dest.replaceWith(source);
  }

  private touchStart(row: HTMLElement, e?: TouchEvent) {
    if (!e) return;
    const touch = e.touches[0];
    const startPos: TouchStartPos = {
      x: touch.clientX,
      y: touch.clientY,
    };
    const sourceBlock = document.querySelector(
      '.level-source'
    ) as HTMLDivElement;
    const touchMove = (ev?: TouchEvent) => {
      if (!ev) return;
      const ele = ev.target as HTMLElement;
      if (!ele.hasAttribute('draggable')) return;
      ele.classList.add('touched');
      const curTouch = ev.touches[0];
      const dx = curTouch.clientX - startPos.x;
      const dy = curTouch.clientY - startPos.y;
      ele.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    const touchEnd = (eve?: TouchEvent) => {
      if (!eve) return;
      const target = eve.target as HTMLElement;
      const endX = eve.changedTouches[0].clientX;
      const endY = eve.changedTouches[0].clientY;
      setTimeout(() => {
        if (!target) return;
        const source = document.querySelector('.touched') as HTMLElement;
        const dest = document.elementFromPoint(endX, endY);
        target.classList.remove('touched');
        if (source === null || dest === null) return;
        if (dest.hasAttribute('data-section')) return;
        if (!dest.closest('[data-section]')) return;
        if (source === dest) return;
        const destClone = dest.cloneNode(true);
        source.after(destClone);
        dest.replaceWith(source);
        this.ButtonCheck.removeClass('visible');
        this.checkHandler();
      });
      target.style.transform = '';
      sourceBlock.removeEventListener('touchmove', touchMove);
      sourceBlock.removeEventListener('touchend', touchEnd);
      row.removeEventListener('touchmove', touchMove);
      row.removeEventListener('touchend', touchEnd);
    };
    sourceBlock.addEventListener('touchmove', touchMove);
    sourceBlock.addEventListener('touchend', touchEnd);
    row.addEventListener('touchmove', touchMove);
    row.addEventListener('touchend', touchEnd);
  }

  private showHintTranslate() {
    this.HintTranslateBtn.toggleClass('active');
    if (this.HintTranslateBtn.containsClass('active')) {
      this.curGame.isTranslateHint = true;
      MyLocalStorage.setData('isHintTranslate', true);
      this.showTranslate();
    } else {
      this.curGame.isTranslateHint = false;
      MyLocalStorage.setData('isHintTranslate', false);
      this.hideTranslate();
    }
  }

  private showTranslate() {
    const { curRound, curSentenceNumber } = this.curGame;
    const { textExampleTranslate } =
      this.data.rounds[curRound].words[curSentenceNumber];
    this.TranslatedArea.text(textExampleTranslate);
    this.TranslatedArea.addClass('active');
  }

  private hideTranslate() {
    this.TranslatedArea.text('');
    setTimeout(() => this.TranslatedArea.removeClass('active'));
  }

  private showHintAudio() {
    this.HintAudioBtn.toggleClass('active');
    if (this.HintAudioBtn.containsClass('active')) {
      this.curGame.isAudioHint = true;
      MyLocalStorage.setData('isHintAudio', true);
      this.showAudio();
    } else {
      this.curGame.isAudioHint = false;
      MyLocalStorage.setData('isHintAudio', false);
      this.hideAudio();
    }
  }

  private showAudio() {
    this.AudioPlayBtn.addClass('visible');
  }

  private hideAudio() {
    this.AudioPlayBtn.removeClass('visible');
  }

  private playAudio() {
    const { curRound, curSentenceNumber } = this.curGame;
    const { audioExample } =
      this.data.rounds[curRound].words[curSentenceNumber];
    const audioUrl = BASE_URL + audioExample;
    this.Audio.getNode().src = audioUrl;
    this.Audio.getNode().play();
  }

  private showHintPic() {
    this.HintPicBtn.toggleClass('active');
    if (this.HintPicBtn.containsClass('active')) {
      this.curGame.isPictureHint = true;
      MyLocalStorage.setData('isHintPicture', true);
      this.showPic();
    } else {
      this.curGame.isPictureHint = false;
      MyLocalStorage.setData('isHintPicture', false);
      this.hidePic();
    }
  }

  private showPic() {
    this.puzzles.forEach((row) => {
      for (let i = 0; i < row.length; i += 1) {
        row[i].classList.remove('withoutHint');
      }
    });
    const puzzles = document.querySelectorAll('.row__cell');
    puzzles.forEach((el) => el.classList.remove('withoutHint'));
  }

  private hidePic() {
    this.puzzles.forEach((row) => {
      for (let i = 0; i < row.length; i += 1) {
        row[i].classList.add('withoutHint');
      }
    });
    const puzzles = document.querySelectorAll('.row__cell');
    puzzles.forEach((el) => el.classList.add('withoutHint'));
  }

  private hideFooterBtns() {
    this.ButtonResult.removeClass('visible');
    this.ButtonContinue.removeClass('visible');
    this.ButtonCheck.removeClass('visible');
    this.ButtonSkip.removeClass('visible');
    this.ButtonLogout.removeClass('visible');
  }

  private initFooterBtns() {
    this.ButtonResult.removeClass('visible');
    this.ButtonContinue.removeClass('visible');
    this.ButtonCheck.removeClass('visible');
    this.ButtonSkip.addClass('visible');
    this.ButtonLogout.addClass('visible');
  }

  private async roundChangeHandler() {
    const newLevel = +this.LevelSelector.getNode().value;
    this.curGame.curLevel = newLevel;
    const newRound = +this.RoundSelector.getNode().value - 1;
    this.data = await Github.getWordsForLevel(newLevel);
    if (this.data.roundsCount <= newRound) {
      this.curGame.curRound = this.data.roundsCount - 1;
    } else {
      this.curGame.curRound = newRound;
    }
    const { complRounds } = MyLocalStorage.getData();
    this.curGame.complRounds = complRounds[newLevel - 1];
  }

  private changeRoundStyle() {
    this.GameBoard.removeClass('hidden');
    this.PuzzleImg.removeClass('visible');
    const body = document.querySelector('body') as HTMLBodyElement;
    switch (this.curGame.curLevel) {
      case 1:
        return body.style.setProperty('--body-color', 'seashell');
      case 2:
        return body.style.setProperty('--body-color', 'aquamarine');
      case 3:
        return body.style.setProperty('--body-color', 'green');
      case 4:
        return body.style.setProperty('--body-color', 'yellow');
      case 5:
        return body.style.setProperty('--body-color', 'coral');
      case 6:
        return body.style.setProperty('--body-color', 'red');
      default:
        return body.style.setProperty('--body-color', '');
    }
  }

  private endRoundHandler() {
    if (!this.curGame.complRounds.includes(this.curGame.curRound + 1)) {
      this.curGame.complRounds.push(this.curGame.curRound + 1);
    }
    this.updateUserRounds();
    this.RoundSelector.getChildren()[this.curGame.curRound].addClass('passed');
    if (this.curGame.complRounds.length === this.data.roundsCount) {
      this.updateUserLevels();
      this.LevelSelector.getChildren()[this.curGame.curLevel - 1].addClass(
        'passed'
      );
      if (this.curGame.complLevels.includes(this.curGame.curLevel)) return;
      this.curGame.complLevels.push(this.curGame.curLevel);
    }
    this.showPicInfo();
  }

  private updateUserRounds() {
    const user = MyLocalStorage.getData();
    const { curLevel, curRound } = this.curGame;
    if (!user.complRounds[curLevel - 1].includes(curRound + 1)) {
      user.complRounds[curLevel - 1].push(curRound + 1);
    }
    user.lastRound = curRound;
    user.lastLevel = curLevel;
    localStorage.setItem('user', JSON.stringify(user));
  }

  private updateUserLevels() {
    const user = MyLocalStorage.getData();
    if (!user.complLevels.includes(this.curGame.curLevel)) {
      user.complLevels.push(this.curGame.curLevel);
    }
    localStorage.setItem('user', JSON.stringify(user));
  }

  private showPuzzleImg() {
    this.endRoundHandler();
    this.GameBoard.addClass('hidden');
    this.PuzzleImg.addClass('visible');
  }

  private showPicInfo() {
    this.GameSource.getNode().innerHTML = '';
    const { author, name, year } =
      this.data.rounds[this.curGame.curRound].levelData;
    this.GameSource.append(
      new BaseComponent({
        className: 'picture',
        text: `${name} (${year}) by ${author}`,
      })
    );
  }

  private saveResult() {
    const { curRound, curSentenceNumber } = this.curGame;
    const sentence = this.sentencesArr[curSentenceNumber];
    const { audioExample } =
      this.data.rounds[curRound].words[curSentenceNumber];
    const audioUrl = BASE_URL + audioExample;
    if (this.isSkipped) {
      this.curGame.unknown.push([sentence, audioUrl]);
      this.isSkipped = false;
    } else {
      this.curGame.known.push([sentence, audioUrl]);
    }
  }
}

export const MainPage = () => new Main();
