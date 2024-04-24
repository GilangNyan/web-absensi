import type { IGeo } from "@/types/models";
import { defineStore } from "pinia";

interface AuthState {
  token: string | null
  menu: any | null
  geo: IGeo
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    menu: null,
    geo: { lat: null, long: null }
  }),
  actions: {
    setCredentials(token: string, menu: any): void {
      this.token = token
      this.menu = menu
    },
    clearCredentials(): void {
      this.token = null
      this.menu = null
      this.geo = { lat: null, long: null }
    },
    setGeoLocations(geo: IGeo): void {
      this.geo = geo
    }
  }
})