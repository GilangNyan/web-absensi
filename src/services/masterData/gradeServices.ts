import { useDataStore } from "@/stores/data"
import { authHeader } from "@/utils/header"
import axios from "axios"

export default {
  getGrades(data: any) {
    const config = authHeader()
    config.params = data
    return axios.get('/grade', config)
  },
  saveGrades(data: any) {
    const dataStore = useDataStore()
    const config = authHeader()
    if (dataStore.status === 'I') {
      return axios.post('/grade', data, config)
    } else if (dataStore.status === 'U') {
      return axios.put('/grade', data, config)
    } else if (dataStore.status === 'D') {
      config.data = data
      return axios.delete('/grade', config)
    }
  }
}