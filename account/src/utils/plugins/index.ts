import type { App } from 'vue'
import type { Router } from 'vue-router'
import type { VueHeadClient, MergeHead } from '@unhead/vue'
import type { Pinia } from 'pinia'
import type { AxiosInstance } from 'axios'

export interface AppContext {
  app: App
  router: Router
  head: VueHeadClient<MergeHead>
  pinia: Pinia
  api: AxiosInstance
  apiAuth: AxiosInstance
  apiAccount: AxiosInstance
}
export type AppPlugin = (app: AppContext) => void | Promise<void>

// this is a helper function to define plugins with autocompletion
export function definePlugin(plugin: AppPlugin) {
  return plugin
}
