import { authHeader } from "@/utils/header"
import axios from "axios"

export default {
  getSummary(data: any) {
    const config = authHeader()
    config.params = data
    return axios.get('/dashboard/summary', config)
  },
}