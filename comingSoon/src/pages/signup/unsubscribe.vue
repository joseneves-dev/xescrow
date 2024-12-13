<script setup lang="ts">
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

import { useReCaptcha } from 'vue-recaptcha-v3';

import { useApi } from '/@src/api/api'
import { useSettings } from '/@userStores/settings'
import { useAppNotification } from '/@appStores/appNotification';

const { t } = useI18n()
const api = useApi()
const router = useRouter()
const route = useRoute()
const settings = useSettings()
const notification = useAppNotification()
const { executeRecaptcha , recaptchaLoaded } = useReCaptcha();

const formError = ref<Boolean>(false)
const zodSchema = z
  .object({
    email: z
      .string({required_error: 'emailAddress.required'})
      .email('emailAddress.invalid'),
    token: z
      .string({required_error: 'token.required'})
  })
const validationSchema = toTypedSchema(zodSchema)

const { handleSubmit, setErrors, setFieldValue, resetField} = useForm({
  validationSchema,
})
const token:string = route.params.token.toString()

setFieldValue('token',token);

const handleSignup = handleSubmit(async (values) => {
  await recaptchaLoaded()

  const reCaptcha = await executeRecaptcha()

  if (!reCaptcha) {
    notification.set({type: 'error', message: t('reCAPTCHA.fail')})
    return;
  }
  const data = {
        ...values,
        language: settings?.language,
        reCaptcha: reCaptcha
      };
  await api.post('signup/unsubscribe', data)
    .then(async (response) => {
      router.push({name: 'subscribe'})
    })
    .catch((error) => {
      console.log(error)
      if(error.response.data.fieldErrors){
          setErrors(error.response.data.fieldErrors);  
      }
      if(error.response.data.formErrors){ 
          formError.value = error.response.data.formErrors
      }
  })
})
</script>
<template>
  <div class="container">
        <div class="columns is-flex is-vcentered">
          <div class="column is-12-mobile is-8-tablet is-6-desktop">
            <p class="title is-1 is-bold">Xescrow.app </p>
            <p class="subtitle is-4 pt-2 light-text">
              {{ t('pages.signup.subtitle') }}
            </p>
            <p>
              {{ t('pages.signup.description') }}
            </p>
            <p class="pt-2"><a href="http://www.x.com/xescrowapp" target="_blank"> @xescrowapp </a></p>
          </div>
          <div class="column is-1">
          </div>
          <div class="column is-12-mobile is-6-tablet is-4-desktop">
            <div class="subtitle is-6 pt-2 light-text"> 
              {{ t('pages.signup.unsubscribe.unsubscribe') }}
            </div>
            <div class="form-card">
            <form @submit.prevent="handleSignup">
              <p v-if="formError" class="help is-danger">{{ t('form.error') }}</p>
              <div id="signin-form" class="login-form">
                <div class="columns is-multiline">
                  <div class="column is-12">
                    <VField v-slot="{ field }" id="token">
                        <VInput
                          v-bind="field"
                          type="hidden"
                        />
                        <p v-if="field?.errorMessage" class="help is-danger">
                          {{ t(field?.errorMessage) }}
                        </p>
                    </VField>
                    <VField v-slot="{ field }" id="email">
                      <VControl icon="lucide:mail">
                        <VInput
                          v-bind="field"
                          type="text"
                          :placeholder="t('emailAddress.placeholder')"
                          autocomplete="email"
                        />
                        <p v-if="field?.errorMessage" class="help is-danger">
                          {{ t(field?.errorMessage) }}
                        </p>
                      </VControl>
                    </VField>
                  </div>
              
                  <div class="column is-12">
                  <VControl class="login">
                    <VButton
                      type="submit"
                      color="primary"
                      bold
                      fullwidth
                      raised
                    >
                      {{ t('action.unsubscribe') }}
                    </VButton>
                  </VControl>
                </div>
              </div>
            </div>
          </form>
        </div>
          </div>
        </div>
      </div>
</template>
