<script setup lang="ts">
import { useApiAuth } from '/@src/api/apiAuth'
import { useSession } from '/@userStores/session';

const { t } = useI18n()

const session = useSession()
const apiAuth = useApiAuth()

const handleLogout = async () => {
  apiAuth.post('/logout')
  .then(async (response) => {
    session.logout()
  })
  .catch((error) => {
  })
}

</script>
<template>
  <div class="navbar-item">
    <form @submit.prevent="handleLogout" class="is-fullwidth">
      <V-Button type="submit" color="primary" icon="lucide:log-out" outlined raised>
        <strong>{{ t('action.logout') }}</strong>
      </V-Button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.lang-dropdown {
  .dropdown-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;

    img {
      width: 2rem;
      height: 2rem;
    }
  }
}
</style>