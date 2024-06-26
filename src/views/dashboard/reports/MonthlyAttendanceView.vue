<template>
  <div class="flex flex-col">
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
      <SelectForm name="year" :label="$t('label.year')" v-model="year" :options="yearOptions" />
      <SelectForm name="month" :label="$t('label.month')" v-model="month" :options="monthOptions" />
      <SelectForm name="grade" :label="$t('tableHead.grade')" v-model="grade" :options="gradeOptions" />
    </div>
    <div class="flex items-center justify-end">
      <ButtonRoundedWithIcon :label="$t('label.confirm')" type="submit" form="monthly-attendance-form" color="indigo">
        <MagnifyingGlassIcon class="w-5 h-5" />
      </ButtonRoundedWithIcon>
    </div>
  </Form>
</template>

<script setup lang="ts">
import ButtonRoundedWithIcon from '@/components/buttons/ButtonRoundedWithIcon.vue';
import SelectForm from '@/components/inputs/SelectForm.vue';
import BreadCrumbs from '@/components/main/BreadCrumbs.vue';
import timeConstants from '@/constants/timeConstants';
import attendanceServices from '@/services/masterData/attendanceServices';
import gradeServices from '@/services/masterData/gradeServices';
import type ISelectOption from '@/types/selectOption';
import { handleErrorResponse } from '@/utils/utilities';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import type { AxiosResponse } from 'axios';
import { Form } from 'vee-validate';
import { onMounted, ref, type Ref } from 'vue';
import * as yup from 'yup';

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

const getData = async (): Promise<void> => {
  const payload = {
    year: year.value?.value,
    month: month.value?.value,
    grade: grade.value?.value
  }
  await attendanceServices.getMonthlyAttendance(payload).then((result: AxiosResponse) => {
    const datas = result.data.data.rows
    console.log(result)
    // datas.forEach((item: any) => {
    //   console.log(item)
    // })
  }).catch((error: unknown) => {
    handleErrorResponse(error)
    console.log(error)
  })
}

onMounted(() => {
  getYears()
  monthOptions.value = timeConstants.monthOptions
  getGrades()
})
</script>