<script setup lang="ts">
const emits = defineEmits(['token', 'resetToken'])

const props = defineProps({
  resetToken: {
    type: Boolean,
    default: true,
    required: true,
  },
})

const imaskReset = ref(false);
const input = ref('')

const imaskOptions = {
          mask: 'X X X X X X',
          definitions: {
            X: {
              mask: '0',
              placeholderChar: 'X',
            },
          },
          lazy: false,
          eager: true,
          overwrite: 'shift',
        };

const handleInput = (value) => {  
    const token = value.unmaskedValue
    emits('token', token);
}

watch(
  () => props.resetToken,
  () => {
    resetInput()
  }
)

const resetInput = () => {
  imaskReset.value = true;
  emits('resetToken', false)
  nextTick(() => {
    imaskReset.value = false;
  });
}

</script>
<template>
   <VField v-slot="{ id }">
    <VControl>
      <VIMaskInput 
      v-if="!imaskReset"
        :model-value="input"
        :id="id"
        class="input is-size-4 has-text-centered"
        :options="imaskOptions"
        @accept="handleInput"
      />
    </VControl>
  </VField>
</template>