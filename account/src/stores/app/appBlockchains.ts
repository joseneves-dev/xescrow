import { defineStore } from 'pinia'

export const useAppBlockchains = defineStore('appBlockchains', () => {
  const blockchains = ref<object | undefined>(undefined)

  function set(data: object) {
    blockchains.value = data
  }

  return {
    blockchains,
    set,
  } as const
})