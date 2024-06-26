<template>
  <div class="flex flex-col min-h-dvh bg-gradient-to-tr from-white to-indigo-500 items-center justify-center space-y-12">
    <div class="flex flex-col space-y-4 items-center justify-center">
      <img src="@/assets/images/tutwuri.png" alt="Logo Tut Wuri Handayani" class="w-32 drop-shadow-lg">
      <h2 class="text-3xl font-bold uppercase">E-Absensi SMAN 1 Beber</h2>
    </div>
    <div class="flex flex-col w-full items-center justify-center space-y-6">
      <!-- Card Grid -->
      <div class="grid grid-cols-3 gap-4 w-10/12">
        <!-- Card 1 -->
        <div class="card">
          <div class="clock">
            <div class="dot"></div>
            <div>
              <div class="hour-hand" :style="{ transform: `rotate(${hourAngle}deg)` }"></div>
              <div class="minute-hand" :style="{ transform: `rotate(${minuteAngle}deg)` }"></div>
              <div class="second-hand" :style="{ transform: `rotate(${secondAngle}deg)` }"></div>
            </div>
            <div>
              <span class="hour3">3</span>
              <span class="hour6">6</span>
              <span class="hour9">9</span>
              <span class="hour12">12</span>
            </div>
            <div class="dial-lines" v-for="n in 12" :key="n" :style="{ transform: `rotate(${n * 30}deg)` }"></div>
            <div class="dial-inner"></div>
          </div>
        </div>
        <!-- Card 2 -->
        <div class="card cursor-pointer" @click="goToPage('/presence-qr-scan')">
          <QrCodeIcon class="w-2/3 h-2/3" />
        </div>
        <!-- Card 3 -->
        <div class="card cursor-pointer" @click="goToPage(auth.token ? '/dashboard' : '/login')">
          <UserIcon class="w-2/3 h-2/3" />
        </div>
      </div>
      <!-- Button Grid -->
      <div class="grid grid-cols-3 gap-4 w-10/12">
        <ButtonRoundedFullWidth color="blue" :label="dateLabel" :loading="false" />
        <ButtonRoundedFullWidth color="blue" :label="$t('label.takeAttendance')" :loading="false" @click="goToPage('/presence-qr-scan')" />
        <ButtonRoundedFullWidth color="blue" :label="$t('label.adminDashboard')" :loading="false" @click="goToPage('/dashboard')" v-if="auth.token"/>
        <ButtonRoundedFullWidth color="blue" :label="$t('login')" :loading="false" @click="goToPage('/login')" v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { QrCodeIcon, UserIcon } from '@heroicons/vue/24/solid';
import ButtonRoundedFullWidth from '@/components/buttons/ButtonRoundedFullWidth.vue';
import { formatFullDate } from '@/utils/utilities';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore()

let hours: Ref<number> = ref(0)
let minutes: Ref<number> = ref(0)
let seconds: Ref<number> = ref(0)
let hourAngle: Ref<number> = ref(0)
let minuteAngle: Ref<number> = ref(0)
let secondAngle: Ref<number> = ref(0)

let dateLabel: Ref<string> = ref('')

const setTime = (): void => {
  const date = new Date()
  hours.value = date.getHours()
  minutes.value = date.getMinutes()
  seconds.value = date.getSeconds()
  let ampm = hours.value >= 12 ? 'PM' : 'AM'
  hours.value = hours.value % 12 || 12

  hourAngle.value = ((hours.value % 12) * 30 + minutes.value * 0.5) - 180 // Dikurangi 180 karena titik tumpunya dibalik
  minuteAngle.value = (minutes.value * 6 + seconds.value * 0.1) - 180 // Dikurangi 180 karena titik tumpunya dibalik
  secondAngle.value = (seconds.value * 6) - 180 // Dikurangi 180 karena titik tumpunya dibalik

  // console.log(`${hours.value}:${minutes.value}:${seconds.value}${ampm}`)
  dateLabel.value = formatFullDate(date.toISOString())
}

const goToPage = (route: string): void => {
  router.push(route)
}

onMounted(() => {
  setTime()
  setInterval(() => setTime(), 1000)
})
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg border border-gray-200 border-t-2 border-t-indigo-600 shadow-lg px-4 py-8 flex items-center justify-center hover:shadow-none
}

.clock {
  @apply bg-white w-10/12 aspect-square rounded-full border-8 border-gray-800 relative shadow-lg
}

.dot {
  @apply w-4 aspect-square rounded-full bg-gray-400 absolute z-50 shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
}

span {
  @apply inline-block absolute bg-white text-2xl font-bold z-10 text-gray-800
}

.hour12 {
  @apply top-2 left-1/2 transform -translate-x-1/2 z-20
}

.hour3 {
  @apply top-1/2 right-4 transform -translate-y-1/2 z-20
}

.hour6 {
  @apply bottom-2 left-1/2 transform -translate-x-1/2 z-20
}

.hour9 {
  @apply top-1/2 left-4 transform -translate-y-1/2 z-20
}

.dial-lines {
  @apply absolute w-0.5 h-1/2 bg-gray-600 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-top
}

.dial-lines:nth-of-type(3n) {
  @apply absolute w-1 h-1/2 bg-gray-600 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-top
}

.dial-inner {
  @apply absolute z-10 w-[90%] aspect-square bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
}

.hour-hand,
.minute-hand,
.second-hand {
  @apply absolute top-1/2 left-1/2 transform origin-top -translate-x-1/2 -translate-y-1/2 rounded-b-full
}

.hour-hand {
  @apply z-20 w-1.5 h-1/4 bg-gray-800
}

.minute-hand {
  @apply z-30 w-1.5 h-1/3 bg-gray-600
}

.second-hand {
  @apply z-40 w-1 h-2/5 bg-red-600
}
</style>