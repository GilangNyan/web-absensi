<template>
  <h2 class="font-semibold text-xl text-gray-800 text-center">{{ $t('login') }}</h2>
  <Form
    class="space-y-2"
    id="login"
    @submit="login"
    :validation-schema="schema"
  >
    <InputFullWidth name="username" type="text" v-model="username" :label="$t('label.username')" />
    <InputFullWidth name="password" type="password" v-model="password" :label="$t('label.password')" />
    <ButtonRoundedFullWidth form="login" :label="$t('login')" :loading="isLoading" />
  </Form>
  <div class="flex justify-between">
    <span></span>
    <RouterLink to="/forgot-password" class="text-xs text-gray-800 underline">{{ $t('label.forgotPassword') }}</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate'
import * as yup from 'yup'
import InputFullWidth from '@/components/inputs/InputFullWidth.vue'
import ButtonRoundedFullWidth from '@/components/buttons/ButtonRoundedFullWidth.vue'
import authenticationServices from '@/services/authentication/authenticationServices'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
import { useToasterStore } from '@/stores/toaster'
import { useI18n } from 'vue-i18n'
import { getLocation } from '@/utils/utilities'

const lang = useI18n()

let username: string = ''
let password: string = ''
let isLoading: boolean = false

const authStore = useAuthStore()
const toasterStore = useToasterStore()

// Validation Schema
const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().required().min(8)
})

const login = async () => {
  isLoading = true
  let payload = {
    username: username,
    password: password
  }
  await getLocation()
  await authenticationServices.login(payload).then(result => {
    authStore.setCredentials(result.data.data.accessToken, result.data.data.menus)
    isLoading = false
    router.push('/dashboard')
    toasterStore.success({ text: lang.t('success.success'), message: lang.t('success.login') })
  }).catch(error => {
    isLoading = false
    console.log(error)
  })
}
</script>