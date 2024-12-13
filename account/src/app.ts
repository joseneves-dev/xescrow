import { createApp as createClientApp } from 'vue'
import { createHead } from '@unhead/vue'
import { InferSeoMetaPlugin } from '@unhead/addons'
import { createPinia } from 'pinia'
import { PiniaSharedState } from 'pinia-shared-state'

import { VueReCaptcha } from 'vue-recaptcha-v3';

import type { AppPlugin, AppContext } from '/@src/utils/plugins'
import { createRouter } from '/@src/router'
import ClientApp from '/@src/ClientApp.vue'
import '/@src/styles'
import { useApi } from './api/api'
import { useApiAuth } from './api/apiAuth'
import { useApiAccount } from '/@src/api/apiAccount'

import SolanaWallets from "solana-wallets-vue";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const plugins = import.meta.glob<{ default: AppPlugin }>
('./plugins/*.ts',{
  eager: true,
})

export async function createApp() {
  const app = createClientApp(ClientApp)
  const router = createRouter()
  const api= useApi()
  const apiAuth = useApiAuth()
  const apiAccount = useApiAccount()

  const head = createHead({
    plugins: [InferSeoMetaPlugin()],
  })
  app.use(head)

  const pinia = createPinia()
  pinia.use(
    PiniaSharedState({
      // Enables the plugin for all stores. Defaults to true.
      enable: true,
      // If set to true this tab tries to immediately recover the shared state from another tab. Defaults to true.
      initialize: true,
      // Enforce a type. One of native, idb, localstorage or node. Defaults to native.
      type: 'native',
    }),
  )
  
  app.use(pinia)

  app.use(VueReCaptcha, { siteKey: import.meta.env.VITE_RECAPTCHA_KEY })

  const walletOptions = {
    wallets: [
      new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    ],
    autoConnect: true,
  };
  
  app.use(SolanaWallets, walletOptions)
 
  const APP: AppContext = {
    app,
    router,
    head,
    pinia,
    api,
    apiAuth,
    apiAccount,
  }

  for (const path in plugins) {
    try {
      const plugin = plugins[path]?.default
      if (!plugin) throw new Error(`Plugin does not have a default export.`)
      await plugin(APP)
    } catch (error) {
      console.log(`Error while loading plugin "${path}": ${error}`)    }
  }

  // use router after plugin registration, so we can register navigation guards
  app.use(APP.router)

  return APP
}