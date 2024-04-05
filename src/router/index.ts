import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('../views/EditorView.vue')
  },
  {
    path: '/contest/add',
    name: 'AddContest',
    component: () => import('../views/AddContest.vue')
  },
  {
    path: '/contest/judge',
    name: 'JudgeView',
    component: () => import('../views/JudgeView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
