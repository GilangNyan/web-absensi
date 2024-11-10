import { authHeader } from "@/utils/header"
import axios from "axios"

export default {
  recordAttendance(data: unknown) {
    const config = authHeader()
    return axios.post('/record-attendance', data, config)
  },
  getDailyAttendance(data: unknown) {
    const config = authHeader()
    config.params = data
    return axios.get('/attendance/daily', config)
  },
  getMonthlyAttendance(data: unknown) {
    const config = authHeader()
    config.params = data
    return axios.get('/attendance/monthly', config)
  },
  downloadDailyAttendance(data: unknown) {
    const config = authHeader()
    config.params = data
    config.responseType = 'blob'
    return axios.get('/attendance/daily/download', config)
  },
  downloadMonthlyAttendance(data: unknown) {
    const config = authHeader()
    config.params = data
    config.responseType = 'blob'
    return axios.get('/attendance/monthly/download', config)
  },
}