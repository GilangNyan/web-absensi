<template>
  <div class="w-full flex flex-col">
    <label :for="name" class="block mb-2 text-sm font-medium text-gray-600">
      {{ label }}
    </label>
    <div class="grid grid-cols-4 gap-4 text-sm text-gray-800" :id="name">
      <div class="flex w-full space-x-2 items-center" v-for="(item, index) in options" :key="index">
        <input
          type="radio"
          :name="index.toString()"
          :id="index.toString()"
          :value="(item as ISelectOption).value"
          v-model="value"
        >
        <label :for="index.toString()">
          {{ (item as ISelectOption).label }}
        </label>
      </div>
    </div>
    <span class="text-red-500 text-xs text-center justify-center w-full flex font-semibold">
      {{ errorMessage }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type ISelectOption from '@/types/selectOption';
import { useField } from 'vee-validate';

interface Props {
  name: string
  label: string
  options: ISelectOption[]
  modelValue: string | number | boolean | null
}

const props = defineProps<Props>()

const { value, errorMessage } = useField(() => props.name, undefined, { syncVModel: true })
</script>