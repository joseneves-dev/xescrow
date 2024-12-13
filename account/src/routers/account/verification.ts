import { type RouteRecordRaw } from 'vue-router'

import { email, phone } from '/@src/routers/guards/account/verification'

const verificationRoutes: RouteRecordRaw[] = [
  {
    component: () => import('/@src/pages/account/verification/email.vue'),
    path: 'verification-email',
    name: 'verification-email',
    props: false,
    meta: { verification: true },
    beforeEnter: [email],
  },
  {
    component: () => import('/@src/pages/account/verification/phone.vue'),
    path: 'verification-phone',
    name: 'verification-phone',
    props: false,
    meta: { verification: true },
    beforeEnter: [phone],
  },
]

export default verificationRoutes
