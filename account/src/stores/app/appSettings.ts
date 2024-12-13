import { defineStore } from 'pinia'

interface settings {
  contact: contact
  authentication: authentication
}

interface contact {
  emailAddress: boolean
  phoneNumber: boolean
  app: boolean
}

interface authentication {
  signup: boolean
  login: boolean
  secondFactor: boolean
}

export const useAppSettings = defineStore('appSettings', () => {
  const contact = ref<contact[]>([])
  const authentication = ref<authentication[]>([])

  function set(data: Partial<settings>) {
    if(data.contact){
      contact.value = data.contact as contact
    }
    if(data.authentication){
      authentication.value = data.authentication as authentication
    }
  }

  return {
    contact,
    authentication,
    set,
  } as const
})