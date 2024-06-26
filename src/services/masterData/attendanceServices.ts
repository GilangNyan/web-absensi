import { authHeader } from "@/utils/header"
import axios from "axios"

export default {
  recordAttendance(data: unknown) {
    const config = authHeader()
    return axios.post('/record-attendance', data, config)
  },
  getMonthlyAttendance(data: unknown) {
    const config = authHeader()
    config.params = data
    return axios.get('/attendance/monthly', config)
  }
}