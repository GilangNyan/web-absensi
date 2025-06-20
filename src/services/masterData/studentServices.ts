import { authHeader } from "@/utils/header"
import axios from "axios"

export default {
  getStudent(data: any) {
    const config = authHeader()
    config.params = data
    return axios.get('/students', config)
  },
  createBatchStudents(data: any) {
    const config = authHeader()
    return axios.post('/students/batch', data, config)
  },
  getStudentByQr(data: any) {
    const config = authHeader()
    config.params = data
    return axios.get('/students/qr', config)
  },
  createStudents(data: any) {
    const config = authHeader()
    return axios.post('/students', data, config)
  },
  updateStudents(data: any) {
    const config = authHeader()
    return axios.put('/students', data, config)
  },
  deleteStudent(data: any) {
    const config = authHeader()
    config.data = data
    return axios.delete('/students', config)
  }
}