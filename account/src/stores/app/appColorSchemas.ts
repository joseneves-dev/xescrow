import { defineStore } from 'pinia'

interface colorSchema {
  type: string
  label:string
  body_class:string
}

export const useAppColorSchemas = defineStore('appColorSchemas', () => {
  const colorSchema = ref<colorSchema[]>([
    { type: 'light', label:'Light', body_class: '' },
    { type: 'dark', label:'Dark', body_class: 'is-dark' }
  ])

  function set(data: Partial<colorSchema>) {
    colorSchema.value = data
  }

  return {
    colorSchema,
    set,
  } as const
})