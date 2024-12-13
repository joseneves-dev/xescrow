<script setup lang="ts">
import { useApiAccount } from "/@src/api/apiAccount";

import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
const emits = defineEmits(["transaction"]);

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
const router = useRouter();
const route = useRoute();
const api = useApiAccount();

const availableBalance = ref<number | undefined>(
  props.selectedPublicKey != props.selectedAccount.publicKey
    ? props.selectedAccount.tokenAccounts[props.selectedPublicKey].balance
    : props.selectedAccount.balance,
);
const transactionTypeDisabled = ref<Boolean>(
  props.selectedPublicKey == props.selectedAccount?.publicKey ? true : false,
);
const selectedPublicKey = ref<String>(props.selectedPublicKey);
const schema = toTypedSchema(
  z.object({
    toPublickey: z
      .string({ required_error: "auth.errors.password.required" })
      .min(4, { message: "Token must be at least 4 characters long" }),
    amount: z
      .string({ required_error: "auth.errors.password.required" })
      .refine(
        (value) => Number(value) > 0, // Check if the amount is greater than 0
        {
          message: "Amount can't be 0",
        },
      )
      .refine(
        (value) => Number(value) <= availableBalance.value, // Check if amount is within available balance
        {
          message: "Amount exceeds available balance",
        },
      ),
    instruction: z.literal("normal").or(z.literal("escrow")).default("normal"),
  }),
);

const { handleSubmit, setFieldValue, setErrors, resetField } = useForm({
  validationSchema: schema,
});

watch(props, (values) => {
  transactionTypeDisabled.value =
    values.selectedPublicKey == values.selectedAccount?.publicKey
      ? true
      : false;
  if (selectedPublicKey.value != values.selectedPublicKey) {
    selectedPublicKey.value = values.selectedPublicKey;
    resetField("toPublickey");
    resetField("amount");
    resetField("instruction");
  }
});
const handleTransaction = handleSubmit(async (values) => {
  const transaction = {
    request: props.selectedAccount.publicKey,
    mint:
      props.selectedPublicKey != props.selectedAccount.publicKey
        ? props.selectedAccount.tokenAccounts[props.selectedPublicKey].metaData
            .mint
        : undefined,
    metaData:
      props.selectedPublicKey != props.selectedAccount.publicKey
        ? props.selectedAccount.tokenAccounts[props.selectedPublicKey].metaData
        : props.selectedAccount.metaData,
    receiver: values.toPublickey,
    amount: values.amount,
    instruction: values.instruction,
  };
  emits("transaction", transaction);
});

const getPublicKeyBalance = async () => {
  await api
    .get("wallet/get-balance", {
      params: { publicKey: props.selectedAccount.publicKey },
    })
    .then(async (response) => {})
    .catch((error) => {});
};

watchEffect(async () => {
  if (props.selectedPublicKey == props.selectedAccount.publicKey) {
    availableBalance.value = props.selectedAccount.balance;
  } else {
    availableBalance.value =
      props.selectedAccount.tokenAccounts[props.selectedPublicKey].balance;
  }
  if (availableBalance.value == undefined) {
    await getPublicKeyBalance();
  }
});
</script>

<template>
  <div class="transfer">
    <div class="form-layout">
      <div class="form-outer">
        <div class="form-body">
          <div class="form-section">
            <div class="form-section-inner">
              <form @submit.prevent="handleTransaction">
                <div class="columns is-multiline is-centered is-vcentered">
                  <div class="column is-9">
                    <div class="option-block">
                      <div class="block-header">
                        <h3>Destination PublicKey</h3>
                      </div>
                      <div class="block-body is-seats">
                        <div>
                          <VField v-slot="{ field }" id="toPublickey">
                            <VControl>
                              <VInput type="text" v-bind="field" />
                              <p
                                v-if="field?.errorMessage"
                                class="help is-danger"
                              >
                                {{ field?.errorMessage }}
                              </p>
                            </VControl>
                          </VField>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column is-3">
                    <div class="option-block">
                      <div class="option-block">
                        <div class="block-header">
                          <h3>Amount</h3>
                        </div>
                        <div class="block-body">
                          <VField v-slot="{ field }" id="amount">
                            <VControl>
                              <VInput type="text" v-bind="field" />
                              <p
                                v-if="field?.errorMessage"
                                class="help is-danger"
                              >
                                {{ field?.errorMessage }}
                              </p>
                            </VControl>
                          </VField>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column is-3">
                    <div class="option-block">
                      <div class="block-header">
                        <h3>Type</h3>
                      </div>
                      <div class="block-body">
                        <VField v-slot="{ field }" id="instruction">
                          <VControl>
                            <VRadio
                              :disabled="
                                transactionTypeDisabled ? 'disabled' : null
                              "
                              v-model="field.value"
                              name="notify-me"
                              color="primary"
                              value="normal"
                            >
                              Normal
                            </VRadio>
                            <VRadio
                              :disabled="
                                transactionTypeDisabled ? 'disabled' : null
                              "
                              v-model="field.value"
                              name="notify-me"
                              value="escrow"
                            >
                              Escrow
                            </VRadio>
                            <p
                              v-if="field?.errorMessage"
                              class="help is-danger"
                            >
                              {{ field?.errorMessage }}
                            </p>
                          </VControl>
                        </VField>
                      </div>
                    </div>
                  </div>
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
                        Submit
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
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";
.transfer {
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

            .btn-block {
              margin-top: 20px;
              display: flex; /* Enable flexbox */
              justify-content: center; /* Center horizontally */
              align-items: center; /* Center vertically (if needed) */
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
