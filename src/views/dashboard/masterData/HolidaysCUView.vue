<template>
  <MainPages>
    <div class="flex items-center justify-between">
      <h1 class="font-bold text-gray-700 text-xl">{{ `${$t('label.add')} ${$t('title.holidaysData')}` }}</h1>
    </div>
    <hr>
    <Form
      id="holidaysForm"
      @submit="save()"
      :validation-schema="schema"
    >
      <div class="w-full md:w-1/2 space-y-4">
        <InputForm name="name" :label="$t('label.name')" v-model="name" :required="true" />
        <InputForm name="date" :label="$t('label.date')" v-model="date" :required="true" type="date" />
        <InputForm name="description" :label="$t('label.description')" v-model="description" type="textarea" />
      </div>
    </Form>
    <div class="flex w-full justify-between items-center">
      <ButtonWithIcon color="gray" :label="$t('label.back')" @click="goToPage('/master-data/holidays')" :disabled="isBusy" :loading="isBusy">
        <ArrowUturnLeftIcon class="h-3 w-3" />
      </ButtonWithIcon>
      <ButtonWithIcon color="blue" :label="$t('label.save')" type="submit" form="holidaysForm" :disabled="isBusy" :loading="isBusy">
        <PencilSquareIcon class="h-3 w-3" />
      </ButtonWithIcon>
    </div>
  </MainPages>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import * as yup from 'yup';
import MainPages from '@/components/main/MainPages.vue';
import InputForm from '@/components/inputs/InputForm.vue';
import ButtonWithIcon from '@/components/buttons/ButtonWithIcon.vue';
import { onMounted, ref, type Ref } from 'vue';
import holidayServices from '@/services/masterData/holidayServices';
import { handleErrorResponse } from '@/utils/utilities';
import type { AxiosResponse } from 'axios';
import router from '@/router';
import { useToasterStore } from '@/stores/toaster';
import { useDataStore } from '@/stores/data';
import { useI18n } from 'vue-i18n';
import { ArrowUturnLeftIcon, PencilSquareIcon } from '@heroicons/vue/24/solid';

const lang = useI18n()
const toast = useToasterStore()
const data = useDataStore()

let isBusy: Ref<boolean> = ref(false)

let name: Ref<string> = ref('');
let date: Ref<string | null> = ref(null);
let description: Ref<string> = ref('');

// Validation Schema
const schema = yup.object({
  name: yup.string().required(),
  date: yup.string().required()
});

const save = async (): Promise<void> => {
  let payload = {
    name: name.value,
    date: date.value,
    description: description.value
  };
  if (data.status === 'U') {
    payload = Object.assign(payload, { id: data.values.id })
  }
  isBusy.value = true
  await holidayServices.saveHoliday(payload)!.then((result: AxiosResponse) => {
    toast.success({ text: lang.t('success.success'), message: lang.t('success.save', { name: result.data.data.name }) })
    goToPage('/master-data/holidays')
    isBusy.value = false
  }).catch((error: any) => {
    handleErrorResponse(error)
    isBusy.value = false
    console.log(error)
  })
}

const goToPage = (route: string): void => {
  router.push(route)
}

const readData = (): void => {
  if (data.status === 'I') {
    // 
  } else if (data.status === 'U') {
    let datas = data.values
    name.value = datas.name
    date.value = datas.date
    description.value = datas.description
  }
}

onMounted(() => {
  readData()
})
</script>