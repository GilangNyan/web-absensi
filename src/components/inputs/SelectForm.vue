<template>
  <div class="w-full flex flex-col">
    <label :for="name" class="block mb-2 text-sm font-medium text-gray-600" @click="toggleOptions()">
      {{ label }}
    </label>
    <div class="relative">
      <input
        type="text"
        :name="name"
        :id="name"
        v-model="value"
        class="hidden"
      >
      <div
        class="option-selected"
        :class="errorMessage != null ? 'focus:border-red-500 focus:ring-red-500 border-red-500' : 'focus:border-cyan-500 focus:ring-cyan-500'"
        @click="toggleOptions()"
      >
        <span :class="value == undefined ? 'text-gray-400' : ''">
          {{ (value as ISelectOption)?.label || value || $t('label.select') }}
        </span>
        <ChevronUpDownIcon class="w-4 h-4" />
      </div>
      <div class="options-wrapper" v-if="isOpen">
        <div class="option" v-for="(item, index) in options" :key="index" @click="selectOptions(item)">
          <span>{{ (item as ISelectOption)?.label || item }}</span>
        </div>
      </div>
      <span class="text-red-500 text-xs text-center justify-center w-full flex font-semibold">
        {{ errorMessage }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type ISelectOption from '@/types/selectOption';
import { ChevronUpDownIcon } from '@heroicons/vue/24/solid';
import { useField } from 'vee-validate';
import { ref, type Ref } from 'vue';

interface Props {
  name: string
  label: string
  options: ISelectOption[] | string[] | number[] | boolean[] | null
  modelValue: ISelectOption | string | number | boolean | null | undefined
}

const props = defineProps<Props>()

const { value, errorMessage } = useField(() => props.name, undefined, { syncVModel: true })

let isOpen: Ref<boolean> = ref(false)

const selectOptions = (optionValue: ISelectOption | string | number | boolean | null): void => {
  value.value = optionValue
  toggleOptions()
}

const toggleOptions = (): void => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.option-selected {
  @apply p-2 shadow-sm text-gray-800 w-full border border-gray-200 placeholder-gray-200 focus:outline-none focus:ring-1 rounded-lg text-sm cursor-pointer flex justify-between items-center
}

.options-wrapper {
  @apply text-sm text-gray-800 rounded-lg border border-gray-200 shadow-md cursor-pointer absolute z-10 w-full bg-white
}

.option {
  @apply px-4 py-2 hover:bg-gray-200
}
</style>