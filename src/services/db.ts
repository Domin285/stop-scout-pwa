import Dexie, { type Table } from "dexie";
import type { Stop } from "../types/ztm";

export interface User {
  id?: number;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface FavoriteStop {
  id?: number;
  userId: number;
  stopId: number;
  stopName: string;
  customName: string;
  note: string;
  stopLat?: number;
  stopLon?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CachedStopList {
  id: string;
  data: Stop[];
  updatedAt: number;
}

class StopScoutDatabase extends Dexie {
  users!: Table<User, number>;
  favoriteStops!: Table<FavoriteStop, number>;
  cachedStopLists!: Table<CachedStopList, string>;

  constructor() {
    super("StopScoutDatabase");

    this.version(1).stores({
      users: "++id, &email",
      favoriteStops: "++id, userId, stopId",
      cachedStopLists: "id",
    });
  }
}

export const db = new StopScoutDatabase();
