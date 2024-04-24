<template>
  <div class="flex items-center space-x-1">
    <HomeIcon class="w-4 h-4 text-indigo-600" />
    <div v-for="(item, index) in breadcrumbs" :key="index" class="flex space-x-1 items-center">
      <ChevronRightIcon class="w-3 h-3 text-indigo-600" v-if="checkNotEmpty(item.title)" />
      <RouterLink :to="item.href" v-if="index != 1" class="text-xs text-indigo-600">
        {{ capitalizeFirstLetter(characterToSpace(item.title, '-')) }}
      </RouterLink>
      <div v-else class="text-xs text-indigo-600">
        {{ capitalizeFirstLetter(characterToSpace(item.title, '-')) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { HomeIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { Ref } from 'vue';
import { capitalizeFirstLetter, characterToSpace, checkNotEmpty } from '@/utils/utilities';

interface IBreadcrumbs {
  title: string,
  href: string
}

const route = useRoute()
let breadcrumbs: Ref<IBreadcrumbs[]> = ref([])

const itemWithLink = (): void => {
  let splitBySlash = route.path.split('/')
  splitBySlash.map((items) => {
    let entry: IBreadcrumbs = {
      title: items,
      href: route.path.substring(0, route.path.indexOf(items) + items.length)
    }
    breadcrumbs.value.push(entry)
  })
}

onMounted(() => {
  itemWithLink()
})
</script>