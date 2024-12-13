<script setup lang="ts">
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

import { useReCaptcha } from 'vue-recaptcha-v3';

import { capitalizeFirstLetter } from '/@src/utils/formating'

import { useApiAuth } from '/@src/api/apiAuth'
import { useSettings } from '/@userStores/settings'
import { useAppCountries } from '/@appStores/appCountries'
import { useAppSettings } from '/@src/stores/app/appSettings'
import { useAppNotification } from '/@appStores/appNotification';

const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

await recaptchaLoaded()

const notification = useAppNotification()
const appSettings = useAppSettings()
const appCountires = useAppCountries()
const settings = useSettings()

const { t } = useI18n()

const apiAuth = useApiAuth()

const isLoading = ref(false)

const countriesList = ref(Object.values(appCountires.countries.map(country => capitalizeFirstLetter(country.name))))

const fieldType = ref<String>('password')
const showErrorMessage = ref<Boolean>(false)

const selectedCountry:any = ref()
const formError = ref<Boolean>(false)
const schema = toTypedSchema(
  z.object({
    firstName: z
      .string({
        required_error: 'firstName.required',
      }).min(4, {
        message: 'firstName.required',
      }),
    lastName: z
      .string({
        required_error: 'lastName.required',
      }).min(4, {
        message: 'lastName.required',
      }),
    country: z
      .string({
        required_error: 'country.required',
        invalid_type_error:"country.empty"
      }),
    email: z
      .string({
        required_error: 'emailAddress.required',
      }).email({
          message: 'emailAddress.invalid',
      }),
    password: z
      .string({
          required_error: 'password.required',
      }).min(10, {
        message: 'password.min',
      })
      .regex(/[a-z]/, {
        message: 'password.lowercase',
      })
      .regex(/[A-Z]/, {
        message: 'password.uppercase',
      })
      .regex(/\d/, {
        message: 'password.numeric',
      })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: 'password.specialCharacter',
      })
  })
)

const { handleSubmit, setErrors, setFieldValue, resetField} = useForm({
  validationSchema: schema,
})

const handleSignup = handleSubmit(async (values) => {

  const reCaptcha = await executeRecaptcha()

  if (!reCaptcha) {
    notification.set({type: 'error', message: t('reCAPTCHA.fail')})
    return;
  }

  const data = {
        ...values,
        settings: {
          language: settings?.language,
          timezone: settings?.timezone,
          colorSchema: settings?.colorSchema
        },
        reCaptcha: reCaptcha
      };
  await apiAuth.post('signup', data)
    .then(async (response) => {
    })
    .catch((error) => {
        if(error.response.data.fieldErrors){
          setErrors(error.response.data.fieldErrors);  
        }
        if(error.response.data.formErrors){ 
          formError.value = error.response.data.formErrors
        }
    })
})

const handlePassword = async () => {
  if (fieldType.value == 'password') {
    fieldType.value = 'text'
  } else {
    fieldType.value = 'password'
  }
}

const handleInput = () => {
  showErrorMessage.value = false // Disable error message display while typing
}

const handleBlur = () => {
  showErrorMessage.value = true // Enable error message display when finished typing
}


watch(selectedCountry, (value) => {
  if(!value){
    resetField('country')
  }else{
    setFieldValue('country', value)
  }
})

useHead({
  title: 'Auth Signup ',
})
</script>

<template>
  <div class="single-form-wrap">
    <div class="inner-wrap">
        <div class="auth-head">
                  <h2>{{ t('pages.signup.title') }}</h2>
                  <p>{{ t('pages.signup.subtitle') }}</p>
                  <RouterLink :to="{ name: 'login' }">
                    {{ t('action.login') }}
                  </RouterLink>
        </div>
        <div class="auth-form-wrapper">
          <div class="form-card">
            <form @submit.prevent="handleSignup">
              <p v-if="formError" class="help is-danger">{{ t('form.error')  }}</p>
              <div id="signin-form" class="login-form">
                <div class="columns is-multiline">
                    <div class="column is-5">
                      <VField v-slot="{ field }" id="firstName">
                        <VControl>
                          <VInput
                            type="text"
                            :placeholder="t('firstName.placeholder')"
                          />
                          <p v-if="field?.errorMessage" class="help is-danger">
                           {{ t(field?.errorMessage) }}
                          </p>
                        </VControl>
                      </VField>
                    </div>
                    <div class="column is-5">
                      <VField v-slot="{ field }" id="lastName">
                        <VControl>
                          <VInput
                            type="text"
                            :placeholder="t('lastName.placeholder')"
                          />
                          <p v-if="field?.errorMessage" class="help is-danger">
                           {{ t(field?.errorMessage) }}
                          </p>
                        </VControl>
                      </VField>
                    </div>
                  <div class="column is-11">
                    <VField v-slot="{ id, field }" id="country" class="is-autocomplete-select">
                      <VControl icon="lucide:search">
                        <Multiselect
                          v-model="selectedCountry"
                          :attrs="{ id }"
                          :options="countriesList"
                          :placeholder="t('listCountry.placeholder')"
                          :searchable="true"
                        />
                        <p v-if="field?.errorMessage" class="help is-danger">
                         {{ t(field?.errorMessage) }}
                        </p>
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-11">
                    <VField v-slot="{ field }" id="email">
                      <VControl>
                        <VInput
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
                  <div class="column is-11">
                    <VField v-slot="{ field }" id="password" addons>
                      <VControl expanded>
                        <VInput
                          :type="fieldType"
                          :placeholder="t('password.placeholder')"
                          autocomplete="password"
                          @input="handleInput"
                          @blur="handleBlur"
                        />
                        <p v-if="showErrorMessage && field?.errorMessage" class="help is-danger">
                         {{ t(field?.errorMessage) }}
                        </p>
                      </VControl>
                      <VControl>
                        <VButtons>
                          <VIconButton
                            v-if="fieldType == 'text'"
                            icon="lucide:eye"
                            @click="handlePassword"
                          />
                          <VIconButton
                           v-else
                            icon="lucide:eye-off"
                            @click="handlePassword"
                            />
                        </VButtons>
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
                      {{ t('action.signup') }}
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

<style lang="scss">
.multiselect-wrapper{
  margin-left: 30px;
}

.is-agree {
  span {
    color: var(--placeholder-dark-8);
    font-size: small;
    a {
      color: var(--muted-grey);
      font-weight: 500;
      transition: color 0.3s;

      &:hover {
        color: var(--primary) !important;
      }
    }
  }
}
</style>










