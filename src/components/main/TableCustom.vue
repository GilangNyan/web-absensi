<template>
  <div class="flex justify-between items-center text-xs">
    <div class="flex items-center space-x-2">
      <div class="flex items-center" v-if="!hideSearch">
        <div class="p-2 bg-white border-l border-y border-gray-200 rounded-l-full">
          <MagnifyingGlassIcon class="w-4 h-4 text-indigo-600" />
        </div>
        <input
          type="text"
          name="table-search"
          id="table-search"
          class="border-r border-y rounded-r-full p-2 focus:border-cyan-500 focus:ring-cyan-500"
          v-model.lazy="search"
          @change="emitSearch(search)"
          :placeholder="$t('label.search')"
        >
      </div>
      <!-- Top Left Panel after Search Field -->
      <slot name="left-panel">
        <!--  -->
      </slot>
    </div>
    <div class="flex items-center space-x-2">
      <!-- Top Right Panel -->
      <slot name="right-panel">
        <!--  -->
      </slot>
    </div>
  </div>
  <div class="relative border rounded-lg bg-white overflow-x-auto">
    <table class="table-auto min-w-full text-sm overflow-x-scroll">
      <thead class="text-gray-800 font-medium text-xs border-b-2">
        <tr>
          <th 
            scope="col"
            class="px-6 py-3"
            :class="item.name == 'actions' ? 'w-32' : ''"
            v-for="(item, index) in columns" :key="index"
            :colspan="item.colspan || 1"
            :rowspan="item.rowspan || 1"
          >
            <span class="flex items-center justify-center space-x-1">
              <span>{{ item.title }}</span>
              <BarsArrowDownIcon
                class="h-3 w-3 cursor-pointer"
                :class="sort?.sort == item.name? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'"
                v-if="item.sortable && ((sort?.sort != item.name) || (sort.sort == item.name && sort.dir == 'ASC'))"
                @click="emitSort(item.name, sort?.sort == item.name ? 'DESC': 'ASC')"
              />
              <BarsArrowUpIcon
                class="h-3 w-3 cursor-pointer"
                :class="sort?.sort == item.name? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'"
                v-if="item.sortable && (sort?.sort == item.name && sort.dir == 'DESC')"
                @click="emitSort(item.name, 'ASC')"
              />
            </span>
          </th>
        </tr>
      </thead>
      <tbody class="text-gray-800 text-xs">
        <template v-if="perPage && currentPage">
          <tr class="border-b hover:bg-gray-100" v-for="(item, index) in paginatedRows" :key="index">
            <td class="px-6 py-2" v-for="(colItem, colIndex) in columns" :key="colIndex">
              <slot
                :name="`cell(${colItem.name})`"
                :value="item[colItem.name]"
                :item="item"
              >
                {{ item[colItem.name] }}
              </slot>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr class="border-b hover:bg-gray-100" v-for="(item, index) in rows" :key="index">
            <td class="px-6 py-2" v-for="(colItem, colIndex) in columns" :key="colIndex">
              <slot
                :name="`cell(${colItem.name})`"
                :value="item[colItem.name]"
                :item="item"
              >
                {{ item[colItem.name] }}
              </slot>
            </td>
          </tr>
        </template>
        <tr class="border-b hover:bg-gray-100" v-if="rows.length == 0">
          <td :colspan="columns.length" class="px-6 py-3 text-center">{{ $t('label.noData') }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type IOrder from '@/types/order';
import { BarsArrowDownIcon, BarsArrowUpIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import { computed, ref, type Ref } from 'vue';

interface Fields {
  name: string
  title: string
  sortable?: boolean
  colspan?: number
  rowspan?: number
}

interface Props {
  columns: Array<Fields>
  rows: Array<any>
  currentPage?: number
  perPage?: number
  sort?: IOrder
  hideSearch?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hideSearch: false
})
const emits = defineEmits<{
  search: [entry: string],
  order: [value: IOrder]
}>()

let search: Ref<string> = ref('')

const emitSearch = (entry: string): void => {
  emits('search', entry)
}

const paginatedRows = computed<any>(() => {
  return props.rows.slice((props.currentPage! - 1) * props.perPage!, props.currentPage! * props.perPage!)
})

const emitSort = (name: string, dir: string) => {
  let val: IOrder = { sort: name, dir: dir }
  emits('order', val)
}
</script>