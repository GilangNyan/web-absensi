<template>
  <button
    class="px-4 py-2 rounded-full flex items-center space-x-1"
    :class="buttonColorMap[color]"
    :disabled="disabled"
    :type="type"
    :form="form"
  >
    <template v-if="loading">
      <svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="text-xs font-medium">{{ $t('label.processing') }}</span>
    </template>
    <template v-else>
      <slot></slot>
      <span class="text-xs font-medium">{{ label }}</span>
    </template>
  </button>
</template>

<script setup lang="ts">
type TButtonColor = 'red' | 'green' | 'blue' | 'yellow' | 'orange' | 'gray' | 'indigo'
type ButtonTypes = 'button' | 'submit' | 'reset' | undefined

interface Props {
  color: TButtonColor
  label: string
  disabled?: boolean
  type?: ButtonTypes
  form?: string
  loading?: boolean
  isReversedColor?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  type: 'button',
  form: '',
  loading: false,
  isReversedColor: false
})

const buttonColorMap: Record<TButtonColor, string> = {
  'red': 'bg-red-500 text-white hover:bg-red-400 disabled:bg-red-400',
  'green': 'bg-green-500 text-white hover:bg-green-400 disabled:bg-green-400',
  'blue': 'bg-blue-500 text-white hover:bg-blue-400 disabled:bg-blue-400',
  'yellow': 'bg-yellow-500 text-gray-600 hover:bg-yellow-400 disabled:bg-yellow-400',
  'orange': 'bg-orange-500 text-white hover:bg-orange-400 disabled:bg-orange-400',
  'gray': 'bg-gray-300 text-gray-800 hover:bg-gray-200 disabled:bg-gray-200 disabled:text-gray-600',
  'indigo': props.isReversedColor ?
    'bg-indigo-50 text-indigo-600 hover:bg-indigo-200 border-2 border-indigo-600 font-bold disabled:bg-gray-100 disabled:border-gray-400 disabled:text-gray-400' : 
    'bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-indigo-400'
}
</script>