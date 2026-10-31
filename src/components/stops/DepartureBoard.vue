<script setup lang="ts">
import type { Departure } from '../../types/ztm'

defineProps<{
  departures: Departure[]
}>()

function formatTime(dateString: string) {
  if (!dateString) return '-'

  return new Date(dateString).toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDelay(delay?: number | null) {
  if (delay === null || delay === undefined) {
    return 'brak danych'
  }

  if (delay < 0) {
    return `${Math.abs(delay)} s przed czasem`
  }

  if (delay === 0) {
    return 'punktualnie'
  }

  return `${delay} s po czasie`
}
</script>

<template>
  <div class="mt-4 rounded-xl bg-gray-950 p-4 text-white">
    <h4 class="mb-3 font-bold text-green-400">
      Najbliższe odjazdy
    </h4>

    <p v-if="!departures.length" class="text-gray-400">
      Brak danych o odjazdach albo brak połączenia.
    </p>

    <div v-else class="space-y-2">
      <div
        v-for="departure in departures.slice(0, 6)"
        :key="departure.id"
        class="grid grid-cols-4 gap-2 rounded-lg bg-gray-800 p-3 text-sm"
      >
        <span class="font-bold text-yellow-300">
          {{ departure.routeId }}
        </span>

        <span class="col-span-2">
          {{ departure.headsign }}
        </span>

        <span
          v-delay-highlight="departure.delayInSeconds"
          class="text-right font-bold"
        >
          {{ formatTime(departure.estimatedTime) }}
        </span>

        <span class="col-span-4 text-xs text-gray-400">
          Rozkład: {{ formatTime(departure.theoreticalTime) }},
          opóźnienie: {{ formatDelay(departure.delayInSeconds) }}        
        </span>
      </div>
    </div>
  </div>
</template>