<template>
  <div>
    <label
      :for="name"
      class="block mb-2 text-sm font-medium text-gray-600"
    >
      {{ label }}
    </label>
    <input
      :type="type"
      :name="name"
      :id="name"
      class="p-2 shadow-sm text-gray-800 w-full border border-gray-200 placeholder-gray-200 focus:outline-none focus:ring-1 rounded-lg text-sm"
      :class="errorMessage != null ? 'focus:border-red-500 focus:ring-red-500 border-red-500' : 'focus:border-cyan-500 focus:ring-cyan-500'"
      v-model="value"
      :required="required"
      v-if="type != 'textarea'"
    >
    <textarea
      :name="name"
      :id="name"
      rows="4"
      class="p-2 shadow-sm text-gray-800 w-full border border-gray-200 placeholder-gray-200 focus:outline-none focus:ring-1 rounded-lg text-sm resize"
      :class="errorMessage != null ? 'focus:border-red-500 focus:ring-red-500 border-red-500' : 'focus:border-cyan-500 focus:ring-cyan-500'"
      v-model="value"
      v-else
    ></textarea>
    <span class="text-red-500 text-xs text-center justify-center w-full flex font-semibold">
      {{ errorMessage }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';

interface Props {
  name: string
  label: string
  modelValue: string | number | null
  required?: boolean
  type?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
})

const { value, errorMessage } = useField(() => props.name, undefined, { syncVModel: true })
</script>