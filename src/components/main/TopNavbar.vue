<template>
  <div class="flex w-full justify-between bg-white px-6 py-3 shadow-sm">
    <div class="flex items-center">
      <Bars3Icon class="w-6 h-6 text-gray-600 cursor-pointer" @click="toggleSidebar()" />
    </div>
    <div class="flex items-center space-x-6">
      <BellIcon class="w-6 h-6 text-gray-600" />
      <div class="flex space-x-2 items-center">
        <img src="@/assets/images/default.jpeg" class="w-8 h-8 rounded-full">
        <div class="flex flex-col">
          <span class="text-xs font-semibold">Gilang Saeful Anwar</span>
          <span class="text-xs">Superadmin</span>
        </div>
      </div>
      <ChevronDownIcon class="w-5 h-5 text-gray-600 border border-gray-400 rounded-full p-1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bars3Icon, BellIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'

interface Props {
  value: boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
  update: [sidebar: boolean]
}>()

const toggleSidebar = () => {
  emits('update', !props.value)
}
</script>