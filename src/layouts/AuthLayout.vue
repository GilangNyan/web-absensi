<template>
  <div class="min-h-screen flex flex-col font-poppins">
    <div class="grow flex flex-col justify-center items-center bg-gray-100 space-y-8">
      <!-- Logo -->
      <div class="h-16 w-16 bg-gray-300 rounded-full"></div>
      <!-- Main Card -->
      <div class="bg-white w-11/12 p-8 sm:w-96 rounded-lg border border-gray-200 shadow-sm space-y-8">
        <slot />
      </div>
      <!-- Text -->
      <div class="inline-flex items-center">
        <hr class="bg-gray-300 w-72 h-0.5 border-0 rounded">
        <span class="absolute text-sm bg-gray-100 text-gray-500 -translate-x-1/2 left-1/2 px-1.5 text-center">{{ $t('appName') }}</span>
      </div>
    </div>
    <!-- Footer -->
    <footer class="bg-white p-4 flex justify-center items-center border-t border-gray-200 shadow-sm w-full">
      <span class="text-xs text-gray-500">&copy; 2024 Gilang Saeful Anwar</span>
    </footer>
    <ToasterNotifications />
  </div>
</template>

<script setup lang="ts">
import ToasterNotifications from '@/components/main/ToasterNotifications.vue';

</script>