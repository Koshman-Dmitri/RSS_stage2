import { DriveStatus, OrderType, SortType, WinnerType } from './types';

const GARAGE_ENDPOINT = 'http://127.0.0.1:3000/garage';
const ENGINE_ENDPOINT = 'http://127.0.0.1:3000/engine';
const WINNERS_ENDPOINT = 'http://127.0.0.1:3000/winners';

export const GARAGE_PAGE_LIMIT = 7;
export const WINNERS_PAGE_LIMIT = 10;

class API {
  public async getCar(id: number) {
    const endpoint = `${GARAGE_ENDPOINT}/${id}`;
    const response = await fetch(endpoint);
    return response.json();
  }

  public async getCars(page: number) {
    const endpoint = `${GARAGE_ENDPOINT}?_page=${page}&_limit=${GARAGE_PAGE_LIMIT}`;
    const response = await fetch(endpoint);
    return response.json();
  }

  public async getTotalCars() {
    const endpoint = `${GARAGE_ENDPOINT}?_limit=${GARAGE_PAGE_LIMIT}`;
    const response = await fetch(endpoint);
    return response.headers.get('X-Total-Count');
  }

  public async createOneCar(name: string, color: string) {
    const body = JSON.stringify({ name, color });
    const response = await fetch(GARAGE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    return response;
  }

  public async deleteCar(id: number) {
    const endpoint = `${GARAGE_ENDPOINT}/${id}`;
    await fetch(endpoint, { method: 'DELETE' });
  }

  public async updateCar(id: number, name: string, color: string) {
    const endpoint = `${GARAGE_ENDPOINT}/${id}`;
    const body = JSON.stringify({ name, color });
    await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  }

  public async startCar(id: number) {
    const status: DriveStatus = 'started';
    const endpoint = `${ENGINE_ENDPOINT}?id=${id}&status=${status}`;
    const response = await fetch(endpoint, { method: 'PATCH' });
    const { velocity, distance } = await response.json();
    return { velocity, distance };
  }

  public async driveCar(id: number, signal: AbortSignal) {
    const status: DriveStatus = 'drive';
    const endpoint = `${ENGINE_ENDPOINT}?id=${id}&status=${status}`;
    const response = await fetch(endpoint, { method: 'PATCH', signal });
    return response;
  }

  public async stopCar(id: number) {
    const status: DriveStatus = 'stopped';
    const endpoint = `${ENGINE_ENDPOINT}?id=${id}&status=${status}`;
    await fetch(endpoint, { method: 'PATCH' });
  }

  public async getWinner(id: number) {
    const endpoint = `${WINNERS_ENDPOINT}/${id}`;
    return fetch(endpoint);
  }

  public async getWinners(page: number, sort: SortType, order: OrderType) {
    const endpoint = `${WINNERS_ENDPOINT}?_page=${page}&_limit=${WINNERS_PAGE_LIMIT}&_sort=${sort}&_order=${order}`;
    const response = await fetch(endpoint);
    return response.json();
  }

  public async getTotalWinners() {
    const endpoint = `${WINNERS_ENDPOINT}?_limit=${WINNERS_PAGE_LIMIT}`;
    const response = await fetch(endpoint);
    return response.headers.get('X-Total-Count');
  }

  public async createWinner({ id, time, wins = 1 }: WinnerType) {
    const body = JSON.stringify({ id, wins, time });
    await fetch(WINNERS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  }

  public async updateWinner({ id, time, wins }: Required<WinnerType>) {
    const endpoint = `${WINNERS_ENDPOINT}/${id}`;
    const body = JSON.stringify({ time, wins });
    await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  }

  public async deleteWinner(id: number) {
    const endpoint = `${WINNERS_ENDPOINT}/${id}`;
    await fetch(endpoint, { method: 'DELETE' });
  }
}

export const RaceAPI = new API();
