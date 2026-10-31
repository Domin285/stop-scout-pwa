<script setup lang="ts">
import { ref } from 'vue'
import type { FavoriteStop } from '../../services/db'
import DepartureBoard from './DepartureBoard.vue'
import type { Departure } from '../../types/ztm'

defineProps<{
  stops: FavoriteStop[]
  departures: Record<number, Departure[]>
}>()

const emit = defineEmits<{
  delete: [id: number]
  update: [id: number, customName: string, note: string]
}>()

const editingId = ref<number | null>(null)
const editedName = ref('')
const editedNote = ref('')

function startEdit(stop: FavoriteStop) {
  editingId.value = stop.id ?? null
  editedName.value = stop.customName
  editedNote.value = stop.note
}

function saveEdit(stop: FavoriteStop) {
  if (!stop.id) return

  emit('update', stop.id, editedName.value, editedNote.value)
  editingId.value = null
}
</script>

<template>
  <section class="rounded-2xl bg-white p-6 shadow">
  <header class="mb-4">
    <slot name="header">
      <h2 class="text-2xl font-bold">Moje tablice przystankowe</h2>
    </slot>
  </header>

    <p v-if="!stops.length" class="text-gray-500">
      Nie masz jeszcze zapisanych przystanków.
    </p>

    <div class="space-y-4">
      <article
        v-for="stop in stops"
        :key="stop.id ?? `${stop.stopId}-${stop.createdAt}`"
        class="rounded-xl border p-4"
      >
        <div v-if="editingId === stop.id" class="space-y-3">
          <input
            v-model="editedName"
            class="w-full rounded-lg border p-3"
            placeholder="Nazwa tablicy"
          />

          <textarea
            v-model="editedNote"
            class="w-full rounded-lg border p-3"
            placeholder="Notatka"
          />

          <div class="flex gap-2">
            <button
              class="rounded-lg bg-green-600 px-4 py-2 font-bold text-white"
              @click="saveEdit(stop)"
            >
              Zapisz
            </button>

            <button
              class="rounded-lg bg-gray-200 px-4 py-2 font-bold"
              @click="editingId = null"
            >
              Anuluj
            </button>
          </div>
        </div>

        <div v-else>
          <h3 class="text-xl font-bold">
            {{ stop.customName }}
          </h3>

          <p class="text-gray-600">
            {{ stop.stopName }} — ID: {{ stop.stopId }}
          </p>

          <p v-if="stop.note" class="mt-2 rounded-lg bg-gray-100 p-3">
            {{ stop.note }}
          </p>

          <DepartureBoard
            :departures="departures[stop.stopId] ?? []"
          />

          <div class="mt-4 flex gap-2">
            <button
              class="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white"
              @click="startEdit(stop)"
            >
              Edytuj
            </button>

            <button
              v-if="stop.id && stop.id > 0"
              class="rounded-lg bg-red-600 px-4 py-2 font-bold text-white"
              @click="emit('delete', stop.id)"
            >
              Usuń
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>