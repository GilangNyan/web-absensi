<template>
  <button
    type="submit"
    class="w-full rounded-full bg-gradient-to-r p-2 disabled:cursor-not-allowed"
    :class="color === 'indigo' ? 'from-indigo-400 to-indigo-500 disabled:bg-indigo-400 hover:from-indigo-500 hover:to-indigo-600': 'from-blue-500 to-cyan-500 disabled:bg-blue-400 hover:from-blue-400 hover:to-cyan-400'"
    :form="form"
    :disabled="loading">
    <span class="text-sm text-white font-semibold inline-flex">
      <svg class="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" v-if="loading">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {{ loading ? $t('label.processing') : label }}
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  label: string
  form?: string
  loading: boolean
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'indigo'
})
</script>