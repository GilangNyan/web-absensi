<template>
  <div class="space-y-1">
    <label :for="name" class="text-xs text-gray-600">
      {{ label }}
    </label>
    <div class="w-full relative">
      <input
        :type="type == 'password' ? (viewPassword ? 'text' : type) : type"
        :name="name"
        :id="name"
        class="w-full border border-gray-200 placeholder-gray-200 focus:outline-none focus:ring-1 rounded-lg text-sm"
        :class="errorMessage != null ? 'focus:border-red-500 focus:ring-red-500 border-red-500' : 'focus:border-cyan-500 focus:ring-cyan-500',
          type == 'password' ? 'pl-2 pr-10 py-2' : 'p-2'"
        v-model="value"
      >
      <button type="button" class="absolute top-1.5 right-2" v-if="type == 'password'" @click="view()">
        <EyeIcon class="h-6 w-6 text-gray-500" v-if="!viewPassword" />
        <EyeSlashIcon class="h-6 w-6 text-gray-500" v-else />
      </button>
    </div>
    <span class="text-red-500 text-xs text-center justify-center w-full flex font-semibold">
      {{ errorMessage }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useField } from 'vee-validate'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'

interface Props {
  name: string
  label: string
  type: string
  modelValue: string
}

let viewPassword: Ref<boolean> = ref(false)

const props = defineProps<Props>()

const { value, errorMessage } = useField(() => props.name, undefined, { syncVModel: true })

const view = () => {
  return viewPassword.value = !viewPassword.value
}
</script>