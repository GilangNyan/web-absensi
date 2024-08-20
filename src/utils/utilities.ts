import i18nSetup from "@/locale/i18n"
import router from "@/router"
import { useAuthStore } from "@/stores/auth"
import { useLanguageStore } from "@/stores/language"
import { useToasterStore } from "@/stores/toaster"
import * as XLSX from "xlsx"
import { DateTime } from "luxon"
import type { VNode } from "vue"
import jsPDF from "jspdf"
import QRCode from "qrcode"
import JSZip from "jszip"

export const simpleLanguage = (string: string) => {
  const languageStore = useLanguageStore()
  const language = languageStore.lang
  if (string.includes('|')) {
    const splittedString: string[] = string.split('|')
    if (language == 'en') {
      return splittedString[0]
    } else if (language == 'id') {
      return splittedString[1]
    } else {
      languageStore.switchLanguage('id')
      return splittedString[1]
    }
  } else {
    return string
  }
}

export const handleErrorResponse = (error: any) => {
  const authStore = useAuthStore()
  const toasterStore = useToasterStore()
  const lang = i18nSetup
  if (error.name == 'AxiosError') {
    console.log(error)
    if (error.response.data.error.errors.name == 'TokenExpiredError') {
      authStore.clearCredentials()
      router.push('/login')
      toasterStore.warning({ text: lang.global.t('warning.warning'), message: lang.global.t('warning.sessionExpired') })
    } else if (error.response.data.error.errors == 'ForbiddenAttendanceError') {
      toasterStore.warning({ text: lang.global.t('warning.warning'), message: lang.global.t('error.forbiddenAttendanceHoliday') })
    } else if (error.response.data.error.message == 'Old Password doesn\'t match') {
      toasterStore.error({ text: 'Error!', message: lang.global.t('error.oldPasswordDoesntMatch') })
    }
  } else {
    toasterStore.error({ text: 'Error!', message: error.message })
  }
}

export const checkNotEmpty = (data: any): boolean => {
  if (data == undefined) {
    return false
  } else if (data.length == 0) {
    return false
  } else if (data == '') {
    return false
  } else {
    return true
  }
}

export const characterToSpace = (data: string, char: string): string => {
  const string = data.replace(char, ' ')
  return string
}

export const capitalizeFirstLetter = (text: string) => {
  const words = text.toLowerCase().split(' ')
  return words.map((items) => {
    return items.charAt(0).toUpperCase() + items.substring(1)
  }).join(' ')
}

export const readExcel = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })
        resolve(jsonData)
      } catch (error) {
        reject(error)
      }
    }

    reader.readAsArrayBuffer(file)
  })
}

export const boolStatus = (status: boolean): string => {
  const lang = i18nSetup
  if (status) {
    return lang.global.t('active')
  } else {
    return lang.global.t('inactive')
  }
}

export const formatFullDate = (date: string): string => {
  const languageStore = useLanguageStore()
  const language = languageStore.lang
  const dt = DateTime.fromISO(date).setLocale((language as string)).toLocaleString(DateTime.DATE_HUGE)
  return dt
}

export const getLocation = async (): Promise<any> => {
  const authStore = useAuthStore()
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude
          authStore.setGeoLocations({ lat: latitude, long: longitude })
          resolve({ latitude, longitude })
        },
        (error) => {
          reject('Gagal mendapatkan lokasi: ' + error.message)
        }
      )
    } else {
      reject('Geolocation tidak didukung di browser ini')
    }
  })
}

export const findElementByRefName = (vnode: VNode, refName: string): HTMLElement | null => {
  if (!vnode || !vnode.component) return null

  const refElement = (vnode.component.proxy?.$refs[refName] as HTMLElement)

  if (refElement) {
    return refElement
  } else {
    const children = vnode.children as VNode[]
    if (children) {
      for (let i = 0; i < children.length; i++) {
        const childElement = findElementByRefName(children[i] as VNode, refName)
        if (childElement) {
          return childElement
        }
      }
    }
  }
  return null
}

export const generatePdfQrList = async (datum: any[]): Promise<string> => {
  const doc = new jsPDF()

  const margin = 10
  const qrSize = 50
  const cellWidth = (doc.internal.pageSize.width - 2 * margin) / 4
  const cellHeight = 60

  let x = margin
  let y = margin

  await datum.forEach(async (item, index) => {
    const qrDataUrl = await QRCode.toDataURL(item.nisn, { width: qrSize })
    doc.addImage(qrDataUrl, 'PNG', x, y, qrSize, qrSize) // Tambah Gambar QR
    const posX = x + cellWidth / 2 // Mencari posisi tengah setiap cell
    doc.setFontSize(10)
    doc.text(item.fullname, posX, y + qrSize + 2, { align: "center" }) // Tambah Nama
    doc.text(item.nisn, posX, y + qrSize + 6, { align: "center" }) // Tambah NISN
    x += cellWidth // Pindah ke kolom berikutnya
    // Jika sudah mencapai 4 kolom, pindah ke baris berikutnya
    if ((index + 1) % 4 === 0) {
      x = margin
      y += cellHeight
      // Jika sudah mencapai akhir halaman, pindah ke halaman selanjutnya
      if (y + cellHeight > doc.internal.pageSize.height - margin) {
        doc.addPage()
        y = margin
      }
    }
  })
  // doc.save()
  const pdfUrl = doc.output('datauristring')
  return pdfUrl
}

export const generateQrImageZipped = async (datum: any[]): Promise<Blob> => {
  const zip = new JSZip()
  for (const [index, item] of datum.entries()) {
    const qrDataUrl = await QRCode.toDataURL(item.nisn)

    // Konversi ke Blob
    const response = await fetch(qrDataUrl)
    const blob = await response.blob()

    // Tambahkan gambar ke zip
    zip.file(`${index + 1} ${item.fullname}-${item.nisn}.png`, blob)
  }
  const content = await zip.generateAsync({ type: 'blob' })
  return content
}

export const getTotalDaysByMonth = (year: number, month: number): number => {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  const timeDiff = endDate.getTime() - startDate.getTime()

  const dayDiff = timeDiff / (1000 * 3600 * 24)

  return dayDiff + 1
}