<template>
  <div class="w-full px-6 py-4 bg-white rounded-lg">
    <h5 class="text-lg font-semibold text-indigo-900">{{t('title.changePassword')}}</h5>
    <div class="grid grid-cols-2 gap-2 my-4">
      <Form id="change-password-form" @submit="submit" :validation-schema="schema">
        <InputForm name="oldPassword" :label="t('label.oldPassword')" v-model="oldPassword" type="password" />
        <InputForm name="newPassword" :label="t('label.newPassword')" v-model="newPassword" type="password" />
        <InputForm name="confirmPassword" :label="t('label.confirmPassword')" v-model="confirmPassword" type="password" />
      </Form>
    </div>
    <div class="flex w-full items-center justify-end">
      <ButtonRoundedWithIcon color="indigo" :label="$t('label.save')" type="submit" form="change-password-form" :disabled="isBusy" :loading="isBusy">
        <PencilSquareIcon class="h-3 w-3" />
      </ButtonRoundedWithIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import { ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import ButtonRoundedWithIcon from '../buttons/ButtonRoundedWithIcon.vue';
import InputForm from '../inputs/InputForm.vue';
import { PencilSquareIcon } from '@heroicons/vue/24/solid';
import authenticationServices from '@/services/authentication/authenticationServices';
import { handleErrorResponse } from '@/utils/utilities';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';
import { useToasterStore } from '@/stores/toaster';

const { t } = useI18n()
const auth = useAuthStore()
const toast = useToasterStore()

const isBusy: Ref<boolean> = ref(false)

const oldPassword: Ref<string> = ref('')
const newPassword: Ref<string> = ref('')
const confirmPassword: Ref<string> = ref('')

const schema = yup.object({
  oldPassword: yup.string().min(8).max(14).required(),
  newPassword: yup.string().min(8).max(14).test('isValidPass', t('validation.password'), (value, context) => {
    const hasUpperCase = /[A-Z]/.test(value!)
    const hasLowerCase = /[a-z]/.test(value!)
    const hasNumber = /[0-9]/.test(value!)
    const hasSymbol = /[!@#%&]/.test(value!)
    let validConditions = 0
    const numberOfMustBeValidConditions = 3
    const conditions = [hasLowerCase, hasUpperCase, hasNumber, hasSymbol]
    conditions.forEach((condition) =>
      condition ? validConditions++ : null
    );
    if (validConditions >= numberOfMustBeValidConditions) {
      return true;
    }
    return false;
  }).required(),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], t('validation.confirmPassword')).required()
})

const submit = async (): Promise<void> => {
  const payload = {
    oldPassword: oldPassword.value,
    newPassword: newPassword.value
  }
  isBusy.value = true
  await authenticationServices.changePassword(payload).then((result) => {
    auth.clearCredentials()
    router.push('/login')
    toast.success({ text: t('success.changePassword') })
  }).catch((error) => {
    handleErrorResponse(error)
  }).finally(() => {
    isBusy.value = false
  })
}
</script>