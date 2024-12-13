<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

import { useApiAccount } from "/@src/api/apiAccount";

const { t } = useI18n();
const api = useApiAccount();

const emits = defineEmits(["close"]);

const props = defineProps({
  publicKey: {
    type: String,
    default: null,
  },
});

const resetToken = ref<Boolean>(false);

const handleResetToken = async () => {
  resetToken.value = false;
};

const formError = ref<Boolean>(false);

const schema = toTypedSchema(
  z.object({
    publicKey: z.string({ required_error: "publicKey.required" }),
    token: z.string({ required_error: "token.required" }),
  }),
);

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: schema,
});

setFieldValue("publicKey", props.publicKey);

const handleRemove = handleSubmit(async (values) => {
  await api
    .post("wallet/remove-secret-key", values)
    .then(async (response) => {
      emits("close");
    })
    .catch((error) => {
      if (error.response.data.formErrors) {
        formError.value = res.data.formErrors;
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
    <p>{{ t("components.wallet.secretKey.remove.update") }}</p>
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
    <form @submit.prevent="handleRemove">
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
