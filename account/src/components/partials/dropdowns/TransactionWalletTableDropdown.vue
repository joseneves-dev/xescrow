<script setup lang="ts">
const emits = defineEmits<{
  (e: "view"): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
  (e: "dispute"): void;
}>();
const props = defineProps({
  transaction: {
    type: Object,
    default: null,
  },
  selectedAccountPubKey: {
    type: String,
    default: null,
  },
});
</script>

<template>
  <VDropdown icon="lucide:more-vertical" class="is-pushed-mobile" spaced right>
    <template #content="{ close }">
      <a
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('view');
            close();
          }
        "
      >
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-trash-can-alt" />
        </div>
        <div class="meta">
          <span>View </span>
          <span>View Transaction Details</span>
        </div>
      </a>

      <hr
        v-if="
          !props.transaction[0]?.err &&
          props.transaction[0].data?.instruction == 'escrow'
        "
        class="dropdown-divider"
      />
      <a
        v-if="
          !props.transaction[0]?.err &&
          props.transaction[0].data?.instruction == 'escrow' &&
          props.transaction[0].data?.status == 'initialized' &&
          props.transaction[0].data?.sender == props.selectedAccountPubKey
        "
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('confirm');
            close();
          }
        "
      >
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-eye" />
        </div>
        <div class="meta">
          <span>Confirm</span>
          <span>Confirm and Send Transaction</span>
        </div>
      </a>
      <a
        v-if="
          !props.transaction[0]?.err &&
          props.transaction[0].data?.instruction == 'escrow' &&
          props.transaction[0].data?.status == 'initialized' &&
          props.transaction[0].data.receiver == props.selectedAccountPubKey
        "
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('cancel');
            close();
          }
        "
      >
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-briefcase" />
        </div>
        <div class="meta">
          <span>Cancel </span>
          <span>Cancel and send to sender</span>
        </div>
      </a>
      <a
        v-if="
          !props.transaction[0]?.err &&
          props.transaction[0].data?.instruction == 'escrow' &&
          props.transaction[0].data?.status == 'initialized'
        "
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('dispute');
            close();
          }
        "
      >
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-calendar" />
        </div>
        <div class="meta">
          <span>Dispute</span>
          <span>Start dispute on transaction</span>
        </div>
      </a>
      <a
        v-if="
          !props.transaction[0]?.err &&
          props.transaction[0].data?.instruction == 'escrow' &&
          props.transaction[0].data?.status == 'dispute' &&
          props.transaction[0].data.escrowAutority ==
            props.selectedAccountPubKey
        "
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('dispute');
            close();
          }
        "
      >
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-calendar" />
        </div>
        <div class="meta">
          <span>Resolve Dispute</span>
          <span>Resolve dispute on transaction</span>
        </div>
      </a>
    </template>
  </VDropdown>
</template>
