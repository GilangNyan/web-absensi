<template>
  <div class="flex justify-between items-center">
    <div class="text-xs text-gray-600 space-x-2">
      <span>{{ $t('showing') }}</span>
      <select
        name="perPage"
        id="perPage"
        class="border rounded-lg px-2 py-1"
        v-model="pageLimit"
        @change="changeLimit(pageLimit)"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      <span>{{ $t('paginationCount', {first: paginationFrom, last: paginationTo, total: totalItems}) }}</span>
    </div>
    <nav class="inline-flex shadow-sm" aria-label="Pagination">
      <a
        href="#"
        class="paging-button"
        :class="{ 'cursor-not-allowed bg-gray-200' : isFirstPage }"
        :disabled="isFirstPage"
        @click.prevent="changePage(currentPage - 1)"
      >
        <ChevronLeftIcon class="h-3 w-3" />
      </a>
      <a
        href="#"
        aria-current="page"
        class="paging-button"
        @click.prevent="changePage(1)"
        v-if="hasFirst"
      >
        1
      </a>
      <span
        class="paging-button"
        v-if="hasFirst"
      >
        ...
      </span>
      <a
        href="#"
        aria-current="page"
        v-for="(page, index) in calculatedPages"
        :key="index"
        class="paging-button"
        :class="{ 'bg-blue-500 hover:!bg-blue-400 !text-white' : currentPage == page }"
        @click.prevent="changePage(page)"
      >
        {{ page }}
      </a>
      <span
        class="paging-button"
        v-if="hasLast"
      >
        ...
      </span>
      <a
        href="#"
        aria-current="page"
        class="paging-button"
        @click.prevent="changePage(totalPages)"
        v-if="hasLast"
      >
        {{ totalPages }}
      </a>
      <a
        href="#"
        class="paging-button"
        :class="{ 'cursor-not-allowed bg-gray-200' : isLastPage }"
        :disabled="isLastPage"
        @click.prevent="changePage(currentPage + 1)"
      >
        <ChevronRightIcon class="h-3 w-3 text-gray-600" />
      </a>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';
import type { Ref } from 'vue';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { computed } from 'vue';

interface Props {
  currentPage: number
  perPage: number
  totalItems: number
  totalPages: number
}

const props = defineProps<Props>()

const emits = defineEmits<{
  pageChanged: [page: number]
  pageLimit: [limit: number]
}>()

const pageRange: number = 2

let pageLimit: Ref<number> = ref(5)

// Computed
const isFirstPage = computed<boolean>(() => {
  return props.currentPage === 1
})
const isLastPage = computed<boolean>(() => {
  return props.currentPage >= props.totalPages
})
const rangeStart = computed<number>(() => {
  let start: number = props.currentPage - pageRange
  return (start > 0) ? start : 1 
})
const rangeEnd = computed<number>(() => {
  let end: number = props.currentPage + pageRange
  return (end < props.totalPages) ? end : props.totalPages
})
const hasFirst = computed<boolean>(() => {
  return rangeStart.value !== 1
})
const hasLast = computed<boolean>(() => {
  return rangeEnd.value !== props.totalPages
})
const calculatedPages = computed(() => {
  let pages = []
  for (let i = rangeStart.value; i <= rangeEnd.value; i++) {
    pages.push(i)
  }
  return pages
})
const paginationFrom = computed<number>(() => {
  return (props.perPage * (props.currentPage - 1)) + 1
})
const paginationTo = computed<number>(() => {
  let end: number = props.currentPage * props.perPage
  return (props.totalItems < end) ? props.totalItems : end
})

// Function
const changePage = (page: number) => {
  if (page > 0 && page <= props.totalPages) {
    emits('pageChanged', page)
  }
}
const changeLimit = (limit: number) => {
  emits('pageLimit', limit)
}

onMounted(() => {
  pageLimit.value = props.perPage
})
</script>

<style scoped>
.paging-button {
  @apply inline-flex items-center p-2 first:rounded-l-lg last:rounded-r-lg border text-xs font-medium text-gray-600 hover:bg-gray-100 min-w-8 justify-center
}
</style>