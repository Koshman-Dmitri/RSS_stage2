import { RaceAPI } from '../../API/RaceAPI';
import { CarType } from '../../API/types';
import { BaseComponent } from '../../components/base-components';
import { STORE } from '../../store/store';
import { randomModel } from '../../utils/randomCarName';
import { randomColor } from '../../utils/randomColor';
import './style-settings.css';

type Callback = () => void;

class Settings extends BaseComponent {
  private readonly CreateText: BaseComponent<HTMLInputElement>;

  private readonly CreateColor: BaseComponent<HTMLInputElement>;

  private readonly BtnCreate: BaseComponent<HTMLButtonElement>;

  private readonly UpdateText: BaseComponent<HTMLInputElement>;

  private readonly UpdateColor: BaseComponent<HTMLInputElement>;

  private readonly BtnUpdate: BaseComponent<HTMLButtonElement>;

  private readonly BtnRace: BaseComponent<HTMLButtonElement>;

  private readonly BtnReset: BaseComponent<HTMLButtonElement>;

  private readonly BtnCreateHundred: BaseComponent<HTMLButtonElement>;

  constructor(rerenderCallback: Callback, showWarnMessage: Callback, resetCallback: Callback, raceCallback: Callback) {
    super({ className: 'settings' });
    this.CreateText = new BaseComponent<HTMLInputElement>({ tag: 'input', className: 'input-text', type: 'text' });
    this.CreateColor = new BaseComponent<HTMLInputElement>({ tag: 'input', className: 'input-color', type: 'color' });
    this.BtnCreate = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'button',
      text: 'Create',
      onclick: () => {
        if (STORE.curRacing.length > 0) {
          showWarnMessage();
          return;
        }
        this.createHandler(rerenderCallback);
      },
    });
    this.UpdateText = new BaseComponent<HTMLInputElement>({
      tag: 'input',
      className: 'input-text',
      type: 'text',
      disabled: true,
    });
    this.UpdateColor = new BaseComponent<HTMLInputElement>({
      tag: 'input',
      className: 'input-color',
      type: 'color',
      disabled: true,
    });
    this.BtnUpdate = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'button',
      text: 'Update',
      disabled: true,
      onclick: () => {
        if (STORE.curRacing.length > 0) {
          showWarnMessage();
          return;
        }
        this.updateHandler(rerenderCallback);
      },
    });
    this.BtnRace = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'button',
      text: 'Race',
      onclick: () => {
        if (STORE.curRacing.length > 0) {
          showWarnMessage();
          return;
        }
        raceCallback();
      },
    });
    this.BtnReset = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'button',
      text: 'Reset',
      onclick: () => resetCallback(),
    });
    this.BtnCreateHundred = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'button',
      text: 'Generate cars',
      onclick: () => {
        if (STORE.curRacing.length > 0) {
          showWarnMessage();
          return;
        }
        this.createHundredHandler(rerenderCallback);
      },
    });

    this.appendChildren([
      new BaseComponent({ className: 'create-area' }, this.CreateText, this.CreateColor, this.BtnCreate),
      new BaseComponent({ className: 'update-area' }, this.UpdateText, this.UpdateColor, this.BtnUpdate),
      new BaseComponent({ className: 'control-area' }, this.BtnRace, this.BtnReset, this.BtnCreateHundred),
    ]);
  }

  private createHandler(callback: Callback) {
    const newName = this.CreateText.getNode().value;
    const newColor = this.CreateColor.getNode().value;
    this.CreateText.getNode().value = '';
    this.CreateColor.getNode().value = '#000000';
    RaceAPI.createOneCar(newName, newColor).then(callback);
  }

  private createHundredHandler(callback: Callback) {
    let count = 100;
    while (count > 0) {
      RaceAPI.createOneCar(randomModel(), randomColor());
      count -= 1;
    }
    callback();
  }

  public setUpdateInputs({ id, name, color }: CarType) {
    if (id === 0) return this.clearUpdateInputs();
    this.UpdateText.getNode().value = name;
    this.UpdateColor.getNode().value = color;
    this.UpdateText.removeAttribute('disabled');
    this.UpdateColor.removeAttribute('disabled');
    this.BtnUpdate.removeAttribute('disabled');
    STORE.selectedCarId = id;
    STORE.selectedCarName = name;
    STORE.selectedCarColor = color;
    return null;
  }

  public clearUpdateInputs() {
    this.UpdateText.getNode().value = '';
    this.UpdateColor.getNode().value = '#000000';
    this.UpdateText.setAttribute('disabled', 'true');
    this.UpdateColor.setAttribute('disabled', 'true');
    this.BtnUpdate.setAttribute('disabled', 'true');
    STORE.selectedCarId = undefined;
    STORE.selectedCarName = undefined;
    STORE.selectedCarColor = undefined;
  }

  private updateHandler(rerenderCallback: Callback) {
    if (!STORE.selectedCarId) return;
    RaceAPI.updateCar(STORE.selectedCarId, this.UpdateText.getNode().value, this.UpdateColor.getNode().value).then(
      rerenderCallback
    );
    this.clearUpdateInputs();
  }
}

export const CreateSettings = (
  rerenderCallback: Callback,
  showWarnMessage: Callback,
  resetCallback: Callback,
  raceCallback: Callback
) => new Settings(rerenderCallback, showWarnMessage, resetCallback, raceCallback);
