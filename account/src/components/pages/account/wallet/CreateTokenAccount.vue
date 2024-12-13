<script setup lang="ts">
import { useApiAccount } from "/@src/api/apiAccount";
import { useAppBlockchains } from "/@appStores/appBlockchains";

const { t } = useI18n();
const appBlockchains = useAppBlockchains();
const router = useRouter();
const api = useApiAccount();

const emits = defineEmits(["close"]);

const props = defineProps({
  accounts: {
    type: Object,
    default: null,
  },
  selectedAccount: {
    type: Object,
    default: null,
  },
});

const blockchains = ref(appBlockchains.blockchains);
const selectedBlockchain = ref(props.accounts);

const tokens = ref<Object>(
  (
    blockchains.value.find(
      (metaData) => metaData.name == selectedBlockchain.value.metaData,
    ) || {}
  ).tokens || [],
);
const handleUpdate = async () => {
  await api
    .post("wallet/create-token-account", {
      publicKey: props.selectedAccount?.publicKey,
      blockchain:
        props.accounts[props.selectedAccount?.publicKey].metaData.publicKey,
      token: selectedToken.value,
    })
    .then((response) => {
      router.push({ name: "wallet" });
    })
    .catch((error) => {});
};

const selectedToken = ref("");
const setToken = async (mint: string) => {
  selectedToken.value = mint;
};

const hasAccount = (name: string) => {
  const accounts = Object.values(
    props.accounts[props.selectedAccount.publicKey].tokenAccounts,
  );
  return accounts.some((account) => account.metaData.name === name);
};
</script>
<template>
  <div class="action-page-wrapper">
    <div class="wrapper-inner">
      <div class="action-box">
        <div class="box-content">
          <form
            novalidate
            class="form-layout is-separate"
            @submit.prevent="handleUpdate"
          >
            <div class="form-outer">
              <div class="form-body">
                <div class="form-section">
                  <div class="form-section-inner">
                    <h3 class="has-text-centered">
                      {{ t("components.wallet.createAccount.title") }}
                    </h3>
                    <VLoader :active="isLoading">
                      <div class="columns is-multiline">
                        <div class="column is-flex is-justify-content-center">
                          <VField>
                            <VControl>
                              <div class="radio-boxes">
                                <div v-for="(token, key) in tokens">
                                  <VControl
                                    v-if="!hasAccount(token.metaData.name)"
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
                            </VControl>
                          </VField>
                        </div>
                      </div>
                    </VLoader>
                  </div>
                  <div class="form-section-outer">
                    <div class="button-wrap">
                      <VButton type="submit" color="primary" bold raised>
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
    </div>
  </div>
</template>
