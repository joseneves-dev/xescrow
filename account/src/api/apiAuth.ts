import axios, { type AxiosInstance, type CancelTokenSource } from "axios";

import storeManager from "/@userStores/storeManager";
import { useSession } from "/@userStores/session";

import { useAppConfigurations } from "/@appStores/appConfigurations";
import { useAppNotification } from "/@appStores/appNotification";

let api: AxiosInstance;

export function createApiAuth() {
  // Here we set the base URL for all requests made to the api
  api = axios.create({
    baseURL: import.meta.env.VITE_API_AUTH_URL,
  });

  api.interceptors.request.use(async (config) => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

    config.withCredentials = true;
    config.cancelToken = cancelTokenSource.token;

    const appConfigurations = useAppConfigurations();
    if (appConfigurations.isOffline) {
      cancelTokenSource.cancel("Request canceled");
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

      if (error.response?.data.message) {
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

export function useApiAuth() {
  if (!api) {
    createApiAuth();
  }
  return api;
}
