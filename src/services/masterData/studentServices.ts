import { authHeader } from "@/utils/header"
import axios from "axios"

export default {
  async getStudent(data: any) {
    const config = await authHeader()
    config!.params = data
    return axios.get('/students', config)
  },
  createBatchStudents(data: any) {
    const config = authHeader()
    return axios.post('/students/batch', data, config)
  }
}