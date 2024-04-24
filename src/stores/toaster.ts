import { defineStore } from "pinia";

export type TToastStatus = 'info' | 'success' | 'warning' | 'error'

interface IToast {
  text: string
  status: TToastStatus
  id: number,
  message?: string
}
type ToastPayload = { timeout?: number; text: string; message?: string }
const defaultTimeout: number = 2000

const createToast = (text: string, status: TToastStatus, message?: string): IToast => ({
  text, status, id: Math.random() * 1000, message: message
})

export const useToasterStore = defineStore('toaster', {
  state: (): { toasts: IToast[] } => ({
    toasts: []
  }),
  actions: {
    updateState(payload: ToastPayload, status: TToastStatus) {
      const { text, timeout, message } = payload
      const toast = createToast(text, status, message)
      this.toasts.push(toast)
      setTimeout(() => {
        this.toasts = this.toasts.filter((t) => t.id !== toast.id)
      }, timeout ?? defaultTimeout)
    },
    info(payload: ToastPayload) {
      this.updateState(payload, 'info')
    },
    success(payload: ToastPayload) {
      this.updateState(payload, 'success')
    },
    warning(payload: ToastPayload) {
      this.updateState(payload, 'warning')
    },
    error(payload: ToastPayload) {
      this.updateState(payload, 'error')
    }
  }
})