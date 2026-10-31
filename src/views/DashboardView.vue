<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useZtmData } from '../composables/useZtmData'
import StopSearch from '../components/stops/StopSearch.vue'
import type { Stop } from '../types/ztm'
import { useFavoriteStopStore } from '../stores/favoriteStopStore'
import FavoriteStopList from '../components/stops/FavoriteStopList.vue'
import { useToastStore } from '../stores/toastStore'
import StopMap from '../components/stops/StopMap.vue'

const router = useRouter()
const authStore = useAuthStore()
const favoriteStopStore = useFavoriteStopStore()
const favoriteError = computed(() => favoriteStopStore.error)
const toastStore = useToastStore()
const activeTab = ref<'search' | 'favorites'>('search')
const sidebarOpen = ref(true)

const {
  stops,
  loading,
  error,
  fromCache,
  departures,
  loadStops,
  loadDepartures,
} = useZtmData()

onMounted(async () => {
  await loadStops()

  if (authStore.currentUser?.id) {
    await favoriteStopStore.loadForUser(authStore.currentUser.id)

    for (const favorite of favoriteStopStore.favoriteStops) {
      await loadDepartures(favorite.stopId)
    }
  }
})

function logout() {
  authStore.logout()
  router.push('/login')
}

async function handleSelectStop(stop: Stop) {
  if (!authStore.currentUser?.id) return

  const beforeCount = favoriteStopStore.favoriteStops.length

  await favoriteStopStore.addFavorite(authStore.currentUser.id, stop)

  const afterCount = favoriteStopStore.favoriteStops.length

  if (afterCount > beforeCount) {
    toastStore.show('success', `Dodano przystanek "${stop.stopName}" do ulubionych.`)
    await loadDepartures(stop.stopId)
  } else if (favoriteStopStore.error) {
    toastStore.show('error', favoriteStopStore.error)
  }
}

async function handleUpdateFavorite(id: number, customName: string, note: string) {
  await favoriteStopStore.updateFavorite(id, {
    customName,
    note,
  })

  toastStore.show('success', 'Zapisano zmiany.')
}

async function handleDeleteFavorite(id: number) {
  await favoriteStopStore.deleteFavorite(id)
  toastStore.show('info', 'Usunięto przystanek z ulubionych.')
}

async function handleMapSelect(stop: Stop) {
  await handleSelectStop(stop)
  activeTab.value = 'favorites'
  sidebarOpen.value = true
}
</script>

<template>
  <main class="relative h-screen w-screen overflow-hidden bg-gray-100">
    <StopMap
      :stops="stops"
      class="absolute inset-0 z-0"
      @select="handleMapSelect"
    />

    <aside
      :class="[
        'absolute right-0 top-0 z-10 h-full bg-white shadow-2xl transition-all duration-300',
        sidebarOpen ? 'w-[420px]' : 'w-16',
      ]"
    >
      <button
        class="absolute left-[-48px] top-6 rounded-l-xl bg-gray-900 px-3 py-2 text-white shadow-lg"
        @click="sidebarOpen = !sidebarOpen"
      >
        {{ sidebarOpen ? '→' : '←' }}
      </button>

      <div v-if="sidebarOpen" class="flex h-full flex-col">
        <div class="border-b p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h1 class="text-3xl font-bold">Stop Scout</h1>

              <p class="mt-1 text-sm text-gray-600">
                {{ authStore.currentUser?.email }}
              </p>
            </div>

            <button
              class="rounded-lg bg-gray-900 px-4 py-2 font-bold text-white"
              @click="logout"
            >
              Wyloguj
            </button>
          </div>

          <div
            v-if="fromCache"
            class="mt-4 rounded-xl bg-blue-100 p-3 text-sm text-blue-900"
          >
            Dane pochodzą z lokalnego cache.
          </div>
        </div>

        <div class="flex border-b">
          <button
            class="flex-1 p-4 font-bold"
            :class="
              activeTab === 'search'
                ? 'border-b-2 border-gray-900 bg-gray-100'
                : 'bg-white'
            "
            @click="activeTab = 'search'"
          >
            Wyszukiwarka
          </button>

          <button
            class="flex-1 p-4 font-bold"
            :class="
              activeTab === 'favorites'
                ? 'border-b-2 border-gray-900 bg-gray-100'
                : 'bg-white'
            "
            @click="activeTab = 'favorites'"
          >
            Ulubione
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="activeTab === 'search'">
            <div
              v-if="loading"
              class="rounded-xl bg-white p-4 shadow"
            >
              Ładowanie przystanków...
            </div>

            <div
              v-if="error"
              class="mb-4 rounded-xl bg-yellow-100 p-4 text-yellow-900"
            >
              {{ error }}
            </div>

            <StopSearch
              v-if="!loading && stops.length"
              :stops="stops"
              @select="handleSelectStop"
            />
          </div>

          <div v-if="activeTab === 'favorites'">
            <div
              v-if="favoriteError"
              class="mb-4 rounded-xl bg-red-100 p-4 text-red-800"
            >
              {{ favoriteError }}
            </div>

            <FavoriteStopList
              :stops="favoriteStopStore.favoriteStops"
              :departures="departures"
              @delete="handleDeleteFavorite"
              @update="handleUpdateFavorite"
            >
              <template #header>
                <div>
                  <h2 class="text-2xl font-bold">
                    Moje tablice
                  </h2>

                  <p class="text-sm text-gray-500">
                    Działają również offline.
                  </p>
                </div>
              </template>
            </FavoriteStopList>
          </div>
        </div>
      </div>
    </aside>
  </main>
</template>