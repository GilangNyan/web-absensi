<template>
  <div class="flex flex-col">
    <h1 class="font-bold text-indigo-900 text-2xl">{{ $t('title.manageUser') }}</h1>
    <BreadCrumbs />
  </div>
  <TableCustom :columns="columns" :rows="rows" @search="search($event)">
    <template #right-panel>
      <ButtonRoundedWithIcon color="indigo" :label="$t('label.add')" @click="triggerUserFormModal('I')">
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
import UserFormModal from '@/components/modals/forms/UserFormModal.vue';
import userServices from '@/services/users/userServices';
import { useDataStore } from '@/stores/data';
import { useModalStore } from '@/stores/modal';
import type TCrudStatus from '@/types/status';
import { charStatus, handleErrorResponse } from '@/utils/utilities';
import { PlusIcon } from '@heroicons/vue/24/solid';
import { onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const dataStore = useDataStore()
const modalStore = useModalStore()

const columns: Ref = ref([
  {
    name: 'username',
    title: t('label.username')
  },
  {
    name: 'fullname',
    title: t('tableHead.fullname')
  },
  {
    name: 'email',
    title: t('label.email')
  },
  {
    name: 'role',
    title: t('label.role')
  },
  {
    name: 'status',
    title: t('tableHead.status')
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
  await userServices.getUsers(req).then((result) => {
    totalPages.value = result.data.data.totalPages
    totalItems.value = result.data.data.totalItems
    result.data.data.rows.forEach((item: any) => {
      const entry = {
        username: item.username,
        email: item.email,
        fullname: item.employees[0].fullname,
        roleId: item.role.id,
        role: item.role.name,
        status: charStatus(item.status),
        statusChar: item.status,
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

const triggerUserFormModal = (actions: TCrudStatus, data?: any): void => {
  dataStore.setStatus(actions)
  modalStore.openModal({ component: UserFormModal, props: data })
}

const handleClickActions = (event: string, value: any): void => {
  if (event === 'update') {
    triggerUserFormModal('U', value)
  }
  if (event === 'delete') {
    dataStore.setStatus('D')
    confirmationDelete(value)
  }
}

onMounted(() => {
  getData()
})
</script>