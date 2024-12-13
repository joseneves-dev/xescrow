<script setup lang="ts">
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

import { useReCaptcha } from 'vue-recaptcha-v3';

import { useApiAuth } from '/@src/api/apiAuth'
import { useAppNotification } from '/@appStores/appNotification';

const notification = useAppNotification()
const api = useApiAuth()
const { t } = useI18n()

const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

const emits = defineEmits(['requested'])

await recaptchaLoaded()
const isLoading = ref<boolean>(false)

const formError = ref<Boolean>(false)

const schema = toTypedSchema(
  z.object({
    email: z
      .string({
        required_error: 'emailAddress.required',
      }).email({
          message: 'emailAddress.invalid',
      }),
  })
)

const { handleSubmit, setErrors } = useForm({
  validationSchema: schema,
})

const handleForgottenPassword = handleSubmit(async (values) => {

    const reCaptcha = await executeRecaptcha()

    if (!reCaptcha) {
      notification.set({type: 'error', message: t('reCAPTCHA.fail')})
      return;
    }

    const data = {
      ...values,
      reCaptcha: reCaptcha
    };

    await api.post('forgot-password', data)
      .then((response) => {
          emits('requested', true)
      })
      .catch((error) => {
          if(error.response.data.fieldErrors) {
            setErrors(error.response.data.fieldErrors);                   
          }
          if(error.response.data.formErrors){
            formError.value = error.response.data.formErrors
          }
      })
})
</script>
<template>
   <div class="inner-wrap">
        <div class="auth-head">
          <h2>{{ t('pages.forgotPassword.title') }}</h2>
          <p>{{ t('pages.forgotPassword.subtitle') }}</p>
          <RouterLink :to="{ name: 'login' }">
                  {{ t('action.login') }}
          </RouterLink>
        </div>
        <div class="form-card">
          <form @submit.prevent="handleForgottenPassword">
            <div class="forgotPassword-form">
                <VField v-slot="{ field }" id="forgotPassword">
                  <VControl>
                    <VInput v-bind="field" type="hidden" />
                    <p v-if="field?.errorMessage" class="help is-danger">
                     {{ t(field?.errorMessage) }}
                    </p>
                  </VControl>
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
              <VControl class="login">
                <VButton
                  :loading="isLoading"
                  color="primary"
                  type="submit"
                  bold
                  fullwidth
                  raised
                >
                  {{ t('action.submit') }}
                </VButton>
              </VControl>
            </div>
          </form>
        </div>
      </div>
</template>