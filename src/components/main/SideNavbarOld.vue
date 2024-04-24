<template>
  <div :class="props.sidebarOpen && props.screenWidth <= 640 ? 'absolute flex w-full h-screen' : 'flex w-fit h-screen'">
    <Transition name="slide-left">
      <aside
        class="bg-white w-60 h-screen shadow-sm border border-l border-gray-200"
        :class="props.screenWidth <= 640 ? 'z-30 absolute' : ''"
        v-show="props.sidebarOpen"
      >
        <div class="flex items-center justify-center p-4 font-extrabold">
          <h1><span class="text-blue-500">SIP</span>admin</h1>
        </div>
        <hr>
        <div class="py-2">
          <template v-for="(item, index) in menus" :key="index">
            <MenuItems :title="item.name" :href="item.url" :icon="item.icon" :has-child="item.hasChild" :submenus="item.submenus"/>
          </template>
        </div>
      </aside>
    </Transition>
    <Transition name="fade">
      <div
        class="grow bg-gray-800 bg-opacity-50"
        v-show="props.sidebarOpen && props.screenWidth <= 640"
        @click="toggleSidebar()"
      ></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import MenuItems from './MenuItems.vue';
import { onMounted } from 'vue';

interface Props {
  sidebarOpen: boolean
  screenWidth: number
}

const props = defineProps<Props>()

const emits = defineEmits<{
  update: [sidebar: boolean]
}>()

const toggleSidebar = () => {
  emits('update', !props.sidebarOpen)
}

const authStore = useAuthStore()

let menus: any = authStore.menu

onMounted(() => {
  console.log(menus)
})
</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  @apply opacity-0
}

.fade-leave-from,
.fade-enter-to {
  @apply opacity-100
}

.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-500
}

.slide-left-enter-from,
.slide-left-leave-to {
  @apply -translate-x-60
}

.slide-left-leave-from,
.slide-left-enter-to {
  @apply translate-x-0
}

.slide-left-enter-active,
.slide-left-leave-active {
  @apply transition-transform duration-500
}
</style>