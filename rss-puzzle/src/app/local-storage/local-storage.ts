export type ValueOf<T> = T[keyof T];

type User = {
  firstname: string;
  surname: string;
  lastLevel: number | null;
  lastRound: number | null;
  isHintAudio: boolean;
  isHintTranslate: boolean;
  isHintPicture: boolean;
  complLevels: number[];
  complRounds: number[][];
  [key: string]: unknown;
};

type UserValue = ValueOf<User>;

const MAX_LEVEL = 6;

class StorageAPI {
  public getData(): User {
    let data = localStorage.getItem('user');
    if (data === null) {
      this.createData();
      data = localStorage.getItem('user') as string;
    }
    const parsedData = JSON.parse(data) as User;
    return parsedData;
  }

  public setData(key: keyof User, value: UserValue): void {
    const user = this.getData();
    user[key] = value;
    localStorage.setItem('user', JSON.stringify(user));
  }

  public createData(): void {
    const initUser: User = {
      firstname: '',
      surname: '',
      lastLevel: 1,
      lastRound: -1,
      isHintAudio: true,
      isHintTranslate: true,
      isHintPicture: true,
      complLevels: [],
      complRounds: Array(MAX_LEVEL).fill([]),
    };
    localStorage.setItem('user', JSON.stringify(initUser));
  }

  public deleteData(): void {
    localStorage.clear();
  }
}

export const MyLocalStorage = new StorageAPI();
