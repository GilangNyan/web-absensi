import { authHeader } from "@/utils/header"
import axios from "axios"

export default {
  recordAttendance(data: unknown) {
    const config = authHeader()
    return axios.post('/record-attendance', data, config)
  }
}