import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import App from './App.vue'
import router from './router'

import { base64Decode, base64Encode } from './utils/crypt'
import i18nSetup from './locale/i18n'
import closable from './directives/customBehavior'

const i18n = i18nSetup

const app = createApp(App)

// Pinia
const pinia = createPinia()
pinia.use((context) => {
  const storeId = base64Encode(context.store.$id)

  const serializer = {
    serialize: JSON.stringify,
    deserialize: JSON.parse
  }

  // Sinkronisasi store dengan localStorage
  const fromStorage = localStorage.getItem(storeId)
  if (fromStorage) {
    const decoded = serializer.deserialize(base64Decode(fromStorage))
    context.store.$patch(decoded)
  }

  // Subscribe untuk memantau perubahan
  context.store.$subscribe((mutation, state) => {
    const decodedStoreId = base64Decode(storeId)
    if (decodedStoreId != 'modal' && decodedStoreId != 'toaster') {
      const encoded = base64Encode(serializer.serialize(state))
      localStorage.setItem(storeId, encoded)
    }
  })
})

app.use(pinia)
app.use(router)
app.use(i18n)

app.directive('closable', closable)

// Axios
axios.defaults.withCredentials = true
if (import.meta.env.MODE == 'development') {
  axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT
} else if (import.meta.env.MODE == 'production') {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASEURL + import.meta.env.VITE_API_ENDPOINT
}

app.mount('#app')
