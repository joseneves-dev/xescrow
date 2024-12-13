<script setup lang="ts">
import { useApiAccount } from '/@src/api/apiAccount'
import { usePhoneNumber } from '/@userStores/phoneNumber';

const api = useApiAccount()
const phoneNumber = usePhoneNumber()
if (!phoneNumber.number) {
  await api.get('user/get-phone')
          .then((response) => {
          })
          .catch((error) => {
          })
}

const active = ref<string>('phone_verification')

const activeComponente = async (value:string) => {
 active.value = value;
}
</script>

<template>
<CreatePhoneNumber v-if="active == 'phone_create' && !phoneNumber.number" :is-modal="false"  @active="activeComponente"/>
<UpdatePhoneNumber v-if="active == 'phone_update' && phoneNumber.number" :phoneNumber="phoneNumber" :is-modal="false"  @active="activeComponente"/>
<VerificationPhoneNumber v-if="active == 'phone_verification'" :is-modal="false"  @active="activeComponente"/>
</template>
