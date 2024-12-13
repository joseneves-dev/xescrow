<script setup lang="ts">
import { useSession } from '/@userStores/session';

const router = useRouter()
const route = useRoute()

const session = useSession()

const redirect = route.query.redirect as string

watchEffect(() => { 
  if (session.loggedIn == true) {
    if (redirect) {
      router.push({ path: redirect })
    }else{
      router.push({ name: 'dashboard' })
    }
  }
})

</script>
<template>
  <AuthLayout>
    <RouterView />
  </AuthLayout>
</template>