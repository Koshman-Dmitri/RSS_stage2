import { GARAGE_PAGE_LIMIT, RaceAPI, WINNERS_PAGE_LIMIT } from '../API/RaceAPI';
import { CarType, WinnerType, OrderType, SortType, WinnerTableType } from '../API/types';

type StoreType = {
  page: number;
  totalPages: number;
  totalCars: string;
  cars: CarType[];
  winnersPage: number;
  totalWinnersPages: number;
  totalWinners: string;
  winnersSort: SortType;
  winnersOrder: OrderType;
  winners: WinnerTableType[];
  selectedCarId: number | undefined;
  selectedCarName: string | undefined;
  selectedCarColor: string | undefined;
  animations: { [idcar: number]: number };
  curRacing: number[];
  toggleSortOrder: () => string;
};

export const STORE: StoreType = {
  page: 1,
  totalPages: 1,
  totalCars: '0',
  cars: [],
  winnersPage: 1,
  totalWinnersPages: 1,
  totalWinners: '0',
  winnersSort: 'wins',
  winnersOrder: 'DESC',
  winners: [],
  selectedCarId: undefined,
  selectedCarName: undefined,
  selectedCarColor: undefined,
  animations: {},
  curRacing: [],

  toggleSortOrder() {
    this.winnersOrder = this.winnersOrder === 'ASC' ? 'DESC' : 'ASC';
    return this.winnersOrder.toLowerCase();
  },
};

export async function updateStoreCars() {
  STORE.cars = await RaceAPI.getCars(STORE.page);
  STORE.totalCars = (await RaceAPI.getTotalCars()) as string;
  STORE.totalPages = Math.ceil(+STORE.totalCars / GARAGE_PAGE_LIMIT);
}

export async function updateStoreWinners() {
  const winners: WinnerType[] = await RaceAPI.getWinners(STORE.winnersPage, STORE.winnersSort, STORE.winnersOrder);
  const promises: Promise<CarType>[] = [];
  winners.forEach((winner) => {
    promises.push(RaceAPI.getCar(winner.id));
  });
  const cars = await Promise.all(promises);

  const resultArr: WinnerTableType[] = [];
  winners.forEach((winner: WinnerType) => {
    const car = cars.find((el) => el.id === winner.id);
    if (!car) return;
    const { color, name } = car;
    const wins = winner.wins as number;
    const { time } = winner;
    resultArr.push({ color, name, wins, time });
  });

  STORE.winners = resultArr;
  STORE.totalWinners = (await RaceAPI.getTotalWinners()) as string;
  STORE.totalWinnersPages = Math.ceil(+STORE.totalWinners / WINNERS_PAGE_LIMIT);
}
