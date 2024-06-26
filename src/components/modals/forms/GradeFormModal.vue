<template>
  <div class="bg-white w-5/6 md:w-1/3 rounded-lg">
    <div class="flex w-full px-4 py-2 border-b border-gray-200">
      <h5 class="text-gray-600 font-bold">{{ (crudStatus == 'I' ? $t('label.add') : $t('update')) + ' ' + $t('title.gradesData') }}</h5>
    </div>
    <div class="flex flex-col items-center p-4 space-y-4">
      <Form
        id="grade-form"
        @submit="save()"
        :validation-schema="schema"
        class="w-full flex"
      >
        <InputForm name="name" :label="$t('label.gradeName')" v-model="names" :required="true" />
      </Form>
      <div class="flex w-full justify-end items-center">
        <ButtonRoundedWithIcon color="indigo" :label="$t('label.save')" type="submit" form="grade-form" :disabled="isBusy" :loading="isBusy">
          <PencilSquareIcon class="h-3 w-3" />
        </ButtonRoundedWithIcon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputForm from '@/components/inputs/InputForm.vue';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import { onMounted, ref, type Ref } from 'vue';
import { PencilSquareIcon } from '@heroicons/vue/24/solid';
import ButtonRoundedWithIcon from '@/components/buttons/ButtonRoundedWithIcon.vue';
import gradeServices from '@/services/masterData/gradeServices';
import type { AxiosResponse } from 'axios';
import { handleErrorResponse } from '@/utils/utilities';
import { useToasterStore } from '@/stores/toaster';
import { useI18n } from 'vue-i18n';
import { useModalStore } from '@/stores/modal';
import { useDataStore } from '@/stores/data';
import type TCrudStatus from '@/types/status';

interface Props {
  id?: string,
  name?: string
}

const props = defineProps<Props>()

const toast = useToasterStore()
const modal = useModalStore()
const data = useDataStore()
const lang = useI18n()

let isBusy: Ref<boolean> = ref(false)

let crudStatus: Ref<TCrudStatus> = ref('I')
let names: Ref<string> = ref('')

const schema = yup.object({
  name: yup.string().required()
});

const read = (): void => {
  if (data.status === 'U') {
    crudStatus.value = 'U'
    names.value = props.name!
  }
}

const save = async (): Promise<void> => {
  let payload = {
    name: names.value
  }
  if (data.status === 'U') {
    payload = Object.assign(payload, { id: props.id })
  }
  isBusy.value = true
  await gradeServices.saveGrades(payload)!.then((result: AxiosResponse) => {
    modal.confirmAction()
    toast.success({ text: lang.t('success.success'), message: lang.t('success.save', { name: result.data.data.name })})
    isBusy.value = false
  }).catch((error: any) => {
    handleErrorResponse(error)
    isBusy.value = false
    console.log(error)
  })
}

onMounted(() => {
  read()
})
</script>