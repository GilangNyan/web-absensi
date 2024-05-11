<template>
  <div class="bg-white w-5/6 md:w-1/3 rounded-lg">
    <div class="flex w-full px-4 py-2 border-b border-gray-200">
      <h5 class="text-gray-600 font-bold">{{ (crudStatus == 'I' ? $t('label.add') : $t('update')) + ' ' + $t('tableHead.menu') }}</h5>
    </div>
    <div class="flex flex-col items-center p-4 space-y-4">
      <Form
        id="menu-form"
        @submit="save()"
        :validation-schema="schema"
        class="w-full flex flex-col space-y-2"
      >
        <InputForm name="name" :label="$t('tableHead.menu')" v-model="names" :required="true" />
        <InputForm name="icon" :label="$t('label.icon')" v-model="icons" :required="true" />
        <InputForm name="level" :label="$t('tableHead.level')" v-model="levels" :required="true" />
        <RadioForm name="hasChild" :options="hasChildOptions" :label="$t('label.hasSubmenu')" v-model="hasChilds" />
        <InputForm name="url" label="URL" v-model="urls" :disabled="hasChilds" />
        <SelectForm name="status" :label="$t('tableHead.status')" :options="statusOptions" v-model="statuses" />
      </Form>
      <div class="flex w-full justify-end items-center">
        <ButtonRoundedWithIcon color="indigo" :label="$t('label.save')" type="submit" form="menu-form" :disabled="isBusy" :loading="isBusy">
          <PencilSquareIcon class="h-3 w-3" />
        </ButtonRoundedWithIcon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputForm from '@/components/inputs/InputForm.vue';
import ButtonRoundedWithIcon from '@/components/buttons/ButtonRoundedWithIcon.vue';
import { useDataStore } from '@/stores/data';
import type TCrudStatus from '@/types/status';
import { Form } from 'vee-validate';
import { onMounted, ref, type Ref } from 'vue';
import * as yup from 'yup';
import { PencilSquareIcon } from '@heroicons/vue/24/solid';
import SelectForm from '@/components/inputs/SelectForm.vue';
import type ISelectOption from '@/types/selectOption';
import { useI18n } from 'vue-i18n';
import RadioForm from '@/components/inputs/RadioForm.vue';
import menuServices from '@/services/menus/menuServices';
import type { AxiosResponse } from 'axios';
import { useModalStore } from '@/stores/modal';
import { useToasterStore } from '@/stores/toaster';
import { handleErrorResponse } from '@/utils/utilities';

interface Props {
  id?: number
  name?: string
  icon?: string
  level?: number
  url?: string
  isActive?: boolean
  hasChild?: boolean
}

const props = defineProps<Props>()

const data = useDataStore()
const lang = useI18n()
const modal = useModalStore()
const toast = useToasterStore()

let isBusy: Ref<boolean> = ref(false)

let crudStatus: Ref<TCrudStatus> = ref('I')
let names: Ref<string> = ref('')
let icons: Ref<string> = ref('')
let levels: Ref<number> = ref(1)
let urls: Ref<string> = ref('')
let statuses: Ref<ISelectOption | null | undefined> = ref(null)
let hasChilds: Ref<boolean> = ref(false)

let statusOptions: Ref<ISelectOption[]> = ref([
  {
    value: true,
    label: lang.t('active')
  },
  {
    value: false,
    label: lang.t('inactive')
  }
])

let hasChildOptions: Ref<ISelectOption[]> = ref([
  {
    value: true,
    label: lang.t('yes')
  },
  {
    value: false,
    label: lang.t('no')
  }
])

const schema = yup.object({
  name: yup.string().required(),
  icon: yup.string().required(),
  level: yup.number().required(),
  url: yup.string().when([], (val, schema) => {
    if (hasChilds.value) {
      return schema.notRequired()
    } else {
      return schema.required()
    }
  }),
  status: yup.object().shape({
    label: yup.string().required(),
    value: yup.boolean().required()
  }).required(),
  hasChild: yup.boolean().required()
});

const read = (): void => {
  if (data.status === 'U') {
    crudStatus.value = 'U'
    names.value = props.name!
    icons.value = props.icon!
    levels.value = props.level!
    urls.value = props.url!
    statuses.value = statusOptions.value.find((item) => {
      return item.value == props.isActive
    })
    hasChilds.value = props.hasChild
  }
}

const save = async (): Promise<void> => {
  let payload = {
    name: names.value,
    icon: icons.value,
    level: levels.value,
    hasChild: hasChilds.value,
    url: urls.value,
    isActive: statuses.value?.value
  }
  if (data.status == 'U') {
    payload = Object.assign(payload, { id: props.id })
  }
  await menuServices.saveMenus(payload)!.then((result: AxiosResponse) => {
    modal.confirmAction()
    toast.success({ text: lang.t('success.success'), message: lang.t('success.save', { name: result.data.data.name })})
    isBusy.value = false
  }).catch((error: unknown) => {
    handleErrorResponse(error)
    isBusy.value = false
    console.log(error)
  })
}

onMounted(() => {
  read()
})
</script>