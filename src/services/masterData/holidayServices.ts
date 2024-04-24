import { useDataStore } from "@/stores/data"
import { authHeader } from "@/utils/header"
import axios from "axios"

export default {
  getHoliday(data: any) {
    const config = authHeader()
    config.params = data
    return axios.get('/holidays', config)
  },
  saveHoliday(data: any) {
    const dataStore = useDataStore()
    const config = authHeader()
    if (dataStore.status === 'I') {
      return axios.post('/holidays', data, config)
    } else if (dataStore.status === 'U') {
      return axios.put('/holidays', data, config)
    } else if (dataStore.status === 'D') {
      config.data = data
      return axios.delete('/holidays', config)
    }
  },
  syncHoliday() {
    const config = authHeader()
    return axios.get('/holidays/sync', config)
  }
}