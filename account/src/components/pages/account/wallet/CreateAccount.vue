<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

import { useApiAccount } from "/@src/api/apiAccount";

import { useAppCurrencies } from "/@appStores/appCurrencies";
import { useAppBlockchains } from "/@appStores/appBlockchains";

import { useWallet } from "/@src/stores/user/wallet";

const { t } = useI18n();

const appCurrencies = useAppCurrencies();
const appBlockchains = useAppBlockchains();

const walletStore = useWallet();

const apiAccount = useApiAccount();

const emits = defineEmits(["close"]);

const blockchains = ref(appBlockchains.blockchains);
const currencies = ref(appCurrencies.currencies);

const tokens = ref([]);

const created = ref<Boolean>(false);
const publicKey = ref<String>("");
const secretKey = ref<String>("");
const isLoading = ref<Boolean>(false);
let nextStep = ref<string>(
  Object.keys(walletStore.accounts).length === 0 ? "currency" : "blockchain",
);

const selectedBlockchain = ref();

const formError = ref<Boolean>(false);

const schema = toTypedSchema(
  z.object({
    currency: z.string({ required_error: "currency.invalid" }).optional(),
    blockchain: z.string({ required_error: "blockchain.required" }),
    token: z.string({ required_error: "blockchain.token.required" }),
  }),
);

const { handleSubmit, setErrors, setFieldValue, resetField } = useForm({
  validationSchema: schema,
});

const setBlockchain = async (name: string) => {
  setFieldValue("blockchain", name);
  selectedBlockchain.value = name;
  tokens.value =
    (
      blockchains.value.find(
        (blockchain) => blockchain.metaData.name == selectedBlockchain.value,
      ) || {}
    ).tokens || [];
};

const selectedToken = ref();
const setToken = async (name: string) => {
  setFieldValue("token", name);
  selectedToken.value = name;
};

const handleNextStep = (step: string) => {
  nextStep.value = step;
};

const selectedCurrency = ref();
const setCurrency = async (name: string) => {
  setFieldValue("currency", name);
  selectedCurrency.value = name;
};

const handleCreate = handleSubmit(async (values) => {
  isLoading.value = true;
  await apiAccount
    .post("wallet/create-account", values)
    .then((response) => {
      created.value = true;
      publicKey.value = response.data.publicKey;
      secretKey.value = response.data.secretKey;
      isLoading.value = false;
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
</script>
<template>
  <div class="action-page-wrapper">
    <div class="wrapper-inner">
      <VLoader :active="isLoading">
        <div v-if="!created" class="action-box">
          <div class="box-content">
            <h3 class="dark-inverted">
              {{ t("components.wallet.createAccount.title") }}
            </h3>
            <form
              novalidate
              class="form-layout is-separate"
              @submit.prevent="handleCreate"
            >
              <p v-if="formError" class="help is-danger">
                {{ t("form.error") }}
              </p>
              <div class="form-outer">
                <div class="form-body">
                  <div v-if="nextStep == 'currency'" class="form-section">
                    <div class="form-section-inner">
                      <h3 class="has-text-centered">
                        {{ t("components.wallet.createAccount.currency") }}
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
                  <div
                    v-else-if="nextStep == 'blockchain'"
                    class="form-section"
                  >
                    <div class="form-section-inner">
                      <h3 class="has-text-centered">
                        {{ t("components.wallet.createAccount.blockchain") }}
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
                                name="blockchain"
                                :checked="
                                  blockchain === blockchain.metaData.name
                                "
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
                          @click="handleNextStep('token')"
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
                  <div v-else-if="nextStep == 'token'" class="form-section">
                    <div class="form-section-inner">
                      <h3 class="has-text-centered">
                        {{ t("components.wallet.createAccount.token") }}
                      </h3>
                      <div class="columns is-multiline">
                        <div class="column is-flex is-justify-content-center">
                          <div class="radio-boxes">
                            <VControl
                              v-for="(token, key) in tokens"
                              :key="key"
                              class="radio-box"
                              subcontrol
                            >
                              <VInput
                                type="radio"
                                name="token"
                                :checked="token === token.metaData.name"
                                @click="setToken(token.metaData.name)"
                              />
                              <div class="radio-box-inner">
                                <div class="fee">
                                  <span>{{ token.metaData.symbol }}</span>
                                </div>
                                <p>{{ token.metaData.name }}</p>
                              </div>
                            </VControl>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-section-outer">
                      <VField id="currency" v-slot="{ field }">
                        <VControl>
                          <VInput v-bind="field" type="hidden" />
                        </VControl>
                      </VField>
                      <VField id="blockchain" v-slot="{ field }">
                        <VControl>
                          <VInput v-bind="field" type="hidden" />
                        </VControl>
                      </VField>
                      <VField id="token" v-slot="{ field }">
                        <VControl>
                          <VInput v-bind="field" type="hidden" />
                        </VControl>
                      </VField>
                      <div class="button-wrap">
                        <VButton color="primary" bold raised type="submit">
                          {{ t("action.submit") }}
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
            </form>
          </div>
        </div>
        <SaveSecretKey v-else :publicKey="publicKey" :secretKey="secretKey" />
      </VLoader>
    </div>
  </div>
</template>
