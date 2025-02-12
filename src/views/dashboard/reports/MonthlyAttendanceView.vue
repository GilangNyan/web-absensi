<template>
  <div class="flex flex-col space-y-4">
    <h1 class="font-bold text-indigo-900 text-2xl">{{ $t('title.monthlyAttendance') }}</h1>
    <BreadCrumbs />
  </div>
  <Form
    class="bg-white p-4 rounded-lg flex flex-col space-y-2"
    id="monthly-attendance-form"
    :validation-schema="schema"
    @submit="getData()"
  >
    <div class="grid grid-cols-3 gap-2">
      <SelectForm name="year" :label="$t('tableHead.academicYear')" v-model="year" :options="yearOptions" />
      <SelectForm name="month" :label="$t('label.month')" v-model="month" :options="monthOptions" />
      <SelectForm name="grade" :label="$t('tableHead.grade')" v-model="grade" :options="gradeOptions" />
    </div>
    <div class="flex items-center justify-end">
      <ButtonRoundedWithIcon :label="$t('label.confirm')" type="submit" form="monthly-attendance-form" color="indigo" :loading="isBusy">
        <MagnifyingGlassIcon class="w-5 h-5" />
      </ButtonRoundedWithIcon>
    </div>
  </Form>
  <div class="bg-white p-4 rounded-lg flex flex-col space-y-2" v-if="isReportGenerated">
    <div class="flex w-full justify-end items-center space-x-2">
      <ButtonRoundedWithIcon color="indigo" type="button" :label="$t('label.print')" @click="generateReports()" :loading="downloadPdfLoading" :disabled="downloadPdfLoading">
        <PrinterIcon class="w-5 h-5" />
      </ButtonRoundedWithIcon>
      <ButtonRoundedWithIcon color="indigo" type="button" :label="$t('label.downloadReports')" @click="downloadReports()" :loading="downloadXlsxLoading" :disabled="downloadXlsxLoading">
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
import SelectForm from '@/components/inputs/SelectForm.vue';
import BreadCrumbs from '@/components/main/BreadCrumbs.vue';
import TableCustom from '@/components/main/TableCustom.vue';
import PrintPreviewModal from '@/components/modals/PrintPreviewModal.vue';
import timeConstants from '@/constants/timeConstants';
import attendanceServices from '@/services/masterData/attendanceServices';
import gradeServices from '@/services/masterData/gradeServices';
import { useModalStore } from '@/stores/modal';
import type ISelectOption from '@/types/selectOption';
import { formatFullDate, getTotalDaysByMonth, handleErrorResponse } from '@/utils/utilities';
import { DocumentArrowDownIcon, MagnifyingGlassIcon, PrinterIcon } from '@heroicons/vue/24/solid';
import type { AxiosResponse } from 'axios';
import { Form } from 'vee-validate';
import { onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const { t } = useI18n()
const modal = useModalStore()
const htmlTemplate = ref('')
const htmlData = ref('')

const yearOptions: Ref<ISelectOption[]> = ref([])
const monthOptions: Ref<ISelectOption[]> = ref([])
const gradeOptions: Ref<ISelectOption[]> = ref([])
const year: Ref<ISelectOption | null> = ref(null)
const month: Ref<ISelectOption | null> = ref(null)
const grade: Ref<ISelectOption | null> = ref(null)

const schema = yup.object({
  year: yup.object().shape({
    label: yup.string(),
    value: yup.string()
  }).required(),
  month: yup.object().shape({
    label: yup.string(),
    value: yup.string()
  }).required(),
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
  },
])
const rows: Ref = ref([])
const isBusy: Ref<boolean> = ref(false)
const isReportGenerated: Ref<boolean> = ref(false)
const downloadXlsxLoading: Ref<boolean> = ref(false)
const downloadPdfLoading: Ref<boolean> = ref(false)

const getYears = (): void => {
  const d = new Date
  const startYear: number = 2022
  const currentYear: number = d.getFullYear()

  for (let i = startYear; i <= currentYear; i++) {
    const entry: ISelectOption = {
      value: i,
      label: i.toString()
    }
    yearOptions.value.push(entry)
  }
}

const getAcademicYears = async (): Promise<void> => {
  const payload = {}
  await gradeServices.getAcademicYears(payload).then((result: AxiosResponse) => {
    const datas = result.data.data.rows
    datas.forEach((item: any) => {
      const entry = {
        value: item.id,
        label: item.name
      }
      yearOptions.value.push(entry)
    })
  }).catch((error: unknown) => {
    handleErrorResponse(error)
  })
}

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
    year: year.value?.value,
    month: month.value?.value,
    grade: grade.value?.value
  }
  isBusy.value = true
  rows.value = []
  await attendanceServices.getMonthlyAttendance(payload).then((result: AxiosResponse) => {
    const datas = result.data.data.rows
    const dayOff: number = result.data.data.dayOff
    const years: number = result.data.data.year
    const weekdays: number = getTotalDaysByMonth(years, (month.value?.value as number)) - dayOff
    datas.forEach((item: any) => {
      const entry = {
        name: item.fullname,
        nisn: item.nisn,
        hadir: item.attendances ? parseInt(item.attendances.hadir) : 0,
        sakit: item.attendances ? parseInt(item.attendances.sakit) : 0,
        izin: item.attendances ? parseInt(item.attendances.izin) : 0,
        alpa: item.attendances ? weekdays - (parseInt(item.attendances.hadir) + parseInt(item.attendances.sakit) + parseInt(item.attendances.izin)) : 0 + weekdays,
      }
      rows.value.push(entry)
    })
  }).catch((error: unknown) => {
    handleErrorResponse(error)
  }).finally(() => {
    isReportGenerated.value = true
    isBusy.value = false
  })
}

const downloadReports = async () => {
  const payload = {
    year: year.value?.value,
    month: month.value?.value,
    grade: grade.value?.value
  }
  await attendanceServices.downloadMonthlyAttendance(payload).then((result: AxiosResponse) => {
    const url = window.URL.createObjectURL(result.data);
    const link = document.createElement('a');
    let filename = 'download.xlsx'
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

  })
}

const generateReports = async () => {
  downloadPdfLoading.value = true
  const response = await fetch('/monthly-attendance.html')
  htmlTemplate.value = await response.text()
  await populateReports()
  const date = new Date()
  htmlTemplate.value = htmlTemplate.value.replace('<tbody></tbody>', `<tbody>${htmlData.value}</tbody>`)
  htmlTemplate.value = htmlTemplate.value.replace('<td id="date"></td>', `<td id="date">${formatFullDate(date.toISOString())}</td>`)
  htmlTemplate.value = htmlTemplate.value.replace('<td id="academic-year"></td>', `<td id="academic-year">${year.value?.label}</td>`)
  htmlTemplate.value = htmlTemplate.value.replace('<td id="grade"></td>', `<td id="grade">${grade.value?.label}</td>`)
  modal.openModal({ component: PrintPreviewModal, props: { content: htmlTemplate.value } })
  downloadPdfLoading.value = false
}

const populateReports = async () => {
  const payload = {
    year: year.value?.value,
    month: month.value?.value,
    grade: grade.value?.value
  }
  htmlData.value = ''
  await attendanceServices.getMonthlyAttendance(payload).then((result) => {
    const datas = result.data.data.rows
    for (const [index, item] of datas.entries()) {
      const dayOff: number = result.data.data.dayOff
      const years: number = result.data.data.year
      const weekdays: number = getTotalDaysByMonth(years, (month.value?.value as number)) - dayOff
      const hadir = item.attendances ? parseInt(item.attendances.hadir) : 0
      const sakit = item.attendances ? parseInt(item.attendances.sakit) : 0
      const izin = item.attendances ? parseInt(item.attendances.izin) : 0
      const alpa = item.attendances ? weekdays - (hadir + sakit + izin) : 0 + weekdays
      const entry = `<tr>
      <td class="center">${index + 1}</td>
      <td>${item.fullname}</td>
      <td class="center">${grade.value?.label}</td>
      <td class="center">${hadir}</td>
      <td class="center">${sakit}</td>
      <td class="center">${izin}</td>
      <td class="center">${alpa}</td>
      </tr>`
      htmlData.value = htmlData.value + entry
    }
  }).catch((error) => {
    handleErrorResponse(error)
    modal.closeModal()
  })
}

onMounted(() => {
  // getYears()
  getAcademicYears()
  monthOptions.value = timeConstants.monthOptions
  getGrades()
})
</script>