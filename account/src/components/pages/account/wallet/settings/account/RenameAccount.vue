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
  rename: {
    type: String,
    default: "",
  },
});

const formError = ref<Boolean>(false);

const renameSchema = toTypedSchema(
  z.object({
    publicKey: z.string({ required_error: "publicKey.required" }),
    rename: z.string({ required_error: "rename.required" }),
  }),
);

const { handleSubmit, setFieldValue, setErrors, resetForm } = useForm({
  validationSchema: renameSchema,
});

setFieldValue("publicKey", props.publicKey);
setFieldValue("rename", props.rename);

const handleRename = handleSubmit(async (value) => {
  await api
    .post("wallet/rename-account", value)
    .then(async (response) => {
      emits("close");
    })
    .catch((error) => {
      if (error.response.data.formErrors) {
        formError.value = error.response.data.formErrors;
      }
    });
});
</script>
<template>
  <VModal :open="true" noheader nofooter noclose size="none">
    <template #content>
      <div class="action-page-wrapper">
        <div class="wrapper-inner">
          <div class="action-box">
            <VLoader :active="isLoading">
              <div class="box-content">
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
                <form @submit.prevent="handleRename">
                  <div class="columns is-centered is-multiline">
                    <div class="column is-8 is-full">
                      <h3 class="dark-inverted">
                        {{ t("components.wallet.account.rename.title") }}
                      </h3>
                    </div>
                    <div class="column is-12 is-full">
                      <p>
                        {{ t("components.wallet.account.rename.subtitle") }}
                      </p>
                    </div>
                    <div class="column is-8 is-full">
                      <p v-if="formError" class="help is-danger">
                        {{ t("form.error") }}
                      </p>
                      <VField v-slot="{ field }" id="publicKey">
                        <VControl>
                          <VInput v-bind="field" type="hidden" />
                          <p v-if="field?.errorMessage" class="help is-danger">
                            {{ field?.errorMessage }}
                          </p>
                        </VControl>
                      </VField>
                      <VField v-slot="{ field }" id="rename">
                        <VControl>
                          <VInput v-bind="field" />
                          <p v-if="field?.errorMessage" class="help is-danger">
                            {{ field?.errorMessage }}
                          </p>
                        </VControl>
                      </VField>
                    </div>
                  </div>
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
            </VLoader>
          </div>
        </div>
      </div>
    </template>
  </VModal>
</template>
