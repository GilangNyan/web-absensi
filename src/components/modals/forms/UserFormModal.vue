<template>
  <div class="bg-white w-11/12 flex flex-col rounded-lg space-y-4">
    <div class="flex w-full px-4 py-2 border-b border-gray-200">
      <h5 class="text-gray-600 font-bold">{{ (crudStatus == 'I' ? t('label.add') : t('update')) + ' ' + t('title.userData') }}</h5>
    </div>
    <div class="flex flex-col space-y-4 px-4 pb-4">
      <Form id="user-form" class="grid grid-cols-2 gap-2" @submit="save" :validation-schema="schema">
        <!--  -->
      </Form>
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
import { ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const data = useDataStore()
const modal = useModalStore()
const toast = useToasterStore()

const crudStatus: Ref<TCrudStatus> = ref('I')
const isBusy: Ref<boolean> = ref(false)

const schema = yup.object()

const save = async () => {
  // 
}
</script>