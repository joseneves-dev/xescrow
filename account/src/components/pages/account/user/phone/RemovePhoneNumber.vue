<script setup lang="ts">
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

import { useApiAccount } from '/@src/api/apiAccount'
import { usePhoneNumber } from '/@userStores/phoneNumber'
import { phoneNumberRemoveWorker, phoneNumberRemove } from '/@src/utils/countdown'

const { t } = useI18n()
const api = useApiAccount()

const phoneNumber = usePhoneNumber()

const props = defineProps({
  isModal: {
    type: Boolean,
  },
})

const emits = defineEmits(['close', 'active'])

const isLoading = ref<boolean>(false)

const resetToken = ref<Boolean>(false)

const isDisabled = ref<boolean>(true)
const formError = ref<Boolean>(false)

const tokenSchema = toTypedSchema (
  z.object({
    token: z.string({required_error: 'token.required'})
    .min(6, { message: 'token.min'})
    .optional(),
  })
  .refine(data => {
    if (phoneNumber?.verified) {
      return data.token !== undefined; // Token must be present if condition is true
    }
    return true; // Token can be absent otherwise
  }, {
    message: 'token.invalid',
    path: ['token'],
  })
);

const { handleSubmit, setFieldValue , setErrors, resetForm } = useForm({
  validationSchema: tokenSchema,
})

const handleReset = async () => {
  resetToken.value = true
}

const handleNewRemove = async () => {
  await api.post('user/new-remove-phone')
  .then(async (response) => {
      phoneNumberRemove()
      resetToken.value = true
  })
  .catch((error) => {
  })
}

const handleRemove = handleSubmit( async (value) => {
  await api.post('user/remove-phone', value)
  .then(async (response) => {
      emits('close')
      phoneNumber.clear()
  })
  .catch((error) => {
      if(error.response.data.fieldErrors) {
        setErrors(error.response.data.fieldErrors);                   
      }
      if(error.response.data.formErrors){
        formError.value = error.response.data.formErrors
      }
      resetToken.value = true
  })
});

// Method to handle the click event
const handleClick = () => {
  emits('active', 'phone_update');
};

const formattedUpdate = computed(() => {
  const formatted = `<b id="update">${ phoneNumber?.country?.code} ${phoneNumber.number}</b>`;
  return t('pages.contacts.phoneNumber.remove.update', { phoneNumber: formatted });
});


watchEffect(() => {
  if(phoneNumber?.remove?.nextRequest > 0){
      isDisabled.value = true
  }else{
      isDisabled.value = false
  }
})

onMounted(() => {
  // Attach the event listener to the element after the DOM is rendered
  const updateElement = document.getElementById("update");
  if (updateElement) {
    updateElement.addEventListener('click', handleClick);
  }
});

onBeforeMount(async () => {
  phoneNumberRemove()
})

onBeforeUnmount(async () => {
  if(phoneNumberRemoveWorker){
    phoneNumberRemoveWorker.terminate()
    }
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
            <form @submit.prevent="handleRemove">
              <div class="columns is-centered is-multiline">
                <div class=" column is-8 is-full">
                  <h3 class="dark-inverted">{{ t('pages.contacts.phoneNumber.remove.title') }}</h3>
                </div>
              <div class=" column is-12 is-full">
                <p v-html="formattedUpdate"></p>
              </div>
                <VerificationToken
                  v-if="phoneNumber?.verified" 
                  class="column is-5"
                  :reset-token="resetToken"
                  @token="(value) => { setFieldValue('token', value) }"
                  @resetToken="handleReset"
                />
              <p v-if="formError" class="help is-danger">{{ t('form.error') }}</p>
                <VField v-slot="{ field }" id="token">
                  <VControl>
                    <VInput v-bind="field" type="hidden"/>
                    <p v-if="field?.errorMessage" class="help is-danger">
                     {{ t(field?.errorMessage) }}
                    </p>
                  </VControl>
                </VField>
              </div>
            <div class="buttons">
              <VButton
                color="primary"
                raised
                tabindex="0"
                class="m-2"
                type="submit"
              >
                {{  t('action.submit') }}
              </VButton>
              <VButton
                v-if="phoneNumber?.verified"
                color="primary"
                raised
                tabindex="0"
                class="m-2"
                @click="handleNewRemove"
                :disabled = isDisabled
              >
                <strong>{{  t('action.requestToken') }}</strong>
              </VButton>
              <VButton
              v-if="props.isModal"
                color="primary"
                raised
                tabindex="0"
                outlined
                class="m-2"
                @click="()=> { emits('close')}"
              >
              {{  t('action.cancel') }}
              </VButton>
            </div>
          </form>
          </div>
        </VLoader>
      </div>
      
    </div>
  </div>
</template>