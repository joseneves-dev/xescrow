import { defineStore } from 'pinia'

export const useAppTimezones = defineStore('appTimezones', () => {
  const timezones = ref<object>({})

  function set(data: object) {
    timezones.value = data
  }

  return {
    timezones,
    set,
  } as const
})