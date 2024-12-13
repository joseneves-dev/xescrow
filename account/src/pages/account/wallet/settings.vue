<script setup lang="ts">
import { useApiAccount } from "/@src/api/apiAccount";

import { useAppCurrencies } from "/@appStores/appCurrencies";

import { useWallet } from "/@userStores/wallet";

const { t } = useI18n();
const appCurrencies = useAppCurrencies();
const wallet = useWallet();

const apiAccount = useApiAccount();

const props = defineProps({
  accounts: {
    type: Object,
    default: null,
  },
});

const publicKey = ref<string>("");
const rename = ref<string>("");

const handleSecretKey = ref<Boolean>(false);
const handlePublicKey = ref<Boolean>(false);

const secretKey = ref<boolean>(false);
const removeAccount = ref<Boolean>(false);
const requestRemoveAccount = ref<Boolean>(false);
const renameAccount = ref<Boolean>(false);

const defaultAccount = ref<String>(wallet?.defaultAccount);
const defaultCurrency = ref<String>(wallet?.defaultCurrency);

const closeModal = async () => {
  removeAccount.value = false;
  requestRemoveAccount.value = false;
  renameAccount.value = false;
  handlePublicKey.value = false;
  handleSecretKey.value = false;
  secretKey.value = false;
};
const currencies = ref(appCurrencies.currencies);

const setDefaultCurrency = async (currency: string) => {
  await apiAccount
    .post("wallet/default-currency", { currency: currency })
    .then(async (response) => {})
    .catch((error) => {});
};
watch(defaultAccount, async (value) => {
  await apiAccount
    .post("wallet/default-account", { publicKey: value })
    .then(async (response) => {})
    .catch((error) => {});
});

// Start the initial call
watchEffect(() => {
  if (wallet?.defaultCurrency) {
    defaultCurrency.value = wallet?.defaultCurrency;
  }

  if (wallet?.defaultAccount) {
    defaultAccount.value = wallet?.defaultAccount;
  }
});
</script>

<template>
  <div>
    <div class="dashboard-card is-card-panel mt-5">
      <div class="form-layout">
        <div class="form-outer">
          <div class="form-body">
            <div class="form-section">
              <div class="form-section-inner">
                <h3 class="has-text-centered">
                  {{ t("pages.wallet.settings.defaultCurrency") }}
                </h3>

                <div class="columns is-multiline">
                  <div class="column is-flex is-justify-content-center">
                    <VField>
                      <VControl>
                        <div class="radio-boxes">
                          <VControl
                            class="radio-box"
                            subcontrol
                            v-for="currency in currencies"
                          >
                            <VInput
                              type="radio"
                              name="currency"
                              :checked="defaultCurrency.name === currency.name"
                              @click="setDefaultCurrency(currency.name)"
                            />
                            <div class="radio-box-inner">
                              <div class="fee">
                                <span>{{ currency.symbol }}</span>
                              </div>
                            </div>
                          </VControl>
                        </div>
                      </VControl>
                    </VField>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <VFlexTable
      rounded
      :data="Object.values(props.accounts)"
      :columns="{
        publicKey: {
          label: '',
          media: true,
          grow: 'lg',
        },
        default: {
          label: '',
          media: true,
          align: 'end',
        },
        info: {
          label: '',
          align: 'end',
        },
        secretKey: {
          label: '',
          align: 'end',
        },
        rename: {
          label: '',
          align: 'end',
        },
        remove: {
          label: '',
          align: 'end',
        },
      }"
    >
      <template #body-cell="{ row, column, value }">
        <template v-if="column.key === 'publicKey'">
          <div>
            <span class="item-name dark-inverted"
              >{{ row.publicKey.substr(0, 10) }}...{{
                row.publicKey.substr(-15)
              }}
              {{ row.rename ? " | " + row.rename : "" }}</span
            >
          </div>
        </template>
        <template v-else-if="column.key === 'default'">
          <span v-if="row.publicKey == defaultAccount" class="item-meta">
            <span class="light-text">{{
              t("pages.wallet.settings.defaultAccount")
            }}</span>
          </span>
          <VRadio
            v-model="defaultAccount"
            :value="row.publicKey"
            name="outlined_radio"
          />
        </template>
        <template v-else-if="column.key === 'info'">
          <VButton
            class="action-button is-dark-outlined is-pushed-mobile"
            @click="
              handlePublicKey = true;
              publicKey = row.publicKey;
              secretKey = row.secretKey;
              rename = row.rename;
            "
          >
            {{ t("pages.wallet.settings.infoPublicKey") }}
          </VButton>
        </template>
        <template v-else-if="column.key === 'secretKey'">
          <VButton
            class="action-button is-dark-outlined is-pushed-mobile"
            @click="
              handleSecretKey = true;
              publicKey = row.publicKey;
              secretKey = row.secretKey;
              rename = row.rename;
            "
          >
            {{ t("pages.wallet.settings.secretKey") }}
          </VButton>
        </template>
        <template v-else-if="column.key === 'rename'">
          <VButton
            class="action-button is-dark-outlined is-pushed-mobile"
            @click="
              renameAccount = true;
              publicKey = row.publicKey;
              rename = row.rename;
            "
          >
            {{ t("pages.wallet.settings.rename") }}
          </VButton>
        </template>
        <template v-else-if="column.key === 'remove'">
          <VButton
            class="action-button is-dark-outlined is-pushed-mobile"
            @click="
              row.secretKey == true
                ? (requestRemoveAccount = true)
                : (removeAccount = true);
              publicKey = row.publicKey;
              rename = row.rename;
            "
          >
            {{ t("pages.wallet.settings.remove") }}
          </VButton>
        </template>
        <span v-else class="light-text">{{ value }}</span>
      </template>
    </VFlexTable>
    <InfoAccount
      v-if="handlePublicKey"
      :publicKey="publicKey"
      @close="closeModal"
    />
    <SecretKey
      v-if="handleSecretKey"
      :publicKey="publicKey"
      :secretKey="secretKey"
      @close="closeModal"
    />
    <RemoveAccount
      v-if="removeAccount"
      :publicKey="publicKey"
      :secretKey="secretKey"
      @close="closeModal"
    />
    <RequestRemoveAccount
      v-if="requestRemoveAccount"
      :publicKey="publicKey"
      @success="
        requestRemoveAccount = false;
        removeAccount = true;
        secretKey = true;
      "
      @close="closeModal"
    />
    <RenameAccount
      v-if="renameAccount"
      :publicKey="publicKey"
      :rename="rename"
      @close="closeModal"
    />
  </div>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.flex-table-item {
  padding: 0 !important;
}
.form-layout {
  margin: 0 auto;

  .form-outer {
    background: none;
    border: none;

    .form-body {
      display: flex;

      .form-section {
        flex-grow: 2;
        padding: 10px 0;
        width: 50%;

        .form-section-inner {
          padding: 40px;

          &.has-padding-bottom {
            padding-bottom: 60px;
            height: 100%;
          }

          > h3 {
            font-family: var(--font-alt);
            font-size: 1.2rem;
            font-weight: 300;
            color: var(--dark-text);
            margin-bottom: 15px;
          }

          .columns {
            .column {
              padding-top: 0.25rem;
              padding-bottom: 0.25rem;
            }
          }

          .radio-boxes {
            display: flex;
            justify-content: space-between;
            margin-inline-start: -8px;
            margin-inline-end: -8px;

            .radio-box {
              position: relative;
              margin: 8px;

              &:focus-within {
                border-radius: 3px;
                outline-offset: var(--accessibility-focus-outline-offset);
                outline-width: var(--accessibility-focus-outline-width);
                outline-style: var(--accessibility-focus-outline-style);
                outline-color: var(--primary);
              }

              input {
                position: absolute;
                top: 0;
                inset-inline-start: 0;
                height: 100%;
                width: 100%;
                opacity: 0;
                cursor: pointer;

                &:checked {
                  + .radio-box-inner {
                    background: var(--primary);
                    border-color: var(--primary);
                    box-shadow: var(--primary-box-shadow);

                    .fee,
                    p {
                      color: var(--smoke-white);
                    }
                  }
                }
              }

              .radio-box-inner {
                background: var(--white);
                border: 1px solid
                  color-mix(in oklab, var(--fade-grey), black 3%);
                text-align: center;
                border-radius: var(--radius);
                font-family: var(--font);
                font-weight: 300;
                font-size: 0.5rem;
                transition:
                  color 0.3s,
                  background-color 0.3s,
                  border-color 0.3s,
                  height 0.3s,
                  width 0.3s;
                padding: 15px 15px;

                .fee {
                  font-family: var(--font);
                  font-weight: 350;
                  color: var(--dark-text);
                  font-size: 1.4rem;
                  line-height: 1;
                }

                p {
                  font-family: var(--font-alt);
                }
              }
            }
          }

          .control {
            > p {
              padding-top: 12px;

              > span {
                display: block;
                font-size: 0.9rem;

                span {
                  font-weight: 500;
                  color: var(--dark-text);
                }
              }
            }
          }
        }

        .form-section-outer {
          .checkboxes {
            padding: 16px 0;

            .checkbox {
              padding: 0;
              font-size: 0.9rem;
            }
          }

          .button-wrap {
            .button {
              min-height: 60px;
              font-size: 1.05rem;
              font-weight: 600;
              font-family: var(--font-alt);
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .form-layout {
    .form-outer {
      background: none !important;

      .form-body {
        .form-section {
          .form-section-inner {
            @include app-card--dark;

            > h3 {
              color: var(--dark-dark-text);
            }

            .radio-boxes {
              .radio-box {
                input:checked + .radio-box-inner {
                  background: var(--primary);
                  border-color: var(--primary);
                  box-shadow: var(--primary-box-shadow);

                  .fee,
                  p {
                    color: var(--smoke-white);
                  }
                }

                .radio-box-inner {
                  background: color-mix(
                    in oklab,
                    var(--dark-sidebar),
                    white 2%
                  );
                  border-color: color-mix(
                    in oklab,
                    var(--dark-sidebar),
                    white 12%
                  );

                  .fee {
                    color: var(--dark-dark-text);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .form-layout {
    &.is-separate {
      .form-outer {
        .form-body {
          padding-inline-start: 0;
          padding-inline-end: 0;
          flex-direction: column;

          .form-section {
            width: 100%;

            .form-section-inner {
              padding: 30px;
            }
          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .form-layout {
    &.is-separate {
      .form-outer {
        .form-body {
          padding-inline-start: 0;
          padding-inline-end: 0;

          // flex-direction: column;

          .form-section {
            // width: 100%;

            .form-section-inner {
              padding: 30px;
            }
          }
        }
      }
    }
  }
}
</style>
