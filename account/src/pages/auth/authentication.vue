<script setup lang="ts">
import { useSecondFactor } from '/@userStores/secondFactor';

const secondFactor = useSecondFactor()

useHead({
  title: 'Auth Login',
})
</script>
<template>
  <div class="single-form-wrap">
      <div class="inner-wrap">
        <SecondFactorAuth v-if="secondFactor.expires && secondFactor.expires > 0"/>
        <Login v-else/>  
      </div>
  </div>
</template>