<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Stop } from '../../types/ztm'
import BaseInput from '../common/BaseInput.vue'

const props = defineProps<{
  stops: Stop[]
}>()

const emit = defineEmits<{
  select: [stop: Stop]
}>()

const search = ref('')

const filteredStops = computed(() => {
  const phrase = search.value.toLowerCase().trim()

  if (!phrase) {
    return props.stops
        .filter((stop) => stop.stopName && stop.stopId)
        .slice(0, 10)  
    }

    return props.stops
    .filter((stop) => {
        return (
        stop.stopName &&
        stop.stopId &&
        (
            stop.stopName.toLowerCase().includes(phrase) ||
            String(stop.stopId).includes(phrase)
        )
        )
    })
    .slice(0, 100)
    })
</script>

<template>
  <section class="rounded-2xl bg-white p-6 shadow">
    <h2 class="mb-4 text-2xl font-bold">Wyszukaj przystanek</h2>

    <BaseInput
      v-model="search"
      placeholder="Wpisz nazwę lub ID przystanku..."
    />

    <div class="max-h-96 space-y-2 overflow-y-auto">
      <button
        v-for="stop in filteredStops"
        :key="stop.stopId"
        class="w-full rounded-lg border p-3 text-left hover:bg-blue-50"
        @click="emit('select', stop)"
      >
        <span class="font-bold">{{ stop.stopName }}</span>
        <span class="ml-2 text-sm text-gray-500">ID: {{ stop.stopId }}</span>
      </button>
    </div>
  </section>
</template>