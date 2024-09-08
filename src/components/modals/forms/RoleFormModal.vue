<template>
  <div class="bg-white w-5/6 md:w-1/2 rounded-lg max-h-dvh overflow-x-hidden overflow-y-auto">
    <div class="flex flex-col">
      <div class="flex w-full px-4 py-2 border-b border-gray-200">
        <h5 class="text-gray-600 font-bold">{{ (crudStatus == 'I' ? $t('label.add') : $t('update')) + ' ' + $t('label.role') }}</h5>
      </div>
      <div class="flex flex-col space-y-4 p-4">
        <Form id="role-form" @submit="save" :validation-schema="schema" class="w-full flex flex-col space-y-2">
          <InputForm name="name" :label="t('label.name')" v-model="names" />
          <InputForm name="description" :label="t('label.description')" v-model="descriptions" />
          <div v-for="(item, index) in menuList" :key="index" class="flex flex-col space-y-2">
            <div class="flex w-full space-x-2">
              <input type="checkbox" :id="item.id" v-model="item.checked" :value="item.id">
              <label :for="item.id">{{ simpleLanguage(item.name) }}</label>
            </div>
            <template v-if="item.submenus && item.submenus.length != 0">
              <span v-for="(subItem, subIndex) in item.submenus" :key="subIndex" class="flex flex-col w-full ml-6">
                {{ simpleLanguage(subItem.name) }}
              </span>
            </template>
          </div>
        </Form>
      </div>
    </div>
    <div class="flex w-full items-center justify-end px-4 pb-4">
      <ButtonRoundedWithIcon color="indigo" :label="$t('label.save')" type="submit" form="role-form" :disabled="isBusy" :loading="isBusy">
        <PencilSquareIcon class="h-3 w-3" />
      </ButtonRoundedWithIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from 'yup';
import { Form } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useDataStore } from '@/stores/data';
import { useModalStore } from '@/stores/modal';
import { useToasterStore } from '@/stores/toaster';
import type TCrudStatus from '@/types/status';
import { onMounted, ref, type Ref } from 'vue';
import InputForm from '@/components/inputs/InputForm.vue';
import ButtonRoundedWithIcon from '@/components/buttons/ButtonRoundedWithIcon.vue';
import { PencilSquareIcon } from '@heroicons/vue/24/solid';
import menuServices from '@/services/menus/menuServices';
import { handleErrorResponse, simpleLanguage } from '@/utils/utilities';
import roleServices from '@/services/users/roleServices';

const { t } = useI18n()
const data = useDataStore()
const modal = useModalStore()
const toast = useToasterStore()

interface Props {
  id: string
  name: string
  description: string
  menus: any[]
}

const props = defineProps<Props>()

const crudStatus: Ref<TCrudStatus> = ref('I')
const isBusy: Ref<boolean> = ref(false)

const names: Ref<string> = ref('')
const descriptions: Ref<string> = ref('')
const menuList: Ref<any[]> = ref([])

const schema = yup.object({
  name: yup.string().required(),
  description: yup.string().required()
})

const read = () => {
  if (data.status == 'U') {
    crudStatus.value = 'U'
    names.value = props.name
    descriptions.value = props.description
  }
}

const save = async () => {
  isBusy.value = true
  const menus = []
  for (const item of menuList.value) {
    if (item.checked) {
      menus.push(item.id)
    }
  }
  let payload = {
    name: names.value,
    description: descriptions.value,
    menus: menus
  }
  try {
    if (data.status === 'I') {
      await roleServices.createRoles(payload).then((result) => {
        modal.okClicked()
        toast.success({ text: t('success.success'), message: t('success.save', { name: result.data.data.name })})
      })
    } else if (data.status === 'U') {
      payload = Object.assign(payload, { id: props.id })
      await roleServices.updateRoles(payload).then((result) => {
        modal.okClicked()
        toast.success({ text: t('success.success'), message: t('success.save', { name: result.data.data.name })})
      })
    }
  } catch (error) {
    handleErrorResponse(error)
  } finally {
    isBusy.value = false
  }
}

const getMenus = async () => {
  const req = {
    page: 1,
    limit: 9999,
    search: ''
  }
  await menuServices.getMenus(req).then((result) => {
    menuList.value = result.data.data.rows.map((item: any) => {
      return Object.assign(item, { checked: false })
    })
    menuList.value.sort((a, b) => a.level - b.level)
    if (data.status == 'U') {
      props.menus.forEach((item: any) => {
        menuList.value.map((subItem: any) => {
          if (item.id === subItem.id) {
            return subItem.checked = true
          }
        })
      })
    }
  }).catch((error) => {
    handleErrorResponse(error)
  })
}

onMounted(() => {
  read()
  getMenus()
})
</script>