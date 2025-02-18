<template>
  <div class="bg-white text-indigo-800 p-4 rounded-lg shadow-lg flex items-center z-20 space-x-2">
    <slot />
    <div class="flex flex-col">
      <p class="text-2xl font-bold lg:text-3xl">{{ value }}</p>
      <p class="text-sm lg:text-base">{{ title }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: number
}

const props = defineProps<Props>()
</script>