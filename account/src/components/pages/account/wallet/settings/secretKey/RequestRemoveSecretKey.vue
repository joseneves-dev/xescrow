<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

import { useApiAccount } from "/@src/api/apiAccount";

import { useEmailAddress } from "/@src/stores/user/emailAddress";
import { usePhoneNumber } from "/@src/stores/user/phoneNumber";
import { useApp } from "/@src/stores/user/app";
import { useWarning } from "/@src/stores/user/warning";

const { t } = useI18n();
const api = useApiAccount();

const emailAddress = useEmailAddress();
const phoneNumber = usePhoneNumber();
const app = useApp();
const warning = useWarning();

const emits = defineEmits(["close", "success"]);

const props = defineProps({
  publicKey: {
    type: String,
    default: null,
  },
});

if (!emailAddress.email) {
  await api
    .get("user/get-email")
    .then((response) => {})
    .catch((error) => {});
}

if (!phoneNumber.number && !warning?.phoneNumber) {
  await api
    .get("user/get-phone")
    .then((response) => {})
    .catch((error) => {});
}

const method = reactive({
  app: ref<Boolean>(app?.verified),
  email: ref<Boolean>(emailAddress?.verified),
  phone: ref<Boolean>(phoneNumber?.verified),
});

const formError = ref<Boolean>(false);

const Schema = toTypedSchema(
  z.object({
    publicKey: z.string({ required_error: "publicKey.required" }),
    method: z.string({ required_error: "method.required" }),
  }),
);

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: Schema,
});

setFieldValue("publicKey", props.publicKey);

const handleRequest = handleSubmit(async (values) => {
  await api
    .post("wallet/request-remove", values)
    .then(async (response) => {
      emits("success");
    })
    .catch((error) => {
      if (error.response.data.formErrors) {
        formError.value = error.response.data.formErrors;
      }
    });
});
</script>
<template>
  <VLoader :active="isLoading">
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
    <h3 class="dark-inverted">
      {{ t("components.wallet.secretKey.remove.send") }}
    </h3>
    <p>
      {{ t("components.wallet.secretKey.remove.update") }}
    </p>
    <form @submit.prevent="handleRequest">
      <p v-if="formError" class="help is-danger">
        {{ t("form.error") }}
      </p>
      <VField v-slot="{ field }" id="publicKey">
        <VControl>
          <VInput v-bind="field" type="hidden" />
        </VControl>
      </VField>
      <VField v-slot="{ field }" id="method">
        <VControl>
          <VRadio
            v-if="method.app"
            v-model="field.value"
            value="app"
            label="Send new notification to App"
            name="outlined_radio"
          />
          <VRadio
            v-if="method.email"
            v-model="field.value"
            value="email"
            :label="'Send new code to email ( ' + emailAddress.email + ' )'"
            name="outlined_radio"
          />
          <VRadio
            v-if="method.phone"
            v-model="field.value"
            value="phone"
            :label="
              'Send new code to Phone ( +' +
              phoneNumber?.code +
              ' ' +
              phoneNumber?.number +
              '  )'
            "
            name="outlined_radio"
          />
        </VControl>
      </VField>
      <div class="buttons">
        <VButton color="primary" raised tabindex="0" class="m-2" type="submit">
          {{ t("action.submit") }}
        </VButton>
        <VButton
          color="primary"
          raised
          tabindex="0"
          outlined
          class="m-2"
          @click="emits('close')"
        >
          {{ t("action.cancel") }}
        </VButton>
      </div>
    </form>
  </VLoader>
</template>
