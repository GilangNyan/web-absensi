<template>
  <div class="flex flex-col">
    <h1 class="font-bold text-indigo-900 text-2xl">{{ $t('title.gradesData') }}</h1>
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
        <ButtonDropdownActions
          :hide-view="true"
          @action="handleClickActions($event, value)"
          :custom-options="customOptions"
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
import { ref, onMounted, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { PlusIcon } from '@heroicons/vue/24/solid';
import BreadCrumbs from '@/components/main/BreadCrumbs.vue';
import ButtonRoundedWithIcon from '@/components/buttons/ButtonRoundedWithIcon.vue';
import gradeServices from '@/services/masterData/gradeServices';
import type { AxiosResponse } from 'axios';
import { handleErrorResponse } from '@/utils/utilities';
import ButtonDropdownActions from '@/components/buttons/ButtonDropdownActions.vue';
import { useModalStore } from '@/stores/modal';
import type IDropdownItem from '@/types/dropdownItem';
import RegisterStudentGradeModal from '@/components/modals/RegisterStudentGradeModal.vue';

const lang = useI18n()
const modalStore = useModalStore()

const columns: Ref = ref([
  {
    name: 'name',
    title: lang.t('tableHead.name')
  },
  {
    name: 'actions',
    title: lang.t('tableHead.actions')
  }
])

const rows: Ref = ref([])
const datas: Ref = ref(null)

// Pagination Variable
let page: Ref<number> = ref(1)
let perPage: Ref<number> = ref(10)
let totalItems: Ref<number> = ref(0)
let totalPages: Ref<number> = ref(0)
let searchData: Ref<string> = ref('')

const customOptions: Ref<IDropdownItem[]> = ref([{
  name: 'member',
  title: lang.t('label.groupMembers'),
  icon: 'UserGroupIcon'
}])

const getData = async (): Promise<void> => {
  let req = {
    page: page.value,
    perPage: perPage.value,
    search: searchData.value
  }
  rows.value = []
  datas.value = []
  gradeServices.getGradeGroup(req).then((result: AxiosResponse) => {
    datas.value = result.data.data
    totalItems.value = datas.value.totalItems
    totalPages.value = datas.value.totalPages
    datas.value.rows.map((item: any) => {
      let entry: object = {
        name: item.name,
        actions: item
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

const handleClickActions = (event: string, value: any): void => {
  if (event === 'delete') {
    confirmationDelete(value)
  }
  if (event === 'member') {
    registerStudentGrade(value)
  }
}

const registerStudentGrade = (data: any): void => {
  modalStore.openModal({ component: RegisterStudentGradeModal, props: data })
}

const confirmationDelete = (data: any): void => {
  modalStore.openConfirmationModal(lang.t('label.confirm'), lang.t('description.actionsConfirmation', { actions: lang.t('label.delete').toLowerCase() }))
}

onMounted(() => {
  getData()
})
</script>