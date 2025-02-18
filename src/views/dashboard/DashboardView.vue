<template>
  <h3 class="text-2xl text-indigo-900 font-bold">Selamat Datang Admin Absensi SMAN 1 Beber</h3>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
    <SummaryCard :title="t('activeStudents')" :value="cards.activeStudents">
      <UserGroupIcon class="w-1/3" />
    </SummaryCard>
    <SummaryCard :title="t('studentsAttended')" :value="cards.studentsAttended">
      <CheckBadgeIcon class="w-1/3 text-green-600" />
    </SummaryCard>
    <SummaryCard :title="t('studentsLate')" :value="cards.studentsLate">
      <ExclamationTriangleIcon class="w-1/3 text-yellow-600" />
    </SummaryCard>
    <SummaryCard :title="t('studentsNotAttended')" :value="cards.studentsNotAttended">
      <XCircleIcon class="w-1/3 text-red-600" />
    </SummaryCard>
  </div>
  <img class="absolute w-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" src="@/assets/images/dashboard-bg.png" alt="Background">
</template>

<script setup lang="ts">
import SummaryCard from '@/components/cards/SummaryCard.vue';
import gradeServices from '@/services/masterData/gradeServices';
import dashboardServices from '@/services/menus/dashboardServices';
import { useAuthStore } from '@/stores/auth';
import { handleErrorResponse } from '@/utils/utilities';
import { CheckBadgeIcon, ExclamationTriangleIcon, UserGroupIcon, XCircleIcon } from '@heroicons/vue/24/outline';
import type { AxiosResponse } from 'axios';
import { onMounted, reactive, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const authStore = useAuthStore()

const academicYear: Ref<any> = ref(null)
const academicYearOptions: Ref<any[]> = ref([])

const cards = reactive({
  activeStudents: 0,
  studentsAttended: 0,
  studentsLate: 0,
  studentsNotAttended: 0
})

const getAcademicYears = async () => {
  const payload = {
    page: 1,
    perPage: 99999,
    search: ''
  }
  academicYearOptions.value = []
  await gradeServices.getAcademicYears(payload).then((result: AxiosResponse) => {
    const datas = result.data.data.rows
    datas.forEach((item: any) => {
      const entry = {
        value: item.id,
        label: item.name
      }
      academicYearOptions.value.push(entry)
    })
    academicYear.value = academicYearOptions.value.find((item) => item.value == authStore.year.id)
  }).catch((error: unknown) => {
    handleErrorResponse(error)
  })
}

const getDashboardSummary = async () => {
  const payload = {
    year: academicYearOptions.value.length == 0 ? authStore.year.id : academicYear.value
  }
  await dashboardServices.getSummary(payload).then((result: AxiosResponse) => {
    const datas = result.data.data
    cards.activeStudents = datas.activeStudents
    cards.studentsAttended = datas.studentsAttended
    cards.studentsLate = datas.studentsLate
    cards.studentsNotAttended = datas.studentsNotAttended
  }).catch((error: any) => {
    handleErrorResponse(error)
  })
}

onMounted(() => {
  // getAcademicYears()
  getDashboardSummary()
})
</script>