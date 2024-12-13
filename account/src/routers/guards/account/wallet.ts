import { useApiAccount } from "/@src/api/apiAccount";

const apiAccount = useApiAccount();

export const wallet = async (to: any, from: any, next: any) => {
  await apiAccount
    .get("wallet/get")
    .then((response) => {})
    .catch((error) => {});
  next();
};
