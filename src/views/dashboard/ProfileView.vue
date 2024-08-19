<template>
  <div class="flex flex-col">
    <h1 class="font-bold text-indigo-900 text-2xl">{{ $t('title.userProfile') }}</h1>
    <BreadCrumbs />
  </div>
  <div class="flex flex-col space-y-4">
    <ChangePassword />
  </div>
</template>

<script setup lang="ts">
import ChangePassword from '@/components/forms/ChangePassword.vue';
import BreadCrumbs from '@/components/main/BreadCrumbs.vue';

</script>