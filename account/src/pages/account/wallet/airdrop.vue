<script setup lang="ts">
import { useApiAccount } from "/@src/api/apiAccount";

const api = useApiAccount();

const router = useRouter();

//props
const props = defineProps({
  selectedPublicKey: {
    type: String,
    default: null,
  },
  selectedAccount: {
    type: Object,
    default: null,
  },
});
watchEffect(() => {
  if (
    props.selectedAccount.publicKey == props.selectedPublicKey &&
    props.selectedAccount?.metaData.symbol == "SOL"
  ) {
    router.push({ name: "wallet" });
  }
});

const requestAirdrop = async () => {
  await api
    .get("wallet/airdrop", {
      params: {
        accountPublicKey: props.selectedAccount.publicKey,
        tokenAccountPublicKey: props.selectedPublicKey,
      },
    })
    .then((response) => {})
    .catch((error) => {});
};
</script>

<template>
  <div class="banking-dashboard banking-dashboard-v2">
    <div class="transfer">
      <div class="form-layout">
        <div class="form-outer">
          <div class="form-body">
            <div class="form-section">
              <div class="form-section-inner">
                <form @submit.prevent="requestAirdrop">
                  <div class="columns is-multiline is-centered is-vcentered">
                    <div class="column is-10">
                      <div class="btn-block">
                        <VButton
                          color="primary"
                          raised
                          tabindex="0"
                          outlined
                          class="m-2"
                          type="submit"
                        >
                          AIRDROP ME
                        </VButton>
                        <VButton
                          color="primary"
                          raised
                          tabindex="0"
                          outlined
                          class="m-2"
                          @click="
                            () => {
                              router.push({
                                name: 'wallet',
                                params: { ...route.params },
                              });
                            }
                          "
                        >
                          Cancel
                        </VButton>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
