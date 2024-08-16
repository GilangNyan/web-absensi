import { defineStore } from "pinia";
import { extend } from "@vue/shared";
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue";

const basicState = { component: null, props: {} }

const component = extend({})
type VueComponent = InstanceType<typeof component>

interface IModalProps {
  component: null | VueComponent
  props?: object
}

interface IModalState {
  modalState: IModalProps
  isConfirmed: boolean
  onOkCallback: (() => void) | null
  onCancelCallback: (() => void) | null
}

export const useModalStore = defineStore('modal', {
  state: (): IModalState => ({ modalState: basicState, isConfirmed: false, onOkCallback: null, onCancelCallback: null }),
  actions: {
    openModal(payload: IModalProps) {
      const { props, component } = payload
      this.isConfirmed = false

      // Prevent Scrolling
      const body = document.body
      if (body) body.style.overflow = "hidden"

      this.modalState = { component, props: props || {} }
    },
    closeModal() {
      this.modalState = basicState

      // Revent Scrolling Prevention
      const body = document.body
      if (body) body.style.overflow = "auto"
    },
    openConfirmationModal(title: string, message: string) {
      this.openModal({ component: ConfirmationModal, props: { title: title, message: message } })
    },
    confirmAction() {
      this.isConfirmed = true
      this.closeModal()
    },
    onOk(callback?: () => void) {
      if (callback) {
        this.onOkCallback = callback
      }
      return this
    },
    onCancel(callback?: () => void) {
      if (callback) {
        this.onCancelCallback = callback
      }
      return this
    },
    okClicked() {
      if (this.onOkCallback) {
        this.onOkCallback()
      }
      this.closeModal()
      return this
    },
    cancelClicked() {
      if (this.onCancelCallback) {
        this.onCancelCallback()
      }
      this.closeModal()
      return this
    }
  },
  getters: {}
})