<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import { RouterView } from 'vue-router'
import router from './router';
import layouts from './layouts';
import { useAuthStore } from './stores/auth';
// import VueJwtDecode from 'vue-jwt-decode';

const layout: any = shallowRef('div')
const authStore = useAuthStore()

// Pemilihan layout berdasarkan meta
router.afterEach((to) => {
  if (to.meta.layout === 'AuthLayout') {
    layout.value = layouts.AuthLayout
  } else if (to.meta.layout === 'BlankLayout') {
    layout.value = layouts.BlankLayout
  } else if (to.meta.layout === 'MainLayout') {
    layout.value = layouts.MainLayout
  } else if (to.meta.layout === 'DividedAuthLayout') {
    layout.value = layouts.DividedAuthLayout
  } else {
    layout.value = 'div'
  }
})

// Penjagaan route
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && (!authStore.token || !authStore.menu)) {
    next({
      path: '/login',
      query: {
        next: to.fullPath
      }
    })
  } else if (!to.meta.requiresAuth && (authStore.token || authStore.menu)) {
    // let tokenValue = VueJwtDecode.decode(authStore.token)
    // console.log(tokenValue)
    next('/dashboard')
  } else {
    next()
  }
})
</script>
