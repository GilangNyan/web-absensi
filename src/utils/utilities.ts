import i18nSetup from "@/locale/i18n"
import router from "@/router"
import { useAuthStore } from "@/stores/auth"
import { useLanguageStore } from "@/stores/language"
import { useToasterStore } from "@/stores/toaster"
import * as XLSX from "xlsx"
import { DateTime } from "luxon"
import type { VNode } from "vue"

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
    if (error.response.data.error.errors.name == 'TokenExpiredError') {
      // toasterStore.error({ text: 'Error!', message: 'masuk sini'})
      authStore.clearCredentials()
      router.push('/login')
      toasterStore.warning({ text: lang.global.t('warning.warning'), message: lang.global.t('warning.sessionExpired') })
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
  const dt = DateTime.fromISO(date).setLocale(language).toLocaleString(DateTime.DATE_HUGE)
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