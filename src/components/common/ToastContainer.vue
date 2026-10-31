<script setup lang="ts">
import { useToastStore } from '../../stores/toastStore'

const toastStore = useToastStore()
</script>

<template>
  <div class="fixed right-4 top-4 z-50 space-y-3">
    <div
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      class="rounded-xl px-4 py-3 font-medium text-white shadow-lg"
      :class="{
        'bg-green-600': toast.type === 'success',
        'bg-red-600': toast.type === 'error',
        'bg-blue-600': toast.type === 'info',
      }"
    >
      {{ toast.message }}
    </div>
  </div>
</template>