import { defineStore } from "pinia";

interface wallet {
  defaultAccount: string;
  defaultCurrency: string;
  accounts: Record<string, accounts>;
}

interface accounts {
  publicKey: string;
  secretKey: boolean;
  rename: string;
  balance: number;
  tokenAccounts: Record<string, tokenAccounts>;
  metaData: Record<string, metaData>;
}

interface tokenAccounts {
  publicKey: string;
  balance: number;
  status: string;
  symbol: string;
}

interface metaData {
  symbol: string;
  blockchain: string;
}
export const useWallet = defineStore("wallet", () => {
  const defaultAccount = ref<string | undefined>(undefined);
  const defaultCurrency = ref<string | undefined>(undefined);
  const accounts = ref<Record<string, accounts>>({});

  function set(data: Partial<wallet>) {
    if (data.defaultCurrency) {
      defaultCurrency.value = data.defaultCurrency;
    }
    if (data.defaultAccount) {
      defaultAccount.value = data.defaultAccount;
    }

    Object.keys(data.accounts as Record<string, accounts>).forEach(
      (accountPublicKey) => {
        const newValue = data.accounts[accountPublicKey];
        if (accounts.value[accountPublicKey] == undefined) {
          accounts.value[accountPublicKey] = {
            ...newValue,
          };
        } else {
          if (newValue.secretKey != undefined) {
            accounts.value[accountPublicKey].secretKey = newValue.secretKey;
          }

          if (newValue.balance != undefined) {
            accounts.value[accountPublicKey].balance = newValue.balance;
          }

          if (newValue.metaData != undefined) {
            accounts.value[accountPublicKey].metaData = newValue.metaData;
          }

          if (newValue.rename != undefined) {
            accounts.value[accountPublicKey].rename = newValue.rename;
          }
          if (newValue.tokenAccounts) {
            Object.keys(
              newValue.tokenAccounts as Record<string, tokenAccounts>,
            ).forEach((tokenAccountPublicKey) => {
              const newValueAccount =
                data.accounts[accountPublicKey].tokenAccounts[
                  tokenAccountPublicKey
                ];

              if (
                accounts.value[accountPublicKey].tokenAccounts[
                  tokenAccountPublicKey
                ] == undefined
              ) {
                accounts.value[accountPublicKey].tokenAccounts[
                  tokenAccountPublicKey
                ] = {
                  ...newValueAccount,
                };
              } else {
                if (newValueAccount.balance != undefined) {
                  accounts.value[accountPublicKey].tokenAccounts[
                    tokenAccountPublicKey
                  ].balance = newValueAccount.balance;
                }
              }
            });
          }
        }
      },
    );
  }

  function clear() {
    defaultAccount.value = undefined;
    defaultCurrency.value = undefined;
    accounts.value = undefined;
  }

  return {
    defaultAccount,
    defaultCurrency,
    accounts,
    set,
    clear,
  } as const;
});
