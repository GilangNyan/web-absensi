import type TCrudStatus from "@/types/status"
import { authHeader } from "@/utils/header"
import axios from "axios"

export default {
  getUsers(data: any) {
    const config = authHeader()
    config.params = data
    return axios.get('/users', config)
  },
  saveUser(data: any, crudStatus: TCrudStatus) {
    const config = authHeader()
    if (crudStatus == 'I') {
      return axios.post('/users', data, config)
    } else {
      return axios.put('/users', data, config)
    }
  },
  deleteUser(data: any) {
    const config = authHeader()
    config.data = data
    return axios.delete('/users', config)
  }
}