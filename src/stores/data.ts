import type TCrudStatus from "@/types/status"
import { defineStore } from "pinia"

interface DataState {
  values: any | null
  status: TCrudStatus
}

export const useDataStore = defineStore('data', {
  state: (): DataState => ({
    values: null,
    status: null
  }),
  actions: {
    setData(newData: any) {
      this.values = newData
    },
    setStatus(newStatus: TCrudStatus) {
      this.status = newStatus
    }
  }
})