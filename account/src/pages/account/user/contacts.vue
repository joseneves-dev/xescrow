<script setup lang="ts">
import { useApiAccount } from '/@src/api/apiAccount'
import { useEmailAddress } from '/@userStores/emailAddress';
import { usePhoneNumber } from '/@userStores/phoneNumber';
import { usePending } from '/@userStores/pending';
import { useWarning } from '/@userStores/warning';

const { t } = useI18n()

const api = useApiAccount()
const emailAddress = useEmailAddress()
const phoneNumber = usePhoneNumber()
const pending = usePending()
const warning = useWarning()

const modal = ref<boolean>(false)

if (!emailAddress.email || (emailAddress.verified == pending?.emailAddress)) {
  await api.get('user/get-email')
  .then((response) => {
  })
  .catch((error) => {
  })
}

if ((!phoneNumber.number && !warning?.phoneNumber) || (phoneNumber?.verified == pending?.phoneNumber)) {
  await api.get('user/get-phone')
  .then((response) => {
  })
  .catch((error) => {
  })
}

const active = ref<string | null>()

const activeComponente = async (value:string) => {
  active.value = value;
}

const closeModal = async () => {
  modal.value = false
  active.value = null
}

</script>
<template>
  <div class="account-box is-form is-footerless">
    <div class="form-head stuck-header">
      <div class="form-head-inner">
        <div class="left">
          <h3>{{ t('pages.contacts.title') }}</h3>
          <p>{{ t('pages.contacts.subtitle') }}</p>
        </div>
      </div>
    </div>
    <div class="form-body">
      <div class="fieldset">
        <div class="fieldset-heading">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <h4>{{ t('pages.contacts.emailAddress.title') }}</h4>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-vcentered is-centered">
          <div class="column is-2">
            <VTag v-if="emailAddress?.verified" color="primary" label="verified" />
            <VTag v-else color="warning" label="unverified" />
          </div>
          <div class="column">
            {{ emailAddress?.email }}
          </div>
          <div class="column">
            <V-Button
              class="m-1"
              color="danger"
              outlined
              raised
              label="Save"
              @click="
                () => {
                  modal = true
                  active = 'email_update'
                }
              "
            >
              <strong>{{ t('action.update') }}</strong>
            </V-Button>
            <V-Button
              v-if="!emailAddress?.verified"
              class="m-1"
              color="danger"
              raised
              label="Verification"
              @click="
                () => {
                  modal = true
                  active = 'email_verification'
                }
              "
            >
              <strong>{{ t('action.verify') }}</strong>
            </V-Button>
          </div>
        </div>
      </div>
      <div v-if="!phoneNumber?.number" class="fieldset">
        <div class="columns setting-list is-vcentered">
          <div class="setting-item is-create">
            <VIconButton
              icon="lnil lnil-circle-plus"
              @click="
                () => {
                  modal = true
                  active = 'phone_create'
                }
              "
            />
            <div class="meta">
              <span class="dark-inverted">{{ t('pages.contacts.phoneNumber.create.title') }}</span>
              <span>{{ t('pages.contacts.phoneNumber.create.subtitle') }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="fieldset">
        <div class="fieldset-heading">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <h4>{{ t('pages.contacts.phoneNumber.title') }}</h4>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-vcentered is-centered">
          <div class="column is-2">
            <VTag v-if="phoneNumber?.verified" color="primary" label="verified" />
            <VTag v-else color="warning" label="unverified" />
          </div>
          <div class="column">{{ phoneNumber?.country?.code }} {{ phoneNumber?.number }}</div>
          <div class="column">
            <V-Button
              class="m-1"
              color="danger"
              outlined
              raised
              label="Save"
              @click="
                () => {
                  active = 'phone_update'
                  modal = true
                }
              "
            >
              <strong>{{ t('action.update') }}</strong>
            </V-Button>
            <V-Button
              v-if="!phoneNumber?.verified"
              class="m-1"
              color="danger"
              raised
              label="Verification"
              @click="
                () => {
                  active = 'phone_verification'
                  modal = true
                }
              "
            >
              <strong>{{ t('action.verify') }}</strong>
            </V-Button>
            <V-Button
              v-if="phoneNumber"
              class="m-1"
              color="danger"
              outlined
              raised
              label="Remove"
              @click="
                () => {
                  active = 'phone_remove'
                  modal = true
                }
              "
            >
              <strong>{{ t('action.remove') }}</strong>
            </V-Button>
        
          </div>
        </div>
      </div>
    </div>
    <VModal :open="modal" noheader nofooter noclose size="none">
      <template #content>
        <UpdateEmailAddress v-if="active == 'email_update'" :is-modal="true" :email="emailAddress.email"  @close="closeModal"  @active="activeComponente"/>
        <VerificationEmailAddress v-if="active == 'email_verification'" :is-modal="true"  @close="closeModal"  @active="activeComponente" />    
        
        <CreatePhoneNumber v-if="active == 'phone_create'" :is-modal="true" @close="closeModal" @active="activeComponente"/>
        <UpdatePhoneNumber v-if="active == 'phone_update'" :is-modal="true" :phoneNumber="phoneNumber"  @close="closeModal"  @active="activeComponente"/>
        <VerificationPhoneNumber  v-if="active == 'phone_verification'" :is-modal="true"  @close="closeModal"  @active="activeComponente"/>
        <RemovePhoneNumber  v-if="active == 'phone_remove'" :is-modal="true"  @close="closeModal"  @active="activeComponente"/>
      </template>
    </VModal>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';

</style>

