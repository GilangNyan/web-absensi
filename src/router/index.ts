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
import GenerateQrCodeView from '@/views/dashboard/GenerateQrCodeView.vue'
import MonthlyAttendanceView from '@/views/dashboard/reports/MonthlyAttendanceView.vue'
import DailyAttendanceView from '@/views/dashboard/reports/DailyAttendanceView.vue'
import SemesterAttendanceView from '@/views/dashboard/reports/SemesterAttendanceView.vue'
import ProfileView from '@/views/dashboard/ProfileView.vue'
import ManageUserView from '@/views/dashboard/user/ManageUserView.vue'
import ManageRolesView from '@/views/dashboard/user/ManageRolesView.vue'

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
      path: '/generate-qr-code',
      name: 'generateQrCode',
      component: GenerateQrCodeView,
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
    },
    {
      path: '/reports/daily-attendance',
      name: 'dailyAttendance',
      component: DailyAttendanceView,
      meta: {
        layout: 'MainLayout',
        requiresAuth: true
      }
    },
    {
      path: '/reports/monthly-attendance',
      name: 'monthlyAttendance',
      component: MonthlyAttendanceView,
      meta: {
        layout: 'MainLayout',
        requiresAuth: true
      }
    },
    {
      path: '/reports/semester-attendance',
      name: 'semesterAttendance',
      component: SemesterAttendanceView,
      meta: {
        layout: 'MainLayout',
        requiresAuth: true
      }
    },
    {
      path: '/user-management/user',
      name: 'ManageUser',
      component: ManageUserView,
      meta: {
        layout: 'MainLayout',
        requiresAuth: true
      }
    },
    {
      path: '/user-management/roles',
      name: 'ManageRoles',
      component: ManageRolesView,
      meta: {
        layout: 'MainLayout',
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'UserProfile',
      component: ProfileView,
      meta: {
        layout: 'MainLayout',
        requiresAuth: true
      }
    }
  ]
})

export default router
