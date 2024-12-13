<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

import { useApiAccount } from "/@src/api/apiAccount";

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
const route = useRoute();
const api = useApiAccount();

const handleSave = handleSubmit(async (value) => {
  await api
    .post("wallet/save-secret-key", value)
    .then(async (response) => {
      router.push({ name: "wallet", params: { ...route.params } });
    })
    .catch((error) => {
      console.log(error);
      if (error.response.data.formErrors) {
        formError.value = error.response.data.formErrors;
      }
    });
});
const download = async () => {
  const publicKey = props.publicKey;
  const secretKey = props.secretKey;

  const content = `Public Key: ${publicKey}\nSecret Key: ${secretKey}`;

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "solana-keypair.txt";
  link.click();
};
</script>
<template>
  <div class="action-box">
    <div class="box-content">
      <h3 class="dark-inverted">{{ t("components.wallet.save.title") }}</h3>
      <form
        novalidate
        class="form-layout is-separate"
        @submit.prevent="handleSave"
      >
        <p v-if="formError" class="help is-danger">{{ t("form.error") }}</p>
        <VField v-slot="{ field }" id="publicKey">
          <VControl>
            <VInput v-bind="field" type="hidden" />
          </VControl>
        </VField>
        <VField v-slot="{ field }" id="secretKey">
          <VControl>
            <VInput v-bind="field" type="hidden" />
          </VControl>
        </VField>
        <div class="form-outer">
          <div class="form-body">
            <div class="form-section">
              <div class="form-section-inner">
                <h4 class="has-text-centered">
                  {{ t("components.wallet.save.subtitle") }}
                </h4>

                <div class="columns is-multiline mt-5">
                  <div class="column is-12">
                    {{ t("components.wallet.save.publicKey") }}
                    <p>{{ publicKey }}</p>
                  </div>
                  <div class="column is-12">
                    {{ t("components.wallet.save.secretKey") }}
                    <p>{{ secretKey }}</p>
                  </div>
                </div>
                <h3 class="download has-text-centered mt-5" @click="download()">
                  {{ t("components.wallet.save.download") }}
                </h3>
                <h4 class="has-text-centered mt-3">
                  {{ t("components.wallet.save.warning") }}
                </h4>
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
                          router.push({
                            name: 'wallet',
                            params: { ...route.params },
                          });
                        }
                      "
                    >
                      {{ t("action.wallet.continueWithoutSave") }}
                    </VButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.download {
  cursor: pointer;
  &:hover {
    color: var(--primary) !important;
  }
}
</style>
