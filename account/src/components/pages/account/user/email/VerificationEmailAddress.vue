<script setup lang="ts">
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

import { useApiAccount } from '/@src/api/apiAccount'
import { useEmailAddress } from '/@userStores/emailAddress'

import { emailAddressVerificationWorker, emailAddressVerification } from '/@src/utils/countdown'

const props = defineProps({
  isModal: {
    type: Boolean,
  },
})

const emits = defineEmits(['close', 'active'])

const { t } = useI18n()

const api = useApiAccount()
const router = useRouter()
const route = useRoute()
const emailAddress = useEmailAddress()

const formError = ref<Boolean>(false)

const tokenSchema = toTypedSchema (
  z.object({
    token: z.string({required_error: 'token.required'}).min(6, { message: 'token.min'}),
  })
);

const { handleSubmit, setFieldValue , setErrors, resetForm } = useForm({
  validationSchema: tokenSchema,
})

const isLoading = ref<boolean>(false)

const resetToken = ref<Boolean>(false)

const isDisabled = ref<boolean>(false)

const handleResetToken = async () => {
  resetToken.value = false
}

const handleToken = async () => {
  await api.post('user/new-verification-email')
  .then(async (response) => {
    resetToken.value = true
    emailAddressVerification()
  })
  .catch((error) => {
  })
}

const handleVerification = handleSubmit(async (values) => {
  await api.post('user/verification-email', values)
  .then(async (response) => {
      if (route.name === 'verification-email') {
        router.push({ name: 'dashboard' })
      } else {
        emits('close')
      }
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
})

// Method to handle the click event
const handleClick = () => {
  emits('active', 'phone_update');
};

const formattedSent = computed(() => {
  const formatted = `<b id="sent">${emailAddress.email}</b>`;
  return t('pages.contacts.emailAddress.verification.sent', { emailAddress: formatted });
});

const formattedUpdate = computed(() => {
  const formatted = `<b id="update"> ${emailAddress.email}</b>`;
  return t('pages.contacts.emailAddress.verification.update', { emailAddress: formatted });
});

watchEffect(() => {
  if(emailAddress?.verification && emailAddress?.verification?.nextRequest > 0){
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

  const sentElement = document.getElementById("sent");
  if (sentElement) {
    sentElement.addEventListener('click', handleClick);
  }
});

onBeforeMount(async () => {
  emailAddressVerification()
})

onBeforeUnmount(async () => {
  if(emailAddressVerificationWorker){
      emailAddressVerificationWorker.terminate()
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
            <form @submit.prevent="handleVerification">
            <div class="columns is-centered is-multiline">
              <div class=" column is-8 is-full">
                <h3 class="dark-inverted">{{ t('pages.contacts.emailAddress.verification.title') }}</h3>
              </div>
            <div class=" column is-12 is-full">
              <p v-html="formattedSent"></p> 
              <p>{{ t('pages.contacts.emailAddress.verification.spam') }}</p> 
              <p v-html="formattedUpdate"></p>
            </div>
              <VerificationToken
                class="column is-5"
                :reset-token="resetToken"
                @token="(value) => { setFieldValue('token', value) }"
                @resetToken="handleResetToken"
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
                {{ t('action.submit') }}
              </VButton>
              <VButton
                v-if="!emailAddress?.verified"
                color="primary"
                raised
                tabindex="0"
                class="m-2"
                @click="handleToken"
                :disabled=isDisabled
              >
                <strong> {{ t('action.requestToken') }} </strong>
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
                {{ t('action.cancel') }}
              </VButton>
            </div>
          </form>
          </div>
        </VLoader>
      </div>
    </div>
  </div>
</template>










































