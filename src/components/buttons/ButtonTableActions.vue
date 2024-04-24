<template>
  <button
    class="rounded-full p-2 shadow"
    :class="[buttonColorMap[type]]"
  >
    <EyeIcon class="w-3 h-3" v-if="type == 'view'" />
    <PencilSquareIcon class="w-3 h-3" v-if="type == 'update'" />
    <TrashIcon class="w-3 h-3" v-if="type == 'delete'" />
  </button>
</template>

<script setup lang="ts">
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid'

type TButtonType = 'view' | 'update' | 'delete'

interface Props {
  type: TButtonType
}

const props = defineProps<Props>()

const buttonColorMap: Record<TButtonType, string> = {
  view: 'bg-cyan-500 text-white hover:bg-cyan-400',
  update: 'bg-green-500 text-white hover:bg-green-400',
  delete: 'bg-red-500 text-white hover:bg-red-400'
}
</script>