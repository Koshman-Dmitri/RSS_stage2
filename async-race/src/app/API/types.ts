export type CarType = {
  id: number;
  name: string;
  color: string;
};

export type WinnerTableType = {
  color: string;
  name: string;
  wins: number;
  time: number;
};

export type DriveStatus = 'started' | 'stopped' | 'drive';

export type WinnerType = {
  id: number;
  time: number;
  wins?: number;
};

export type SortType = 'id' | 'wins' | 'time';

export type OrderType = 'ASC' | 'DESC';
