<script setup lang="ts">
const emits = defineEmits<{
  (e: "view"): void;
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
          props.transaction[0].data?.status == 'disputed'
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
          <i aria-hidden="true" class="lnil lnil-eye" />
        </div>
        <div class="meta">
          <span>Action</span>
          <span>Take an action on the transaction</span>
        </div>
      </a>
    </template>
  </VDropdown>
</template>
