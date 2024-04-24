import { defineStore } from "pinia"

type TCrudStatus = 'I' | 'U' | 'D' | null

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