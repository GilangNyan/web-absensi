<template>
  <div
    class="w-full p-4 bg-gray-100 border-2 border-dashed rounded flex flex-col space-y-4 items-center justify-center text-gray-500"
    :class="isDragging ? 'border-green-400' : 'border-gray-400'"
    @dragover="dragOver"
    @dragleave="dragLeave"
    @drop="drop"
  >
    <template v-if="files.length != 0">
      <div class="w-full flex justify-center gap-2">
        <div
          v-for="(item, index) in files" :key="index"
          class="p-2 flex flex-col items-center justify-center border border-gray-400 w-1/2 sm:w-1/4 md:w-1/6 relative"
        >
          <div class="w-full aspect-square flex items-center justify-center mb-1">
            <img :src="readImage(item)" :alt="item.name" v-if="isImage(item)">
            <img src="@/assets/images/icon/xls.png" :alt="item.name" v-else-if="isExcel(item)">
            <img src="@/assets/images/icon/pdf.png" :alt="item.name" v-else-if="isPdf(item)">
            <DocumentTextIcon v-else />
          </div>
          <span class="text-xs font-medium truncate max-w-full justify-center">{{ item.name }}</span>
          <span class="text-xs font-light">{{ Math.round(item.size / 1000) + 'kb' }}</span>
          <!-- Remove Button -->
          <button
            class="rounded-full bg-red-600 flex p-1 items-center justify-center absolute -right-2 -top-2 hover:bg-red-400"
            @click="remove(index)"
          >
            <XMarkIcon class="w-3 h-3 text-white" />
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col space-y-1 items-center justify-center">
        <CloudArrowUpIcon class="w-12 h-12" />
        <span class="font-medium">
          {{ $t('label.dropFile') }}
        </span>
      </div>
      <span class="text-xs">
        {{ $t('label.or') }}
      </span>
      <button
        class="bg-indigo-500 text-white px-3 py-2 rounded text-sm font-medium"
        @click="triggerFileInput"
      >
        {{ $t('label.browse') }}
      </button>
      <input type="file" ref="fileInputRef" class="hidden" @change="handleInputChange" :multiple="multiple" :accept="accept">
    </template>
  </div>
</template>

<script setup lang="ts">
import { useToasterStore } from '@/stores/toaster';
import { CloudArrowUpIcon, DocumentTextIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import type { Ref } from 'vue';
import { onMounted } from 'vue';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  multiple?: boolean,
  accept?: string,
  fileList: File[]
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  accept: 'image/*'
})

const emits = defineEmits<{
  uploadedFiles: [files: File[]]
}>()

const lang = useI18n()
const fileInputRef: Ref<HTMLInputElement | null> = ref(null)
const toasterStore = useToasterStore()
let isDragging: Ref<boolean> = ref(false)
let files: Ref<File[]> = ref([])

const dragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const dragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}

const drop = (e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer) {
    const fileList: FileList = e.dataTransfer.files
    if (props.multiple) {
      for (let i = 0; i < fileList.length; i++) {
        let isExist = files.value.some(item => {
          return item.name === fileList.item(i)?.name && item.size === fileList.item(i)?.size
        })
        if (isExist) {
          toasterStore.warning({ text: lang.t('warning.warning'), message: lang.t('warning.fileExist') })
        } else {
          files.value.push(fileList.item(i)!)
        }
      }
    } else {
      files.value = []
      files.value.push(fileList.item(0)!)
    }
  }
  isDragging.value = false
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleInputChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files
  if (file) {
    if (props.multiple) {
      for (let i = 0; i < file.length!; i++) {
        let isExist = files.value.some(item => {
          return item.name === file.item(i)?.name && item.size === file.item(i)?.size
        })
        if (isExist) {
          toasterStore.warning({ text: lang.t('warning.warning'), message: lang.t('warning.fileExist') })
        } else {
          files.value.push(file.item(i)!)
        }
      }
    } else {
      files.value = []
      files.value.push(file.item(0)!)
    }
  }
}

const remove = (index: number) => {
  files.value.splice(index, 1)
}

const isImage = (file: File): boolean => {
  if (file.type && file.type.startsWith('image/')) {
    return true
  } else {
    return false
  }
}

const readImage = (file: File): string => {
  return URL.createObjectURL(file)
}

const isExcel = (file: File): boolean => {
  if (file.type && (file.type == 'application/vnd.ms-excel' || file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
    return true
  } else {
    return false
  }
}

const isPdf = (file: File): boolean => {
  if (file.type == 'application/pdf') {
    return true
  } else {
    return false
  }
}

watch(files, (newValue) => {
  emits('uploadedFiles', newValue)
})

onMounted(() => {
  files.value = props.fileList
})
</script>