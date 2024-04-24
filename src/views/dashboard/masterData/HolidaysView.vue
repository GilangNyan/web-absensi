<template>
  <div class="flex flex-col">
    <h1 class="font-bold text-indigo-900 text-2xl">{{ $t('title.holidaysData') }}</h1>
    <BreadCrumbs />
  </div>
  <TableCustom :columns="columns" :rows="rows" @search="search($event)">
    <template #right-panel>
      <ButtonRoundedWithIcon color="indigo" :label="$t('label.sync')" @click="sync()" :is-reversed-color="true">
        <ArrowPathIcon class="w-4 h-4" />
      </ButtonRoundedWithIcon>
      <ButtonRoundedWithIcon color="indigo" :label="$t('label.add')" @click="goToPage('/master-data/holidays/add')">
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
import { useModalStore } from '@/stores/modal';
import { useDataStore } from '@/stores/data';
import type { Ref } from 'vue';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import holidayServices from '@/services/masterData/holidayServices';
import { formatFullDate, handleErrorResponse, simpleLanguage } from '@/utils/utilities';
import type { AxiosResponse } from 'axios';
import TablePagination from '@/components/main/TablePagination.vue';
import { PlusIcon, ArrowPathIcon } from '@heroicons/vue/24/solid';
import router from '@/router';
import { useToasterStore } from '@/stores/toaster';
import BreadCrumbs from '@/components/main/BreadCrumbs.vue';
import ButtonRoundedWithIcon from '@/components/buttons/ButtonRoundedWithIcon.vue';
import ButtonDropdownActions from '@/components/buttons/ButtonDropdownActions.vue';

const lang = useI18n()

const modalStore = useModalStore()
const dataStore = useDataStore()
const toastStore = useToasterStore()

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
  await holidayServices.getHoliday(req).then((result: AxiosResponse) => {
    let datas = result.data.data
    totalItems.value = datas.totalItems
    totalPages.value = datas.totalPages
    datas.rows.map((items: any) => {
      let entry: object = {
        name: items.name,
        date: formatFullDate(items.date),
        description: items.description,
        actions: items
      }
      rows.value.push(entry)
    })
  }).catch((error: any) => {
    console.log(error)
    handleErrorResponse(error)
  })
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

const goToPage = (route: string, data?: any): void => {
  if (data != undefined) {
    dataStore.setData(data)
    dataStore.setStatus('U')
  } else {
    dataStore.setStatus('I')
  }
  router.push(route)
}

const sync = (): void => {
  holidayServices.syncHoliday().then((result) => {
    if (result.data.message.includes('Success')) {
      toastStore.success({ text: lang.t('success.success'), message: simpleLanguage(result.data.message) })
      getData()
    }
  }).catch((error) => {
    console.log(error)
    handleErrorResponse(error)
  })
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