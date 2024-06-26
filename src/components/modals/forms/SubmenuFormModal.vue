<template>
  <div class="bg-white w-5/6 md:w-1/3 rounded-lg">
    <div class="flex w-full px-4 py-2 border-b border-gray-200">
      <h5 class="text-gray-600 font-bold">{{ (crudStatus == 'I' ? $t('label.add') : $t('update')) + ' ' + $t('tableHead.submenu') }}</h5>
    </div>
    <div class="flex flex-col items-center p-4 space-y-4">
      <Form
        id="menu-form"
        @submit="save()"
        :validation-schema="schema"
        class="w-full flex flex-col space-y-2"
      >
        <SelectForm name="menu" :label="$t('tableHead.menu')" :options="menuOptions" v-model="menus" />
        <InputForm name="name" :label="$t('tableHead.submenu')" v-model="names" :required="true" />
        <InputForm name="level" :label="$t('tableHead.level')" v-model="levels" :required="true" />
        <InputForm name="url" label="URL" v-model="urls" :required="true" />
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
import menuServices from '@/services/menus/menuServices';
import type { AxiosResponse } from 'axios';
import { useModalStore } from '@/stores/modal';
import { useToasterStore } from '@/stores/toaster';
import { handleErrorResponse, simpleLanguage } from '@/utils/utilities';

interface IMenu {
  id: number
  name: string
  icon: string
}

interface Props {
  id?: number
  name?: string
  level?: number
  url?: string
  isActive?: boolean
  menu?: IMenu
}

const props = defineProps<Props>()

const data = useDataStore()
const lang = useI18n()
const modal = useModalStore()
const toast = useToasterStore()

let isBusy: Ref<boolean> = ref(false)

let crudStatus: Ref<TCrudStatus> = ref('I')
let names: Ref<string> = ref('')
let levels: Ref<number> = ref(1)
let urls: Ref<string> = ref('')
let statuses: Ref<ISelectOption | null | undefined> = ref(null)
let menus: Ref<ISelectOption | null | undefined> = ref(null)
let menuOptions: Ref<ISelectOption[]> = ref([])

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

const schema = yup.object({
  menu: yup.object().shape({
    label: yup.string().required(),
    value: yup.number().required()
  }).required(),
  name: yup.string().required(),
  level: yup.number().required(),
  url: yup.string().required(),
  status: yup.object().shape({
    label: yup.string().required(),
    value: yup.boolean().required()
  }).required()
});

const read = (): void => {
  getMenus()
  if (data.status === 'U') {
    crudStatus.value = 'U'
    names.value = props.name!
    levels.value = props.level!
    urls.value = props.url!
    statuses.value = statusOptions.value.find((item) => {
      return item.value == props.isActive
    })
    let timeout = setInterval(() => {
      if (menuOptions.value.length != 0) {
        clearInterval(timeout)
        menus.value = menuOptions.value.find((item) => {
          return item.value == props.menu?.id
        })
      }
    })
  }
}

const save = async (): Promise<void> => {
  let payload = {
    menuId: menus.value?.value,
    name: names.value,
    level: levels.value,
    url: urls.value,
    isActive: statuses.value?.value
  }
  if (data.status == 'U') {
    payload = Object.assign(payload, { id: props.id })
  }
  await menuServices.saveSubmenus(payload)!.then((result: AxiosResponse) => {
    modal.confirmAction()
    toast.success({ text: lang.t('success.success'), message: lang.t('success.save', { name: result.data.data.name })})
    isBusy.value = false
  }).catch((error: unknown) => {
    handleErrorResponse(error)
    isBusy.value = false
    console.log(error)
  })
}

const getMenus = async (): Promise<void> => {
  let req = {
    page: 1,
    perPage: 999,
    search: ''
  }
  menuOptions.value = []
  menuServices.getMenus(req).then((result: AxiosResponse) => {
    let datas = result.data.data
    datas.rows.forEach((item: any) => {
      let entry: ISelectOption = {
        label: simpleLanguage(item.name),
        value: item.id
      }
      menuOptions.value.push(entry)
    })
    console.log(menuOptions.value)
  }).catch((error: any) => {
    console.log(error)
    handleErrorResponse(error)
  })
}

onMounted(() => {
  read()
})
</script>