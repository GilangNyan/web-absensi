<template>
  <div class="flex flex-col min-h-dvh bg-gradient-to-tr from-white to-indigo-500 items-center justify-center space-y-12">
    <div class="flex flex-col w-full items-center justify-center space-x-4">
      <div class="flex w-10/12 space-x-4">
        <div class="w-3/4 rounded-lg">
          <QrCamera />
        </div>
        <div class="w-1/4 grid grid-rows-4 gap-4">
          <div class="side-button">
            <span class="card-label">{{ $t('label.time') }}</span>
            <h3 class="card-value flex-grow">{{ currentTime }}</h3>
          </div>
          <div class="side-button">
            <span class="card-label">{{ $t('label.name') }}</span>
          </div>
          <button class="side-button confirm"></button>
          <button class="side-button back" @click.prevent="goToPage('/')">
            {{ $t('label.back') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QrCamera from '@/components/main/QrCamera.vue';
import router from '@/router';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';

const currentTime: Ref<string> = ref(new Date().toLocaleTimeString())

const goToPage = (route: string): void => {
  router.push(route)
}

const updateTime = (): void => {
  currentTime.value = new Date().toLocaleTimeString()
}

let interval: number

onMounted(() => {
  interval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.side-button {
  @apply bg-white hover:bg-gray-100 rounded-lg px-4 py-2 shadow-lg
}

.confirm {
  @apply bg-blue-500 hover:bg-blue-600 text-lg font-bold text-white
}

.back {
  @apply bg-red-500 hover:bg-red-600 text-lg font-bold text-white
}

.card-label {
  @apply text-xs font-medium
}

.card-value {
  @apply text-xl font-bold
}
</style>