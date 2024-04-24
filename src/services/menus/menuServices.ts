import { authHeader } from "@/utils/header"
import axios from "axios"

export default {
  getMenus(data: any) {
    const config = authHeader()
    config.params = data
    return axios.get('/menus', config)
  },
  getSubmenus(data: any) {
    const config = authHeader()
    config.params = data
    return axios.get('/submenus', config)
  }
}