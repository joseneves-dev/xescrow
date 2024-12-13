import { defineStore } from 'pinia'

interface pending {
  emailAddress?: boolean
  phoneNumber?: boolean
  app?: boolean
  identification?: identification
}

interface identification {
  identity?: {
    upload?: boolean
    review?: boolean
    verified?: boolean
  }
  address?: {
    upload?: boolean
    review?: boolean
    verified?: boolean
  }
}

export const usePending = defineStore('pending', () => {
  const emailAddress = ref<boolean | undefined>(undefined)
  const phoneNumber = ref<boolean | undefined>(undefined)
  const app = ref<boolean | undefined>(undefined)
  const identification = ref<identification | undefined>(undefined)

  function set(data: Partial<pending>) {
   emailAddress.value = data.emailAddress
   phoneNumber.value = data.phoneNumber
   app.value = data.app
   identification.value = data.identification as identification
  }
  
  function updateEmailAddress(value: boolean) {
    emailAddress.value = value
  }

  function updatePhoneNumber(value: boolean) {
    phoneNumber.value = value
  }

  function updateApp(value: boolean) {
    app.value = value
  }

  function updateIdentification(data: identification) {
    if(data.address && identification.value.address){
      if(data.address.review){
        identification.value.address.review = data.address.review
      }
      if(data.address.upload){
        identification.value.address.upload = data.address.upload
      }
      if(data.address.verified){
        identification.value.address.verified = data.address.verified
      }
    }

    if(data.identity && identification.value.identity){
      if(data.identity.review){
        identification.value.identity.review = data.identity.review
      }
      if(data.identity.upload){
        identification.value.identity.upload = data.identity.upload
      }
      if(data.identity.verified){
        identification.value.identity.verified = data.identity.verified
      }
    }
  }

  function clear() {
    emailAddress.value = undefined
    phoneNumber.value = undefined
    app.value = undefined
    identification.value = undefined
  }

  return {
    emailAddress,
    phoneNumber,
    app,
    identification,
    set,
    updateEmailAddress,
    updatePhoneNumber,
    updateApp,
    updateIdentification,
    clear,
  } as const
})