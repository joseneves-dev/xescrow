<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

import { useApiAccount } from "/@src/api/apiAccount";

import { useWallet } from "/@userStores/wallet";

const { t } = useI18n();
const router = useRouter();

const wallet = useWallet();

const api = useApiAccount();

const emits = defineEmits(["close"]);

const props = defineProps({
  publicKey: {
    type: String,
    default: null,
  },
  secretKey: {
    type: Boolean,
    default: false,
  },
});

const formError = ref<Boolean>(false);

const removeSchema = toTypedSchema(
  z.object({
    publicKey: z.string({ required_error: "publicKey.required" }),
    token: z.string({ required_error: "token.required" }).optional(),
  }),
);

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: removeSchema,
});

setFieldValue("publicKey", props.publicKey);

const resetToken = ref<Boolean>(false);

const handleResetToken = async () => {
  resetToken.value = false;
};

const handleRemove = handleSubmit(async (value) => {
  await api
    .post("wallet/remove-account", value)
    .then(async (response) => {
      delete wallet?.accounts[response.data.publicKey];

      emits("close");

      if (Object.values(wallet.accounts).length == 0) {
        router.push({ name: "start-wallet" });
      }
    })
    .catch((error) => {
      if (error.response.data.formErrors) {
        formError.value = error.response.data.formErrors;
      }
    });
});
const isLoading = ref(false);
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
                <form @submit.prevent="handleRemove">
                  <p v-if="formError" class="help is-danger">
                    {{ t("form.error") }}
                  </p>
                  <div class="columns is-centered is-multiline">
                    <div class="column is-6 is-full">
                      <h3 class="dark-inverted">
                        {{ t("components.wallet.account.remove.confirm") }}
                      </h3>
                      <p>{{ publicKey }}</p>
                    </div>
                    <VerificationToken
                      v-if="props.secretKey"
                      class="column is-two-thirds"
                      :reset-token="resetToken"
                      @token="
                        (value) => {
                          setFieldValue('token', value);
                        }
                      "
                      @resetToken="handleResetToken"
                    />

                    <VField v-slot="{ field }" id="publicKey">
                      <VControl>
                        <VInput v-bind="field" type="hidden" />
                        <p v-if="field?.errorMessage" class="help is-danger">
                          {{ field?.errorMessage }}
                        </p>
                      </VControl>
                    </VField>
                    <VField
                      v-if="props.secretKey"
                      v-slot="{ field }"
                      id="token"
                    >
                      <VControl>
                        <VInput v-bind="field" type="hidden" />
                      </VControl>
                    </VField>
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
