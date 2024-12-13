<script setup lang="ts">
import { useApiAccount } from "/@src/api/apiAccount";
import { useAppBlockchains } from "/@appStores/appBlockchains";

const appBlockchains = useAppBlockchains();

const api = useApiAccount();

const props = defineProps({
  selectedAccount: {
    type: Object,
    default: null,
  },
});

const blockchains = appBlockchains.blockchains;

interface TransactionsData {
  signature: string;
  blockTime: number;
  data: {
    receiver: string;
    request: string;
    escrow?: string;
    status?: string;
    program_id: string;
    decimals?: number;
    metaData?: metaData;
    instruction: string;
    mint?: string;
    amount: string;
    timestamp?: string;
    fee: string;
  };
}

interface metaData {
  name?: string;
  symbol?: string;
}

const selectedPublicKey = ref(props.selectedAccount.publicKey);

// Create a reactive object
const transactions = reactive({
  data: [] as TransactionsData[],
});
const action = ref<String>();
const isLoading = ref<Boolean>(true);
const currentPage = ref(1);
const filters = ref("");
const itemsPerPage = ref(10); // Items per page (adjust as needed)

const handleGetTransactions = async () => {
  isLoading.value = true;
  transactions.data = [];
  await api
    .get("escrow/transactions", {
      params: { publicKey: props.selectedAccount.publicKey },
    })
    .then((response) => {
      transactions.data = response.data.transactions;
    })
    .catch((error) => {});

  const filteredTransactions = [];

  transactions.data.forEach((transaction) => {
    if (
      transaction[0].data.instruction == "escrow" &&
      (transaction[0].data.status == "disputed" ||
        transaction[0].data.status == "initialized") &&
      transaction[0].data.escrowAutority == props.selectedAccount.publicKey
    ) {
      filteredTransactions.push(transaction); // Keep the transaction
    }
  });

  transactions.data = filteredTransactions; // Update the original array

  transactions.data.forEach((transaction, key) => {
    const blockchain = blockchains.find(
      (b) => b.metaData.name === props.selectedAccount.metaData.name,
    );
    if (
      transaction[0] &&
      blockchain.programId === transaction[0].data.programId
    ) {
      transaction[0] = {
        ...transaction[0],
        metaData: blockchain.metaData,
        decimals: blockchain.decimals,
      }; // Add blockchain properties
    } else if (transaction[0]) {
      const blockchainToken = blockchain.tokens.find(
        (token) => token.mint === transaction[0].data.mint,
      );
      transaction[0] = {
        ...transaction[0],
        metaData: blockchainToken.metaData,
        decimals: blockchainToken.decimals,
      }; // Add token properties
    }
  });
  isLoading.value = false;
};

handleGetTransactions();

const transactionData = ref<any | undefined>();
const transactionView = ref<any | undefined>();
const modal = ref(false);

const handleView = async (signature: string) => {
  const getTransaction = transactions.data.find((transactionGroup) => {
    // Check if the transaction group is an array
    if (Array.isArray(transactionGroup)) {
      // Check the first signature in the group
      return transactionGroup[0].signature === signature;
    }
    return false; // If it's not an array, skip it
  });
  // Assuming getTransactionGroup contains the entire sub-array of transactions
  transactionView.value = getTransaction; // Set the whole group to transactionData
  modal.value = true;
};

const handleDispute = async (signature: string) => {
  const getTransaction = transactions.data.find((transactionGroup) => {
    // Check if the transaction group is an array
    if (Array.isArray(transactionGroup)) {
      // Check the first signature in the group
      return transactionGroup[0].signature === signature;
    }
    return false; // If it's not an array, skip it
  });

  transactionData.value = getTransaction[0];
  transactionView.value = getTransaction;
  action.value = "dispute";
  modal.value = true;
};

const closeModal = async () => {
  modal.value = false;
  action.value = undefined;
  transactionView.value = [];
  transactionData.value = {};
};

const filteredData = computed(() => {
  if (!filters.value) {
    return transactions.data;
  } else {
    const filterRe = new RegExp(filters.value, "i");
    return transactions.data.filter((transaction) => {
      return (
        transaction[0].data.amount.match(filterRe) ||
        transaction[0].data.instruction.match(filterRe) ||
        transaction[0].data?.status?.match(filterRe) ||
        transaction[0].signature.match(filterRe) ||
        transaction[0].data?.receiver.match(filterRe) ||
        transaction[0].data?.sender.match(filterRe)
      );
    });
  }
});

// Computed property to paginate filtered data
const filterPagination = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

watchEffect(() => {
  if (selectedPublicKey.value != props.selectedAccount.publicKey) {
    currentPage.value = 1;
    filters.value = "";
    handleGetTransactions();
    selectedPublicKey.value = props.selectedAccount.publicKey;
  }
});

const columns = {
  account: {
    label: "Account",
    grow: true,
  },
  amount: {
    label: "Amount",
    grow: true,
    align: "center",
  },
  type: {
    label: "type",
    grow: true,
    align: "center",
  },
  status: {
    label: "Status",
    grow: true,
    align: "center",
  },
  date: {
    label: "Date",
    grow: true,
    align: "center",
  },

  actions: {
    label: "Actions",
    align: "end",
  },
} as const;
</script>

<template>
  <VLoader :active="isLoading" class="mt-5">
    <div class="banking-dashboard is-card-panel mt-5">
      <div
        v-if="transactions.data.length > 0"
        class="list-flex-toolbar flex-list-v1"
      >
        <div class="columns is-centered is-multiline">
          <div class="column is-7 is-full is-centered">
            <VField class="ml-4">
              <VControl icon="lucide:search">
                <input
                  v-model="filters"
                  class="input custom-text-filter"
                  placeholder="Search..."
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>

      <VPlaceholderPage
        v-if="!filterPagination.length"
        title="We couldn't find any matching results."
        subtitle="Too bad. Looks like we couldn't find any matching results for the
              search terms you've entered. Please try different search terms or
              criteria."
        larger
      >
      </VPlaceholderPage>

      <VFlexTable
        v-if="filterPagination.length"
        :data="filterPagination"
        :columns="columns"
        compact
      >
        <template #body>
          <TransitionGroup name="list" tag="div" class="flex-list-inner">
            <!--Table item-->
            <div
              v-for="transaction in filterPagination"
              :key="transaction[0].signature"
              class="flex-table-item"
            >
              <VFlexTableCell :column="{ grow: true }" data-th="Label">
                <span
                  class="light-text monospace"
                  v-if="!transaction.err && transaction[0].data?.sender"
                  >{{
                    props.selectedAccount.publicKey !=
                    transaction[0].data?.sender
                      ? transaction[0].data?.sender.slice(0, 15) +
                        "..." +
                        transaction[0].data?.sender.slice(-5)
                      : transaction[0].data?.receiver.slice(0, 15) +
                        "..." +
                        transaction[0].data?.receiver.slice(-5)
                  }}</span
                >
              </VFlexTableCell>
              <VFlexTableCell
                :column="{ grow: true, align: 'center' }"
                data-th="Amount"
              >
                <span
                  :class="
                    transaction[0].data?.instruction == 'escrow' &&
                    transaction[0].data?.status == 'initialized'
                      ? 'text-yellow'
                      : props.selectedAccount.publicKey ==
                          transaction[0].data?.sender
                        ? 'text-red'
                        : 'text-green'
                  "
                >
                  {{
                    props.selectedAccount.publicKey ==
                    transaction[0].data?.sender
                      ? "-"
                      : "+"
                  }}
                  {{
                    transaction[0].data?.amount >= 1
                      ? Number(transaction[0].data?.amount).toFixed(2)
                      : parseFloat(transaction[0].data?.amount).toString()
                  }}
                </span>
              </VFlexTableCell>
              <VFlexTableCell
                :column="{ grow: true, align: 'center' }"
                data-th="Type"
              >
                <span class="light-text">
                  {{ transaction[0].data.instruction }}
                </span>
              </VFlexTableCell>
              <VFlexTableCell
                :column="{ grow: true, align: 'center' }"
                data-th="Status"
              >
                <VTag v-if="transaction[0].err" color="danger" rounded>
                  Error
                </VTag>
                <VTag
                  v-else-if="transaction[0].data?.status == 'initialized'"
                  color="info"
                  rounded
                >
                  Inicialized
                </VTag>
                <VTag
                  v-else-if="transaction[0].data?.status == 'disputed'"
                  color="danger"
                  rounded
                >
                  Disputed
                </VTag>
              </VFlexTableCell>
              <VFlexTableCell :column="{ grow: true }" data-th="Label">
                <span class="light-text" v-if="!transaction.err">
                  {{
                    new Date(transaction[0].blockTime * 1000).toLocaleString()
                  }}</span
                >
              </VFlexTableCell>
              <VFlexTableCell :column="{ align: 'end' }">
                <TransactionEscrowTableDropdown
                  :selectedAccountPubKey="props.selectedAccount.publicKey"
                  :transaction="transaction"
                  @view="handleView(transaction[0].signature)"
                  @dispute="handleDispute(transaction[0].signature)"
                />
              </VFlexTableCell>
            </div>
          </TransitionGroup>
        </template>
      </VFlexTable>
      <!--Table Pagination-->
      <VFlexPagination
        v-if="filteredData.length > 10"
        v-model:current-page="currentPage"
        :item-per-page="10"
        :total-items="transactions.data.length"
        :max-links-displayed="5"
        no-router
      />
    </div>
    <VModal
      v-if="modal"
      :open="modal"
      title=""
      size="big"
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
                <ViewTransaction
                  :transaction="transactionView"
                  :action="action"
                  @close="closeModal"
                />
                <DisputeActionEscrow
                  v-if="
                    action == 'dispute' &&
                    transactionData.data.instruction == 'escrow' &&
                    transactionData.data.status == 'disputed'
                  "
                  :transaction="transactionData"
                  :selected-account="props.selectedAccount"
                  @close="closeModal"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </VModal>
  </VLoader>
</template>
<style lang="scss">
.monospace {
  font-family: monospace;
  font-size: larger;
}
.text-green {
  opacity: 75%;
  color: green;
}
.text-yellow {
  opacity: 75%;
  color: yellow;
}
.text-red {
  opacity: 75%;
  color: red;
}
</style>
