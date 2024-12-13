<script setup lang="ts">
import { useWallet } from "solana-wallets-vue";

import { tx, txToken, txTokenInitEscrow } from "/@src/utils/wallet/transaction";

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

const Wallet = useWallet();
const walletConnected = ref(Wallet.connected);
const walletPublicKey = ref(Wallet.publicKey);

const methods = computed(() => {
  const secretKey = true; // Always true
  const wallet =
    props.selectedAccount?.publicKey == walletPublicKey.value &&
    walletConnected.value; // true if conditions are met
  const app = props.selectedAccount?.secretKey == true; // true if selectedAccount.secretKey is true
  return {
    secretKey,
    wallet,
    app,
  };
});

const transaction = ref<Object>();
const modal = ref<Boolean>(false);
const method = ref<String>();

const closeModal = async () => {
  modal.value = false;
  method.value = undefined;
};
const confirmMethod = async (data: string) => {
  method.value = data;
};
const transactionFees = ref();
type data = {
  instruction?: "escrow" | "normal";
  sender?: string;
  receiver?: string;
  amount?: number;
  mint?: string;
  metaData?: {
    name: string;
    symbol: string;
  };
};

type transactionData = {
  escrowData?: String;
  escrowAccount?: String;
  escrowAutority?: String;
  sender?: String;
  receiver?: String;
  amount?: number;
  instruction?: "escrow" | "normal";
  metaData?: {
    name?: string;
    symbol?: string;
  };
};

type instructionData = {
  escrowData?: String;
  escrowAccount?: String;
  escrowAutority?: String;
  sender?: String;
  receiver?: String;
  amount?: number;
  mint?: String;
  programId?: String;
};

let instructionData: instructionData = {};
let transactionData: transactionData = {};

const handleTransaction = async (data: data) => {
  let instructionInstance: any;
  instructionData = {
    request: data?.request,
    receiver: data?.receiver,
    amount: data?.amount,
    mint: data?.mint,
  };
  transactionData = {
    request: data?.request,
    receiver: data?.receiver,
    amount: data?.amount,
    instruction: data.instruction,
    metaData: data.metaData,
  };
  if (data.mint) {
    if (data.instruction == "escrow") {
      instructionInstance = await txTokenInitEscrow(instructionData);
    } else if (data.instruction == "normal") {
      instructionInstance = await txToken(instructionData);
    }
  } else {
    instructionInstance = await tx(instructionData);
  }

  transaction.value = {
    data: {
      request: data.request,
      initialize: true,
      mint: data?.mint,
      escrowAccount: instructionInstance?.escrow,
    },
    tx: instructionInstance.tx,
  };

  transactionFees.value = instructionInstance.fee;

  modal.value = true;
};

watch(Wallet.publicKey, (publicKey) => {
  if (publicKey) {
    walletPublicKey.value = publicKey.toString();
  }
});

watch(Wallet.connected, (connected) => {
  walletConnected.value = connected;
});
</script>

<template>
  <div class="dashboard-card is-card-panel mt-5">
    <TransferForm
      :selectedPublicKey="props.selectedPublicKey"
      :selectedAccount="props.selectedAccount"
      @transaction="handleTransaction"
    />
    <VModal
      v-if="modal"
      :open="modal"
      title=""
      size="none"
      actions="center"
      noheader
      nofooter
      noclose
    >
      <template #content>
        <div class="action-page-wrapper">
          <div class="wrapper-inner">
            <div class="action-box">
              <div class="box-content">
                <p>To - {{ transactionData.receiver }}</p>
                <p>Instruction - {{ transactionData.instruction }}</p>
                <p>
                  Amount - {{ transactionData.amount }}
                  {{ transactionData.metaData?.symbol }}
                </p>
                <p>Fee - {{ transactionFees }} SOL</p>
                <MethodTransfer
                  v-if="!method"
                  :methods="methods"
                  @method="confirmMethod"
                  @close="closeModal"
                />
                <ManualTransfer
                  v-else-if="method == 'secretKey'"
                  :transaction="transaction"
                  @close="closeModal"
                />
                <WalletTransfer
                  v-else-if="method == 'wallet'"
                  :transaction="transaction"
                  @close="closeModal"
                />
                <AppTransfer
                  v-else-if="method == 'app'"
                  :transaction="transaction"
                  @close="closeModal"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </VModal>
  </div>
</template>
