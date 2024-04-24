import { createI18n } from "vue-i18n";
import en from '@/locale/en.json';
import id from '@/locale/id.json';

const i18nSetup = createI18n({
  locale: 'id',
  legacy: false,
  messages: {
    en: en,
    id: id
  }
})

export default i18nSetup