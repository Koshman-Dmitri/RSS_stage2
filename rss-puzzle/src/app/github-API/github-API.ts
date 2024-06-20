import { Level } from '../pages/main-page/types';

export const BASE_URL =
  'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/';

class GithHubAPI {
  public async getWordsForLevel(level: number) {
    const url = `${BASE_URL}data/wordCollectionLevel${level}.json`;
    const response = await fetch(url);
    const data = (await response.json()) as Level;
    return data;
  }
}

export const Github = new GithHubAPI();
