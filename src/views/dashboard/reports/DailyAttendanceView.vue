<template>
  <div class="flex flex-col space-y-4">
    <h1 class="font-bold text-indigo-900 text-2xl">{{ $t('title.dailyAttendance') }}</h1>
    <BreadCrumbs />
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from '@/components/main/BreadCrumbs.vue';

</script>