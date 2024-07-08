<template>
  <div class="flex flex-col">
    <h1 class="font-bold text-indigo-900 text-2xl">{{ $t('title.gradesData') }}</h1>
    <BreadCrumbs />
  </div>
  <TableCustom :columns="columns" :rows="rows" @search="search($event)">
    <template #right-panel>
      <ButtonRoundedWithIcon color="indigo" :label="$t('label.add')" @click="triggerGradeFormModal('I')">
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
import { ref, onMounted, type Ref, computed, watch } from 'vue';
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
import GradeFormModal from '@/components/modals/forms/GradeFormModal.vue';
import { useDataStore } from '@/stores/data';
import type TCrudStatus from '@/types/status';
import { useToasterStore } from '@/stores/toaster';

const lang = useI18n()
const modalStore = useModalStore()
const dataStore = useDataStore()
const toastStore = useToasterStore()

const columns: Ref = ref([
  {
    name: 'name',
    title: lang.t('tableHead.name')
  },
  // {
  //   name: 'count',
  //   title: lang.t('tableHead.studentsCount')
  // },
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

let selectedData: Ref<any> = ref({})

const customOptions: Ref<IDropdownItem[]> = ref([{
  name: 'member',
  title: lang.t('label.groupMembers'),
  icon: 'UserGroupIcon'
}])

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
  let req = {
    page: page.value,
    perPage: perPage.value,
    search: searchData.value
  }
  rows.value = []
  datas.value = []
  gradeServices.getGrades(req).then((result: AxiosResponse) => {
    datas.value = result.data.data
    totalItems.value = datas.value.totalItems
    totalPages.value = datas.value.totalPages
    datas.value.rows.map((item: any) => {
      let entry: object = {
        name: item.name,
        count: item.students.length,
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
  if (event === 'update') {
    triggerGradeFormModal('U', value)
  }
  if (event === 'delete') {
    dataStore.setStatus('D')
    confirmationDelete(value)
  }
  if (event === 'member') {
    registerStudentGrade(value)
  }
}

const registerStudentGrade = (data: any): void => {
  dataStore.setStatus('U')
  modalStore.openModal({ component: RegisterStudentGradeModal, props: data })
}

const triggerGradeFormModal = (actions: TCrudStatus, data?: any): void => {
  dataStore.setStatus(actions)
  modalStore.openModal({ component: GradeFormModal, props: data })
}

const confirmationDelete = (data: any): void => {
  selectedData.value = data
  modalStore.openConfirmationModal(lang.t('label.confirm'), lang.t('description.actionsConfirmation', { actions: lang.t('label.delete').toLowerCase() }))
}

const deleteData = async (): Promise<void> => {
  const payload = {
    id: selectedData.value.id
  }
  await gradeServices.saveGrades(payload)!.then((result: AxiosResponse) => {
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