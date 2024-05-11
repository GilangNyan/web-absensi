import { useDataStore } from "@/stores/data"
import { authHeader } from "@/utils/header"
import axios from "axios"

export default {
  getMenus(data: any) {
    const config = authHeader()
    config.params = data
    return axios.get('/menus', config)
  },
  saveMenus(data: any) {
    const dataStore = useDataStore()
    const config = authHeader()
    if (dataStore.status === 'I') {
      return axios.post('/menus', data, config)
    } else if (dataStore.status === 'U') {
      return axios.put('/menus', data, config)
    } else if (dataStore.status === 'D') {
      config.data = data
      return axios.delete('/menus', config)
    }
  },
  getSubmenus(data: any) {
    const config = authHeader()
    config.params = data
    return axios.get('/submenus', config)
  },
  saveSubmenus(data: any) {
    const dataStore = useDataStore()
    const config = authHeader()
    if (dataStore.status === 'I') {
      return axios.post('/submenus', data, config)
    } else if (dataStore.status === 'U') {
      return axios.put('/submenus', data, config)
    } else if (dataStore.status === 'D') {
      config.data = data
      return axios.delete('/submenus', config)
    }
  },
}