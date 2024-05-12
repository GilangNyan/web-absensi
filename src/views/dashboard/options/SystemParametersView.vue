<template>
  <div class="flex flex-col">
    <h1 class="font-bold text-indigo-900 text-2xl">{{ $t('title.systemParameters') }}</h1>
    <BreadCrumbs />
  </div>
  <TableCustom :columns="columns" :rows="rows">
    <template #cell(actions)="{value}">
      <div class="flex items-center space-x-1 justify-center">
        <ButtonDropdownActions
          :hide-view="true"
          :hide-delete="true"
          @action="handleClickActions($event, value)"
        />
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
import BreadCrumbs from '@/components/main/BreadCrumbs.vue';
import { computed, onMounted, ref, watch, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import systemParametersServices from '@/services/options/systemParametersServices';
import type { AxiosResponse } from 'axios';
import { handleErrorResponse, simpleLanguage } from '@/utils/utilities';
import ButtonDropdownActions from '@/components/buttons/ButtonDropdownActions.vue';
import { useDataStore } from '@/stores/data';
import { useModalStore } from '@/stores/modal';
import type TCrudStatus from '@/types/status';
import SystemParameterFormModal from '@/components/modals/forms/SystemParameterFormModal.vue';
import { useToasterStore } from '@/stores/toaster';

const lang = useI18n()
const dataStore = useDataStore()
const modalStore = useModalStore()
const toastStore = useToasterStore()

const columns: Ref = ref([
  {
    name: 'name',
    title: lang.t('tableHead.name')
  },
  {
    name: 'value',
    title: lang.t('tableHead.value')
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

let selectedData: Ref<any> = ref('')

const isModalStateConfirmed = computed(() => {
  return modalStore.isConfirmed
})

watch(isModalStateConfirmed, () => {
  if (modalStore.isConfirmed) {
    if (dataStore.status == 'I' || dataStore.status == 'U') {
      getData()
    } else if (dataStore.status == 'D') {
      deleteData()
    }
  }
})

const getData = async (): Promise<void> => {
  let payload = {
    page: page.value,
    perPage: perPage.value,
    search: searchData.value
  }
  rows.value = []
  await systemParametersServices.getSystemParameters(payload).then((result: AxiosResponse) => {
    const data = result.data.data
    totalItems.value = data.totalItems
    totalPages.value = data.totalPages
    data.rows.forEach((item: any) => {
      const { key: name, ...rest } = item
      const updatedObject = { name, ...rest }
      let entry: object = {
        name: item.key,
        value: item.value,
        description: simpleLanguage(item.description),
        actions: updatedObject // item
      }
      rows.value.push(entry)
    })
  }).catch((error: unknown) => {
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

const handleClickActions = (event: string, value: any): void => {
  if (event === 'update') {
    triggerSystemParameterFormModal('U', value)
  }
  if (event === 'delete') {
    dataStore.setStatus('D')
    confirmationDelete(value)
  }
}

const triggerSystemParameterFormModal = (actions: TCrudStatus, data?: any): void => {
  dataStore.setStatus(actions)
  modalStore.openModal({ component: SystemParameterFormModal, props: data })
}

const confirmationDelete = (data: any): void => {
  selectedData.value = data
  modalStore.openConfirmationModal(lang.t('label.confirm'), lang.t('description.actionsConfirmation', { actions: lang.t('label.delete').toLowerCase() }))
}

const deleteData = async (): Promise<void> => {
  const payload = {
    id: selectedData.value.id
  }
  await systemParametersServices.saveSystemParameters(payload)!.then((result: AxiosResponse) => {
    toastStore.success({ text: lang.t('success.success'), message: lang.t('success.save', { name: result.data.data.name })})
    getData()
  }).catch((error: any) => {
    handleErrorResponse(error)
    console.log(error)
  })
}

onMounted(() => {
  getData()
})
</script>