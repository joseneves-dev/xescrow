import {
  createRouter as createClientRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router'

import AccountRoutes from '/@src/routers/account/account' 
import AuthRoutes from '/@src/routers/auth'

const routes: RouteRecordRaw[] = [
  ...AccountRoutes, 
  ...AuthRoutes,
]

export function createRouter() {
  const router = createClientRouter({
    scrollBehavior(to, from, savedPosition) {
      return { top: 0 }
    },
    history: createWebHistory(),
    routes,
    linkExactActiveClass: 'is-active',
  })

  return router
}
