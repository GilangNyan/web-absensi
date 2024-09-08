import { authHeader } from "@/utils/header"
import axios from "axios"

export default {
  getRoles(data: any) {
    const config = authHeader()
    config.params = data
    return axios.get('/roles', config)
  },
  createRoles(data: any) {
    const config = authHeader()
    return axios.post('/roles', data, config)
  },
  updateRoles(data: any) {
    const config = authHeader()
    return axios.put('/roles', data, config)
  },
  deleteRoles(data: any) {
    const config = authHeader()
    config.data = data
    return axios.delete('/roles', config)
  }
}