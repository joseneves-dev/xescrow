import { defineStore } from 'pinia'
import { usePending } from './pending'
import { useWarning } from './warning'

export interface app {
  verified: boolean
}

export const useApp = defineStore('app', () => {
  const verified = ref<boolean | undefined>(undefined)

  function set(data: Partial<app>) {

    verified.value = data.verified

    const pending = usePending()
    if (data.verified === false) {
      pending.updateApp(true)
    }else{
      pending.updateApp(false)
    }

    const warning = useWarning()
    if (data.app) {
      if (warning.app) {
        warning.updateApp(false)
      }
    }else{
      warning.updateApp(true)
    }
  }

  function clear() {
    verified.value = undefined
  }

  return {
    verified,
    set,
    clear,
  } as const
})