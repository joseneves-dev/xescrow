import { type RouteRecordRaw } from 'vue-router'

import { authorize } from '/@src/routers/guards/authorize'
import { languages, countries, settings as appSettings } from './guards/app/settings'

const AuthRouters: RouteRecordRaw[] = [
  {
    component: () => import('/@src/pages/auth.vue'),
    path: '/',
    name: 'auth',
    alias: '/login',
    children: [
      {
        component: () => import('/@src/pages/auth/authentication.vue'),
        name: 'login',
        path: 'login',
      },
      {
        component: () => import('/@src/pages/auth/signup.vue'),
        name: 'signup',
        path: 'signup',
        beforeEnter: [countries]
      },
      {
        component: () => import('../pages/auth/forgottenpassword.vue'),
        name: 'forgottenpassword',
        path: 'forgotten-password',
      },
      {
        component: () => import('../pages/auth/resetpassword.vue'),
        name: 'resetpassword',
        path: 'reset-password/:token/:request',
      },
    ],
    beforeEnter: [languages, appSettings, authorize], // Apply the navigation guard
  },
  {
    path: '',
    redirect: { name: 'login' },
  },
  {
    component: () => import('/@src/pages/[...all].vue'),
    name: '404',
    path: '/:all(.*)',
    props: true,
  },
]

export default AuthRouters
