<template>
  <div class="scanner">
    <video ref="video" autoplay playsinline v-if="scanning"></video>
    <canvas ref="canvas" class="hidden"></canvas>
    <img :src="capturedImg" alt="Captured Image" v-if="capturedImg">
  </div>
</template>

<script setup lang="ts">
import jsQR from 'jsqr';
import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';

interface Props {
  isDetected: boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
  qrCode: [qrCode: string],
  isDetected: [isDetected: boolean]
}>()

const video: Ref<HTMLVideoElement | null> = ref(null)
const canvas: Ref<HTMLCanvasElement | null> = ref(null)
const scanning: Ref<boolean> = ref(true)
const capturedImg: Ref<string | null> = ref(null)

const startCamera = async (): Promise<void> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    if (video.value) {
      video.value.srcObject = stream
      video.value.addEventListener('loadedmetadata', () => {
        scanQrCode()
      })
    }
  } catch (error) {
    console.error('Gagal mengakses kamera', error)
  }
}

const stopCamera = (): void => {
  if (video.value && video.value.srcObject) {
    const stream = video.value.srcObject as MediaStream
    const tracks = stream.getTracks()
    tracks.forEach(track => track.stop())
  }
}

const scanQrCode = () => {
  if (!video.value || !canvas.value) return
  const context = canvas.value.getContext('2d')
  if (!context) return

  const scan = () => {
    if (!scanning.value) return

    if (video.value && !props.isDetected) {
      if (video.value!.readyState === video.value!.HAVE_ENOUGH_DATA) {
        canvas.value!.width = video.value!.videoWidth
        canvas.value!.height = video.value!.videoHeight
        context.drawImage(video.value!, 0, 0, canvas.value!.width, canvas.value!.height)
        const imageData = context.getImageData(0, 0, canvas.value!.width, canvas.value!.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          console.log('QR Code terdeteksi', code.data)
          scanning.value = false // Berhenti scan setelah code didapatkan

          // Ambil gambar
          const capturedImgUrl = canvas.value!.toDataURL('image/png')
          capturedImg.value = capturedImgUrl

          stopCamera()
          emits('qrCode', code.data)
          emits('isDetected', true)
        } else {
          requestAnimationFrame(scan)
        }
      } else {
        requestAnimationFrame(scan)
      }
    }
    
  }

  scan()
}

watch(() => props.isDetected, (newValue) => {
  if (!newValue) {
    scanning.value = true
    startCamera()
  }
})

onMounted(() => {
  startCamera()
})

onBeforeUnmount(() => {
  stopCamera()
})
</script>

<style scoped>
.scanner {
  @apply flex flex-col items-center
}

video {
  @apply w-full
}
</style>