import { useAuthStore } from "@/stores/auth"
import type { AxiosRequestConfig } from "axios"
import { getLocation } from "./utilities"

export const authHeader = () => {
  const authStore = useAuthStore()
  const headers: AxiosRequestConfig<any> = {}

  // Ambil Location
  getLocation()
  const latitude = authStore.geo.lat
  const longitude = authStore.geo.long

  if (authStore.token) {
    headers.headers = {
      'Authorization': `Bearer ${authStore.token}`,
      'Content-Type': 'application/json',
      'Latitude': latitude,
      'Longitude': longitude
    }
  } else {
    authStore.clearCredentials()
  }
  return headers
}