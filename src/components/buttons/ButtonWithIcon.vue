<template>
  <button
    class="px-3 py-2 rounded-lg flex items-center space-x-1"
    :class="buttonColorMap[color]"
    :disabled="disabled"
    :type="type"
    :form="form"
  >
    <slot />
    <span class="text-xs font-medium">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
type TButtonColor = 'red' | 'green' | 'blue' | 'yellow' | 'orange' | 'gray'
type ButtonTypes = 'button' | 'submit' | 'reset' | undefined

interface Props {
  color: TButtonColor
  label: string
  disabled?: boolean
  type?: ButtonTypes
  form?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  type: 'button',
  form: '',
  loading: false
})

const buttonColorMap: Record<TButtonColor, string> = {
  'red': 'bg-red-500 text-white hover:bg-red-400 disabled:bg-red-400',
  'green': 'bg-green-500 text-white hover:bg-green-400 disabled:bg-green-400',
  'blue': 'bg-blue-500 text-white hover:bg-blue-400 disabled:bg-blue-400',
  'yellow': 'bg-yellow-500 text-gray-600 hover:bg-yellow-400 disabled:bg-yellow-400',
  'orange': 'bg-orange-500 text-white hover:bg-orange-400 disabled:bg-orange-400',
  'gray': 'bg-gray-300 text-gray-800 hover:bg-gray-200 disabled:bg-gray-200 disabled:text-gray-600'
}
</script>