import { authHeader } from "@/utils/header"
import axios from "axios"

export default {
  login(data: any) {
    return axios.post('/login', data)
  },
  logout(data: any) {
    const config = authHeader()
    return axios.post('/logout', data, config)
  },
  changePassword(data: any) {
    const config = authHeader()
    return axios.post('/change-password', data, config)
  }
}