<template>
  <div class="flex flex-col space-y-4">
    <h1 class="font-bold text-indigo-900 text-2xl">{{ $t('title.dailyAttendance') }}</h1>
    <BreadCrumbs />
  </div>
  <Form
    class="bg-white p-4 rounded-lg flex flex-col space-y-2"
    id="daily-attendance-form"
    :validation-schema="schema"
    @submit="getData()"
  >
    <div class="grid grid-cols-2 gap-2">
      <InputForm name="date" :label="$t('label.date')" v-model="date" type="date" />
      <SelectForm name="grade" :label="$t('tableHead.grade')" v-model="grade" :options="gradeOptions" />
    </div>
    <div class="flex items-center justify-end">
      <ButtonRoundedWithIcon color="indigo" :label="$t('label.confirm')" type="submit" form="daily-attendance-form" :loading="isBusy">
        <MagnifyingGlassIcon class="w-5 h-5" />
      </ButtonRoundedWithIcon>
    </div>
  </Form>
  <div class="bg-white p-4 rounded-lg flex flex-col space-y-2" v-if="isReportGenerated">
    <div class="flex w-full justify-end items-center space-x-2">
      <ButtonRoundedWithIcon color="indigo" type="button" :label="$t('label.downloadReports', { type: 'PDF' })" @click="downloadReports('pdf')" :loading="downloadPdfLoading" :disabled="downloadPdfLoading">
        <DocumentArrowDownIcon class="w-5 h-5" />
      </ButtonRoundedWithIcon>
      <ButtonRoundedWithIcon color="indigo" type="button" :label="$t('label.downloadReports', { type: 'Excel' })" @click="downloadReports('xlsx')" :loading="downloadXlsxLoading" :disabled="downloadXlsxLoading">
        <DocumentArrowDownIcon class="w-5 h-5" />
      </ButtonRoundedWithIcon>
    </div>
    <TableCustom :columns="columns" :rows="rows" hide-search>
      <!--  -->
    </TableCustom>
  </div>
</template>

<script setup lang="ts">
import ButtonRoundedWithIcon from '@/components/buttons/ButtonRoundedWithIcon.vue';
import InputForm from '@/components/inputs/InputForm.vue';
import SelectForm from '@/components/inputs/SelectForm.vue';
import BreadCrumbs from '@/components/main/BreadCrumbs.vue';
import TableCustom from '@/components/main/TableCustom.vue';
import attendanceServices from '@/services/masterData/attendanceServices';
import gradeServices from '@/services/masterData/gradeServices';
import type ISelectOption from '@/types/selectOption';
import { handleErrorResponse } from '@/utils/utilities';
import { DocumentArrowDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import type { AxiosResponse } from 'axios';
import { Form } from 'vee-validate';
import { onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const { t } = useI18n()
const isBusy: Ref<boolean> = ref(false)
const isReportGenerated: Ref<boolean> = ref(false)
const downloadXlsxLoading: Ref<boolean> = ref(false)
const downloadPdfLoading: Ref<boolean> = ref(false)

const gradeOptions: Ref<ISelectOption[]> = ref([])
const grade: Ref<ISelectOption | null> = ref(null)
const date: Ref<string | null> = ref(null)

const schema = yup.object({
  grade: yup.object().shape({
    label: yup.string(),
    value: yup.string()
  }).required()
})

const columns: Ref = ref([
{
    name: 'name',
    title: t('tableHead.name')
  },
  {
    name: 'nisn',
    title: t('tableHead.nisn')
  },
  {
    name: 'hadir',
    title: 'Hadir'
  },
  {
    name: 'sakit',
    title: 'Sakit'
  },
  {
    name: 'izin',
    title: 'Izin'
  },
  {
    name: 'alpa',
    title: 'Alpa'
  }
])
const rows: Ref = ref([])

const getGrades = async (): Promise<void> => {
  const payload = {
    page: 1,
    perPage: 99999,
    search: '',
  }
  await gradeServices.getGrades(payload).then((result: AxiosResponse) => {
    const datas = result.data.data.rows
    datas.forEach((item: any) => {
      const entry = {
        value: item.id,
        label: item.name
      }
      gradeOptions.value.push(entry)
    })
  }).catch((error: unknown) => {
    handleErrorResponse(error)
  })
}

const getData = async (): Promise<void> => {
  const payload = {
    date: date.value,
    grade: grade.value?.value
  }
  isBusy.value = true
  rows.value = []
  await attendanceServices.getDailyAttendance(payload).then((result: AxiosResponse) => {
    const datas = result.data.data
    datas.forEach((item: any) => {
      const hadir = item.attendances.find((item: any) => item.status == 'H')
      const izin = item.attendances.find((item: any) => item.status == 'I')
      const sakit = item.attendances.find((item: any) => item.status == 'S')
      const alpa = item.attendances.find((item: any) => item.status == 'A')
      const entry = {
        name: item.fullname,
        nisn: item.nisn,
        hadir: hadir ? '☑' : '☐',
        sakit: sakit ? '☑' : '☐',
        izin: izin ? '☑' : '☐',
        alpa: alpa || (!hadir && !sakit && !izin) ? '☑' : '☐'
      }
      rows.value.push(entry)
    })
  }).catch((error: unknown) => {
    handleErrorResponse(error)
  }).finally(() => {
    isBusy.value = false
    isReportGenerated.value = true
  })
}

const downloadReports = async (fileType: string) => {
  const payload = {
    date: date.value,
    grade: grade.value?.value,
    type: fileType
  }
  if (fileType == 'xlsx') downloadXlsxLoading.value = true
  if (fileType == 'pdf') downloadPdfLoading.value = true
  await attendanceServices.downloadDailyAttendance(payload).then((result: AxiosResponse) => {
    const url = window.URL.createObjectURL(result.data);
    const link = document.createElement('a');
    let filename = `download.${fileType}`
    const disposition = result.headers['content-disposition']
    if (disposition && disposition.indexOf('attachment') !== -1) {
      let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      let matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) { 
        filename = matches[1].replace(/['"]/g, '');
      }
    }
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }).catch((error: unknown) => {
    handleErrorResponse(error)
  }).finally(() => {
    downloadXlsxLoading.value = false
    downloadPdfLoading.value = false
  })
}

const getCurrentDate = () => {
  const d = new Date().toISOString().slice(0, 10)
  date.value = d
}

onMounted(() => {
  getCurrentDate()
  getGrades()
})
</script>