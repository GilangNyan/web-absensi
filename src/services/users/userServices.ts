import { authHeader } from "@/utils/header"
import axios from "axios"

export default {
  getUsers(data: any) {
    const config = authHeader()
    config.params = data
    return axios.get('/users', config)
  },
  createUser(data: any) {
    const config = authHeader()
    return axios.post('/users', data, config)
  },
  updateUser(data: any) {
    const config = authHeader()
    return axios.put('/users', data, config)
  },
  deleteUser(data: any) {
    const config = authHeader()
    config.data = data
    return axios.delete('/users', config)
  }
}