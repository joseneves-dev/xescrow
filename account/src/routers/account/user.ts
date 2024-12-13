import { type RouteRecordRaw } from 'vue-router'
import { warning } from '/@src/routers/guards/account/warning'
import { countries, timezones } from '/@src/routers/guards/app/settings'

const userRoutes: RouteRecordRaw[] = [
  {
    component: () => import('/@src/pages/account/user.vue'),
    path: 'user',
    name: 'user',
    props: true,
    alias: 'user/personal',
    children: [
      {
        component: () => import('/@src/pages/account/user/personal.vue'),
        name: 'personal',
        path: 'personal',
        props: true,
      },
      {
        component: () => import('/@src/pages/account/user/contacts.vue'),
        name: 'contacts',
        path: 'contacts',
        beforeEnter: [ countries ],
        props: true,
      },
      {
        component: () => import('/@src/pages/account/user/security.vue'),
        name: 'security',
        path: 'security',
        props: true,
      },
      {
        component: () => import('/@src/pages/account/user/settings.vue'),
        name: 'settings',
        path: 'settings',
        beforeEnter: [ timezones ],
        props: true,
      },
      {
        component: () => import('/@src/pages/account/user/notifications.vue'),
        name: 'user-notifications',
        path: 'notifications',
        props: true,
      },
    ],
    beforeEnter: [ warning ], // Apply the navigation guard
    redirect: {
      name: 'personal',
    },
  },
]

export default userRoutes
