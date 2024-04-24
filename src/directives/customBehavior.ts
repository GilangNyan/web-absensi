import { findElementByRefName } from "@/utils/utilities";
import type { Directive, ObjectDirective } from "vue";

let handleOutsideClick: (event: MouseEvent | TouchEvent) => void

const closable: ObjectDirective<HTMLElement> = {
  beforeMount(el, binding, vnode) {
    handleOutsideClick = (event) => {
      event.stopPropagation()
      const { handler, exclude } = binding.value

      let clickOnExcludedEl: boolean | null = false
      exclude.forEach((refName: string) => {
        if (!clickOnExcludedEl) {
          const excludedEl = findElementByRefName(vnode, refName) //(vnode as VNode<HTMLElement>).component?.refs[refName] as HTMLElement
          clickOnExcludedEl = excludedEl && excludedEl.contains(event.target as Node)
        }
      });
      if (!(el == event.target || el.contains(event.target as Node)) && !clickOnExcludedEl) {
        handler()
        // const component: any = (vnode as VNode<HTMLElement>).component
        // if (component && component.proxy) {
        //   component.proxy[handler]()
        // }
      }
    }
    document.addEventListener('click', handleOutsideClick)
    // document.addEventListener('touchstart', handleOutsideClick)
  },
  unmounted() {
    document.removeEventListener('click', handleOutsideClick)
    // document.removeEventListener('touchstart', handleOutsideClick)
  }
}

export default closable as Directive