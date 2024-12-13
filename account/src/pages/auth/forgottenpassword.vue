<script setup lang="ts">

const request = ref<Boolean>(false)

const requested = async (value: boolean) => {
  request.value = value
}
</script>

<template>
    <div class="single-form-wrap">
      <ForgottenRequest v-if="request == false" @requested="requested" />
      <ForgottenSent v-else />
    </div>
</template>
