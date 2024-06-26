<template>
  <div class="min-h-dvh flex font-poppins">
    <!-- Left Section -->
    <div class="grow flex flex-col justify-center items-center w-full sm:w-7/12 bg-gray-100">
      <!-- Card -->
      <div class="bg-white p-8 w-11/12 sm:w-96 rounded-lg border border-t-2 border-gray-200 border-t-indigo-600 shadow-md space-y-8">
        <slot />
      </div>
    </div>
    <!-- Right Section -->
    <div class="hidden sm:flex sm:flex-col sm:w-5/12 justify-center items-center bg-gradient-to-tr from-indigo-700 to-indigo-500 space-y-8">
      <img src="@/assets/images/tutwuri.png" alt="Logo Tut Wuri Handayani" class="w-40 drop-shadow-lg">
      <h2 class="text-3xl font-bold text-white uppercase text-center">E-Absensi<br>SMAN 1 Beber</h2>
      <img src="@/assets/images/qr.png" alt="QR" class="w-72 drop-shadow-lg">
    </div>
  </div>
  <ToasterNotifications />
</template>

<script setup lang="ts">
import ToasterNotifications from '@/components/main/ToasterNotifications.vue';

</script>