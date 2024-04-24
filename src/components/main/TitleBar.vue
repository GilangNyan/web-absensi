<template>
  <div class="flex w-full justify-between items-center bg-white px-6 py-3 sm:bg-indigo-50 sm:px-6 sm:py-4">
    <!-- Kiri -->
    <div class="flex space-x-4 items-center">
      <Bars3Icon class="w-6 h-6 text-indigo-900 cursor-pointer" @click="toggleSidebar()" />
      <!-- <div class="flex flex-col">
        <h1 class="font-bold text-indigo-900 text-xl">Test</h1>
        <BreadCrumbs />
      </div> -->
    </div>
    <!-- Kanan -->
    <div class="flex relative" v-closable="{ handler: onClose, exclude: ['toggler'] }">
      <button class="flex space-x-4 items-center" @click="handleUserDropdownClick()" ref="toggler">
        <div class="flex flex-col text-right">
          <span class="text-xs font-semibold text-indigo-900">{{ userFullname }}</span>
          <span class="text-xs text-indigo-600">{{ userRole }}</span>
        </div>
        <img src="@/assets/images/user.png" class="w-8 h-8 rounded-full">
      </button>
      <!-- Dropdown -->
      <Transition name="slide-up">
        <div
          class="absolute top-10 right-0 z-30 bg-white border border-gray-200 shadow-lg rounded-lg text-sm min-w-48"
          v-if="toggleUserDropdown"
        >
          <div class="dropdown-item">
            <UserIcon class="w-4 h-4" />
            <span>{{ $t('label.account') }}</span>
          </div>
          <div class="dropdown-item">
            <BellIcon class="w-4 h-4" />
            <span>{{ $t('label.notifications') }}</span>
          </div>
          <hr>
          <div
            class="dropdown-item relative"
            @click="handleLangDropdownClick()"
            v-closable="{ handler: onCloseLang, exclude: ['toggler', 'langToggler'] }"
            ref="langToggler"
          >
            <div class="flex w-full items-center justify-between">
              <div class="flex items-center space-x-2">
                <GlobeAltIcon class="w-4 h-4" />
                <span>{{ $t('label.language') }}</span>
              </div>
              <img :src="loadLangImage($i18n.locale)" :alt="$i18n.locale" class="h-4">
            </div>
            <Transition name="slide-right">
              <div
                class="absolute bg-white border border-gray-200 shadow-lg rounded-lg top-0 right-full z-40 min-w-32"
                v-if="toggleLangDropdown"
              >
                <div
                  class="dropdown-item"
                  v-for="locale in $i18n.availableLocales"
                  :key="locale"
                  @click="switchLanguage(locale)"
                >
                  <img :src="loadLangImage(locale)" :alt="locale" class="h-4">
                  <span>{{ $t(`lang.${locale}`) }}</span>
                </div>
              </div>
            </Transition>
          </div>
          <hr>
          <div class="dropdown-item" @click="logout()">
            <ArrowRightStartOnRectangleIcon class="w-4 h-4" />
            <span>{{ $t('label.logout') }}</span>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightStartOnRectangleIcon, Bars3Icon, BellIcon, GlobeAltIcon, UserIcon } from '@heroicons/vue/24/outline';
import { decodeJwt } from '@/utils/crypt';
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref, type Ref } from 'vue';
import router from '@/router';
import { useToasterStore } from '@/stores/toaster';
import { useI18n } from 'vue-i18n';
import { useLanguageStore } from '@/stores/language';
// import BreadCrumbs from './BreadCrumbs.vue';

interface Props {
  value: boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
  update: [sidebar: boolean]
}>()

const auth = useAuthStore()
const toast = useToasterStore()
const lang = useI18n()
const langStore = useLanguageStore()

let userFullname: Ref<string> = ref('')
let userRole: Ref<string> = ref('')

let toggleUserDropdown: Ref<boolean> = ref(false)
let toggleLangDropdown: Ref<boolean> = ref(false)

const toggleSidebar = () => {
  emits('update', !props.value)
}

const getCurrentUserData = () => {
  let token = auth.token
  let decoded = decodeJwt(token)
  userFullname.value = decoded.employees[0].fullname
  userRole.value = decoded.role.name
}

const handleUserDropdownClick = () => {
  toggleUserDropdown.value = !toggleUserDropdown.value
}

const handleLangDropdownClick = () => {
  toggleLangDropdown.value = !toggleLangDropdown.value
}

const onClose = () => {
  toggleUserDropdown.value = false
  onCloseLang()
}

const onCloseLang = () => {
  toggleLangDropdown.value = false
}

const logout = () => {
  auth.clearCredentials()
  router.push('/login')
  toast.success({ text: lang.t('success.success'), message: lang.t('success.logout') })
}

const switchLanguage = (locale: string) => {
  toggleLangDropdown.value = false
  langStore.switchLanguage(locale)
}

const loadLangImage = (locale: string) => {
  return new URL(`../../assets/images/lang/${locale}.png`, import.meta.url).href
}

onMounted(() => {
  getCurrentUserData()
})
</script>

<style scoped>
.dropdown-item {
  @apply px-3 py-2 flex space-x-2 hover:bg-gray-100 cursor-pointer items-center
}

.slide-up-enter-from,
.slide-up-leave-to {
  @apply -translate-y-10 opacity-0
}

.slide-up-leave-from,
.slide-up-enter-to {
  @apply translate-y-0 opacity-100
}

.slide-up-enter-active,
.slide-up-leave-active {
  @apply transition-all duration-300
}

.slide-right-enter-from,
.slide-right-leave-to {
  @apply translate-x-10 opacity-0
}

.slide-right-leave-from,
.slide-right-enter-to {
  @apply translate-x-0 opacity-100
}

.slide-right-enter-active,
.slide-right-leave-active {
  @apply transition-all duration-300
}
</style>