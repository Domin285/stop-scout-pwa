import { defineStore } from "pinia";
import { db, type FavoriteStop } from "../services/db";
import type { Stop } from "../types/ztm";

interface FavoriteStopState {
  favoriteStops: FavoriteStop[];
  loading: boolean;
  error: string | null;
}

export const useFavoriteStopStore = defineStore("favoriteStops", {
  state: (): FavoriteStopState => ({
    favoriteStops: [],
    loading: false,
    error: null,
  }),

  actions: {
    async loadForUser(userId: number) {
      this.loading = true;
      this.error = null;

      try {
        this.favoriteStops = await db.favoriteStops
          .where("userId")
          .equals(userId)
          .toArray();
      } finally {
        this.loading = false;
      }
    },

    async addFavorite(userId: number, stop: Stop) {
      const alreadyExists = this.favoriteStops.some((favorite) => {
        return favorite.userId === userId && favorite.stopId === stop.stopId;
      });

      if (alreadyExists) {
        this.error = `Przystanek "${stop.stopName}" jest już zapisany w ulubionych.`;

        setTimeout(() => {
          this.error = null;
        }, 3000);

        return;
      }

      const now = new Date().toISOString();

      const favorite: FavoriteStop = {
        id: -Date.now(),
        userId,
        stopId: stop.stopId,
        stopName: stop.stopName,
        customName: stop.stopName,
        note: "",
        stopLat: stop.stopLat,
        stopLon: stop.stopLon,
        createdAt: now,
        updatedAt: now,
      };

      this.favoriteStops.unshift(favorite);

      try {
        const realId = await db.favoriteStops.add({
          userId: favorite.userId,
          stopId: favorite.stopId,
          stopName: favorite.stopName,
          customName: favorite.customName,
          note: favorite.note,
          stopLat: favorite.stopLat,
          stopLon: favorite.stopLon,
          createdAt: favorite.createdAt,
          updatedAt: favorite.updatedAt,
        });

        const index = this.favoriteStops.findIndex(
          (item) => item.id === favorite.id,
        );

        if (index !== -1) {
          this.favoriteStops[index].id = realId;
        }
      } catch (error) {
        this.favoriteStops = this.favoriteStops.filter(
          (item) => item.id !== favorite.id,
        );
        this.error = "Nie udało się dodać przystanku.";

        setTimeout(() => {
          this.error = null;
        }, 3000);
      }
    },

    async updateFavorite(id: number, changes: Partial<FavoriteStop>) {
      const index = this.favoriteStops.findIndex((item) => item.id === id);
      if (index === -1) return;

      const oldValue = { ...this.favoriteStops[index] };

      this.favoriteStops[index] = {
        ...this.favoriteStops[index],
        ...changes,
        updatedAt: new Date().toISOString(),
      };

      try {
        await db.favoriteStops.update(id, this.favoriteStops[index]);
      } catch {
        this.favoriteStops[index] = oldValue;
      }
    },

    async deleteFavorite(id: number) {
      const oldList = [...this.favoriteStops];

      this.favoriteStops = this.favoriteStops.filter((item) => item.id !== id);

      try {
        await db.favoriteStops.delete(id);
      } catch {
        this.favoriteStops = oldList;
      }
    },
  },
});
