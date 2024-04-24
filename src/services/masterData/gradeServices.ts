import { useDataStore } from "@/stores/data"
import { authHeader } from "@/utils/header"
import axios from "axios"

export default {
  getGradeGroup(data: any) {
    const config = authHeader()
    config.params = data
    return axios.get('/grade', config)
  },
  saveGradeGroup(data: any) {
    const dataStore = useDataStore()
    const config = authHeader()
    if (dataStore.status === 'I') {
      return axios.post('/grade-group', data, config)
    } else if (dataStore.status === 'U') {
      return axios.put('/grade-group', data, config)
    } else if (dataStore.status === 'D') {
      config.data = data
      return axios.delete('/grade-group', config)
    }
  }
}