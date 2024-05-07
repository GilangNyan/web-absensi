<template>
  <div class="bg-white w-72 flex flex-col items-center rounded-lg p-4 space-y-4">
    <ExclamationTriangleIcon class="w-24 h-24 text-yellow-500" />
    <div class="flex flex-col items-center space-y-1">
      <h4 class="font-semibold">{{ title }}</h4>
      <span class="text-sm">{{ message }}</span>
    </div>
    <div class="flex space-x-2 w-full mt-8">
      <button
        class="bg-gray-300 px-4 py-2 text-gray-800 rounded w-1/2 ho"
        @click.prevent="modalStore.closeModal"
      >
        {{ $t('label.cancel') }}
      </button>
      <button
        class="bg-blue-500 px-4 py-2 text-white rounded w-1/2"
        @click.prevent="modalStore.confirmAction"
      >
        {{ $t('label.confirm') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts"> 
import { useModalStore } from '@/stores/modal';
import { ExclamationTriangleIcon } from "@heroicons/vue/24/solid"

interface Props {
  title: string
  message: string
}

const props = defineProps<Props>()

const modalStore = useModalStore()
</script>