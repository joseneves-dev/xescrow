import { type RouteRecordRaw } from "vue-router";

import {
  email,
  phone,
  identification,
} from "/@src/routers/guards/account/verification";
import { wallet } from "../guards/account/wallet";
import { blockchain, currencies } from "/@src/routers/guards/app/settings";

const walletRoutes: RouteRecordRaw[] = [
  {
    component: () => import("/@src/pages/account/escrow.vue"),
    name: "escrow",
    path: "escrow/:account?",
    props: false,
    beforeEnter: [email, phone, identification, blockchain, currencies, wallet],
    children: [
      {
        component: () => import("/@src/pages/account/escrow/transactions.vue"),
        name: "transactions-escrow",
        path: "transactions",
        props: true,
      },
      {
        component: () => import("/@src/pages/account/escrow/settings.vue"),
        name: "settings-escrow",
        path: "settings",
        props: false,
      },
      {
        component: () => import("/@src/pages/account/escrow/manage.vue"),
        name: "manage-escrow",
        path: "manage",
        props: false,
      },
    ],
  },
];

export default walletRoutes;
