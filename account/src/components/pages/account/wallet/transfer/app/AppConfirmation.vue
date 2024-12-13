<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

import { useApiAccount } from "/@src/api/apiAccount";

const api = useApiAccount();
const emits = defineEmits(["close", "success"]);

const props = defineProps({
  transaction: {
    type: Object,
    default: null,
  },
});
const isLoading = ref<Boolean>(false);
const resetToken = ref<Boolean>(false);

const handleResetToken = async () => {
  resetToken.value = false;
};

const formError = ref<Boolean>(false);

const Schema = toTypedSchema(
  z.object({
    token: z.string({ required_error: "auth.errors.password.required" }),
  }),
);

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: Schema,
});

const handleView = handleSubmit(async (values) => {
  isLoading.value = true;
  const tx = props.transaction.tx;
  let txSerialized = tx.serialize({ requireAllSignatures: false });
  const base64Tx = txSerialized.toString("base64");
  if (props.transaction.data.escrowAccount) {
    await api
      .post("wallet/transfer/escrow", {
        transaction: props.transaction.data,
        tx: base64Tx,
        token: values.token,
      })
      .then(async (response) => {
        console.log("transaction success");
      })
      .catch((error) => {
        if (error.response.data.formErrors) {
          formError.value = error.response.data.formErrors;
        }
        resetToken.value = true;
      });
  } else {
    await api
      .post("wallet/transfer/normal", {
        transaction: props.transaction.data,
        tx: base64Tx,
        token: values.token,
      })
      .then(async (response) => {
        console.log("transaction success");
      })
      .catch((error) => {
        if (error.response.data.formErrors) {
          formError.value = error.response.data.formErrors;
        }
        resetToken.value = true;
      });
  }
  isLoading.value = false;
  emits("close");
});
</script>
<template>
  <VLoader :active="isLoading">
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
        Reload page ... invalid form
      </p>
      <VField v-slot="{ field }" id="token">
        <VControl>
          <VInput v-bind="field" type="hidden" />
        </VControl>
      </VField>
      <div class="buttons">
        <VButton color="primary" raised tabindex="0" class="m-2" type="submit">
          Submit
        </VButton>
        <VButton
          color="primary"
          raised
          tabindex="0"
          outlined
          class="m-2"
          @click="emits('close')"
        >
          Cancel
        </VButton>
      </div>
    </form>
  </VLoader>
</template>
