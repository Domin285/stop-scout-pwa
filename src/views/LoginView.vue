<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  error.value = ''

  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Nie udało się zalogować.'
  }
}
</script>

<template>
  <main class="min-h-screen flex items-center justify-center p-6">
    <form
      class="w-full max-w-md rounded-2xl bg-white p-8 shadow"
      @submit.prevent="handleLogin"
    >
      <h1 class="mb-6 text-3xl font-bold text-gray-900">Logowanie</h1>

      <label class="mb-2 block font-medium">E-mail</label>
      <input
        v-model="email"
        type="email"
        required
        class="mb-4 w-full rounded-lg border p-3"
        autocomplete="email"
      />

      <label class="mb-2 block font-medium">Hasło</label>
      <input
        v-model="password"
        type="password"
        required
        class="mb-4 w-full rounded-lg border p-3"
        autocomplete="current-password"
      />

      <p v-if="error" class="mb-4 text-red-600">
        {{ error }}
      </p>

      <button
        type="submit"
        class="w-full rounded-lg bg-blue-600 p-3 font-bold text-white"
      >
        Zaloguj
      </button>

      <RouterLink class="mt-4 block text-center text-blue-600" to="/register">
        Nie mam konta
      </RouterLink>
    </form>
  </main>
</template>