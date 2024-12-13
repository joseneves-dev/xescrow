<script setup lang="ts">
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useApiAccount } from '/@src/api/apiAccount';
import { useNotifications } from '/@userStores/notifications';

const { t } = useI18n()
const api = useApiAccount();
const notifications = useNotifications();

await api.get('user/notifications')
      .then((response) => {
      })
      .catch((error) => {
      })

const updateNotificationsAccount = async (property:string) =>{
  await api.post('user/update-notifications-account', { property: property})
        .then((response) => {
        })
        .catch((error) => {
          handleReset()
        })
}

const updateNotificationsMarketing = async (property:string) =>{
  await api.post('user/update-notifications-marketing', { property: property})
        .then((response) => {
        })
        .catch((error) => {
          handleReset()
        })
}

const schema = toTypedSchema(
  z.object({
    verifications: z
      .boolean({
        required_error: 'notifications.verifications.required',
      }),
    login: z
      .boolean({
        required_error: 'notifications.login.required',
      }),
    updates: z
      .boolean({
        required_error: 'notifications.updates.required',
      }),
    email: z
      .boolean({
        required_error: 'notifications.email.required',
      }),
    phone: z
      .boolean({
        required_error: 'notifications.phone.required',
      }),
    app : z
      .boolean({
        required_error: 'notifications.app.required',
      }),
    partners: z
      .boolean({
        required_error: 'notifications.partners.required',
      })
  })
)

// Create a separate instance of useForm for schemaAccount
const { setValues, handleReset } = useForm({
  validationSchema: schema, // Use validationSchemaAccount for schemaAccount properties
});

watchEffect(() => {
  if(notifications){
    // Now, you can set values and trigger validation separately for each schema
    setValues({
      verifications: notifications?.account?.verifications,
      login: notifications?.account?.login,
      updates: notifications?.account?.updates,
      email: notifications?.marketing?.emailAddress,
      phone: notifications?.marketing?.phoneNumber,
      app : notifications?.marketing?.app,
      partners: notifications?.marketing?.partners,
    });
  }
}) 


</script>

<template>
  <div class="account-box is-form is-footerless">
    <div class="form-head stuck-header">
      <div class="form-head-inner">
        <div class="left">
          <h3>{{ t('pages.notifications.title') }}</h3>
          <p>{{ t('pages.notifications.subtitle') }}</p>
        </div>
      </div>
    </div>
    <div class="form-body">
        <div class="fieldset">
          <div class="fieldset-heading">
            <h4>{{ t('pages.notifications.account.title') }}</h4>
            <p>{{ t('pages.notifications.account.subtitle') }}</p>
          </div>
          <div class="columns is-multiline is-vcentered">
            <div class="column is-8">
              <VField>
                {{ t('pages.notifications.account.verifications.title') }}
                <VLabel>{{ t('pages.notifications.account.verifications.subtitle') }}</VLabel>
              </VField>
            </div>
            <div class="column is-2">
              <VField id="verifications">
                <VControl>
                  <VSwitchBlock @change="updateNotificationsAccount('verifications')" />
                </VControl>
              </VField>
            </div>
            <div class="column is-8">
              <VField>
                {{ t('pages.notifications.account.login.title') }}
                <VLabel>{{ t('pages.notifications.account.login.subtitle') }}</VLabel>
              </VField>
            </div>
            <div class="column is-2">
              <VField  id="login">
                <VControl>
                  <VSwitchBlock @change="updateNotificationsAccount('login')" />
                </VControl>
              </VField>
            </div>
          </div>
        </div>
        <div class="fieldset" >
          <div class="fieldset-heading">
            <h4>{{ t('pages.notifications.lowPriority.title') }}</h4>
            <p>{{  t('pages.notifications.lowPriority.subtitle') }}</p>
          </div>
          <div class="columns is-multiline is-vcentered">
            <div class="column is-8">
              <VField>
                {{  t('pages.notifications.lowPriority.updates.title') }}
                <VLabel>{{  t('pages.notifications.lowPriority.updates.subtitle') }}</VLabel>
              </VField>
            </div>
            <div class="column is-2">
              <VField  id="updates">
                <VControl>
                  <VSwitchBlock @change="updateNotificationsAccount('updates')" />
                </VControl>
              </VField>
            </div>
          </div>
        </div>
        <div class="fieldset">
          <div class="fieldset-heading">
            <h4>{{  t('pages.notifications.marketing.title') }}</h4>
            <p>{{  t('pages.notifications.marketing.subtitle') }}</p>
          </div>
          <div class="columns is-multiline is-vcentered">
            <div class="column is-8">
              <VField>
                {{  t('pages.notifications.marketing.emailAddress.title') }}
                <VLabel> {{  t('pages.notifications.marketing.emailAddress.subtitle') }}</VLabel>
              </VField>
            </div>
            <div class="column is-2">
              <VField  id="email">
                <VControl>
                  <VSwitchBlock @change="updateNotificationsMarketing('email')" />
                </VControl>
              </VField>
            </div>
            <div class="column is-8">
              <VField>
                {{  t('pages.notifications.marketing.phoneNumber.title') }}
                <VLabel> {{  t('pages.notifications.marketing.phoneNumber.subtitle') }}</VLabel>
              </VField>
            </div>
            <div class="column is-2">
              <VField  id="phone">
                <VControl>
                  <VSwitchBlock @change="updateNotificationsMarketing('phone')" />
                </VControl>
              </VField>
            </div>
            <div class="column is-8">
              <VField>
                {{  t('pages.notifications.marketing.app.title') }}
                <VLabel> {{  t('pages.notifications.marketing.app.subtitle') }}</VLabel>
              </VField>
            </div>
            <div class="column is-2">
              <VField id="app">
                <VControl>
                  <VSwitchBlock @change="updateNotificationsMarketing('app')"/>
                </VControl>
              </VField>
            </div>
            <div class="column is-8">
              <VField>
                {{  t('pages.notifications.marketing.partners.title') }}
                <VLabel> {{  t('pages.notifications.marketing.partners.subtitle') }}</VLabel>
              </VField>
            </div>
            <div class="column is-2">
              <VField  id="partners">
                <VControl>
                  <VSwitchBlock @change="updateNotificationsMarketing('partners')"/>
                </VControl>
              </VField>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
