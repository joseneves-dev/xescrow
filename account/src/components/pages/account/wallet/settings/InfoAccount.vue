<script setup lang="ts">
import { useApiAccount } from "/@src/api/apiAccount";

import { useWallet } from "/@userStores/wallet";

const { t } = useI18n();
const wallet = useWallet();
const api = useApiAccount();
const emits = defineEmits(["close"]);

const props = defineProps({
  publicKey: {
    type: String,
    default: null,
  },
});

const isLoading = ref<Boolean>(true);

const getPublicKeyBalance = async () => {
  if (
    wallet?.accounts[props.publicKey] == undefined ||
    wallet?.accounts[props.publicKey].balance == undefined
  ) {
    await api
      .get("wallet/get-balance", {
        params: { publicKey: props.publicKey },
      })
      .then(async (response) => {
        isLoading.value = false;
      })
      .catch((error) => {});
  } else {
    isLoading.value = false;
  }
};

onBeforeMount(async () => {
  await getPublicKeyBalance();
});
</script>
<template>
  <VModal :open="true" noheader nofooter noclose size="none">
    <template #content>
      <VLoader :active="isLoading">
        <div class="action-page-wrapper">
          <div class="wrapper-inner">
            <div class="action-box">
              <div class="box-content">
                <div>
                  <h3>
                    {{ wallet?.accounts[props.publicKey].metaData.name }} ({{
                      wallet?.accounts[props.publicKey].metaData.symbol
                    }})
                  </h3>
                  <div>
                    {{ t("components.wallet.infoAccount.balance") }}
                    {{ wallet?.accounts[props.publicKey].balance }}
                  </div>
                  <div>{{ wallet?.accounts[props.publicKey].publicKey }}</div>
                  <div
                    v-for="account in wallet?.accounts[props.publicKey]
                      .tokenAccounts"
                  >
                    <h3>
                      {{ account.metaData.name }} ({{
                        account.metaData.symbol
                      }})
                    </h3>
                    <div>
                      {{ t("components.wallet.infoAccount.balance") }}
                      {{ account.balance }}
                    </div>
                    <div>{{ account.publicKey }}</div>
                  </div>
                  <div class="buttons">
                    <VButton
                      color="primary"
                      raised
                      tabindex="0"
                      outlined
                      class="m-2"
                      @click="emits('close')"
                    >
                      {{ t("action.close") }}
                    </VButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </VLoader>
    </template>
  </VModal>
</template>
