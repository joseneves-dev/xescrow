import { defineStore } from 'pinia'

interface currencies {
  name: string
  symbol: string
  image: string
}

export const useAppCurrencies = defineStore('appCurrencies', () => {
  const currencies = ref<currencies[]>([
    { name: 'Euro', symbol: 'EUR', image:'' },
    { name: 'Us Dollar', symbol: 'USD', image:'' }
  ])
 
  function set(data: Partial<currencies>) {
    currencies.value = data
  }

  return {
    currencies,
    set,
  } as const
})