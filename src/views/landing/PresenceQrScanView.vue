<template>
  <div class="flex flex-col min-h-dvh bg-gradient-to-tr from-white to-indigo-500 items-center justify-center space-y-12">
    <div class="flex flex-col w-full items-center justify-center space-x-4">
      <div class="flex w-10/12 space-x-4">
        <div class="w-3/4 rounded-lg">
          <QrCamera :is-detected="!isScanning" @qr-code="getStudentDataByQr($event)" @is-detected="isScanning = !$event" />
        </div>
        <div class="w-1/4 grid grid-rows-4 gap-4">
          <div class="side-button">
            <span class="card-label">{{ $t('label.time') }}</span>
            <h3 class="card-value flex-grow">{{ currentTime }}</h3>
          </div>
          <div class="side-button">
            <span class="card-label">{{ $t('label.name') }}</span>
            <h3 class="card-value flex-grow">{{ studentName }}</h3>
          </div>
          <button class="side-button confirm" @click.prevent="submitAttendance()" :disabled="isScanning" v-if="isFailed">
            {{ $t('label.confirm') }}
          </button>
          <button class="side-button confirm" @click.prevent="submitAttendance()" :disabled="isScanning" v-else>
            {{ $t('label.confirm') }}
          </button>
          <button class="side-button back" @click.prevent="goToPage('/')">
            {{ $t('label.back') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QrCamera from '@/components/main/QrCamera.vue';
import router from '@/router';
import attendanceServices from '@/services/masterData/attendanceServices';
import studentServices from '@/services/masterData/studentServices';
import { useAuthStore } from '@/stores/auth';
import { useToasterStore } from '@/stores/toaster';
import { handleErrorResponse } from '@/utils/utilities';
import type { AxiosResponse } from 'axios';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

const lang = useI18n()
const toast = useToasterStore()
const auth = useAuthStore()

const isScanning: Ref<boolean> = ref(true)
const isFailed: Ref<boolean> = ref(false)
const currentTime: Ref<string> = ref(new Date().toLocaleTimeString())
const studentName: Ref<string> = ref('')
const datas: Ref<any> = ref('')

const goToPage = (route: string): void => {
  router.push(route)
}

const getStudentDataByQr = async (data: string) => {
  console.log(data)
  const regex = /^\d{10}$/ // 10 digit string angka
  if (!regex.test(data)) {
    toast.warning({ text: lang.t('warning.warning'), message: 'QR Tidak Valid' })
    isFailed.value = true
    return null
  }
  const payload = {
    nisn: data
  }
  await studentServices.getStudentByQr(payload).then((result: AxiosResponse) => {
    console.log('Siswa Didapatkan', result)
    datas.value = result.data.data
    isFailed.value = false
    studentName.value = datas.value.student.fullname
  }).catch((error: unknown) => {
    isFailed.value = true
    handleErrorResponse(error)
  })
}

const submitAttendance = async (): Promise<void> => {
  const payload = {
    studentId: datas.value.studentId,
    gradeId: datas.value.gradeId,
    academicYearId: auth.year? auth.year.id : datas.value.academicYearId,
    date: new Date(),
    status: 'H'
  }
  await attendanceServices.recordAttendance(payload).then((result: AxiosResponse) => {
    toast.success({ text: lang.t('success.success'), message: lang.t('success.recordAttendance') })
    console.log(result)
    goToPage('/')
  }).catch((error: any) => {
    handleErrorResponse(error)
  })
}

const updateTime = (): void => {
  currentTime.value = new Date().toLocaleTimeString()
}

let interval: number

onMounted(() => {
  interval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.side-button {
  @apply bg-white hover:bg-gray-100 rounded-lg px-4 py-2 shadow-lg
}

.confirm {
  @apply bg-blue-500 hover:bg-blue-600 text-lg font-bold text-white disabled:bg-blue-400 disabled:hover:bg-blue-400
}

.back {
  @apply bg-red-500 hover:bg-red-600 text-lg font-bold text-white
}

.card-label {
  @apply text-xs font-medium
}

.card-value {
  @apply text-xl font-bold
}
</style>