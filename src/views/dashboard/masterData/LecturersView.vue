<template>
  <div class="flex flex-col">
    <h1 class="font-bold text-indigo-900 text-2xl">{{ $t('title.lecturersData') }}</h1>
    <BreadCrumbs />
  </div>
  <TableCustom :columns="columns" :rows="rows" @search="search($event)">
    <template #right-panel>
      <ButtonRoundedWithIcon color="indigo" :label="$t('label.add')">
        <PlusIcon class="w-4 h-4" />
      </ButtonRoundedWithIcon>
    </template>
    <template #cell(actions)="{value}">
      <div class="flex items-center space-x-1 justify-center">
        <ButtonDropdownActions :hide-view="true" @action="handleClickActions($event, value)" />
      </div>
    </template>
  </TableCustom>
  <TablePagination
    :current-page="page"
    :per-page="perPage"
    :total-items="totalItems"
    :total-pages="totalPages"
    @page-changed="paginationRequest($event)"
    @page-limit="changePageLimit($event)"
  />
</template>

<script setup lang="ts">
import TableCustom from '@/components/main/TableCustom.vue';
import TablePagination from '@/components/main/TablePagination.vue';
import { ref, onMounted, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { PlusIcon } from '@heroicons/vue/24/solid';
import BreadCrumbs from '@/components/main/BreadCrumbs.vue';
import ButtonRoundedWithIcon from '@/components/buttons/ButtonRoundedWithIcon.vue';
import ButtonDropdownActions from '@/components/buttons/ButtonDropdownActions.vue';
import { useModalStore } from '@/stores/modal';

const lang = useI18n()
const modalStore = useModalStore()

const columns: Ref = ref([
  {
    name: 'name',
    title: lang.t('tableHead.name')
  },
  {
    name: 'date',
    title: lang.t('tableHead.date')
  },
  {
    name: 'description',
    title: lang.t('tableHead.description')
  },
  {
    name: 'actions',
    title: lang.t('tableHead.actions')
  }
])

const rows: Ref = ref([])

// Pagination Variable
let page: Ref<number> = ref(1)
let perPage: Ref<number> = ref(10)
let totalItems: Ref<number> = ref(0)
let totalPages: Ref<number> = ref(0)
let searchData: Ref<string> = ref('')

  const getData = async (): Promise<void> => {
  let req = {
    page: page.value,
    perPage: perPage.value,
    search: searchData.value
  }
  rows.value = []
}

const paginationRequest = (event: number): void => {
  page.value = event
  getData()
}

const changePageLimit = (event: number): void => {
  page.value = 1
  perPage.value = event
  getData()
}

const search = (event: string): void => {
  page.value = 1
  searchData.value = event
  getData()
}

const handleClickActions = (event: string, value: any): void => {
  if (event === 'delete') {
    confirmationDelete(value)
  }
}

const confirmationDelete = (data: any): void => {
  modalStore.openConfirmationModal(lang.t('label.confirm'), lang.t('description.actionsConfirmation', { actions: lang.t('label.delete').toLowerCase() }))
}

onMounted(() => {
  getData()
})
</script>