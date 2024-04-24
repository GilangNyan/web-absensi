import { authHeader } from "@/utils/header"
import axios from "axios"

export default {
  getLecturer(data: any) {
    const config = authHeader()
    config.params = data
    return axios.get('/lecturers', config)
  }
}