import axios, { type AxiosInstance, type CancelTokenSource } from "axios";

import storeManager from "/@userStores/storeManager";
import { useSession } from "/@userStores/session";

import { useAppConfigurations } from "/@appStores/appConfigurations";
import { useAppNotification } from "/@appStores/appNotification";

let api: AxiosInstance;
let cancelTokenSource: CancelTokenSource | null = null;
let lastRequestConfig: any = null;

export function createApiAccount() {
  // Here we set the base URL for all requests made to the api
  api = axios.create({
    baseURL: import.meta.env.VITE_API_ACCOUNT_URL,
  });

  api.interceptors.request.use(async (config) => {
    if (cancelTokenSource && lastRequestConfig) {
      const isSameRequest =
        config.url === lastRequestConfig.url &&
        config.method === lastRequestConfig.method;

      if (isSameRequest) {
        cancelTokenSource.cancel(
          "Operation canceled due to new identical request.",
        );
      }

      const session = useSession();

      if (session.isRefreshing) {
        cancelTokenSource.cancel("Operation canceled due refresh.");
      }
    }

    cancelTokenSource = axios.CancelToken.source();
    config.cancelToken = cancelTokenSource.token;

    // Store the last request configuration for comparison
    lastRequestConfig = config;

    config.withCredentials = true;

    const appConfigurations = useAppConfigurations();

    if (appConfigurations.isOffline) {
      cancelTokenSource.cancel();
    }

    if (appConfigurations.csrf) {
      config.headers["x-csrf-token"] = appConfigurations.csrf;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => {
      storeManager(response.data);

      const appConfigurations = useAppConfigurations();
      appConfigurations.setStatusCode(200);

      if (response.data?.message) {
        const appNotification = useAppNotification();
        appNotification.set({
          type: "success",
          message: response.data?.message,
        });
      }

      return Promise.resolve(response);
    },
    (error) => {
      storeManager(error.response.data);

      const appConfigurations = useAppConfigurations();

      if (error.response.data?.message) {
        const appNotification = useAppNotification();
        appNotification.set({
          type: "error",
          message: error.response.data?.message,
        });
      }

      if (error.code == "ERR_BAD_REQUEST" && error.response.status == 401) {
        appConfigurations.setStatusCode(401);
        const session = useSession();
        session.logout();
      }

      if (error.code == "ERR_BAD_REQUEST" && error.response.status == 403) {
        appConfigurations.setStatusCode(403);
      }

      if (
        (error.code == "ERR_NETWORK" || error.code == "ERR_BAD_RESPONSE") &&
        (error.response == undefined || error.response.status == 500)
      ) {
        appConfigurations.setStatusCode(500);

        const appNotification = useAppNotification();
        appNotification.set({ type: "error", message: "App Offline" });
      }

      return Promise.reject(error);
    },
  );

  return api;
}

export function useApiAccount() {
  if (!api) {
    createApiAccount();
  }
  return api;
}
