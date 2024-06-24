import { LocalStorageData } from 'interfaces/localStorage.interface';

type LocalStorageKey = keyof LocalStorageData;

export class LocalStorageService {
  public static saveData<K extends LocalStorageKey>(key: K, data: LocalStorageData[K]): void {
    localStorage.setItem(key.toString(), JSON.stringify(data));
  }

  public static getData<K extends LocalStorageKey>(key: K): LocalStorageData[K] | null {
    const data = localStorage.getItem(key.toString());
    return data ? JSON.parse(data) : null;
  }

  public static removeData<K extends LocalStorageKey>(key: K): void {
    localStorage.removeItem(key.toString());
  }

  public static removeAll(): void {
    localStorage.clear();
  }
}
