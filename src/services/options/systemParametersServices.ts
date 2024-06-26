import { useDataStore } from "@/stores/data"
import { authHeader } from "@/utils/header"
import axios from "axios"

export default {
  getSystemParameters(data: any) {
    const config = authHeader()
    config.params = data
    return axios.get('/config', config)
  },
  saveSystemParameters(data: any) {
    const dataStore = useDataStore()
    const config = authHeader()
    if (dataStore.status === 'I') {
      return axios.post('/config', data, config)
    } else if (dataStore.status === 'U') {
      return axios.put('/config', data, config)
    } else if (dataStore.status === 'D') {
      config.data = data
      return axios.delete('/config', config)
    }
  }
}