<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

import { capitalizeFirstLetter } from "/@src/utils/formating";

import { useAppCountries } from "/@appStores/appCountries";

import { useApiAccount } from "/@src/api/apiAccount";

const { t } = useI18n();

const apiAccount = useApiAccount();
const appCountires = useAppCountries();

const props = defineProps({
  isModal: {
    type: Boolean,
  },
  phoneNumber: {
    type: Object,
  },
});

const emits = defineEmits(["close", "active"]);

const isLoading = ref<boolean>(false);

const formError = ref<Boolean>(false);

const schema = toTypedSchema(
  z
    .object({
      code: z.string(),
      number: z.number({ required_error: "phoneNumber.required" }),
    })
    .refine((data) => !!data.code, {
      message: "country.code.invalid",
      path: ["number"],
    }),
);

const { handleSubmit, setErrors, resetField, setFieldValue } = useForm({
  validationSchema: schema,
});

const number = ref<String>();

const countriesList = ref(
  appCountires.countries.map((country) => ({
    label: `${country.code} - ${capitalizeFirstLetter(country.name)}`,
    value: country.name, // Use the country code as the value
  })),
);

const findCountryByName = (name) => {
  const countriesList = appCountires.countries;

  const country = countriesList.find((country) => country.name == name);
  return country ? { code: country.code, name: country.name } : null;
};

const selectedCountry = ref<string | null | undefined>();

selectedCountry.value =
  props.phoneNumber.country.code +
  " - " +
  capitalizeFirstLetter(props.phoneNumber.country.name);

const selectedCode = ref<string | null | undefined>(
  props.phoneNumber.country.code,
);

const handleUpdate = handleSubmit(async (value) => {
  await apiAccount
    .post("user/update-phone", value)
    .then(async (response) => {
      emits("active", "phone_verification");
    })
    .catch((error) => {
      if (error.response.data.fieldErrors) {
        setErrors(error.response.data.fieldErrors);
        number.value = undefined;
      }
      if (error.response.data.formErrors) {
        formError.value = error.response.data.formErrors;
      }
    });
});

watch(selectedCountry, (value) => {
  if (!value) {
    selectedCode.value = "";
    resetField("code");
  } else {
    const countryData = findCountryByName(value);
    selectedCountry.value = countryData?.name;
    selectedCode.value = countryData?.code;
    setFieldValue("code", countryData?.code);
  }
});
</script>
<template>
  <div class="action-page-wrapper">
    <div class="wrapper-inner">
      <div class="action-box">
        <VLoader :active="isLoading">
          <div class="box-content">
            <img
              class="light-image"
              src="/@src/assets/illustrations/placeholders/launch.svg"
              alt=""
            />
            <img
              class="dark-image"
              src="/@src/assets/illustrations/placeholders/launch-dark.svg"
              alt=""
            />
            <form @submit.prevent="handleUpdate">
              <div class="columns is-centered is-multiline">
                <div class="column is-6 is-full">
                  <h3 class="dark-inverted">
                    {{ t("pages.contacts.phoneNumber.update.title") }}
                  </h3>
                </div>
                <div class="column is-12 is-full">
                  {{ t("pages.contacts.phoneNumber.update.subtitle") }}
                </div>
                <div class="column is-7 is-full">
                  <p v-if="formError" class="help is-danger">
                    {{ t("form.error") }}
                  </p>
                  <VField
                    v-slot="{ id }"
                    id="code"
                    class="is-autocomplete-select"
                  >
                    <VControl icon="lucide:search">
                      <Multiselect
                        v-model="selectedCountry"
                        track-by="id"
                        :options="countriesList"
                        :placeholder="t('listCountry.placeholder')"
                        :searchable="true"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-7 is-full">
                  <VField addons v-slot="{ field }" id="number">
                    <VControl class="is-over is-left">
                      <VButton class="min-width" static>
                        {{ selectedCode }}
                      </VButton>
                    </VControl>
                    <VControl expanded class="padding-left-20">
                      <VInput
                        type="number"
                        class="input"
                        :placeholder="t('emailAddress.placeholder')"
                      />
                      <p v-if="field?.errorMessage" class="help is-danger">
                        {{ t(field?.errorMessage) }}
                      </p>
                    </VControl>
                  </VField>
                </div>
              </div>
              <div class="buttons">
                <VButton
                  color="primary"
                  raised
                  tabindex="0"
                  class="m-2"
                  type="submit"
                >
                  {{ t("action.submit") }}
                </VButton>
                <VButton
                  color="primary"
                  raised
                  tabindex="0"
                  outlined
                  class="m-2"
                  @click="
                    () => {
                      if (props.isModal) {
                        emits('close');
                      } else {
                        emits('active', 'phone_verification');
                      }
                    }
                  "
                >
                  {{ t("action.cancel") }}
                </VButton>
              </div>
            </form>
          </div>
        </VLoader>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.min-width {
  min-width: 50px;
}

.help.is-danger {
  transform: translateX(-20%);
}
</style>
