<script setup lang="ts">
import "solana-wallets-vue/styles.css";
import { useWallet } from "solana-wallets-vue";

import { useWallet as useWalletStore } from "/@userStores/wallet";

const { t } = useI18n();
const walletStore = useWalletStore();
const Wallet = useWallet();
const router = useRouter();

const modal = ref(false);
const active = ref<string | null>();
const connected = ref<boolean>(false);
const closeModal = async () => {
  modal.value = false;
  active.value = null;
  connected.value = false;
};

const connectedWallet = async () => {
  connected.value = true;
  active.value = "import";
};

onBeforeMount(() => {
  if (!walletStore.accounts) {
    router.push({ name: "wallet" });
  }
});
</script>

<template>
  <div class="page-content-inner">
    <div class="account-wrapper">
      <div class="columns">
        <div class="column">
          <div class="standard-onboarding">
            <div class="title-wrap">
              <p>{{ t("pages.wallet.create.title") }}</p>
              <h2>{{ t("pages.wallet.create.subtitle") }}</h2>
            </div>
            <div class="onboarding-wrap">
              <div class="onboarding-wrap-inner">
                <div class="onboarding-card">
                  <h3>{{ t("pages.wallet.create.newAccount.title") }}</h3>
                  <div class="button-wrap">
                    <VButton
                      color="primary"
                      outlined
                      rounded
                      raised
                      @click="
                        () => {
                          modal = true;
                          active = 'createAccount';
                        }
                      "
                    >
                      {{ t("action.wallet.newAccount") }}
                    </VButton>
                  </div>
                </div>
                <div class="onboarding-card">
                  <h3>{{ t("pages.wallet.create.connect.title") }}</h3>

                  <div class="button-wrap">
                    <VButton
                      color="primary"
                      outlined
                      rounded
                      raised
                      @click="
                        () => {
                          modal = true;
                          active = 'connect';
                        }
                      "
                    >
                      {{ t("action.wallet.connect") }}
                    </VButton>
                  </div>
                </div>
                <div class="onboarding-card">
                  <h3>{{ t("pages.wallet.create.import.title") }}</h3>

                  <div class="button-wrap">
                    <VButton
                      color="primary"
                      outlined
                      rounded
                      raised
                      @click="
                        () => {
                          modal = true;
                          active = 'import';
                        }
                      "
                    >
                      {{ t("action.wallet.import") }}
                    </VButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <VModal
            :open="modal"
            size="none"
            actions="center"
            noheader
            nofooter
            noclose
            @close="!modal"
          >
            <template #content>
              <CreateAccount
                v-if="active == 'createAccount'"
                @close="closeModal"
              />
              <ConnectWallet
                v-if="active == 'connect'"
                @close="closeModal"
                @connected="connectedWallet"
              />
              <ImportAccount
                v-if="active == 'import'"
                :publicKey="connected ? Wallet.publicKey.value?.toString() : ''"
                @close="closeModal"
              />
            </template>
          </VModal>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.standard-onboarding {
  padding: 20px 0;

  .title-wrap {
    text-align: center;

    h2 {
      font-family: var(--font-alt);
      font-weight: 600;
      font-size: 1.4rem;
      color: var(--dark-text);
    }

    p {
      text-transform: uppercase;
      font-family: var(--font);
      font-size: 0.85rem;
    }
  }

  .onboarding-wrap {
    padding: 30px 0;

    .onboarding-wrap-inner {
      display: flex;
      max-width: 880px;
      margin: 0 auto;

      .onboarding-card {
        @include app-r-card;

        margin: 8px;
        width: calc(33.3% - 16px);
        text-align: center;

        > img {
          display: block;
          width: 100%;
          max-width: 140px;
          margin: 0 auto;
        }

        h3 {
          font-family: var(--font-alt);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--dark-text);
          margin-bottom: 12px;
        }

        p {
          font-family: var(--font);
          font-size: 0.95rem;
        }

        .button-wrap {
          text-align: center;
          padding: 30px 0 20px;

          .button {
            min-width: 140px;
          }
        }
      }
    }
  }
}

.is-dark {
  .standard-onboarding {
    .title-wrap {
      h2 {
        color: var(--dark-dark-text);
      }
    }

    .onboarding-wrap {
      .onboarding-wrap-inner {
        .onboarding-card {
          @include app-card--dark;

          h3 {
            color: var(--dark-dark-text);
          }
        }
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .onboarding-wrapper {
    .standard-onboarding {
      padding: 20px 0;
    }

    .title-wrap {
      h2 {
        max-width: 280px;
        margin: 0 auto;
      }
    }

    .onboarding-wrap {
      .onboarding-wrap-inner {
        flex-wrap: wrap;

        .onboarding-card {
          min-width: calc(100% - 16px) !important;
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .standard-onboarding {
    padding: 20px 0;

    .title-wrap {
      h2 {
        max-width: 280px;
        margin: 0 auto;
      }
    }
  }
}
</style>
