<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

import { useApiAccount } from "/@src/api/apiAccount";

const emits = defineEmits(["close"]);
const { t } = useI18n();
const props = defineProps({
  publicKey: {
    type: String,
    default: "",
  },
  secretKey: {
    type: String,
    default: "",
  },
});

const formError = ref<Boolean>(false);

const saveSchema = toTypedSchema(
  z.object({
    publicKey: z.string({ required_error: "publicKey.required" }),
    secretKey: z.string({ required_error: "secretKey.required" }),
  }),
);

const { handleSubmit, setFieldValue, setErrors, resetForm } = useForm({
  validationSchema: saveSchema,
});

setFieldValue("publicKey", props.publicKey);
setFieldValue("secretKey", props.secretKey);

const router = useRouter();
const api = useApiAccount();

const isLoading = ref<Boolean>(false);

const handleSave = handleSubmit(async (value) => {
  await api
    .post("wallet/save-secret-key", value)
    .then(async (response) => {
      router.push({ name: "wallet" });
    })
    .catch((error) => {
      if (error.response.data.formErrors) {
        formError.value = error.response.data.formErrors;
      }
    });
});
</script>
<template>
  <form novalidate class="form-layout is-separate" @submit.prevent="handleSave">
    <p v-if="formError" class="help is-danger">{{ t("form.error") }}</p>
    <div class="form-outer">
      <div class="form-body">
        <div class="form-section">
          <div class="form-section-inner">
            <h3 class="has-text-centered">
              {{ t("components.wallet.secretKey.add.title") }}
            </h3>
            <h4 class="has-text-centered">
              {{ t("components.wallet.secretKey.add.subtitle") }}
            </h4>

            <div class="columns is-multiline mt-5">
              <div class="column is-12">
                {{ t("components.wallet.secretKey.add.publicKey") }}
                <VField v-slot="{ field }" id="publicKey">
                  <VControl>
                    <VInput v-bind="field" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-12">
                {{ t("components.wallet.secretKey.add.secretKey") }}
                <VField v-slot="{ field }" id="secretKey">
                  <VControl>
                    <VInput v-bind="field" />
                  </VControl>
                </VField>
              </div>
            </div>
            <div class="form-section-outer">
              <div class="buttons">
                <VButton type="submit" color="primary" bold raised>
                  {{ t("action.wallet.save") }}
                </VButton>

                <VButton
                  color="primary"
                  raised
                  tabindex="0"
                  outlined
                  class="ml-2"
                  @click="
                    () => {
                      emits('close');
                    }
                  "
                >
                  {{ t("action.cancel") }}
                </VButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
