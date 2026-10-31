<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
  type?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <input
    :value="modelValue"
    :type="type ?? 'text'"
    :placeholder="placeholder"
    class="w-full rounded-lg border p-3"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>