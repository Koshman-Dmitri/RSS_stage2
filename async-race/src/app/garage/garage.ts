import { RaceAPI } from '../API/RaceAPI';
import { CarType, WinnerType } from '../API/types';
import { BaseComponent } from '../components/base-components';
import { CreatePaggination } from '../navigation/paggination';
import { STORE, updateStoreCars } from '../store/store';
import { CreateSettings } from './car-settings/car-settings';
import { Car, CreateCar } from './car/car';
import './garage-style.css';

class GarageWrapper extends BaseComponent {
  private readonly CarsCounter: BaseComponent;

  private readonly PageCounter: BaseComponent;

  private readonly Garage: BaseComponent;

  private rerenderWinnersTable: () => void;

  private readonly Settings;

  private readonly Pagination;

  constructor(rerenderWinners: () => void) {
    super({ className: 'garage__wrapper' });
    this.rerenderWinnersTable = rerenderWinners;
    this.Settings = CreateSettings(
      () => this.render(),
      () => this.showReturnMessage(),
      () => this.resetCallback(),
      () => this.raceCallback()
    );
    this.Garage = new BaseComponent({ className: 'garage' });
    this.CarsCounter = new BaseComponent({ tag: 'h2', className: 'garage-count' });
    this.PageCounter = new BaseComponent({ tag: 'h3', className: 'garage-page' });
    this.Pagination = CreatePaggination(
      () => this.render(),
      () => this.showReturnMessage()
    );
    this.appendChildren([this.Settings, this.CarsCounter, this.PageCounter, this.Garage, this.Pagination]);
    this.render();
  }

  private async render() {
    await updateStoreCars();
    this.renderGarageCounter();
    this.renderCars();
    this.Pagination.updatePagination();
  }

  private renderCars() {
    this.Garage.deleteChildren();
    STORE.cars.forEach((car: CarType) =>
      this.Garage.append(
        CreateCar(
          { id: car.id, name: car.name, color: car.color },
          () => this.render(),
          (props: CarType) => this.Settings.setUpdateInputs(props),
          () => this.showReturnMessage()
        )
      )
    );
  }

  private renderGarageCounter() {
    this.CarsCounter.text(`Garage (${STORE.totalCars})`);
    this.PageCounter.text(`Page # ${STORE.page} / ${STORE.totalPages}`);
  }

  private showReturnMessage() {
    if (this.getChildren().length > 5) return;
    const message = new BaseComponent({ tag: 'p', className: 'message', text: 'Return all cars to garage' });
    this.append(message);
    setTimeout(() => {
      message.deleteNode();
      this.getChildren().pop();
    }, 2000);
  }

  private resetCallback() {
    const cars = this.Garage.getChildren() as Car[];
    cars.forEach((car) => {
      const id = +car.getNode().id;
      car.stopHandler(id);
    });
  }

  private async raceCallback() {
    const cars = this.Garage.getChildren() as Car[];
    const promises = cars.map((car) => {
      const id = Number(car.getNode().id);
      return car.startHandler(id);
    });
    const { id, time } = (await Promise.any(promises)) as { id: number; time: number };
    const { name } = STORE.cars.find((car) => car.id === id) as CarType;
    const winMessage = document.createElement('p');
    winMessage.className = 'race-result';
    winMessage.textContent = `${name} wins in ${time} sec`;
    this.append(winMessage);
    setTimeout(() => winMessage.remove(), 5000);
    const response = await RaceAPI.getWinner(id);
    if (response.status === 200) await this.updateWinner(id, time, response);
    if (response.status === 404) await this.createWinner({ id, time });
    this.rerenderWinnersTable();
  }

  private async createWinner({ id, time }: WinnerType) {
    await RaceAPI.createWinner({ id, time });
  }

  private async updateWinner(winnerId: number, winnerTime: number, response: Response) {
    let { id, time, wins } = await response.json();
    if (time > winnerTime) time = winnerTime;
    wins += 1;
    id = winnerId;
    await RaceAPI.updateWinner({ id, time, wins });
  }
}

export const CreateGaragePage = (rerenderWinners: () => void) => new GarageWrapper(rerenderWinners);
