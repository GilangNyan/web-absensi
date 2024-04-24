<template>
  <div class="relative" v-closable="{ handler: onClose, exclude: ['toggler'] }">
    <button
      class="px-2 py-1 border border-white hover:bg-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200"
      :class="dropdownOpen ? 'bg-gray-200 border-gray-300' : ''"
      @click="toggleDropdown()"
      ref="toggler"
    >
      <EllipsisHorizontalIcon class="w-4 h-4" />
    </button>
    <!-- Dropdown -->
    <Transition name="slide-right">
      <div
        class="absolute top-0 right-10 z-30 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden min-w-40"
        v-if="dropdownOpen"
      >
        <div class="dropdown-item" v-if="!hideView" @click="emitFunction('view')">
          <EyeIcon class="w-4 h-4" />
          <span>{{ $t('view') }}</span>
        </div>
        <div class="dropdown-item" v-if="!hideUpdate" @click="emitFunction('update')">
          <PencilSquareIcon class="w-4 h-4" />
          <span>{{ $t('update') }}</span>
        </div>
        <div class="dropdown-item text-red-600" v-if="!hideDelete" @click="emitFunction('delete')">
          <TrashIcon class="w-4 h-4" />
          <span>{{ $t('delete') }}</span>
        </div>
        <hr v-if="customOptions && customOptions.length !== 0">
        <div class="dropdown-item" @click="emitFunction(item.name)" v-for="(item, index) in customOptions" :key="index">
          <component :is="heroIcons[item.icon]" class="w-4 h-4" />
          <span>{{ item.title }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type IDropdownItem from '@/types/dropdownItem';
import { EllipsisHorizontalIcon, EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
import * as heroIcons from '@heroicons/vue/24/solid';
import { ref, type Ref } from 'vue';

interface Props {
  hideView?: boolean
  hideUpdate?: boolean
  hideDelete?: boolean
  customOptions?: IDropdownItem[]
}

const props = withDefaults(defineProps<Props>(), {
  hideView: false,
  hideUpdate: false,
  hideDelete: false
})

const emits = defineEmits<{
  action: [action: string]
}>()

let dropdownOpen: Ref<boolean> = ref(false)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const emitFunction = (func: string) => {
  emits('action', func)
  toggleDropdown()
}

const onClose = () => {
  dropdownOpen.value = false
}
</script>

<style scoped>
.dropdown-item {
  @apply px-3 py-2 flex space-x-2 hover:bg-gray-100 cursor-pointer
}

.slide-right-enter-from,
.slide-right-leave-to {
  @apply translate-x-10 opacity-0
}

.slide-right-leave-from,
.slide-right-enter-to {
  @apply translate-x-0 opacity-100
}

.slide-right-enter-active,
.slide-right-leave-active {
  @apply transition-all duration-300
}
</style>