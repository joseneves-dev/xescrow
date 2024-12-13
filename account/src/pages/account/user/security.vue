<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

import { useApiAccount } from "/@src/api/apiAccount";

const { t } = useI18n();

const api = useApiAccount();

const trustedDevices = ref([]);
const sessions = ref([]);

const formError = ref<Boolean>(false);

const schema = toTypedSchema(
  z
    .object({
      currentPassword: z
        .string({ required_error: "password.required" })
        .min(10, { message: "password.min" }),
      newPassword: z
        .string({
          required_error: "password.required",
        })
        .min(10, {
          message: "password.min",
        })
        .regex(/[a-z]/, {
          message: "password.lowercase",
        })
        .regex(/[A-Z]/, {
          message: "password.uppercase",
        })
        .regex(/\d/, {
          message: "password.numeric",
        })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, {
          message: "password.specialCharacter",
        }),
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: "password.repetead",
      path: ["newPassword"],
    }),
);

const { handleSubmit, setErrors, handleReset, setFieldValue } = useForm({
  validationSchema: schema,
});

const handleUpdatePassword = handleSubmit(async (values) => {
  await api
    .post("user/update-password", values)
    .then(async (response) => {})
    .catch((error) => {
      if (error.response.data.fieldErrors) {
        setErrors(error.response.data.fieldErrors);
      }
      if (error.response.data.formErrors) {
        formError.value = error.response.data.formErrors;
      }
      handleReset();
    });
});

const handleRemoveTrustedDevices = async (device) => {
  await api
    .post("user/remove-trusted-device", { device })
    .then(async (response) => {
      modalDevices.value = false;
      dataDevice.value = null;
      trustedDevices.value = response.data.trustedDevices;
    })
    .catch((error) => {});
};

await api
  .get("user/get-trusted-devices")
  .then((response) => {
    trustedDevices.value = response.data.trustedDevices;
  })
  .catch((error) => {});

await api
  .get("user/get-sessions")
  .then((response) => {
    sessions.value = response.data.sessions;
  })
  .catch((error) => {});

const fieldType = ref("password");
const newFieldType = ref("password");
const handleCancel = async () => {
  handleReset();
  fieldType.value = "password";
  newFieldType.value = "password";
};

const handlePassword = async () => {
  if (fieldType.value == "password") {
    fieldType.value = "text";
  } else {
    fieldType.value = "password";
  }
};

const handleNewPassword = async () => {
  if (newFieldType.value == "password") {
    newFieldType.value = "text";
  } else {
    newFieldType.value = "password";
  }
};

const handleGenerate = async () => {
  newFieldType.value = "text";

  // Character sets
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numericChars = "0123456789";
  const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";

  // Combine all characters
  const allChars =
    upperCaseChars + lowerCaseChars + numericChars + specialChars;

  // Randomly pick one character from each required set
  const getRandomChar = (charSet) =>
    charSet[Math.floor(Math.random() * charSet.length)];

  // Generate a random password length between 12 and 18
  const passwordLength = Math.floor(Math.random() * (18 - 12 + 1)) + 12;

  let generatedPassword = "";
  generatedPassword += getRandomChar(upperCaseChars);
  generatedPassword += getRandomChar(lowerCaseChars);
  generatedPassword += getRandomChar(numericChars);
  generatedPassword += getRandomChar(specialChars);

  // Fill the rest of the password with random characters from all sets
  for (let i = generatedPassword.length; i < passwordLength; i++) {
    generatedPassword += getRandomChar(allChars);
  }
  // Shuffle the password to avoid predictable patterns
  const newPassword = generatedPassword
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  setFieldValue("newPassword", newPassword);
};

const modalSession = ref(false);
const modalDevices = ref(false);
const dataDevice = ref(null);

const showErrorMessage = ref<Boolean>(false);

const handleInput = () => {
  showErrorMessage.value = false; // Disable error message display while typing
};

const handleBlur = () => {
  showErrorMessage.value = true; // Enable error message display when finished typing
};
const isLoadingFields = ref(false);
</script>
<template>
  <div class="account-box is-form is-footerless">
    <div class="form-head stuck-header">
      <div class="form-head-inner">
        <div class="left">
          <h3>{{ t("pages.security.title") }}</h3>
          <p>{{ t("pages.security.subtitle") }}</p>
        </div>
      </div>
    </div>
    <div class="form-body">
      <VLoader :active="isLoadingFields">
        <div class="fieldset">
          <div class="fieldset-heading">
            <h4>{{ t("pages.security.password.title") }}</h4>
            <p>{{ t("pages.security.password.subtitle") }}</p>
          </div>
          <form @submit.prevent="handleUpdatePassword">
            <p v-if="formError" class="help is-danger">{{ t("form.error") }}</p>
            <div class="login-form">
              <div class="columns is-multiline">
                <div class="column is-6">
                  <VField v-slot="{ field }" id="currentPassword" addons>
                    <VControl expanded>
                      <VInput
                        v-bind="field"
                        :type="fieldType"
                        :placeholder="t('currentPassword.placeholder')"
                        @input="handleInput"
                        @blur="handleBlur"
                      />
                      <p
                        v-if="showErrorMessage && field?.errorMessage"
                        class="help is-danger"
                      >
                        {{ t(field?.errorMessage) }}
                      </p>
                    </VControl>
                    <VControl class="is-over is-right">
                      <VButtons>
                        <VIconButton
                          v-if="fieldType == 'text'"
                          icon="lucide:eye"
                          @click="handlePassword"
                        />
                        <VIconButton
                          v-else
                          icon="lucide:eye-off"
                          @click="handlePassword"
                        />
                      </VButtons>
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField v-slot="{ field }" id="newPassword" addons>
                    <VControl expanded>
                      <VInput
                        v-bind="field"
                        :type="newFieldType"
                        :placeholder="t('newPassword.placeholder')"
                        @input="handleInput"
                        @blur="handleBlur"
                      />
                      <p
                        v-if="showErrorMessage && field?.errorMessage"
                        class="help is-danger"
                      >
                        {{ t(field?.errorMessage) }}
                      </p>
                    </VControl>
                    <VControl class="is-over is-right">
                      <VButtons>
                        <VIconButton
                          v-if="newFieldType == 'text'"
                          icon="lucide:eye"
                          @click="handleNewPassword"
                        />
                        <VIconButton
                          v-else
                          icon="lucide:eye-off"
                          @click="handleNewPassword"
                        />
                      </VButtons>
                    </VControl>
                  </VField>
                </div>
                <div
                  class="column is-4 has-text-centered is-centered is-vcentered"
                >
                  <VButton
                    color="danger"
                    class="ml-1"
                    outlined
                    raised
                    label="Cancel"
                    @click="handleCancel"
                  >
                    <strong>{{ t("action.cancel") }}</strong>
                  </VButton>
                  <VButton
                    color="primary"
                    class="ml-1"
                    raised
                    label="Save"
                    type="submit"
                  >
                    <strong>{{ t("action.update") }}</strong>
                  </VButton>
                </div>
                <div class="column is-6 is-vcentered">
                  <VButton
                    color="success"
                    class="ml-1"
                    outlined
                    raised
                    label="Cancel"
                    @click="handleGenerate()"
                  >
                    <strong>{{ t("action.password.generate") }}</strong>
                  </VButton>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div v-if="trustedDevices.length != 0" class="fieldset">
          <div class="fieldset-heading">
            <h4>{{ t("pages.security.trustDevices.title") }}</h4>
            <p>{{ t("pages.security.trustDevices.subtitle") }}</p>
          </div>
          <div class="columns is-multiline is-vcentered">
            <div
              v-for="(device, key) in trustedDevices"
              :key="key"
              class="column is-5"
            >
              <div class="setting-list">
                <div class="setting-item is-create">
                  <VIconWrap
                    icon="fas fa-trash"
                    @click="
                      () => {
                        modalDevices = true;
                        dataDevice = device;
                      }
                    "
                  />
                  <div class="meta">
                    <span class="dark-inverted">
                      {{ device.os.name }} - {{ device.browser.name }}
                    </span>
                    <span>
                      {{ device.ipv4 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <VModal
            :open="modalDevices"
            size="small"
            actions="center"
            noscroll
            noclose
            :title="t('pages.security.trustDevices.remove')"
            cancel-label="Cancel"
            @close="modalDevices = false"
          >
            <template #content>
              <VPlaceholderSection
                :title="t('pages.security.trustDevices.remove')"
                :subtitle="
                  t('pages.security.trustDevices.info', {
                    deviceName: dataDevice.os.name,
                    deviceIp: dataDevice.ipv4,
                  })
                "
              />
            </template>
            <template #action>
              <VButton
                color="primary"
                raised
                @click="handleRemoveTrustedDevices(dataDevice.id)"
                >Yes remove!</VButton
              >
            </template>
          </VModal>
        </div>
        <div class="fieldset">
          <div class="fieldset-heading">
            <h4>{{ t("pages.security.sessions.title") }}</h4>
            <p>{{ t("pages.security.sessions.subtitle") }}</p>
          </div>

          <div class="columns is-multiline is-vcentered">
            <div
              v-for="(session, key) in sessions"
              :key="key"
              class="column is-5"
            >
              <div class="setting-list">
                <div class="setting-item is-create">
                  <VIconWrap
                    :icon="
                      session?.success == 1
                        ? 'fas fa-check'
                        : 'fas fa-exclamation'
                    "
                  />
                  <div class="meta">
                    <span class="dark-inverted">
                      {{ session?.data?.os?.name }} -
                      {{ session?.data?.browser?.name }}
                    </span>
                    <span class="dark-inverted">
                      {{ session?.createdAt }}
                    </span>
                    <span>{{ session?.data?.ipv4 }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-10 has-text-centered">
              <VButton
                raised
                dark-outlined
                icon="fas fa-exclamation-triangle"
                class="add-setting-item"
                @click="modalSession = true"
              >
                {{ t("pages.security.sessions.recognize") }}
              </VButton>
            </div>
          </div>
        </div>
      </VLoader>
    </div>
    <VModal
      :open="modalSession"
      size="medium"
      actions="center"
      noscroll
      :title="t('pages.security.sessions.recognize')"
      :cancel-label="t('action.back')"
      @close="modalSession = false"
    >
      <template #content>
        {{ t("pages.security.sessions.info") }}
      </template>
      <template #action> </template>
    </VModal>
  </div>
</template>

<style lang="scss">
.is-dark {
  .icon-wrap,
  .icon-wrap.is-placeholder {
    background: color-mix(in oklab, var(--dark-sidebar), white 2%) !important;
    border-color: color-mix(
      in oklab,
      var(--dark-sidebar),
      white 12%
    ) !important;
  }
}
</style>
