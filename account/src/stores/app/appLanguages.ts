import { defineStore } from 'pinia'

interface langauges {
  iso: string
  name: string
}

export const useAppLanguages = defineStore('appLangauges', () => {
  const languages = ref<langauges[]>([
    { iso: 'en', name: 'english' },
    { iso: 'fr', name: 'français' },
    { iso: 'es', name: 'español' },
    { iso: 'pt', name: 'português' }
  ])

  function set(data: Partial<langauges>) {
    languages.value = data
  }

  return {
    languages,
    set,
  } as const
})