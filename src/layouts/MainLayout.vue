<template>
  <div class="min-h-screen flex font-poppins bg-indigo-50">
    <SideNavbar :sidebar-open="sidebarOpen" :screen-width="screenWidth" @update="handleSidebarUpdate" />
    <div class="flex flex-col w-full">
      <!-- <TopNavbar :value="sidebarOpen" @update="handleSidebarUpdate" /> -->
      <TitleBar :value="sidebarOpen" @update="handleSidebarUpdate" />
      <div class="p-4 font-inter flex flex-col space-y-4">
        <slot />
      </div>
    </div>
  </div>
  <!-- <ToasterNotifications /> -->
  <ModalWindow />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import SideNavbar from '@/components/main/SideNavbar.vue'
// import TopNavbar from '@/components/main/TopNavbar.vue'
import TitleBar from '@/components/main/TitleBar.vue'
// import ToasterNotifications from '@/components/main/ToasterNotifications.vue';
import ModalWindow from '@/components/main/ModalWindow.vue';

let sidebarOpen: Ref<boolean> = ref(true)
let screenWidth: Ref<number> = ref(0)

const onScreenResize = (): void => {
  window.addEventListener('resize', () => {
    updateScreenWidth()
  })
}

const updateScreenWidth = (): void => {
  screenWidth.value = window.innerWidth
  if (screenWidth.value <= 640) {
    sidebarOpen.value = false
  } else {
    sidebarOpen.value = true
  }
}

const handleSidebarUpdate = (val: boolean): void => {
  sidebarOpen.value = val
  // console.log(sidebarOpen.value)
}

onMounted(() => {
  onScreenResize()
  updateScreenWidth()
})
</script>

