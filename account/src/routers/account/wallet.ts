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
    component: () => import("/@src/pages/account/wallet.vue"),
    name: "wallet",
    path: "wallet/:account?/:publicKey?",
    props: false,
    beforeEnter: [email, phone, identification, blockchain, currencies, wallet],
    children: [
      {
        component: () => import("/@src/pages/account/wallet/airdrop.vue"),
        name: "airdrop",
        path: "airdrop",
        props: true,
      },
      {
        component: () => import("/@src/pages/account/wallet/transfer.vue"),
        name: "transfer",
        path: "transfer",
        props: true,
      },
      {
        component: () => import("/@src/pages/account/wallet/transactions.vue"),
        name: "transactions",
        path: "transactions",
        props: false,
      },
      {
        component: () => import("/@src/pages/account/wallet/settings.vue"),
        name: "settings-wallet",
        path: "settings",
        props: false,
      },
      {
        component: () => import("/@src/pages/account/wallet/manage.vue"),
        name: "manage",
        path: "manage",
        props: false,
      },
    ],
  },
  {
    component: () => import("/@src/pages/account/walletCreate.vue"),
    name: "create-wallet",
    path: "wallet-create",
    props: false,
    beforeEnter: [blockchain, currencies, wallet],
  },
];

export default walletRoutes;
