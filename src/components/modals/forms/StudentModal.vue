<template>
  <div class="bg-white w-11/12 flex flex-col rounded-lg space-y-4">
    <div class="flex w-full px-4 py-2 border-b border-gray-200">
      <h5 class="text-gray-600 font-bold">{{ (crudStatus == 'I' ? t('label.add') : t('update')) + ' ' + t('title.studentsData') }}</h5>
    </div>
    <div class="flex flex-col space-y-4 px-4 pb-4">
      <Form id="student-form" class="grid grid-cols-2 gap-2" @submit="save" :validation-schema="schema">
        <InputForm name="name" :label="t('tableHead.fullname')" v-model="names" />
        <InputForm name="nisn" :label="t('tableHead.nisn')" v-model="nisns" />
        <InputForm name="nipd" :label="t('tableHead.nipd')" v-model="nipds" />
        <SelectForm name="gender" :label="t('tableHead.gender')" :options="genderOptions" v-model="genders" />
        <InputForm name="birthPlace" :label="t('tableHead.birthPlace')" v-model="birthPlaces" />
        <InputForm name="birthDate" :label="t('tableHead.birthDate')" v-model="birthDates" type="date" />
      </Form>
      <div class="flex w-full justify-end items-center">
        <ButtonRoundedWithIcon color="indigo" :label="t('label.save')" type="submit" form="student-form" :disabled="isBusy" :loading="isBusy">
          <PencilIcon class="w-3 h-3" />
        </ButtonRoundedWithIcon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from 'yup';
import { Form } from 'vee-validate';
import { useDataStore } from '@/stores/data';
import type TCrudStatus from '@/types/status';
import { PencilIcon } from '@heroicons/vue/24/solid';
import { onMounted, ref, type Ref } from 'vue';
import ButtonRoundedWithIcon from '@/components/buttons/ButtonRoundedWithIcon.vue';
import InputForm from '@/components/inputs/InputForm.vue';
import SelectForm from '@/components/inputs/SelectForm.vue';
import type ISelectOption from '@/types/selectOption';
import { useModalStore } from '@/stores/modal';
import { handleErrorResponse } from '@/utils/utilities';
import studentServices from '@/services/masterData/studentServices';
import { useToasterStore } from '@/stores/toaster';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const data = useDataStore()
const modal = useModalStore()
const toast = useToasterStore()

interface Props {
  id?: string
  fullname?: string
  nisn?: string
  nipd?: string
  gender?: string
  birthPlace?: string
  birthDate?: string
}

const props = defineProps<Props>()

const crudStatus: Ref<TCrudStatus> = ref('I');
const isBusy: Ref<boolean> = ref(false)

const ids: Ref<string | null> = ref(null)
const names: Ref<string> = ref('')
const nisns: Ref<string> = ref('')
const nipds: Ref<string> = ref('')
const genders: Ref<ISelectOption | null | undefined> = ref(null)
const birthPlaces: Ref<string> = ref('')
const birthDates: Ref<string | null> = ref(null)

const genderOptions: Ref<ISelectOption[]> = ref([
  {
    label: 'Laki-laki',
    value: 'L'
  },
  {
    label: 'Perempuan',
    value: 'P'
  }
])

const schema = yup.object({
  name: yup.string().required(),
  nisn: yup.string().required().matches(/^[0-9]+$/, "Must be only digits").length(10),
  nipd: yup.string().required().matches(/^[0-9]+$/, "Must be only digits").length(9),
  gender: yup.object().shape({
    label: yup.string().required(),
    value: yup.string().required()
  }).required(),
  birthPlace: yup.string().required(),
  birthDate: yup.string().required()
});

const read = (): void => {
  if (data.status === 'U') {
    crudStatus.value = 'U';
    ids.value = props.id!
    names.value = props.fullname!
    nisns.value = props.nisn!
    nipds.value = props.nipd!
    birthPlaces.value = props.birthPlace!
    birthDates.value = props.birthDate!
    genders.value = genderOptions.value.find((item) => {
      return item.value == props.gender
    })
  }
}

const save = async (): Promise<void> => {
  let payload = {
    nisn: nisns.value,
    nipd: nipds.value,
    fullname: names.value,
    gender: genders.value?.value,
    birthDate: birthDates.value,
    birthPlace: birthPlaces.value
  }
  isBusy.value = true
  try {
    if (data.status == 'I') {
      await studentServices.createStudents(payload)
    } else if (data.status == 'U') {
      payload = Object.assign(payload, { id: ids.value })
      await studentServices.updateStudents(payload)
    }
    modal.okClicked()
    toast.success({ text: t('success.success'), message: t('success.save', { name: names.value })})
  } catch (error) {
    handleErrorResponse(error)
  } finally {
    isBusy.value = false
  }
}

onMounted(() => {
  read()
})
</script>