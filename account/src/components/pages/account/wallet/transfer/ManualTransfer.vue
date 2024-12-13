<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

import { useApiAccount } from "/@src/api/apiAccount";

import { Keypair } from "@solana/web3.js";

const api = useApiAccount();
const props = defineProps({
  transaction: {
    type: Object,
    default: null,
  },
});

const emits = defineEmits(["close"]);

const formError = ref<Boolean>(false);
const isLoading = ref<Boolean>(false);
const schema = toTypedSchema(
  z.object({
    secretKey: z
      .string({ required_error: "auth.errors.password.required" })
      .min(4, { message: "Token must be at least 4 characters long" }),
  }),
);

const { handleSubmit, setErrors } = useForm({
  validationSchema: schema,
});

const handleTransaction = handleSubmit(async (values) => {
  isLoading.value = true;
  var fromKeypair;
  try {
    fromKeypair = Keypair.fromSecretKey(Buffer.from(values.secretKey, "hex"));
  } catch (error) {
    setErrors({ secretKey: "Invalid secretKey" });
    return;
  }

  try {
    const tx = ref(props.transaction.tx);

    tx.value.partialSign(fromKeypair);

    let txSerialized = tx.value.serialize({ requireAllSignatures: false });

    const base64Tx = txSerialized.toString("base64");

    if (props.transaction.data.escrowAccount) {
      await api
        .post("wallet/transfer/escrow", {
          transaction: props.transaction.data,
          tx: base64Tx,
        })
        .then(async (response) => {})
        .catch((error) => {
          if (error.response.data.formErrors) {
            formError.value = error.response.data.formErrors;
          }
        });
    } else {
      await api
        .post("wallet/transfer/normal", {
          transaction: props.transaction.data,
          tx: base64Tx,
        })
        .then(async (response) => {})
        .catch((error) => {
          if (error.response.data.formErrors) {
            formError.value = error.response.data.formErrors;
          }
        });
    }
  } catch (error) {}
  isLoading.value = false;
  emits("close");
});
</script>
<template>
  <VLoader :active="isLoading">
    <form class="form-layout is-separate" @submit.prevent="handleTransaction">
      <div class="form-outer">
        <div class="form-body">
          <div class="form-section">
            <div class="form-section-inner">
              <VField v-slot="{ field }" id="secretKey">
                <VControl>
                  <VInput placeholder="Secret Key" type="text" v-bind="field" />
                  <p v-if="field?.errorMessage" class="help is-danger">
                    {{ field?.errorMessage }}
                  </p>
                </VControl>
              </VField>
            </div>
          </div>
        </div>
        <VButton
          color="primary"
          raised
          tabindex="0"
          outlined
          class="m-2"
          type="submit"
        >
          CONFIRM {{ isLoading }} 1
        </VButton>
        <VButton
          color="primary"
          raised
          tabindex="0"
          outlined
          class="m-2"
          @click="
            () => {
              emits('close');
            }
          "
        >
          CANCEL
        </VButton>
      </div>
    </form>
  </VLoader>
</template>
