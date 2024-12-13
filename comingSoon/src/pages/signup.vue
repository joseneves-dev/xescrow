<script setup lang="ts">
import { useAppNotification } from '/@appStores/appNotification';

import { useApi } from '/@src/api/api'

const notyf = useNotyf()
const appNotification = useAppNotification()

const { t } = useI18n()
const api = useApi()

await api.get('/csrf')
.then((response) => {
}).catch((error) => {
})

watchEffect(() => {
  if(appNotification.type && appNotification.message){
    if(appNotification.type == 'error'){
      notyf.error(t(appNotification.message))
    }
    if(appNotification.type == 'success'){
      notyf.success(t(appNotification.message))
    }
    appNotification.clear()
  }
})

</script>
<template>
    <SignupLayout>
        <RouterView />
    </SignupLayout>
</template>