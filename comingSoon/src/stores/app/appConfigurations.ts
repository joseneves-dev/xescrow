import { defineStore } from 'pinia'

export const useAppConfigurations = defineStore('appConfigurations', () => {
  const statusCode = ref<number>(200)
  const isOffline = ref<boolean>(false)
  const csrf = ref<string>()
  const appName = ref<string>('Xescow.app')
  const pageTitle = ref<string>('{appName} - Welcome')
  
  function setStatusCode(value: number) {
    statusCode.value = value
    
    if(value >= 500){
      isOffline.value = true
    }else{
      isOffline.value = false
    }
  }

  function setCsrf(value: string) {
    csrf.value = value
  }

  function setPageTitle(value: string) {
    pageTitle.value = value
  }


  return {
    statusCode,
    isOffline,
    csrf,
    appName,
    pageTitle,
    setStatusCode,
    setCsrf,
    setPageTitle,
  } as const
})