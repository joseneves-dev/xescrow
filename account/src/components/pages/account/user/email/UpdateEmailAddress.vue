<script setup lang="ts">
import { useForm, useFormErrors } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

import { useApiAccount } from '/@src/api/apiAccount'

const props = defineProps({
  isModal: {
    type: Boolean,
  },
  email:{
    type: String
  }
})

const emits = defineEmits(['close', 'active'])

const { t } = useI18n()
const api = useApiAccount()

const formError = ref<Boolean>(false)

const schema = toTypedSchema ( 
  z.object({
    email: z
      .string({
        required_error: 'emailAddress.required',
      }).email({
          message: 'emailAddress.invalid',
      }),
  })
);

const { handleSubmit, setErrors, setFieldValue}  = useForm({
  validationSchema : schema,
})

const isLoading = ref<boolean>(false)

const handleUpdate = handleSubmit(async (values) => {
  await api.post('user/update-email', values)
  .then(async (response) => {
      emits('active', 'email_verification')
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
  <div class="action-page-wrapper">
    <div class="wrapper-inner">
        <div class="action-box">
        <VLoader :active="isLoading">
          <div class="box-content">
            <img
              class="light-image"
              src="/@src/assets/illustrations/placeholders/launch.svg"
              alt=""
            />
            <img
              class="dark-image"
              src="/@src/assets/illustrations/placeholders/launch-dark.svg"
              alt=""
            />
            <form @submit.prevent="handleUpdate" >
            <div class="columns is-centered is-multiline">
              <div class=" column is-6 is-full">
                <h3 class="dark-inverted">{{ t('pages.contacts.emailAddress.update.title') }}</h3>
              </div>
              <div class=" column is-12 is-full">
                {{ t('pages.contacts.emailAddress.update.subtitle') }}
              </div>
              <div class=" column is-8 is-full">
                <p v-if="formError" class="help is-danger">{{ t('form.error') }}</p>
                <VField  
                v-slot="{ field }"
                id="email">
                  <VControl>
                    <VInput
                      v-bind="field"
                      :placeholder="t('emailAddress.placeholder')" 
                    />
                    <p v-if="field?.errorMessage" class="help is-danger">
                     {{ t(field?.errorMessage) }}
                    </p>
                  </VControl>
                </VField>
              </div>
            </div>
              <div class="buttons">
                <VButton
                  color="primary"
                  raised
                  tabindex="0"
                  class="m-2"
                  type="submit"
                >
                {{t('action.submit')}}
                </VButton>
                <VButton
                  color="primary"
                  raised
                  tabindex="0"
                  outlined
                  class="m-2"
                  @click="()=> {
                    if(props.isModal){
                      emits('close')
                    }else{
                      emits('active', 'email_verification')
                    }
                  }"
                >
                {{t('action.cancel')}}
                </VButton>
              </div>
            </form>
          </div>
        </VLoader>
      </div>
    </div>
  </div>
</template>











































