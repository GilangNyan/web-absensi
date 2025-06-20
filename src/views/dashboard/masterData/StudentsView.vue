<template>
  <div class="flex flex-col">
    <h1 class="font-bold text-indigo-900 text-2xl">{{ $t('title.studentsData') }}</h1>
    <BreadCrumbs />
  </div>
  <TableCustom :columns="columns" :rows="rows" @search="search($event)" :sort="sorting" @order="orderByColumns($event)">
    <template #right-panel>
      <ButtonRoundedWithIcon color="indigo" :label="$t('label.upload')" :is-reversed-color="true" @click="openUploadStudentsModal()">
        <ArrowUpTrayIcon class="w-4 h-4" />
      </ButtonRoundedWithIcon>
      <ButtonRoundedWithIcon color="indigo" :label="$t('label.add')" @click="triggerStudentFormModal('I')">
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
import StudentUploadModal from '@/components/modals/StudentsUploadModal.vue';
import { type Ref, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import studentServices from '@/services/masterData/studentServices';
import type { AxiosResponse } from 'axios';
import { ArrowUpTrayIcon, PlusIcon } from '@heroicons/vue/24/solid';
import { handleErrorResponse } from '@/utils/utilities';
import { useModalStore } from '@/stores/modal';
import BreadCrumbs from '@/components/main/BreadCrumbs.vue';
import ButtonRoundedWithIcon from '@/components/buttons/ButtonRoundedWithIcon.vue';
import ButtonDropdownActions from '@/components/buttons/ButtonDropdownActions.vue';
import type IOrder from '@/types/order';
import { useAuthStore } from '@/stores/auth';
import StudentModal from '@/components/modals/forms/StudentModal.vue';
import { useDataStore } from '@/stores/data';
import type TCrudStatus from '@/types/status';
import { useToasterStore } from '@/stores/toaster';

const lang = useI18n()
const modalStore = useModalStore()
const authStore = useAuthStore()
const dataStore = useDataStore()
const toastStore = useToasterStore()

const columns: Ref = ref([
  {
    name: 'fullname',
    title: lang.t('tableHead.fullname'),
    sortable: true
  },
  {
    name: 'nisn',
    title: lang.t('tableHead.nisn'),
    sortable: true
  },
  {
    name: 'nipd',
    title: lang.t('tableHead.nipd'),
    sortable: true
  },
  {
    name: 'gender',
    title: lang.t('tableHead.gender')
  },
  {
    name: 'birthPlace',
    title: lang.t('tableHead.birthPlace')
  },
  {
    name: 'birthDate',
    title: lang.t('tableHead.birthDate')
  },
  {
    name: 'grade',
    title: lang.t('tableHead.grade')
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
let sorting: Ref<IOrder> = ref({
  sort: 'fullname',
  dir: 'ASC'
})

const getData = async (): Promise<void> => {
  let req = {
    page: page.value,
    perPage: perPage.value,
    search: searchData.value,
    sort: sorting.value.sort,
    dir: sorting.value.dir
  }
  rows.value = []
  await studentServices.getStudent(req).then((result: AxiosResponse) => {
    let datas = result.data.data
    totalItems.value = datas.totalItems
    totalPages.value = datas.totalPages
    datas.rows.map((items: any) => {
      let grades = ''
      if (items.grades && items.grades.length != 0) {
        const findCurrentGrade = items.grades.find((item: any) => {
          return item.student_grade.academicYearId === authStore.year.id
        })
        grades = findCurrentGrade.name
      }
      let entry: object = {
        fullname: items.fullname,
        nisn: items.nisn,
        nipd: items.nipd,
        gender: items.gender,
        birthPlace: items.birthPlace,
        birthDate: items.birthDate,
        grade: grades,
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

const openUploadStudentsModal = () => modalStore.openModal({ component: StudentUploadModal })

const triggerStudentFormModal = (actions: TCrudStatus, data?: any): void => {
  dataStore.setStatus(actions)
  modalStore.openModal({ component: StudentModal, props: data })
  modalStore.onOk(() => {
    getData()
  })
}

const handleClickActions = (event: string, value: any): void => {
  if (event === 'update') {
    triggerStudentFormModal('U', value)
  }
  if (event === 'delete') {
    confirmationDelete(value)
  }
}

const confirmationDelete = (data: any): void => {
  modalStore.openConfirmationModal(lang.t('label.confirm'), lang.t('description.actionsConfirmation', { actions: lang.t('label.delete').toLowerCase() }))
  modalStore.onOk(() => {
    deleteData(data)
  })
}

const deleteData = async (data: any): Promise<void> => {
  const payload = {
    id: data.id
  }
  await studentServices.deleteStudent(payload).then((result) => {
    toastStore.success({ text: lang.t('success.success'), message: lang.t('success.delete', { name: result.data.data.fullname }) })
    getData()
  }).catch((error: unknown) => {
    handleErrorResponse(error)
    console.error(error)
  })
}

const orderByColumns = (data: any): void => {
  sorting.value = data
  getData()
}

onMounted(() => {
  getData()
})
</script>