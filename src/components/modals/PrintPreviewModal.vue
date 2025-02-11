<template>
  <div class="w-10/12 md:w-[850px] bg-white rounded-lg p-4 space-y-4">
    <h4>Pratinjau Laporan</h4>
    <hr>
    <iframe frameborder="0" id="print-frame" class="w-full h-[500px] border-none"></iframe>
    <div class="flex items-center justify-end">
      <ButtonRoundedWithIcon color="indigo" :label="t('label.print')" @click="print()">
        <PrinterIcon class="w-5 h-5" />
      </ButtonRoundedWithIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ButtonRoundedWithIcon from '../buttons/ButtonRoundedWithIcon.vue';
import { useI18n } from 'vue-i18n';
import { PrinterIcon } from '@heroicons/vue/24/solid';

const { t } = useI18n()

interface Props {
  content: string
}

const props = defineProps<Props>()

const getHtmlContent = () => {
  const iframe = document.getElementById('print-frame') as HTMLIFrameElement | null
  if (iframe) iframe.srcdoc = props.content
}

const print = () => {
  const iframe = (document.getElementById('print-frame') as HTMLIFrameElement).contentWindow
  iframe?.focus()
  iframe?.print()
}

onMounted(() => {
  getHtmlContent()
})
</script>