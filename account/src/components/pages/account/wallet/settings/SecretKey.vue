<script setup lang="ts">
const { t } = useI18n();
const emits = defineEmits(["close"]);

const props = defineProps({
  publicKey: {
    type: String,
    default: null,
  },
  secretKey: {
    type: Boolean,
    default: false,
  },
});

const requestViewSecretKey = ref<Boolean>(false);
const viewSecretKey = ref<Boolean>(false);
const requestRemoveSecretKey = ref<Boolean>(false);
const removeSecretKey = ref<Boolean>(false);

const closeModal = async () => {
  requestViewSecretKey.value = false;
  viewSecretKey.value = false;
  requestRemoveSecretKey.value = false;
  removeSecretKey.value = false;
  emits("close");
};
</script>
<template>
  <VModal :open="true" noheader nofooter noclose size="none">
    <template #content>
      <div class="action-page-wrapper">
        <div class="wrapper-inner">
          <div class="action-box">
            <div class="box-content">
              <AddSecretKey
                v-if="!props.secretKey"
                :publicKey="publicKey"
                @close="closeModal"
              />
              <RequestViewSecretKey
                v-else-if="requestViewSecretKey"
                :publicKey="publicKey"
                @close="closeModal"
                @success="
                  requestViewSecretKey = false;
                  viewSecretKey = true;
                "
              />
              <ViewSecretKey
                v-else-if="viewSecretKey"
                :publicKey="publicKey"
                @close="closeModal"
              />
              <RequestRemoveSecretKey
                v-else-if="requestRemoveSecretKey"
                :publicKey="publicKey"
                @close="closeModal"
                @success="
                  requestRemoveSecretKey = false;
                  removeSecretKey = true;
                "
              />
              <RemoveSecretKey
                v-else-if="removeSecretKey"
                :publicKey="publicKey"
                @close="closeModal"
              />
              <div v-else>
                <h3>{{ t("components.wallet.secretKey.title") }}</h3>
                <h4>
                  {{ t("components.wallet.secretKey.subtitle") }}
                </h4>
                <div class="buttons">
                  <VButton
                    color="primary"
                    raised
                    tabindex="0"
                    class="m-2"
                    @click="requestViewSecretKey = true"
                  >
                  </VButton>
                  <VButton
                    color="primary"
                    raised
                    tabindex="0"
                    outlined
                    class="m-2"
                    @click="requestRemoveSecretKey = true"
                  >
                    {{ t("action.remove") }}
                  </VButton>
                  <VButton
                    color="primary"
                    raised
                    tabindex="0"
                    outlined
                    class="m-2"
                    @click="emits('close')"
                  >
                    {{ t("action.close") }}
                  </VButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </VModal>
</template>
