<template>
  <div class="bg-white w-11/12 flex flex-col rounded-lg p-4 space-y-4">
    <h4>Perbarui Anggota Rombel {{ name }}</h4>
    <hr>
    <div class="grid grid-cols-2 gap-4">
      <div class="grid grid-cols-2 gap-2">
        <SelectForm name="grade" :options="gradeOptions" v-model="gradeFilter" label="" />
        <SelectForm name="year" :options="academicYearOptions" v-model="academicYearFilter" label="" />
      </div>
      <div></div>
      <draggable
        class="flex flex-col w-full bg-gray-100 overflow-y-auto h-[70vh] rounded-lg"
        group="student"
        v-model="oldStudentsData"
        item-key="id"
      >
        <template #item="{element}">
          <span class="flex w-full items-center justify-between px-3 py-1 cursor-move">
            {{ element.name }}
          </span>
        </template>
      </draggable>
      <draggable
        class="flex flex-col w-full bg-gray-100 overflow-y-auto h-[70vh] rounded-lg"
        group="student"
        v-model="destinedStudentsGroup"
        item-key="id"
      >
        <template #item="{element}">
          <span class="flex w-full items-center justify-between px-3 py-1 cursor-move">
            {{ element.name }}
          </span>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import studentServices from '@/services/masterData/studentServices';
import { handleErrorResponse } from '@/utils/utilities';
import type { AxiosResponse } from 'axios';
import { onMounted, ref, watch, type Ref } from 'vue';
import draggable from 'vuedraggable';
import SelectForm from '../inputs/SelectForm.vue';
import gradeServices from '@/services/masterData/gradeServices';
import { useToasterStore } from '@/stores/toaster';
import { useAuthStore } from '@/stores/auth';

interface Props {
  id: string
  name: string
  students: any[]
}

const props = defineProps<Props>()

const toast = useToasterStore()
const auth = useAuthStore()

let search: Ref<string> = ref('')
let oldStudentsData: Ref<any[]> = ref([])
let destinedStudentsGroup: Ref<any[]> = ref([])

const gradeOptions: Ref<any[]> = ref([
  {
    value: '0',
    label: 'Semua Kelas'
  }
])
let gradeFilter: Ref<any> = ref({
  value: '0',
  label: 'Semua Kelas'
})
const academicYearOptions: Ref<any[]> = ref([])
let academicYearFilter: Ref<any> = ref(null)

// Watcher
watch(() => destinedStudentsGroup.value.length, (newValue, oldValue) => {
  console.log(`Panjang array berubah dari ${oldValue} menjadi ${newValue}`)
  registerStudent()
})

const getStudents = async (): Promise<void> => {
  const payload = {
    page: 1,
    perPage: 99999,
    search: search.value,
    sort: 'fullname',
    dir: 'ASC',
    grade: gradeFilter.value.value != '0' ? gradeFilter.value.value : 'no-grade'
  }
  await studentServices.getStudent(payload).then((result: AxiosResponse) => {
    const datas = result.data.data.rows
    datas.forEach((item: any) => {
      const entry = {
        id: item.id,
        name: item.fullname
      }
      oldStudentsData.value.push(entry)
    })
  }).catch((error: unknown) => {
    handleErrorResponse(error)
    console.log(error)
  })
}

const getGrades = async (): Promise<void> => {
  const payload = {
    page: 1,
    perPage: 99999,
    search: '',
  }
  await gradeServices.getGrades(payload).then((result: AxiosResponse) => {
    const datas = result.data.data.rows
    datas.forEach((item: any) => {
      const entry = {
        value: item.id,
        label: item.name
      }
      gradeOptions.value.push(entry)
    })
  }).catch((error: unknown) => {
    handleErrorResponse(error)
    console.log(error)
  })
}

const getAcademicYears = async (): Promise<void> => {
  const payload = {
    page: 1,
    perPage: 99999,
    search: ''
  }
  await gradeServices.getAcademicYears(payload).then((result: AxiosResponse) => {
    const datas = result.data.data.rows
    datas.forEach((item: any) => {
      const entry = {
        value: item.id,
        label: item.name
      }
      academicYearOptions.value.push(entry)
    })
  }).catch((error: unknown) => {
    handleErrorResponse(error)
    console.log(error)
  })
}

const registerStudent = async (): Promise<void> => {
  let datas: any = []
  await destinedStudentsGroup.value.forEach((item) => {
    const entry = {
      studentId: item.id,
      gradeId: props.id,
      academicYearId: auth.year.id
    }
    datas.push(entry)
  })
  const payload = {
    data: datas
  }
  await gradeServices.registerStudentsGrade(payload).then((result: AxiosResponse) => {
    console.log(result)
    toast.success({ text: 'Perubahan berhasil disimpan' })
  }).catch((error: unknown) => {
    toast.error({ text: 'Kesalahan: ' + error })
    console.log(error)
  })
}

const mapCurrentStudent = (): void => {
  if (props.students?.length != 0) {
    props.students.forEach((item: any) => {
      const student = {
        id: item.id,
        name: item.fullname
      }
      destinedStudentsGroup.value.push(student)
    })
  }
}

onMounted(() => {
  academicYearFilter.value = { value: auth.year.id, label: auth.year.name }
  mapCurrentStudent()
  getGrades()
  getAcademicYears()
  getStudents()
})
</script>