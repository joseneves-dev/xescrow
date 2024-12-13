import { defineStore } from 'pinia'
import { usePending } from './pending'

interface warning {
  phoneNumber?: boolean
  app?: boolean
  identification?: boolean
}

export const useWarning = defineStore('warning', () => {
  const phoneNumber = ref<boolean | undefined>()
  const app = ref<boolean | undefined>()
  const identification = ref<boolean | undefined>()

  function set(data: Partial<warning>) {
    const pending = usePending()
    phoneNumber.value = data?.phoneNumber
    app.value = data?.phoneNumber
    identification.value = data?.phoneNumber

    if (data?.phoneNumber === true) {
      if (pending.phoneNumber) {
        pending.updatePhoneNumber(false)
      }
      if (phoneNumber.value) {
        phoneNumber.value = undefined
      }
    }
  }

  function updatePhoneNumber(value: boolean) {
    phoneNumber.value = value
  }

  function updateApp(value: boolean) {
    app.value = value
  }
  
  function updateIdentification(value: boolean) {
    identification.value = value
  }
  

  function clear() {
    phoneNumber.value = undefined
    app.value = undefined
    identification.value = undefined

  }

  return {
    phoneNumber,
    app,
    identification,
    set,
    updatePhoneNumber,
    updateApp,
    updateIdentification,
    clear,
  } as const
})