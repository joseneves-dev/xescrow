import { defineStore } from 'pinia'

interface notification {
  type: string
  message: string
}

export const useAppNotification = defineStore('appNotification', () => {
  const type = ref<string | undefined>(undefined)
  const message = ref<string | undefined>(undefined)

  function set(data: Partial<notification>) {
    type.value = data.type
    message.value = data.message
  }

  function clear() {
    type.value = undefined
    message.value = undefined
  }
  
  return {
    type,
    message,
    set,
    clear,
  } as const
})