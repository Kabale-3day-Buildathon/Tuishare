import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/student/register',
      name: 'student-register',
      component: () => import('@/views/StudentRegisterView.vue')
    },
    {
      path: '/sponsor',
      name: 'sponsor',
      component: () => import('@/views/SponsorView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue')
    }
  ]
})

export default router
