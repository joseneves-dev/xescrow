import { type RouteRecordRaw } from 'vue-router'

import { email, phone } from '/@src/routers/guards/account/verification'

const dashboardRoutes: RouteRecordRaw[] = [
  {
    component: () => import('/@src/pages/account/dashboard.vue'),
    name: 'dashboard',
    path: 'dashboard',
    props: true,
    beforeEnter: [email, phone], // Apply the navigation guard
  },
  // ...other dashboard-related routes
]

export default dashboardRoutes
