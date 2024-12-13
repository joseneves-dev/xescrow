import {
  createRouter as createClientRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router'
import { languages } from '/@src/routers/guards/app_settings'

const routes: RouteRecordRaw[] = [
  {
    component: () => import('/@src/pages/signup.vue'),
    path: '/',
    children:[
      {
        component: () => import('/@src/pages/signup/subscribe.vue'),
        name: 'subscribe',
        path: '/',
      },
      {
        component: () => import('/@src/pages/signup/unsubscribe.vue'),
        name: 'unsubscribe',
        path: 'unsubscribe/:token',
      },
    ],
    beforeEnter: [languages]
  },
  {
    component: () => import('/@src/pages/[...all].vue'),
    name: '404',
    path: '/:all(.*)',
    props: true,
  },
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
