<template>
  <div class="flex flex-col">
    <h1 class="font-bold text-indigo-900 text-2xl">{{ $t('title.manageRoles') }}</h1>
    <BreadCrumbs />
  </div>
  <TableCustom :columns="columns" :rows="rows" @search="search($event)">
    <template #right-panel>
      <ButtonRoundedWithIcon color="indigo" :label="$t('label.add')" @click="triggerRoleFormModal('I')">
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
import ButtonDropdownActions from '@/components/buttons/ButtonDropdownActions.vue';
import ButtonRoundedWithIcon from '@/components/buttons/ButtonRoundedWithIcon.vue';
import BreadCrumbs from '@/components/main/BreadCrumbs.vue';
import TableCustom from '@/components/main/TableCustom.vue';
import TablePagination from '@/components/main/TablePagination.vue';
import RoleFormModal from '@/components/modals/forms/RoleFormModal.vue';
import roleServices from '@/services/users/roleServices';
import { useDataStore } from '@/stores/data';
import { useModalStore } from '@/stores/modal';
import { useToasterStore } from '@/stores/toaster';
import type TCrudStatus from '@/types/status';
import { handleErrorResponse, simpleLanguage } from '@/utils/utilities';
import { PlusIcon } from '@heroicons/vue/24/solid';
import { onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const dataStore = useDataStore()
const modalStore = useModalStore()
const toastStore = useToasterStore()

const columns: Ref = ref([
  {
    name: 'name',
    title: t('tableHead.name')
  },
  {
    name: 'description',
    title: t('tableHead.description')
  },
  {
    name: 'actions',
    title: t('tableHead.actions')
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
  const req = {
    page: page.value,
    perPage: perPage.value,
    search: searchData.value
  }
  rows.value = []
  await roleServices.getRoles(req).then((result) => {
    totalPages.value = result.data.data.totalPages
    totalItems.value = result.data.data.totalItems
    result.data.data.rows.forEach((item: any) => {
      const entry = {
        name: item.name,
        description: simpleLanguage(item.description),
        actions: item
      }
      rows.value.push(entry)
    })
  }).catch((error) => {
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

const triggerRoleFormModal = (actions: TCrudStatus, data?: any): void => {
  dataStore.setStatus(actions)
  modalStore.openModal({ component: RoleFormModal, props: data })
  modalStore.onOk(() => {
    getData()
  })
}

const handleClickActions = (event: string, value: any): void => {
  if (event === 'update') {
    triggerRoleFormModal('U', value)
  }
  if (event === 'delete') {
    dataStore.setStatus('D')
    confirmationDelete(value)
  }
}

const confirmationDelete = (data: any): void => {
  modalStore.openConfirmationModal(t('label.confirm'), t('description.actionsConfirmation', { actions: t('label.delete').toLowerCase() }))
  modalStore.onOk(() => {
    deleteData(data)
  })
}

const deleteData = async (data: any): Promise<void> => {
  const payload = {
    id: data.id
  }
  await roleServices.deleteRoles(payload).then((result) => {
    toastStore.success({ text: t('success.success'), message: t('success.save', { name: result.data.data.name })})
    getData()
  }).catch((error: unknown) => {
    handleErrorResponse(error)
    console.error(error)
  })
}

onMounted(() => {
  getData()
})
</script>