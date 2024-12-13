<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

import { useApiAuth } from "/@src/api/apiAuth";

import {
  secondFactorExpiresWorker,
  secondFactorNextRequestWorker,
  secondFactorExpires,
  secondFactorNextRequest,
} from "/@src/utils/countdown";
import sleep from "/@src/utils/sleep";

import { useSecondFactor } from "/@userStores/secondFactor";
import { useSession } from "/@userStores/session";

const session = useSession();
const secondFactor = useSecondFactor();

const api = useApiAuth();
const { t } = useI18n();

const formError = ref<Boolean>(false);

const schemaToken = z.object({
  token: z.string({
    required_error: "token.required",
  }),
  trustDevice: z.boolean().optional(),
});

const schemaMethod = z.object({
  method: z.string({
    required_error: "method.invalid",
  }),
});

// Define a validation schema
const validationSchemaToken = toTypedSchema(schemaToken);
const validationSchemaMethod = toTypedSchema(schemaMethod);

const formToken = useForm({
  validationSchema: validationSchemaToken,
});

const formMethod = useForm({
  validationSchema: validationSchemaMethod,
});

//Loader animation
const isLoaderActive = ref<Boolean>(true);

//resetToken
const resetToken = ref<Boolean>(false);
const otherMethods = ref<Boolean>(false);

const availableMethods = reactive({
  app: ref<Boolean>(secondFactor?.methods?.app ? true : false),
  emailAddress: ref<Boolean>(
    secondFactor?.methods?.emailAddress ? true : false,
  ),
  phoneNumber: ref<Boolean>(secondFactor?.methods?.phoneNumber ? true : false),
});

const countOtherMethos = computed(() => {
  let trueCount = 0;
  if (availableMethods.app) trueCount++;
  if (availableMethods.emailAddress) trueCount++;
  if (availableMethods.phoneNumber) trueCount++;
  return trueCount > 1;
});

//New Two Factor Auth Method
const selectedMethod = ref<string | null>(secondFactor?.method?.type || null);
//Stop 2FA
const stopCheck = ref<Boolean>(false);

//isDisable new requests token
const isDisabled = ref<boolean>(true);

const checkTwoFactor = async () => {
  if (stopCheck.value == true) {
    return;
  }
  if (secondFactor?.method.type == "app") {
    await api
      .get("secondfactor/otn")
      .then(async (response) => {
        await sleep();
        await checkTwoFactor();
        isLoaderActive.value = false;
      })
      .catch((error) => {});
  }
};

const handleResetToken = async (data: Boolean) => {
  resetToken.value = data;
};

const onCancel = async () => {
  session.logout();
};

const onCancelMethods = async () => {
  otherMethods.value = false;
};

const handleRequest = async () => {
  if (countOtherMethos.value) {
    otherMethods.value = true;
  } else {
    formMethod.setValues({ method: selectedMethod.value });
    handleRequestSecondFactor();
  }
};

const handleMethods = async () => {
  formMethod.setValues({ method: selectedMethod.value });
  otherMethods.value = false;
  handleRequestSecondFactor();
};

const handleToken = formToken.handleSubmit(async (values) => {
  await api
    .post("secondfactor/ott", values)
    .then(async (response) => {})
    .catch((error) => {
      if (error.response.data.formErrors) {
        formError.value = error.response.data.formErrors;
      }
      resetToken.value = true;
    });
});

const handleRequestSecondFactor = formMethod.handleSubmit(async (values) => {
  stopCheck.value = true;
  await api
    .post("/secondfactor", values)
    .then(async (response) => {
      resetToken.value = true;
      secondFactorNextRequest();
    })
    .catch((error) => {});
});

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const emailAddress = ref<string>(
  secondFactor?.methods?.emailAddress?.email || "",
);

const phoneNumber = ref<string>(
  secondFactor?.methods?.phoneNumber?.country?.code &&
    secondFactor?.methods?.phoneNumber?.number
    ? secondFactor.methods.phoneNumber.country.code +
        " " +
        secondFactor.methods.phoneNumber.number
    : "",
);

watchEffect(() => {
  if (secondFactor?.expires == 0) {
    secondFactorExpiresWorker.terminate();
    session.logout();
  }

  if (secondFactor?.method?.nextRequest > 0) {
    isDisabled.value = true;
  } else {
    isDisabled.value = false;
  }
});

onBeforeMount(async () => {
  stopCheck.value = true;
  secondFactorExpires();
  secondFactorNextRequest();
});

onBeforeUnmount(async () => {
  stopCheck.value = true;
  if (secondFactorExpiresWorker) {
    secondFactorExpiresWorker.terminate();
  }
  if (secondFactorNextRequestWorker) {
    secondFactorNextRequestWorker.terminate();
  }
});
</script>
<template>
  <div class="auth-head">
    <h2>Authentication</h2>
    <VLoader
      size="large"
      :active="isLoaderActive"
      :empty="true"
      :transparent="true"
      class="m-5"
    />
  </div>
  <div class="form-card">
    <form @submit.prevent="handleRequestSecondFactor">
      <VField v-slot="{ field }" id="method">
        <VControl>
          <VInput v-bind="field" type="hidden" />
          <p v-if="field?.errorMessage" class="help is-danger">
            {{ t(field?.errorMessage) }}
          </p>
        </VControl>
      </VField>
    </form>
    <div v-if="otherMethods" class="login-form">
      <VField>
        <VControl>
          <VRadio
            v-if="availableMethods.app"
            v-model="selectedMethod"
            value="app"
            :label="t('pages.secondFactor.app.sendNotification')"
            name="outlined_radio"
          />
          <VRadio
            v-if="availableMethods.emailAddress"
            v-model="selectedMethod"
            value="emailAddress"
            :label="
              t('pages.secondFactor.emailAddress.sendToken', {
                emailAddress: emailAddress,
              })
            "
            name="outlined_radio"
          />
          <VRadio
            v-if="availableMethods.phoneNumber"
            v-model="selectedMethod"
            value="phoneNumber"
            :label="
              t('pages.secondFactor.phoneNumber.sendToken', {
                phoneNumber: phoneNumber,
              })
            "
            name="outlined_radio"
          />
        </VControl>
      </VField>
      <div class="columns is-vcentered">
        <VControl class="column is-6">
          <VButton
            color="primary"
            outlined
            fullwidth
            raised
            @click="onCancelMethods"
          >
            {{ t("action.cancel") }}
          </VButton>
        </VControl>
        <VControl class="column is-6">
          <VButton color="primary" fullwidth raised @click="handleMethods">
            {{ t("action.next") }}
          </VButton>
        </VControl>
      </div>
    </div>
    <div v-else class="login-form">
      <VField class="has-text-centered mb-4">
        <div v-if="secondFactor?.method?.type == 'app'">
          <h3 class="has-text-weight-bold mb-4">
            {{ t("pages.secondFactor.app.check") }}
          </h3>
          <p>
            {{ t("pages.secondFactor.app.sent") }}
          </p>
        </div>
        <div v-else-if="secondFactor?.method?.type == 'emailAddress'">
          <h3 class="has-text-weight-bold mb-4">
            {{ t("pages.secondFactor.emailAddress.check") }}
          </h3>
          <p>
            {{ t("pages.secondFactor.emailAddress.sent") }}
          </p>
        </div>
        <div v-else-if="secondFactor?.method?.type == 'phoneNumber'">
          <h3 class="has-text-weight-bold mb-4">
            {{ t("pages.secondFactor.phoneNumber.check") }}
          </h3>
          <p>
            {{ t("pages.secondFactor.phoneNumber.sent") }}
          </p>
        </div>
        <span class="has-text-weight-bold">
          {{ formatTime(secondFactor?.expires) }} min
        </span>
      </VField>
      <VerificationToken
        v-if="secondFactor?.method?.type != 'app'"
        :reset-token="resetToken"
        @token="
          (value) => {
            formToken.setValues({ token: value });
          }
        "
        @resetToken="handleResetToken"
      />
      <form @submit.prevent="handleToken">
        <p v-if="formError" class="help is-danger">{{ t("form.error") }}</p>
        <VField v-slot="{ field }" id="token">
          <VControl>
            <VInput v-bind="field" type="hidden" />
            <p v-if="field?.errorMessage" class="help is-danger">
              {{ t(field?.errorMessage) }}
            </p>
          </VControl>
        </VField>
        <VField class="mb-4" id="trustDevice">
          <VControl>
            <VCheckbox :label="t('action.trustDevice')" color="primary" />
          </VControl>
        </VField>
        <div class="columns is-vcentered">
          <VControl class="column is-6">
            <VButton
              color="primary"
              fullwidth
              raised
              tabindex="0"
              type="submit"
            >
              {{ t("action.submit") }}
            </VButton>
          </VControl>
          <VControl class="column is-6">
            <VButton
              color="primary"
              outlined
              fullwidth
              raised
              @click="onCancel"
            >
              {{ t("action.cancel") }}
            </VButton>
          </VControl>
        </div>
      </form>
      <div class="columns is-vcentered">
        <VControl class="column is-12">
          <VButton
            color="primary"
            fullwidth
            raised
            :disabled="isDisabled"
            @click="handleRequest"
          >
            {{ t("action.requestToken") }}
          </VButton>
        </VControl>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.checkbox {
  padding: 1em 1em 1em 0 !important;
}
</style>
