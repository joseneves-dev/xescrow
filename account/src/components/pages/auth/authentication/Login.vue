<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

import { useReCaptcha } from "vue-recaptcha-v3";

import { useApiAuth } from "/@src/api/apiAuth";

import { useAppNotification } from "/@appStores/appNotification";

const notification = useAppNotification();

const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

const api = useApiAuth();
const { t } = useI18n();

await recaptchaLoaded();

const isLoading = ref<boolean>(false);

const fieldType = ref<String>("password");
const showErrorMessage = ref<Boolean>(false);

const handlePassword = async () => {
  if (fieldType.value == "password") {
    fieldType.value = "text";
  } else {
    fieldType.value = "password";
  }
};

const formError = ref<Boolean>(false);

const schema = toTypedSchema(
  z.object({
    email: z
      .string({
        required_error: "emailAddress.required",
      })
      .email({
        message: "emailAddress.invalid",
      }),
    password: z
      .string({
        required_error: "password.required",
      })
      .min(10, {
        message: "password.min",
      }),
  }),
);

const { handleSubmit, setErrors } = useForm({
  validationSchema: schema,
});

const handleLogin = handleSubmit(async (values) => {
  const reCaptcha = await executeRecaptcha();

  if (!reCaptcha) {
    notification.set({ type: "error", message: t("reCAPTCHA.fail") });
    return;
  }
  const data = {
    ...values,
    reCaptcha: reCaptcha,
  };
  await api
    .post("login", data)
    .then(async (response) => {})
    .catch((error) => {
      if (error.response.data.fieldErrors) {
        setErrors(error.response.data.fieldErrors);
      }
      if (error.response.data.formErrors) {
        formError.value = error.response.data.formErrors;
      }
    });
});

const handleInput = () => {
  showErrorMessage.value = false; // Disable error message display while typing
};

const handleBlur = () => {
  showErrorMessage.value = true; // Enable error message display when finished typing
};
</script>
<template>
  <div class="auth-head">
    <h2>{{ t("pages.login.title") }}</h2>
    <p>{{ t("pages.login.subtitle") }}</p>
    <RouterLink :to="{ name: 'signup' }">
      {{ t("action.signup") }}
    </RouterLink>
  </div>
  <div class="form-card">
    <VMessage color="primary">
      <div>
        <strong class="pr-1">email:</strong>
        <span>solana@xescrow.app</span>
      </div>
      <div>
        <strong class="pr-1">password:</strong>
        <span>Radar2024$</span>
      </div>
    </VMessage>
    <form @submit.prevent="handleLogin" class="login-form">
      <p v-if="formError" class="help is-danger">{{ t("form.error") }}</p>
      <VField v-slot="{ field }" id="email">
        <VControl>
          <VInput
            v-bind="field"
            type="text"
            :placeholder="t('emailAddress.placeholder')"
            autocomplete="e-mail"
          />
          <p v-if="field?.errorMessage" class="help is-danger">
            {{ t(field?.errorMessage) }}
          </p>
        </VControl>
      </VField>
      <VField v-slot="{ field }" id="password" addons>
        <VControl expanded>
          <VInput
            v-bind="field"
            :type="fieldType"
            :placeholder="t('password.placeholder')"
            @input="handleInput"
            @blur="handleBlur"
            autocomplete="password"
          />

          <p
            v-if="showErrorMessage && field?.errorMessage"
            class="help is-danger"
          >
            {{ t(field?.errorMessage) }}
          </p>
        </VControl>
        <VControl class="is-over is-right">
          <VButtons class="is-right">
            <VIconButton
              v-if="fieldType == 'text'"
              icon="lucide:eye"
              @click="handlePassword"
            />
            <VIconButton v-else icon="lucide:eye-off" @click="handlePassword" />
          </VButtons>
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
          {{ t("action.login") }}
        </VButton>
      </VControl>

      <div class="forgot-link has-text-centered">
        <RouterLink :to="{ name: 'forgottenpassword' }">
          {{ t("action.password.forgot") }}
        </RouterLink>
      </div>
    </form>
  </div>
</template>
