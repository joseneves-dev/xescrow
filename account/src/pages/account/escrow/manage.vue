<script setup lang="ts">
import { useWallet } from "solana-wallets-vue";

const { t } = useI18n();

const { connected } = useWallet();
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

const modal = ref(false);
const active = ref<string | undefined>();
const WalletPublicKey = ref<string | undefined>();

const connectedWallet = async (value: string) => {
  if (!props.accounts[value]) {
    WalletPublicKey.value = value;
    active.value = "import";
  } else {
    modal.value = false;
    active.value = undefined;
  }
};

const closeModal = async () => {
  modal.value = false;
  active.value = undefined;
  WalletPublicKey.value = undefined;
};
</script>

<template>
  <div class="banking-dashboard banking-dashboard-v2 mt-5">
    <div class="standard-onboarding">
      <div class="title-wrap">
        <h2>{{ t("pages.wallet.manage.title") }}</h2>
      </div>
      <div class="onboarding-wrap">
        <div class="onboarding-wrap-inner">
          <div class="onboarding-card">
            <h3>{{ t("pages.wallet.manage.newAccount") }}</h3>
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
          <div v-if="!connected" class="onboarding-card">
            <h3>{{ t("pages.wallet.manage.connect") }}</h3>
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
            <h3>{{ t("pages.wallet.manage.import") }}</h3>
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
        <CreateAccount v-if="active == 'createAccount'" @close="closeModal" />
        <ConnectWallet
          v-if="active == 'connect'"
          @close="closeModal"
          @connected="connectedWallet"
        />
        <ImportAccount
          v-if="active == 'import'"
          :publicKey="WalletPublicKey"
          @close="closeModal"
        />
      </template>
    </VModal>
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
