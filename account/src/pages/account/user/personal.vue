<script setup lang="ts">
import { useApiAccount } from '/@src/api/apiAccount'
import { usePending } from '/@userStores/pending'
import { useWarning } from '/@userStores/warning'
import { useUser } from '/@src/stores/user/user'
import sleep from '/@src/utils/sleep'

const { t } = useI18n()
const user = useUser()
const pending = usePending()
const warning = useWarning()

const api = useApiAccount()

const form = ref(null)
const isLoading = ref(false)
const isLoadingFields = ref(false)
const router = useRouter()

const handleContinueVerification = async () => {
  router.push({name : 'verification-identity'})
 
}
const handleStartVerification = async () => {
  await api.get('verification/start')
      .then((response) => {
        router.push({name:'verification-start' })
      })
      .catch((error) => {
      })
}
const handleUserDetails = async () => {
  isLoadingFields.value = true
  await api.get('user/details')
    .then(async (response) => {
      await sleep()
      isLoadingFields.value = false
    })
    .catch((error) => {
    })
}
const name = ref<string>(user.identity?.firstName+' '+ user.identity?.lastName)
</script>
<template>
  <div class="account-box is-form">
    <div class="form-head stuck-header">
      <div class="form-head-inner">
        <div class="left">
          <h3>{{ t('pages.personal.title') }}</h3>
          <p>
            {{ t('pages.personal.subtitle') }}
          </p>
        </div>
      </div>
    </div>
    <div v-if="!warning?.identification" class="action-page-wrapper">
        <div class="wrapper-inner">
          <div class="action-box no-border">
            <div class="box-content">
              <img
                class="light-image"
                src="/@src/assets/illustrations/placeholders/launch.svg"
                alt=""
              >
              <img
                class="dark-image"
                src="/@src/assets/illustrations/placeholders/launch-dark.svg"
                alt=""
              >
              <div class="has-text-centered">
                <h3 class="dark-inverted">
                  {{ t('pages.personal.start.heading') }}
                </h3>
                <p>
                  {{ t('pages.personal.start.body',  {name: name}) }}
                </p>
              </div>
              <div class="buttons">
                <VButton
                  color="primary"
                  raised
                  tabindex="0"
                  @click = handleStartVerification()
                >
                  {{ t('action.verification.start')}}
                </VButton>
              </div>
            </div>
          </div>
        </div>
    </div>
    <div v-else-if="!pending?.identification?.identity?.upload || !pending?.identification?.identity?.review || !pending?.identification?.address?.upload || !pending?.identification?.address?.review" class="action-page-wrapper"> 
      <div class="wrapper-inner">
          <div class="action-box no-border">
            <div class="box-content">
              <img
                class="light-image"
                src="/@src/assets/illustrations/placeholders/launch.svg"
                alt=""
              >
              <img
                class="dark-image"
                src="/@src/assets/illustrations/placeholders/launch-dark.svg"
                alt=""
              >
              <h3 class="dark-inverted">
                {{ t('pages.personal.continue.heading') }}
              </h3>
              <p>
                {{ t('pages.personal.continue.body',  {name: name}) }}
              </p>
              <div class="buttons">
                <VButton
                  color="primary"
                  raised
                  tabindex="0"
                  @click = handleContinueVerification()
                >
                {{ t('action.verification.continue') }}
                </VButton>
              </div>
            </div>
          </div>
        </div>
    </div>
    <div v-else-if="pending?.identification.identity.upload || pending?.identification.identity.review || pending?.identification.address.upload || pending?.identification.address.review" class="action-page-wrapper"> 
      <div class="wrapper-inner">
          <div class="action-box">
            <div class="box-content">
              <img
                class="light-image"
                src="/@src/assets/illustrations/placeholders/launch.svg"
                alt=""
              >
              <img
                class="dark-image"
                src="/@src/assets/illustrations/placeholders/launch-dark.svg"
                alt=""
              >
              <h3 class="dark-inverted">
                {{ t('pages.personal.review.heading') }}
              </h3>
              <p>
                {{ t('pages.personal.review.body',  {name: name}) }}
              </p>
              <div class="buttons">
                <VButton
                  color="primary"
                  raised
                  tabindex="0"
                  @click = handleContinueVerification()
                >
                {{ t('action.verification.review') }}
                </VButton>
              </div>
            </div>
          </div>
        </div>
    </div>
    <div v-else class="form-body">
      <VLoader :active="isLoadingFields">
        <div class="fieldset">
          <div class="fieldset-heading">
            <h4>  {{ t('pages.personal.identification') }}</h4>
          </div>
          <div class="columns is-multiline">
            <div class="column is-4">
              <VField>
                <VControl icon="lucide:user">
                  <VInput
                    type="text"
                    :placeholder="t('firstName.placeholder')"
                    disabled
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-4">
              <VField>
                <VControl icon="lucide:user">
                  <VInput
                    type="text"
                    :placeholder="t('middleName.placeholder')"
                    disabled
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-4">
              <VField>
                <VControl icon="lucide:user">
                  <VInput
                    type="text"
                    :placeholder="t('lastName.placeholder')"
                    disabled
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-4">
              <VField>
                <VControl icon="lucide:map-pin">
                  <VInput 
                    type="text" 
                    :placeholder="t('birthdate.placeholder')"
                    disabled 
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-3">
              <VField>
                <VControl icon="lucide:map-pin">
                  <VInput
                    type="text"
                    :placeholder="t('gender.placeholder')"
                    disabled
                  />
                </VControl>
              </VField>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column is-4">
              <VField>
                <VControl icon="lucide:user">
                  <VInput
                    type="text"
                    :placeholder="t('idNumber.placeholder')"
                    disabled
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-4">
              <VField>
                <VControl icon="lucide:user">
                  <VInput
                    type="text"
                    :placeholder="t('taxNumber.placeholder')"
                    disabled
                  />
                </VControl>
              </VField>
            </div>
          </div>
        </div>
        <div class="fieldset">
          <div class="fieldset-heading">
            <h4>{{ t('pages.personal.address') }}</h4>
          </div>
          <div class="columns is-multiline">
            <div class="column is-12">
              <VField>
                <VControl>
                  <VInput
                    type="text"
                    :placeholder="t('address.placeholder')"
                    disabled
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-12">
              <VField>
                <VControl>
                  <VInput
                    type="text"
                    :placeholder="t('addressOptional.placeholder')"
                    disabled
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField>
                <VControl icon="lucide:map-pin">
                  <VInput 
                    type="text" 
                    :placeholder="t('region.placeholder')"
                    disabled 
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField>
                <VControl icon="lucide:map-pin">
                  <VInput
                    type="text"
                    :placeholder="t('city.placeholder')"
                    disabled
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField>
                <VControl icon="lucide:map-pin">
                  <VInput
                    type="text"
                    :placeholder="t('country.placeholder')"
                    disabled
                  />
                </VControl>
              </VField>
            </div>
          </div>
        </div>
        <div class="fieldset">
          <div class="fieldset-heading">
            <div class="columns no-padding is-vcentered">
              <div class="column is-10">
                <h4>{{ t('pages.personal.identityStatement.title') }}</h4>
                <p>
                  <h4>{{ t('pages.personal.identityStatement.subtitle') }}</h4>
                </p>
              </div>
              <div class="column is-2 has-text-centered">
                <VIconButton outlined icon="lucide:download" />
              </div>
            </div>
          </div>
        </div>
      </VLoader>
    </div>
  </div>
</template>
<style scoped lang="scss">
.action-box{
  &.no-border{
    border: none !important;
  }
}
</style>






























