<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

import { useApiAccount } from "/@src/api/apiAccount";

const api = useApiAccount();
const emits = defineEmits(["close"]);
const { t } = useI18n();
const props = defineProps({
  publicKey: {
    type: String,
    default: null,
  },
});
const resetToken = ref<Boolean>(false);
const publicKey = ref<String>();
const secretKey = ref<String>();

const handleResetToken = async () => {
  resetToken.value = false;
};

const formError = ref<Boolean>(false);

const Schema = toTypedSchema(
  z.object({
    publicKey: z.string({ required_error: "publicKey.required" }),
    token: z.string({ required_error: "token.required" }),
  }),
);

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: Schema,
});

setFieldValue("publicKey", props.publicKey);

const handleView = handleSubmit(async (values) => {
  await api
    .post("wallet/view-secret-key", values)
    .then(async (response) => {
      publicKey.value = response.data.publicKey;
      secretKey.value = response.data.secretKey;
    })
    .catch((error) => {
      if (error.response.data.formErrors) {
        formError.value = error.response.data.formErrors;
      }
      resetToken.value = true;
    });
});
</script>
<template>
  <VLoader :active="isLoading">
    <div v-if="!secretKey && !publicKey">
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
        {{ t("components.wallet.secretKey.view.send") }}
      </h3>
      <p>
        {{ t("components.wallet.secretKey.view.update") }}
      </p>
      <div class="columns is-centered mb-0">
        <VerificationToken
          class="column is-two-thirds"
          :reset-token="resetToken"
          @token="
            (value) => {
              setFieldValue('token', value);
            }
          "
          @resetToken="handleResetToken"
        />
      </div>
      <form @submit.prevent="handleView">
        <p v-if="formError" class="help is-danger">
          {{ t("form.error") }}
        </p>
        <VField v-slot="{ field }" id="publicKey">
          <VControl>
            <VInput v-bind="field" type="hidden" />
          </VControl>
        </VField>
        <VField v-slot="{ field }" id="token">
          <VControl>
            <VInput v-bind="field" type="hidden" />
          </VControl>
        </VField>
        <div class="buttons">
          <VButton
            color="primary"
            raised
            tabindex="0"
            class="m-2"
            type="submit"
          >
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
    </div>
    <div v-else>
      <h4 class="has-text-centered">
        {{ t("components.wallet.secretKey.view.saveSecretKey") }}
      </h4>
      <h3 class="has-text-centered mt-5">
        {{ t("components.wallet.secretKey.view.download") }}
      </h3>
      <div class="columns is-multiline mt-5">
        <div class="column is-12">
          {{ t("components.wallet.secretKey.view.publicKey") }}
          <p>{{ publicKey }}</p>
        </div>
        <div class="column is-12">
          {{ t("components.wallet.secretKey.view.secretKey") }}
          <p>{{ secretKey }}</p>
        </div>
      </div>

      <div class="form-section-outer">
        <div class="buttons">
          <VButton
            color="primary"
            raised
            tabindex="0"
            outlined
            class="ml-2"
            @click="emits('close')"
          >
            {{ t("action.close") }}
          </VButton>
        </div>
      </div>
    </div>
  </VLoader>
</template>
