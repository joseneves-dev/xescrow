import { type RouteRecordRaw } from "vue-router";

import {
  languages,
  settings as appSettings,
} from "/@src/routers/guards/app/settings";
import { authorize } from "/@src/routers/guards/authorize";
import { session } from "/@src/routers/guards/account/session";
import { pending } from "/@src/routers/guards/account/pending";
import { settings } from "/@src/routers/guards/account/settings";

import dashboardRoutes from "./dashboard";
import userRoutes from "./user";
import walletRoutes from "./wallet";
import escrowRoutes from "./escrow";
import verificationRoutes from "./verification";

const AccountRoutes: RouteRecordRaw[] = [
  {
    component: () => import("/@src/pages/account.vue"),
    path: "/account",
    name: "account",
    props: true,
    alias: "/account/dashboard",
    meta: { requiresAuth: true },
    children: [
      ...dashboardRoutes,
      ...userRoutes,
      ...escrowRoutes,
      ...walletRoutes,
      ...verificationRoutes,
      {
        component: () => import("/@src/pages/account/help.vue"),
        name: "help",
        path: "/help-center",
        props: true,
      },
    ],
    beforeEnter: [
      languages,
      appSettings,
      authorize,
      session,
      pending,
      settings,
    ], // Apply the navigation guard
    redirect: {
      name: "dashboard",
    },
  },
  {
    component: () => import("/@src/pages/[...all].vue"),
    name: "404",
    path: "/:all(.*)",
    props: true,
  },
];

export default AccountRoutes;
