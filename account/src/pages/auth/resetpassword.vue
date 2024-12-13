<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

import { useReCaptcha } from "vue-recaptcha-v3";

import { useApiAuth } from "/@src/api/apiAuth";
import { useAppNotification } from "/@appStores/appNotification";

const notification = useAppNotification();
const route = useRoute();
const router = useRouter();
const api = useApiAuth();
const { t } = useI18n();

const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

await recaptchaLoaded();

const isLoading = ref<boolean>(false);

const typeNewPassword = ref<String>("password");
const typeConfirmPassword = ref<String>("password");

const formError = ref<Boolean>(false);

const token = ref<string>();
const request = ref<string>();

const schema = toTypedSchema(
  z
    .object({
      request: z.string({
        required_error: "token.required",
      }),
      token: z.string({
        required_error: "token.required",
      }),
      newPassword: z
        .string({
          required_error: "password.required",
        })
        .min(10, {
          message: "password.min",
        })
        .regex(/[a-z]/, {
          message: "password.lowercase",
        })
        .regex(/[A-Z]/, {
          message: "password.uppercase",
        })
        .regex(/\d/, {
          message: "password.numeric",
        })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, {
          message: "password.specialCharacter",
        }),
      confirmPassword: z.string({
        required_error: "password.required",
      }),
    })
    .refine((data) => data.newPassword == data.confirmPassword, {
      message: "password.match",
      path: ["confirmPassword"],
    }),
);

const { handleSubmit, setErrors, setFieldValue } = useForm({
  validationSchema: schema,
});

const handleNewPassword = async () => {
  if (typeNewPassword.value == "password") {
    typeNewPassword.value = "text";
  } else {
    typeNewPassword.value = "password";
  }
};
const handleConfirmPassword = async () => {
  if (typeConfirmPassword.value == "password") {
    typeConfirmPassword.value = "text";
  } else {
    typeConfirmPassword.value = "password";
  }
};

const handleResetPassword = handleSubmit(async (values) => {
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
    .post("reset-password", data)
    .then((response) => {
      router.push({ name: "login" });
    })
    .catch((error) => {
      if (error.response.data.fieldErrors) {
        setErrors(error.response.data.fieldErrors);
      }
      if (error.response.data.formErrors) {
        formError.value = error.response.data.formErrors;
      }
    });
});

onBeforeMount(() => {
  token.value = route.params.token.toString();
  setFieldValue("token", token.value);

  request.value = route.params.request.toString();
  setFieldValue("request", request.value);
});
</script>

<template>
  <div class="single-form-wrap">
    <div class="inner-wrap">
      <div class="auth-head">
        <h2>{{ t("pages.resetPassword.title") }}</h2>
        <p>{{ t("pages.resetPassword.subtitle") }}</p>
      </div>

      <div class="form-card">
        <form @submit.prevent="handleResetPassword">
          <div class="login-form">
            <VField v-slot="{ field }" id="request">
              <VInput type="hidden" />
              <p v-if="field?.errorMessage" class="help is-danger">
                {{ t(field?.errorMessage) }}
              </p>
            </VField>
            <VField v-slot="{ field }" id="token">
              <VInput type="hidden" />
              <p v-if="field?.errorMessage" class="help is-danger">
                {{ t(field?.errorMessage) }}
              </p>
            </VField>
            <VField v-slot="{ field }" id="newPassword" addons>
              <VControl expanded>
                <VInput
                  v-bind="field"
                  :type="typeNewPassword"
                  :placeholder="t('newPassword.placeholder')"
                />
                <p v-if="field?.errorMessage" class="help is-danger">
                  {{ t(field?.errorMessage) }}
                </p>
              </VControl>
              <VControl class="is-over is-right">
                <VButtons>
                  <VIconButton
                    v-if="typeNewPassword == 'text'"
                    icon="lucide:eye"
                    @click="handleNewPassword"
                  />
                  <VIconButton
                    v-else
                    icon="lucide:eye-off"
                    @click="handleNewPassword"
                  />
                </VButtons>
              </VControl>
            </VField>
            <VField v-slot="{ field }" id="confirmPassword" addons>
              <VControl expanded>
                <VInput
                  v-bind="field"
                  :type="typeConfirmPassword"
                  :placeholder="t('confirmPassword.placeholder')"
                />
                <p v-if="field?.errorMessage" class="help is-danger">
                  {{ t(field?.errorMessage) }}
                </p>
              </VControl>
              <VControl class="is-over is-right">
                <VButtons>
                  <VIconButton
                    v-if="typeConfirmPassword == 'text'"
                    icon="lucide:eye"
                    @click="handleConfirmPassword"
                  />
                  <VIconButton
                    v-else
                    icon="lucide:eye-off"
                    @click="handleConfirmPassword"
                  />
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
                {{ t("action.submit") }}
              </VButton>
            </VControl>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
