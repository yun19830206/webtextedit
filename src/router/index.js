import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/App'

const routes = [
  {
    path: '/',
    name: 'Portal',
    redirect: '/word',
    component: Home,
    children: [
      {
        path: '/word',
        name: 'Word',
        component: () => import('@/views/index.vue'),
        meta: { title: '富文本标注' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
