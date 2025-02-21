<template>
  <div class="bg-white w-5/6 md:w-1/2 rounded-lg max-h-dvh overflow-x-hidden overflow-y-auto">
    <div class="flex flex-col">
      <div class="flex w-full px-4 py-2 border-b border-gray-200">
        <h5 class="text-gray-600 font-bold">{{ t('update') + ' ' + t('label.attendance') }}</h5>
      </div>
      <div class="flex flex-col space-y-4 p-4">
        <Form id="attendance-form" :validation-schema="schema" @submit="save()" class="w-full flex flex-col space-y-2">
          <SelectForm name="attendanceStatus" :label="t('label.attendanceStatus')" v-model="statuses" :options="statusOptions" />
          <InputForm name="name" :label="t('label.name')" v-model="names" disabled />
          <InputForm name="nisn" :label="t('tableHead.nisn')" v-model="nisns" disabled />
          <InputForm name="attendanceDate" :label="t('tableHead.date')" v-model="dates" type="date" />
        </Form>
      </div>
    </div>
    <div class="flex w-full items-center justify-end px-4 pb-4">
      <ButtonRoundedWithIcon color="indigo" :label="$t('label.save')" type="submit" form="attendance-form" :disabled="isBusy" :loading="isBusy">
        <PencilSquareIcon class="h-3 w-3" />
      </ButtonRoundedWithIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from 'yup';
import { Form } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import InputForm from '@/components/inputs/InputForm.vue';
import ButtonRoundedWithIcon from '@/components/buttons/ButtonRoundedWithIcon.vue';
import { onMounted, ref, type Ref } from 'vue';
import { useDataStore } from '@/stores/data';
import type ISelectOption from '@/types/selectOption';
import SelectForm from '@/components/inputs/SelectForm.vue';
import { PencilSquareIcon } from '@heroicons/vue/24/solid';
import { useAuthStore } from '@/stores/auth';
import attendanceServices from '@/services/masterData/attendanceServices';
import type { AxiosResponse } from 'axios';
import { handleErrorResponse } from '@/utils/utilities';
import { useModalStore } from '@/stores/modal';
import { useToasterStore } from '@/stores/toaster';

const { t } = useI18n()
const auth = useAuthStore()
const data = useDataStore()
const modal = useModalStore()
const toast = useToasterStore()
const isBusy: Ref<boolean> = ref(false)

interface Props {
  id: string
  name: string
  nisn: string
  date: string
  grade: string
  status: string
}

const props = defineProps<Props>()

const names: Ref<string> = ref('')
const nisns: Ref<string> = ref('')
const dates: Ref<string | null> = ref(null)
const statuses: Ref<ISelectOption | null | undefined> = ref(null)

const statusOptions: Ref<ISelectOption[]> = ref([
  {
    label: 'Hadir',
    value: 'H'
  },
  {
    label: 'Sakit',
    value: 'S'
  },
  {
    label: 'Izin',
    value: 'I'
  },
  {
    label: 'Tanpa Keterangan',
    value: 'A'
  }
])

const schema = yup.object({
  attendanceStatus: yup.object().shape({
    label: yup.string().required(),
    value: yup.string().required()
  }).required(),
  attendanceDate: yup.string().required()
})

const read = () => {
  if (data.status == 'U') {
    names.value = props.name
    nisns.value = props.nisn
    dates.value = props.date
    statuses.value = statusOptions.value.find((item) => item.value == props.status)
  }
}

const save = async () => {
  isBusy.value = true
  const payload = {
    studentId: props.id,
    gradeId: props.grade,
    academicYearId: auth.year.id,
    date: new Date(dates.value!),
    status: statuses.value?.value
  }
  await attendanceServices.recordAttendance(payload).then((result: AxiosResponse) => {
    modal.okClicked()
    toast.success({ text: t('success.success'), message: t('success.recordAttendance') })
  }).catch((error: any) => {
    handleErrorResponse(error)
  }).finally(() => {
    isBusy.value = false
  })
}

onMounted(() => {
  read()
})
</script>