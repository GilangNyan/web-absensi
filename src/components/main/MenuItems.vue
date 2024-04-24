<template>
  <RouterLink :to="href" class="menus" v-if="!hasChild">
    <span class="group flex flex-1 px-4 py-3 space-x-3 items-center">
      <component :is="heroIcons[icon]" class="w-4 h-4" />
      <span class="font-medium">{{ simpleLanguage(title) }}</span>
    </span>
  </RouterLink>
  <div class="parent flex flex-col overflow-hidden" v-else>
    <a href="#" class="menus has-child w-full items-center cursor-pointer z-10" @click.prevent="toggleSubmenu()">
      <span class="group flex flex-1 px-4 py-3 space-x-3 items-center">
        <component :is="heroIcons[icon]" class="w-4 h-4" />
        <span class="font-medium">{{ simpleLanguage(title) }}</span>
      </span>
      <component :is="heroIcons['ChevronLeftIcon']" class="w-4 h-4 mr-1 transition-all" :class="submenuOpen ? '-rotate-90' : ''" />
    </a>
    <Transition name="slide-down">
      <div class="flex flex-col" v-show="submenus?.length != 0 && submenuOpen">
        <RouterLink :to="item.url" v-for="(item, index) in submenus" :key="index" class="w-full ml-8 pl-5 py-2 text-[13px] text-gray-300 hover:text-white hover:bg-indigo-500 rounded-l-full">
          <span class="font-medium">{{ simpleLanguage(item.name) }}</span>
        </RouterLink>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { simpleLanguage } from '@/utils/utilities';
import * as heroIcons from '@heroicons/vue/24/solid';
import type { Ref } from 'vue';
import { ref } from 'vue';

interface Props {
  title: string
  href: string
  icon: string
  hasChild: boolean
  submenus?: any[]
}

defineProps<Props>()

let submenuOpen: Ref<boolean> = ref(false)

const toggleSubmenu = (): void => {
  submenuOpen.value = !submenuOpen.value
}
</script>

<style scoped>
.menus {
  @apply flex px-2 hover:bg-indigo-500 text-[13px] text-gray-300 hover:text-white rounded-l-full uppercase font-semibold
}

.router-link-active {
  @apply bg-white text-indigo-600 hover:bg-gray-200 hover:text-indigo-600 rounded-l-full
}

.slide-down-enter-from,
.slide-down-leave-to {
  @apply -translate-y-1/2 opacity-0
}

.slide-down-leave-from,
.slide-down-enter-to {
  @apply translate-y-0 opacity-100
}

.slide-down-enter-active,
.slide-down-leave-active {
  @apply transition-all duration-500
}

a.has-child:has(+div .router-link-active) {
  @apply bg-white text-indigo-600 hover:bg-gray-200
}

.parent a.router-link-active {
  @apply bg-indigo-200 text-indigo-600 hover:bg-indigo-300
}
</style>