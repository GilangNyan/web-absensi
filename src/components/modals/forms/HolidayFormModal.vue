<template>
  <div class="bg-white w-5/6 md:w-1/3 rounded-lg">
    <div class="flex w-full px-4 py-2 border-b border-gray-200">
      <h5 class="text-gray-600 font-bold">{{ (crudStatus == 'I' ? $t('label.add') : $t('update')) + ' ' + $t('tableHead.menu') }}</h5>
    </div>
    <div class="flex flex-col items-center p-4 space-y-4">
      <Form
        id="holiday-form"
        @submit="save()"
        :validation-schema="schema"
        class="w-full flex flex-col space-y-2"
      >
        <InputForm name="name" :label="$t('label.name')" v-model="names" :required="true" />
        <InputForm name="date" :label="$t('label.name')" v-model="dates" :required="true" type="date" />
        <InputForm name="description" :label="$t('label.description')" v-model="descriptions" type="textarea" />
      </Form>
      <div class="flex w-full justify-end items-center">
        <ButtonRoundedWithIcon color="indigo" :label="$t('label.save')" type="submit" form="menu-form" :disabled="isBusy" :loading="isBusy">
          <PencilIcon class="w-3 h-3" />
        </ButtonRoundedWithIcon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from 'yup';
import { Form } from 'vee-validate';
import { onMounted, ref, type Ref } from 'vue';
import type TCrudStatus from '@/types/status';
import { useDataStore } from '@/stores/data';
import { useModalStore } from '@/stores/modal';
import { useI18n } from 'vue-i18n';
import { useToasterStore } from '@/stores/toaster';
import InputForm from '@/components/inputs/InputForm.vue';
import ButtonRoundedWithIcon from '@/components/buttons/ButtonRoundedWithIcon.vue';
import { PencilIcon } from '@heroicons/vue/24/solid';
import holidayServices from '@/services/masterData/holidayServices';
import type { AxiosResponse } from 'axios';
import { handleErrorResponse } from '@/utils/utilities';

interface Props {
  id?: string
  name?: string
  date?: string
  description?: string
}

const props = defineProps<Props>();

const lang = useI18n();
const data = useDataStore();
const modal = useModalStore();
const toast = useToasterStore();

let isBusy: Ref<boolean> = ref(false);

let crudStatus: Ref<TCrudStatus> = ref('I');
let names: Ref<string> = ref('');
let dates: Ref<string | null> = ref('');
let descriptions: Ref<string> = ref('');

// Validation Schema
const schema = yup.object({
  name: yup.string().required(),
  date: yup.string().required()
});

const read = (): void => {
  if (data.status === 'U') {
    crudStatus.value = 'U';
    names.value = props.name!;
    dates.value = props.date!;
    descriptions.value = props.description!;
  }
}

const save = async (): Promise<void> => {
  let payload = {
    name: names.value,
    date: dates.value,
    description: descriptions.value
  };
  if (data.status === 'U') {
    payload = Object.assign(payload, { id: props.id });
  }
  isBusy.value = true;
  await holidayServices.saveHoliday(payload)!.then((result: AxiosResponse) => {
    modal.confirmAction()
    toast.success({ text: lang.t('success.success'), message: lang.t('success.save', { name: result.data.data.name })})
    isBusy.value = false
  }).catch((error: unknown) => {
    handleErrorResponse(error)
    isBusy.value = false
    console.log(error)
  });
}

onMounted(() => {
  read();
});
</script>