import { defineStore } from 'pinia'

interface versions {
  api: string
  webapp:string
  app:string
}

export const useAppVersions = defineStore('appVersions', () => {

  const api = ref<string>()
  const webapp = ref<string>()
  const app = ref<string>()

  function set(data: Partial<versions>) {
    api.value = data.api
    webapp.value = data.webapp
    app.value = data.app
  }

  return {
    api,
    webapp,
    app,
    set,
  } as const
})