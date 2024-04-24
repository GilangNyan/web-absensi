<template>
  <div class="bg-white w-11/12 flex flex-col items-center rounded-lg p-4 space-y-4">
    <StepperNav :step="step" @next-step="nextStep" @submit="submit">
      <template #step(upload)>
        <InputFileDrop
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :file-list="excelUpload"
          @uploaded-files="handleUploadedFiles"
        />
      </template>
      <template #step(validate)>
        <div v-if="missingColumn.length > 0" class="flex flex-col w-full space-y-1 max-h-[70vh] overflow-y-auto">
          <div
            v-for="(item, index) in missingColumn"
            :key="index"
            class="flex w-full bg-red-100 border-2 border-red-500 px-4 py-2 rounded"
          >
            <span class="text-sm font-medium text-red-600 flex items-center space-x-2">
              <ExclamationCircleIcon class="w-4 h-4" />
              <span>{{ $t('validation.columnNotFound', { column: item }) }}</span>
            </span>
          </div>
        </div>
        <div v-else class="flex flex-col w-full space-y-1 max-h-[70vh] overflow-y-auto">
          <div class="flex w-full bg-green-100 border-2 border-green-500 px-4 py-2 rounded">
            <span class="text-sm font-medium text-green-600 flex items-center space-x-2">
              <CheckCircleIcon class="w-4 h-4" />
              <span>{{ $t('validation.allValid') }}</span>
            </span>
          </div>
        </div>
      </template>
      <template #step(verify)>
        <div class="flex flex-col w-full space-y-1 max-h-[70vh] overflow-y-auto">
          <TableCustom :columns="columns" :rows="rows" :current-page="page" :per-page="perPage">
            <!--  -->
          </TableCustom>
          <TablePagination
            :current-page="page"
            :per-page="perPage"
            :total-items="totalItems"
            :total-pages="totalPages"
            @page-changed="paginationRequest($event)"
            @page-limit="changePageLimit($event)"
          />
        </div>
      </template>
    </StepperNav>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import StepperNav from '@/components/main/StepperNav.vue';
import InputFileDrop from '@/components/inputs/InputFileDrop.vue';
import TableCustom from '../main/TableCustom.vue';
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import type IStep from '@/types/stepper';
import { capitalizeFirstLetter, handleErrorResponse, readExcel } from '@/utils/utilities';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/solid';
import TablePagination from '../main/TablePagination.vue';
import { computed } from 'vue';
import studentServices from '@/services/masterData/studentServices';
import { useModalStore } from '@/stores/modal';
import { useToasterStore } from '@/stores/toaster';

const lang = useI18n()
const requiredColumns: string[] = [
  'fullname', 'nipd', 'nisn', 'gender', 'birthPlace', 'birthDate'
]
const modal = useModalStore()
const toast = useToasterStore()

let excelUpload: Ref<File[]> = ref([])
let missingColumn: Ref<string[]> = ref([])
let rawExcelData: Ref<any[]> = ref([])
let excelData: Ref<any[]> = ref([])

let step: IStep[] = reactive([
  {
    label: lang.t('label.upload'),
    key: 'upload',
    nextCondition: excelUpload.value.length > 0
  },
  {
    label: lang.t('label.validate'),
    key: 'validate',
    nextCondition: missingColumn.value.length <= 0
  },
  {
    label: lang.t('label.verify'),
    key: 'verify'
  }
])

const columns: Ref = ref([
  {
    name: 'fullname',
    title: lang.t('tableHead.fullname')
  },
  {
    name: 'nisn',
    title: lang.t('tableHead.nisn')
  },
  {
    name: 'nipd',
    title: lang.t('tableHead.nipd')
  },
  {
    name: 'gender',
    title: lang.t('tableHead.gender')
  },
  {
    name: 'birthPlace',
    title: lang.t('tableHead.birthPlace')
  },
  {
    name: 'birthDate',
    title: lang.t('tableHead.birthDate')
  }
])
let rows: Ref<any[]> = ref([])
let page: Ref<number> = ref(1)
let perPage: Ref<number> = ref(10)

const totalItems = computed<number>(() => {
  return rows.value.length
})
const totalPages = computed<number>(() => {
  return Math.ceil(rows.value.length / perPage.value)
})

const paginationRequest = (event: number): void => {
  page.value = event
}

const changePageLimit = (event: number): void => {
  page.value = 1
  perPage.value = event
}

const handleUploadedFiles = (value: File[]): void => {
  excelUpload.value = value
  step[0].nextCondition = excelUpload.value.length > 0
}

const validateExcelColumns = async (value: File[]): Promise<void> => {
  try {
    await value.map(async (items) => {
      const val = await readExcel(items)
      const dataFromFile: any[] = []
      val.map((items) => {
        dataFromFile.push(items)
      })
      const header = dataFromFile[0] || []
      missingColumn.value = requiredColumns.filter((reqCol) => !header.includes(reqCol))
      step[1].nextCondition = missingColumn.value.length <= 0
      rawExcelData.value = dataFromFile
    })
  } catch (error) {
    console.log("Excel Read Error", error)
  }
}

const convertExcelData = async (data: any[]): Promise<void> => {
  const header = data[0]
  const convertedData: any[] = []
  await data.filter(items => {
    if (items === header) {
      return false
    }
    return true
  }).map((arrayItems: any) => {
    const obj: any = {}
    header.map((items: string, index: number) => {
      obj[items] = typeof arrayItems[index] === "number" ? arrayItems[index].toString() : capitalizeFirstLetter(arrayItems[index])
    })
    convertedData.push(obj)
  })
  excelData.value = convertedData
  rows.value = convertedData
}

const submit = async (value: boolean) => {
  if (value) {
    let req = {
      data: excelData.value
    }
    await studentServices.createBatchStudents(req).then((result) => {
      modal.closeModal()
      toast.success({ text: 'Berhasil', message: 'Berhasil menambahkan siswa' })
    }).catch((error: any) => {
      console.log(error)
      handleErrorResponse(error)
    })
  }
}

const nextStep = (value: number) => {
  if (value == 0) {
    validateExcelColumns(excelUpload.value)
  } else if (value == 1) {
    convertExcelData(rawExcelData.value)
  }
}
</script>