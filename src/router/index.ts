import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/views/landing/LandingView.vue'
import LoginView from '@/views/authentication/LoginView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import StudentsView from '@/views/dashboard/masterData/StudentsView.vue'
import LecturersView from '@/views/dashboard/masterData/LecturersView.vue'
import GradesView from '@/views/dashboard/masterData/GradesView.vue'
import HolidaysView from '@/views/dashboard/masterData/HolidaysView.vue'
import HolidaysCUView from '@/views/dashboard/masterData/HolidaysCUView.vue'
import MaintenanceMenuView from '@/views/dashboard/menu/MaintenanceMenuView.vue'
import MaintenanceSubmenuView from '@/views/dashboard/menu/MaintenanceSubmenuView.vue'
import SystemParametersView from '@/views/dashboard/options/SystemParametersView.vue'
import PresenceQrScanView from '@/views/landing/PresenceQrScanView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingView,
      meta: {
        layout: 'BlankLayout',
        requiresAuth: false,
        isAuthPage: false
      }
    },
    {
      path: '/presence-qr-scan',
      name: 'presenceQrScan',
      component: PresenceQrScanView,
      meta: {
        layout: 'BlankLayout',
        requiresAuth: false,
        isAuthPage: false
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        layout: 'DividedAuthLayout',
        requiresAuth: false,
        isAuthPage: true
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        layout: 'MainLayout',
        requiresAuth: true
      }
    },
    {
      path: '/master-data/students',
      name: 'students',
      component: StudentsView,
      meta: {
        layout: 'MainLayout',
        requiresAuth: true
      }
    },
    {
      path: '/master-data/lecturers',
      name: 'lecturers',
      component: LecturersView,
      meta: {
        layout: 'MainLayout',
        requiresAuth: true
      }
    },
    {
      path: '/master-data/grades',
      name: 'grades',
      component: GradesView,
      meta: {
        layout: 'MainLayout',
        requiresAuth: true
      }
    },
    {
      path: '/master-data/holidays',
      name: 'holidays',
      component: HolidaysView,
      meta: {
        layout: 'MainLayout',
        requiresAuth: true
      },
    },
    {
      path: '/master-data/holidays/:status',
      name: 'holidaysCU',
      component: HolidaysCUView,
      meta: {
        layout: 'MainLayout',
        requiresAuth: true
      }
    },
    {
      path: '/menus/menu-maintenance',
      name: 'maintenanceMenu',
      component: MaintenanceMenuView,
      meta: {
        layout: 'MainLayout',
        requiresAuth: true
      }
    },
    {
      path: '/menus/submenu-maintenance',
      name: 'maintenanceSubmenu',
      component: MaintenanceSubmenuView,
      meta: {
        layout: 'MainLayout',
        requiresAuth: true
      }
    },
    {
      path: '/options/system-parameters',
      name: 'systemParameters',
      component: SystemParametersView,
      meta: {
        layout: 'MainLayout',
        requiresAuth: true
      }
    }
  ]
})

export default router
