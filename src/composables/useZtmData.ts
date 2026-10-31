import { ref } from "vue";
import { db } from "../services/db";
import type { Stop, Departure } from "../types/ztm";

const STOPS_URL =
  "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json";

const CACHE_KEY = "ztm-stops";
const ONE_DAY = 24 * 60 * 60 * 1000;

export function useZtmData() {
  const stops = ref<Stop[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const fromCache = ref(false);
  const departures = ref<Record<number, Departure[]>>({});

  async function loadStops() {
    loading.value = true;
    error.value = null;
    fromCache.value = false;

    try {
      const cached = await db.cachedStopLists.get(CACHE_KEY);
      const now = Date.now();

      if (cached && now - cached.updatedAt < ONE_DAY) {
        stops.value = JSON.parse(JSON.stringify(cached.data)) as Stop[];
        fromCache.value = true;
        return;
      }

      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 10000);

      const response = await fetch(STOPS_URL, {
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error("Nie udało się pobrać listy przystanków.");
      }

      const data = await response.json();

      const values = Object.values(data);
      const newestValue = values[values.length - 1];

      const rawStopList = Array.isArray(data)
        ? data
        : Array.isArray(data.stops)
          ? data.stops
          : Array.isArray(newestValue)
            ? newestValue
            : newestValue && typeof newestValue === "object"
              ? Object.values(newestValue).flat()
              : [];

      const cleanedStops: Stop[] = rawStopList
        .flat()
        .filter((stop: any) => {
          return (
            stop && typeof stop === "object" && stop.stopId && stop.stopName
          );
        })
        .map((stop: any) => ({
          stopId: Number(stop.stopId),
          stopName: String(stop.stopName),
          stopShortName: stop.stopShortName
            ? String(stop.stopShortName)
            : undefined,
          stopDesc: stop.stopDesc ? String(stop.stopDesc) : undefined,
          subName: stop.subName ? String(stop.subName) : undefined,
          date: stop.date ? String(stop.date) : undefined,
          zoneId: stop.zoneId ? Number(stop.zoneId) : undefined,
          stopLat: stop.stopLat ? Number(stop.stopLat) : undefined,
          stopLon: stop.stopLon ? Number(stop.stopLon) : undefined,
        }));

      if (!cleanedStops.length) {
        throw new Error("Pobrano dane, ale nie znaleziono listy przystanków.");
      }

      stops.value = cleanedStops;

      await db.cachedStopLists.put({
        id: CACHE_KEY,
        data: JSON.parse(JSON.stringify(cleanedStops)) as Stop[],
        updatedAt: now,
      });
    } catch (err) {
      const cached = await db.cachedStopLists.get(CACHE_KEY);

      if (cached) {
        stops.value = cached.data as Stop[];
        fromCache.value = true;
        error.value = "Brak internetu. Pokazuję zapisane przystanki.";
      } else {
        error.value =
          err instanceof Error
            ? err.message
            : "Wystąpił błąd pobierania danych.";
      }
    } finally {
      loading.value = false;
    }
  }

  async function loadDepartures(stopId: number) {
    try {
      const response = await fetch(
        `https://ckan2.multimediagdansk.pl/departures?stopId=${stopId}`,
      );

      if (!response.ok) {
        throw new Error("Nie udało się pobrać odjazdów.");
      }

      const data = await response.json();

      const departureList = Array.isArray(data)
        ? data
        : Array.isArray(data.delay)
          ? data.delay
          : Array.isArray(data.departures)
            ? data.departures
            : [];

      departures.value[stopId] = departureList;
    } catch (error) {
      departures.value[stopId] = [];
    }
  }

  return {
    stops,
    loading,
    error,
    fromCache,
    departures,
    loadDepartures,
    loadStops,
  };
}
