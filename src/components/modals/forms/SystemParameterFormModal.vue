<template>
  <div class="bg-white w-5/6 md:w-1/3 rounded-lg">
    <div class="flex w-full px-4 py-2 border-b border-gray-200">
      <h5 class="text-gray-600 font-bold">{{ $t('update') + ' ' + $t('title.systemParameters') }}</h5>
    </div>
    <div class="flex flex-col items-center p-4 space-y-4">
      <Form
        id="system-parameter-form"
        :validation-schema="schema"
        @submit="save()"
        class="w-full flex flex-col space-y-2"
      >
        <InputForm name="key" :label="$t('tableHead.name')" v-model="keys" :required="true" :disabled="true" />
        <InputForm name="value" :label="$t('tableHead.value')" v-model="values" :required="true" />
        <InputForm name="description" :label="$t('tableHead.description')" v-model="descriptions" :required="true" :disabled="true" type="textarea" />
      </Form>
      <div class="flex w-full justify-end items-center">
        <ButtonRoundedWithIcon color="indigo" :label="$t('label.save')" type="submit" form="system-parameter-form" :disabled="isBusy" :loading="isBusy">
          <PencilSquareIcon class="h-3 w-3" />
        </ButtonRoundedWithIcon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputForm from '@/components/inputs/InputForm.vue';
import ButtonRoundedWithIcon from '@/components/buttons/ButtonRoundedWithIcon.vue';
import systemParametersServices from '@/services/options/systemParametersServices';
import { useDataStore } from '@/stores/data';
import { useModalStore } from '@/stores/modal';
import { useToasterStore } from '@/stores/toaster';
import { handleErrorResponse, simpleLanguage } from '@/utils/utilities';
import { PencilSquareIcon } from '@heroicons/vue/24/solid';
import type { AxiosResponse } from 'axios';
import { Form } from 'vee-validate';
import { onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

interface Props {
  id: string
  name: string
  value: string
  description: string
}

const props = defineProps<Props>()

const lang = useI18n()
const data = useDataStore()
const modal = useModalStore()
const toast = useToasterStore()

let isBusy: Ref<boolean> = ref(false)

let keys: Ref<string> = ref('')
let values: Ref<string> = ref('')
let descriptions: Ref<string> = ref('')

const schema = yup.object({
  key: yup.string().required(),
  value: yup.string().required(),
  description: yup.string().required()
})

const read = (): void => {
  if (data.status === 'U') {
    keys.value = props.name
    values.value = props.value
    descriptions.value = simpleLanguage(props.description)
  }
}

const save = async (): Promise<void> => {
  const payload = {
    id: props.id,
    key: props.name,
    value: values.value,
    description: props.description
  }
  await systemParametersServices.saveSystemParameters(payload)!.then((result: AxiosResponse) => {
    modal.confirmAction()
    toast.success({ text: lang.t('success.success'), message: lang.t('success.save', { name: result.data.data.key })})
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