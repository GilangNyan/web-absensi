<template>
  <div class="flex flex-col">
    <h1 class="font-bold text-indigo-900 text-2xl">{{ $t('title.generateQr') }}</h1>
    <BreadCrumbs />
  </div>
  <Form
    class="grid grid-cols-3 gap-2 p-4 bg-white rounded-lg"
    @submit="getStudent()"
    id="generate-qr-form"
    :validation-schema="schema"
  >
    <SelectForm name="year" :label="$t('tableHead.academicYear')" v-model="academicYear" :options="academicYearOptions" />
    <SelectForm name="grade" :label="$t('tableHead.grade')" v-model="grade" :options="gradeOptions" />
    <div class="flex flex-col w-full justify-end">
      <div class="grid grid-cols-2 gap-2">
        <ButtonRoundedWithIcon :label="$t('label.search')" type="submit" form="generate-qr-form" color="indigo">
          <MagnifyingGlassIcon class="h-5 w-5" />
        </ButtonRoundedWithIcon>
        <ButtonRoundedWithIcon :label="$t('label.downloadAsZip')" color="indigo" is-reversed-color :disabled="!zippedQrImage" @click="downloadZippedQrImage()">
          <ArchiveBoxArrowDownIcon class="h-5 w-5" />
        </ButtonRoundedWithIcon>
      </div>
    </div>
  </Form>
  <div class="flex w-full items-center justify-center bg-white" v-if="pdfDataUrl">
    <iframe :src="pdfDataUrl" frameborder="0" class="w-full h-96"></iframe>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from '@/components/main/BreadCrumbs.vue';
import ButtonRoundedWithIcon from '@/components/buttons/ButtonRoundedWithIcon.vue';
import { ArchiveBoxArrowDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import { onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useModalStore } from '@/stores/modal';
import { useDataStore } from '@/stores/data';
import SelectForm from '@/components/inputs/SelectForm.vue';
import type ISelectOption from '@/types/selectOption';
import { Form } from 'vee-validate';
import studentServices from '@/services/masterData/studentServices';
import type { AxiosResponse } from 'axios';
import * as yup from 'yup';
import gradeServices from '@/services/masterData/gradeServices';
import { generatePdfQrList, generateQrImageZipped, handleErrorResponse } from '@/utils/utilities';
import { saveAs } from 'file-saver';

const lang = useI18n()
const modalStore = useModalStore()
const dataStore = useDataStore()

const academicYearOptions: Ref<ISelectOption[]> = ref([])
const gradeOptions: Ref<ISelectOption[]> = ref([])
const academicYear: Ref<ISelectOption | null> = ref(null)
const grade: Ref<ISelectOption | null> = ref(null)
const pdfDataUrl: Ref<string | null> = ref(null)
const zippedQrImage: Ref<Blob | null> = ref(null)

const schema = yup.object({
  year: yup.object().shape({
    label: yup.string().required(),
    value: yup.string().required()
  }).required(),
  grade: yup.object().shape({
    label: yup.string().required(),
    value: yup.string().required()
  }).required()
})

const getStudent = async (): Promise<void> => {
  const payload = {
    page: 1,
    perPage: 9999,
    search: '',
    sort: 'fullname',
    dir: 'ASC',
    grade: grade.value?.value,
    year: academicYear.value?.value
  }
  await studentServices.getStudent(payload).then(async (result: AxiosResponse) => {
    const datas = result.data.data.rows
    pdfDataUrl.value = await generatePdfQrList(datas)
    zippedQrImage.value = await generateQrImageZipped(datas)
  })
}

const getAcademicYears = async (): Promise<void> => {
  const payload = {
    page: 1,
    perPage: 99999,
    search: ''
  }
  await gradeServices.getAcademicYears(payload).then((result: AxiosResponse) => {
    const datas = result.data.data.rows
    datas.forEach((item: any) => {
      const entry = {
        value: item.id,
        label: item.name
      }
      academicYearOptions.value.push(entry)
    })
  }).catch((error: unknown) => {
    handleErrorResponse(error)
    console.log(error)
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
    console.log(error)
  })
}

const downloadZippedQrImage = async (): Promise<void> => {
  const academicYearNoSymbol = academicYear.value?.label.replace('/', '')
  saveAs((zippedQrImage.value as Blob), `${academicYearNoSymbol}_${grade.value?.label}_QRCode.zip`)
}

onMounted(() => {
  getAcademicYears()
  getGrades()
})
</script>