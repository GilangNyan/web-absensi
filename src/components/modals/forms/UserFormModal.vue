<template>
  <div class="bg-white w-5/6 md:w-1/2 flex flex-col rounded-lg space-y-4">
    <div class="flex w-full px-4 py-2 border-b border-gray-200">
      <h5 class="text-gray-600 font-bold">{{ (crudStatus == 'I' ? t('label.add') : t('update')) + ' ' + t('title.userData') }}</h5>
    </div>
    <div class="flex flex-col space-y-4 px-4 pb-4">
      <Form id="user-form" class="grid grid-cols-2 gap-2" @submit="save" :validation-schema="schema">
        <InputForm name="username" :label="t('label.username')" v-model="usernames" :disabled="crudStatus == 'U'" />
        <SelectForm name="role" :label="t('label.role')" v-model="roles" :options="rolesOptions" />
        <InputForm name="fullname" :label="t('tableHead.fullname')" v-model="fullnames" />
        <SelectForm name="gender" :label="t('tableHead.gender')" v-model="genders" :options="genderOptions" />
        <InputForm name="birthPlace" :label="t('tableHead.birthPlace')" v-model="birthPlaces" />
        <InputForm name="birthDate" :label="t('tableHead.birthDate')" v-model="birthDates" type="date" />
        <InputForm name="email" :label="t('label.email')" v-model="emails" />
        <SelectForm name="status" :label="t('tableHead.status')" v-model="statuses" :options="statusOptions" />
      </Form>
    </div>
    <div class="flex w-full items-center justify-end px-4 pb-4">
      <ButtonRoundedWithIcon color="indigo" :label="t('label.save')" type="submit" form="user-form" :disabled="isBusy" :loading="isBusy">
        <PencilSquareIcon class="h-3 w-3" />
      </ButtonRoundedWithIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from 'yup';
import { Form } from 'vee-validate';
import { useDataStore } from '@/stores/data';
import { useModalStore } from '@/stores/modal';
import { useToasterStore } from '@/stores/toaster';
import type TCrudStatus from '@/types/status';
import { onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import InputForm from '@/components/inputs/InputForm.vue';
import type ISelectOption from '@/types/selectOption';
import SelectForm from '@/components/inputs/SelectForm.vue';
import ButtonRoundedWithIcon from '@/components/buttons/ButtonRoundedWithIcon.vue';
import { PencilSquareIcon } from '@heroicons/vue/24/solid';
import roleServices from '@/services/users/roleServices';
import type { AxiosResponse } from 'axios';
import { handleErrorResponse } from '@/utils/utilities';
import userServices from '@/services/users/userServices';

const { t } = useI18n()
const data = useDataStore()
const modal = useModalStore()
const toast = useToasterStore()

const crudStatus: Ref<TCrudStatus> = ref('I')
const isBusy: Ref<boolean> = ref(false)

interface Props {
  id?: string
  email?: string
  username?: string
  roleId?: string
  // fullname: string
  // gender: string
  // birthPlace: string
  // birthDate: string
  employees?: any
  status?: string
}

const props = defineProps<Props>()

const emails: Ref<string> = ref('')
const usernames: Ref<string> = ref('')
const roles: Ref<ISelectOption | null | undefined> = ref(null)
const fullnames: Ref<string> = ref('')
const genders: Ref<ISelectOption | null | undefined> = ref(null)
const birthPlaces: Ref<string> = ref('')
const birthDates: Ref<string | null> = ref(null)
const statuses: Ref<ISelectOption | null | undefined> = ref(null)

const rolesOptions: Ref<ISelectOption[]> = ref([])
const statusOptions: Ref<ISelectOption[]> = ref([
  {
    label: t('active'),
    value: 'A'
  },
  {
    label: t('inactive'),
    value: 'I'
  }
])
const genderOptions: Ref<ISelectOption[]> = ref([
  {
    label: t('male'),
    value: 'L'
  },
  {
    label: t('female'),
    value: 'P'
  }
])

const schema = yup.object({
  username: yup.string().required(),
  fullname: yup.string().required(),
  gender: yup.object().shape({
    label: yup.string().required(),
    value: yup.string().required()
  }).required(),
  birthPlace: yup.string().required(),
  birthDate: yup.string().required(),
  email: yup.string().email().required(),
  role: yup.object().shape({
    label: yup.string().required(),
    value: yup.string().required()
  }).required(),
  status: yup.object().shape({
    label: yup.string().required(),
    value: yup.string().required()
  }).required()
})

const readData = () => {
  crudStatus.value = data.status
  if (data.status == 'I') {
    // 
  } else if (data.status == 'U') {
    usernames.value = props.username!
    emails.value = props.email!
    fullnames.value = props.employees[0].fullname
    birthPlaces.value = props.employees[0].birthPlace
    birthDates.value = props.employees[0].birthDate
    genders.value = genderOptions.value.find((item) => item.value == props.employees[0].gender)
    statuses.value = statusOptions.value.find((item) => item.value == props.status)
    const timeout = setInterval(() => {
      if (rolesOptions.value.length > 0) {
        clearInterval(timeout)
        roles.value = rolesOptions.value.find((item) => item.value == props.roleId)
      }
    })
  }
}

const save = async () => {
  let payload = {
    username: usernames.value,
    email: emails.value,
    role: roles.value?.value,
    fullname: fullnames.value,
    gender: genders.value?.value,
    birthPlace: birthPlaces.value,
    birthDate: birthDates.value,
    status: statuses.value?.value
  }
  if (crudStatus.value == 'U') {
    payload = Object.assign(payload, { id: props.id, employeeId: props.employees[0].id })
  }
  await userServices.saveUser(payload, crudStatus.value).then((result) => {
    modal.okClicked()
    toast.success({ text: t('success.success'), message: t('success.save', { name: result.data.data.username })})
  }).catch((error) => {
    handleErrorResponse(error)
  }).finally(() => {
    isBusy.value = false
  })
}

const getRoles = async () => {
  const payload = {
    page: 1,
    perPage: 100,
    search: ''
  }
  await roleServices.getRoles(payload).then((result: AxiosResponse) => {
    const data = result.data.data.rows
    for (const item of data) {
      const entry = {
        value: item.id,
        label: item.name
      }
      rolesOptions.value.push(entry)
    }
  }).catch((error: unknown) => {
    handleErrorResponse(error)
  })
}

onMounted(() => {
  readData()
  getRoles()
})
</script>