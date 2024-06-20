import { RaceAPI } from '../../API/RaceAPI';
import { CarType } from '../../API/types';
import { BaseComponent } from '../../components/base-components';
import { STORE } from '../../store/store';
import './car-style.css';

export const paintCar = (color: string) => `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="100" height="100" viewBox="0 0 256 256" xml:space="preserve">
  <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4 -50) scale(2.81 2.81)">
    <path d="M 72.57 59.974 c -4.895 0 -8.877 -3.982 -8.877 -8.877 s 3.982 -8.877 8.877 -8.877 s 8.877 3.982 8.877 8.877 S 77.465 59.974 72.57 59.974 z M 72.57 45.22 c -3.24 0 -5.877 2.637 -5.877 5.877 s 2.637 5.877 5.877 5.877 s 5.877 -2.637 5.877 -5.877 S 75.811 45.22 72.57 45.22 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" fill="${color}" />
    <path d="M 14.943 59.974 c -4.895 0 -8.876 -3.982 -8.876 -8.877 s 3.982 -8.877 8.876 -8.877 s 8.877 3.982 8.877 8.877 S 19.838 59.974 14.943 59.974 z M 14.943 45.22 c -3.24 0 -5.876 2.637 -5.876 5.877 s 2.636 5.877 5.876 5.877 c 3.241 0 5.877 -2.637 5.877 -5.877 S 18.184 45.22 14.943 45.22 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" fill="${color}" />
    <path d="M 72.569 54.1 c -0.199 0 -0.39 -0.02 -0.59 -0.06 c -0.189 -0.04 -0.38 -0.101 -0.56 -0.17 c -0.18 -0.08 -0.351 -0.17 -0.521 -0.28 c -0.159 -0.11 -0.31 -0.23 -0.449 -0.37 c -0.561 -0.56 -0.881 -1.33 -0.881 -2.12 s 0.32 -1.569 0.881 -2.12 c 0.689 -0.699 1.729 -1.02 2.699 -0.819 c 0.2 0.029 0.391 0.09 0.57 0.17 c 0.18 0.069 0.35 0.16 0.51 0.27 c 0.17 0.11 0.32 0.24 0.46 0.38 c 0.561 0.561 0.88 1.33 0.88 2.12 s -0.319 1.561 -0.88 2.12 c -0.14 0.14 -0.29 0.26 -0.46 0.37 c -0.16 0.11 -0.33 0.2 -0.51 0.28 c -0.18 0.069 -0.37 0.13 -0.57 0.17 C 72.96 54.08 72.77 54.1 72.569 54.1 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" fill="${color}" />
    <path d="M 14.94 54.1 c -0.79 0 -1.56 -0.319 -2.12 -0.88 c -0.56 -0.56 -0.88 -1.33 -0.88 -2.12 s 0.32 -1.569 0.88 -2.12 c 0.7 -0.699 1.73 -1.02 2.71 -0.819 c 0.19 0.029 0.38 0.09 0.56 0.17 c 0.18 0.069 0.36 0.16 0.52 0.27 c 0.16 0.11 0.32 0.24 0.45 0.38 c 0.14 0.13 0.27 0.29 0.38 0.45 c 0.11 0.16 0.2 0.34 0.27 0.521 c 0.08 0.18 0.14 0.369 0.17 0.56 c 0.04 0.19 0.06 0.39 0.06 0.59 c 0 0.79 -0.32 1.561 -0.88 2.12 c -0.13 0.14 -0.29 0.26 -0.45 0.37 s -0.34 0.2 -0.52 0.28 c -0.18 0.069 -0.37 0.13 -0.56 0.17 S 15.14 54.1 14.94 54.1 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" fill="${color}" />
    <path d="M 81.855 39.499 l -12.382 -4.861 c -9.95 -3.529 -20.415 -5.043 -30.874 -4.505 c 0 0 -0.001 0 -0.001 0 c -4.74 0.244 -9.478 0.909 -14.167 2 l -5.124 1.524 c -0.003 0.001 -0.005 0.001 -0.008 0.002 l -6.091 1.812 c -1.269 0.295 -2.57 0.375 -3.869 0.237 l -7.682 -0.815 c -0.451 -0.048 -0.905 0.113 -1.225 0.437 c -0.32 0.325 -0.476 0.777 -0.423 1.23 l 1.553 13.185 c 0.247 2.093 1.438 3.867 3.116 4.92 c -0.39 -1.119 -0.613 -2.316 -0.613 -3.567 c 0 -5.998 4.879 -10.877 10.876 -10.877 c 5.998 0 10.877 4.879 10.877 10.877 c 0 1.645 -0.377 3.199 -1.034 4.598 h 37.94 c -0.656 -1.399 -1.033 -2.953 -1.033 -4.598 c 0 -5.998 4.879 -10.877 10.877 -10.877 s 10.877 4.879 10.877 10.877 c 0 1.645 -0.377 3.199 -1.033 4.598 h 3.339 c 2.342 0 4.247 -1.905 4.247 -4.247 C 90 46.132 86.804 41.442 81.855 39.499 z M 29.814 38.501 c -1.991 0 -3.959 -0.666 -5.541 -1.875 l -1.242 -0.95 l 2.168 -0.645 c 4.115 -0.957 8.276 -1.559 12.446 -1.833 l 2.267 5.303 H 29.814 z M 65.897 38.34 c -0.563 0.107 -1.137 0.161 -1.706 0.161 H 43.174 l -2.329 -5.45 c 9.348 -0.226 18.687 1.243 27.58 4.396 l 0.704 0.277 L 65.897 38.34 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" fill="${color}" />
  </g>
  </svg>
`;

type Callback = () => void;

type UpdateType = (props: CarType) => void;

export class Car extends BaseComponent {
  private readonly Road: BaseComponent;

  private readonly CarImg: BaseComponent;

  private readonly BtnStart: BaseComponent<HTMLButtonElement>;

  private readonly BtnStop: BaseComponent<HTMLButtonElement>;

  private readonly BtnSelect: BaseComponent<HTMLButtonElement>;

  private readonly BtnRemove: BaseComponent<HTMLButtonElement>;

  private controller: AbortController;

  constructor({ id, name, color }: CarType, rerender: Callback, setUpdateData: UpdateType, showWarnMessage: Callback) {
    super(
      { id: String(id), className: 'car-container' },
      new BaseComponent({ tag: 'span', className: 'car-name', text: name })
    );

    this.controller = new AbortController();
    this.CarImg = new BaseComponent({ className: 'car' });
    this.CarImg.getNode().innerHTML = paintCar(color);
    this.Road = new BaseComponent({ className: 'road' }, this.CarImg, new BaseComponent({ className: 'flag' }));

    this.BtnStart = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'button car-button button_start',
      text: 'Start',
      onclick: (e) => {
        const carId = this.getId(e);
        this.startHandler(carId);
      },
    });
    this.BtnStop = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'button car-button button_stop',
      text: 'Stop/Back',
      disabled: true,
      onclick: (e) => {
        const carId = this.getId(e);
        this.stopHandler(carId);
      },
    });
    this.BtnSelect = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'button car-button button_select',
      text: 'Select',
      onclick: (e) => {
        if (STORE.curRacing.length > 0) {
          showWarnMessage();
          return;
        }
        this.selectHandler(e, setUpdateData);
      },
    });
    this.BtnRemove = new BaseComponent<HTMLButtonElement>({
      tag: 'button',
      className: 'button car-button button_remove',
      text: 'Remove',
      onclick: (e) => {
        if (STORE.curRacing.length > 0) {
          showWarnMessage();
          return;
        }
        this.removeHandler(e, rerender, setUpdateData);
      },
    });

    this.appendChildren([this.Road, this.BtnStart, this.BtnStop, this.BtnSelect, this.BtnRemove]);
  }

  private getId(e: Event): number {
    const target = e.target as HTMLButtonElement;
    return Number(target.closest('div')?.getAttribute('id'));
  }

  private async removeHandler(e: Event, rerender: Callback, setUpdateData: UpdateType) {
    const id = this.getId(e);
    await RaceAPI.deleteWinner(id);
    RaceAPI.deleteCar(id)
      .then(rerender)
      .then(() => {
        if (STORE.cars.length === 0 && STORE.page > 1) {
          STORE.page -= 1;
          rerender();
        }
      })
      .then(() => {
        if (id === STORE.selectedCarId) setUpdateData({ id: 0, name: '', color: '' });
      });
  }

  private selectHandler(e: Event, setUpdateData: UpdateType) {
    const id = this.getId(e);
    const { name, color } = STORE.cars.find((car) => car.id === id) as CarType;
    setUpdateData({ id, name, color });
  }

  public async startHandler(id: number) {
    this.controller = new AbortController();
    this.BtnStart.setAttribute('disabled', 'true');
    this.BtnStop.removeAttribute('disabled');
    STORE.curRacing.push(id);
    const car = this.CarImg.getNode();
    const roadLength = this.Road.getNode().clientWidth - car.offsetWidth;
    const { velocity, distance } = await RaceAPI.startCar(id);
    const time = +(distance / velocity / 1000).toFixed(2);
    this.animateCar(velocity, distance, id, roadLength);

    return new Promise((resolve) => {
      RaceAPI.driveCar(id, this.controller.signal)
        .then((response) => {
          if (response.status !== 200) throw Error(`Car id#${id} engine fail`);
          resolve({ id, time });
        })
        .catch(() => window.cancelAnimationFrame(STORE.animations[id]));
    });
  }

  private animateCar(velocity: number, distance: number, id: number, roadLength: number) {
    const time = distance / velocity;
    let start: number;
    let previousTimeStamp: number;
    let done = false;
    const car = this.CarImg.getNode();
    const frameVelocity = roadLength / time;

    function step(timeStamp: number) {
      if (start === undefined) start = timeStamp;
      const elapsed = timeStamp - start;

      if (previousTimeStamp !== timeStamp) {
        const count = Math.min(frameVelocity * elapsed, roadLength);
        car.style.transform = `translateX(${count}px)`;
        if (count === roadLength) done = true;
      }
      if (!done) {
        const animId = window.requestAnimationFrame(step);
        STORE.animations[id] = animId;
      }
    }
    const animId = window.requestAnimationFrame(step);
    STORE.animations[id] = animId;
  }

  public async stopHandler(id: number) {
    await RaceAPI.stopCar(id);
    window.cancelAnimationFrame(STORE.animations[id]);
    this.CarImg.getNode().style.transform = 'translateX(0)';
    this.controller.abort();
    this.BtnStart.removeAttribute('disabled');
    this.BtnStop.setAttribute('disabled', 'true');
    STORE.curRacing = STORE.curRacing.filter((car) => car !== id);
  }
}

export const CreateCar = (
  { id, name, color }: CarType,
  rerender: Callback,
  setUpdateData: UpdateType,
  showWarnMessage: Callback
) => new Car({ id, name, color }, rerender, setUpdateData, showWarnMessage);
