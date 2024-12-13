<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

import { useApiAccount } from "/@src/api/apiAccount";

import { useAppCurrencies } from "/@appStores/appCurrencies";
import { useAppBlockchains } from "/@appStores/appBlockchains";

import { useWallet } from "/@userStores/wallet";

const { t } = useI18n();
const api = useApiAccount();
const router = useRouter();

const appCurrencies = useAppCurrencies();
const appBlockchains = useAppBlockchains();

const walletStore = useWallet();

const props = defineProps({
  publicKey: {
    type: String,
    default: null,
  },
});

const emits = defineEmits(["close"]);

const currencies = ref(appCurrencies.currencies);
const blockchains = ref(appBlockchains.blockchains);

const formError = ref<Boolean>(false);

const schema = toTypedSchema(
  z.object({
    publicKey: z.string({ required_error: "publicKey.required" }),
    blockchain: z.string({ required_error: "blockchain.required" }),
    currency: z.string({ required_error: "currency.invalid" }).optional(),
  }),
);

const { handleSubmit, setErrors, setFieldValue } = useForm({
  validationSchema: schema,
});

const selectedBlockchain = ref();
const setBlockchain = async (name: string) => {
  setFieldValue("blockchain", name);
  selectedBlockchain.value = true;
};

const selectedCurrency = ref();
const setCurrency = async (name: string) => {
  setFieldValue("currency", name);
  selectedCurrency.value = true;
};

let nextStep = ref<string>(
  Object.keys(walletStore.accounts).length === 0 ? "currency" : "blockchain",
);

const handleNextStep = (step: string) => {
  nextStep.value = step;
};

const handleImport = handleSubmit(async (values) => {
  await api
    .post("wallet/import", values)
    .then(async (response) => {
      router.push({ name: "wallet" });
      emits("close");
    })
    .catch((error) => {
      if (error.response.data.fieldErrors) {
        setErrors(error.response.data.fieldErrors);
      }
      if (error.response.data.formErrors) {
        formError.value = error.response.data.formErrors;
      }
    });
});

watchEffect(() => {
  if (props.publicKey) {
    setFieldValue("publicKey", props.publicKey);
  }
});
</script>

<template>
  <div class="action-page-wrapper">
    <div class="wrapper-inner">
      <div class="action-box">
        <div class="box-content">
          <h3 class="dark-inverted">
            {{ t("components.wallet.import.title") }}
          </h3>
          <form
            novalidate
            class="form-layout is-separate"
            @submit.prevent="handleImport"
          >
            <p v-if="formError" class="help is-danger">{{ t("form.error") }}</p>
            <div class="form-outer">
              <div class="form-body">
                <div v-if="nextStep == 'currency'" class="form-section">
                  <div class="form-section-inner">
                    <h3 class="has-text-centered">
                      {{ t("components.wallet.import.currency") }}
                    </h3>
                    <div class="columns is-multiline">
                      <div class="column is-flex is-justify-content-center">
                        <div class="radio-boxes">
                          <VControl
                            v-for="(currency, key) in currencies"
                            :key="key"
                            class="radio-box"
                            subcontrol
                          >
                            <VInput
                              type="radio"
                              name="currency"
                              :checked="selectedCurrency === currency.name"
                              @click="setCurrency(currency.name)"
                            />
                            <div class="radio-box-inner">
                              <div class="fee">
                                <span>{{ currency.symbol }}</span>
                              </div>
                              <p>{{ currency.name }}</p>
                            </div>
                          </VControl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-section-outer">
                    <div class="button-wrap">
                      <VButton
                        color="primary"
                        bold
                        raised
                        @click="handleNextStep('blockchain')"
                      >
                        {{ t("action.next") }}
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
                <div v-if="nextStep == 'blockchain'" class="form-section">
                  <div class="form-section-inner">
                    <h3 class="has-text-centered">
                      {{ t("components.wallet.connect.blockchain") }}
                    </h3>
                    <div class="columns is-multiline">
                      <div class="column is-flex is-justify-content-center">
                        <div class="radio-boxes">
                          <VControl
                            v-for="(blockchain, key) in blockchains"
                            :key="key"
                            class="radio-box"
                            subcontrol
                          >
                            <VInput
                              type="radio"
                              name="token"
                              :checked="blockchain === blockchain.metaData.name"
                              @click="setBlockchain(blockchain.metaData.name)"
                            />
                            <div class="radio-box-inner">
                              <div class="fee">
                                <span>{{ blockchain.metaData.symbol }}</span>
                              </div>
                              <p>{{ blockchain.metaData.name }}</p>
                            </div>
                          </VControl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-section-outer">
                    <div class="button-wrap">
                      <VButton
                        color="primary"
                        bold
                        raised
                        @click="handleNextStep('connect')"
                      >
                        {{ t("action.next") }}
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
                <div v-if="nextStep == 'connect'">
                  <VField id="currency" v-slot="{ field }">
                    <VControl>
                      <VInput v-bind="field" type="hidden" />
                      <p v-if="field?.errorMessage" class="help is-danger">
                        {{ field?.errorMessage }}
                      </p>
                    </VControl>
                  </VField>
                  <VField id="blockchain" v-slot="{ field }">
                    <VControl>
                      <VInput v-bind="field" type="hidden" />
                      <p v-if="field?.errorMessage" class="help is-danger">
                        {{ field?.errorMessage }}
                      </p>
                    </VControl>
                  </VField>
                  <VField v-slot="{ field }" id="publicKey">
                    <VControl>
                      <VInput
                        v-bind="field"
                        placeholder="Enter the 32 character publicKey"
                      />
                      <p v-if="field?.errorMessage" class="help is-danger">
                        {{ field?.errorMessage }}
                      </p>
                    </VControl>
                  </VField>
                  <div class="buttons">
                    <VButton
                      color="primary"
                      raised
                      tabindex="0"
                      outlined
                      class="m-2"
                      type="submit"
                    >
                      {{ t("action.wallet.import") }}
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
                      {{ t("action.cancel") }}
                    </VButton>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
