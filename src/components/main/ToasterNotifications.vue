<template>
  <Teleport to="body">
    <div
      class="fixed z-20 top-4 right-4 flex flex-col-reverse"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasterStore.toasts"
          :key="toast.text"
          class="flex min-w-64 items-center p-2 space-x-2 text-gray-800 rounded-lg shadow mb-2 font-medium"
          :class="[toastColorMap[toast.status]]"
          role="alert"
        >
          <div
            class="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-lg"
            :class="[toastIconMap[toast.status]]"
          >
            <CheckCircleIcon class="w-8 h-8" v-if="toast.status == 'success'" />
            <ExclamationCircleIcon class="w-8 h-8" v-if="toast.status == 'warning'" />
            <InformationCircleIcon class="w-8 h-8" v-if="toast.status == 'info'" />
            <XCircleIcon class="w-8 h-8" v-if="toast.status == 'error'" />
          </div>
          <div class="flex flex-col space-y-1">
            <span class="text-sm">{{ toast.text }}</span>
            <span class="text-xs">{{ toast.message }}</span>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToasterStore, type TToastStatus } from '@/stores/toaster';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid';

const toasterStore = useToasterStore()

const toastColorMap: Record<TToastStatus, string> = {
  info: 'bg-cyan-100',
  success: 'bg-green-100',
  warning: 'bg-yellow-100',
  error: 'bg-red-100'
}

const toastIconMap: Record<TToastStatus, string> = {
  info: 'bg-cyan-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-red-500 text-white'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  @apply transition-all duration-500 ease-in-out
}

.toast-enter-from,
.toast-leave-to {
  @apply opacity-0 translate-x-8
}
</style>