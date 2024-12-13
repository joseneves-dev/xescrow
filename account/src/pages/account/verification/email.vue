<script setup lang="ts">
import { useApiAccount } from '/@src/api/apiAccount'
import { useEmailAddress } from '/@userStores/emailAddress';

const api = useApiAccount()
const emailAddress = useEmailAddress()
if (!emailAddress.email) {
  await api.get('user/get-email')
          .then((response) => {
        })
          .catch((error) => {
        })
}

const active = ref<string>('email_verification')

const activeComponente = async (value:string) => {
 active.value = value;
}

</script>

<template>
<UpdateEmailAddress v-if="active == 'email_update'" :is-modal="false" :email="emailAddress.email" @active="activeComponente"/>
<VerificationEmailAddress v-if="active == 'email_verification'" :is-modal="false" @active="activeComponente" />
</template>
