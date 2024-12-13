import { defineStore } from 'pinia'

interface notifications {
  account?: account
  marketing?: marketing
}

interface account {
  verifications?: boolean
  login?: boolean
  updates?: boolean
}

interface marketing {
  emailAddress?: boolean
  phoneNumber?: boolean
  app?: boolean
  partners?: boolean
}

export const useNotifications = defineStore('notifications', () => {
  const account = ref<account | undefined>(undefined)
  const marketing = ref<marketing | undefined> (undefined)

  function set(data: Partial<notifications>) {
    account.value = data.account as account
    marketing.value = data.marketing as marketing
  }
  
  function clear() {
    account.value = undefined
    marketing.value = undefined
  }

  return {
    account,
    marketing,
    set,
    clear,
  } as const
})