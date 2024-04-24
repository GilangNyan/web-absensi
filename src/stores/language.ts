import i18nSetup from "@/locale/i18n"
import { defineStore } from "pinia"

interface LanguageState {
  lang: string | null
}

export const useLanguageStore = defineStore('language', {
  state: (): LanguageState => ({
    lang: null
  }),
  actions: {
    switchLanguage(language: string): void {
      this.lang = language
      i18nSetup.global.locale.value = this.lang as "id" | "en"
    }
  }
})