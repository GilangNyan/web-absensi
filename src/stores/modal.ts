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
}

export const useModalStore = defineStore('modal', {
  state: (): IModalState => ({ modalState: basicState }),
  actions: {
    openModal(payload: IModalProps) {
      const { props, component } = payload

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
    }
  },
  getters: {}
})