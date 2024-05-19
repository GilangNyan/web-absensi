import AuthLayout from '@/layouts/AuthLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import DividedAuthLayout from './DividedAuthLayout.vue'
import 'vue-router'

export default {
  AuthLayout,
  BlankLayout,
  MainLayout,
  DividedAuthLayout
}

// Declare Meta Field Type
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean
    layout: string,
    isAuthPage?: boolean
  }
}
