<script setup lang="ts">
import {SearchZoneResult} from "~@/types.ts";

const props = defineProps<{
  name: string;
  value: string;
}>();

const emit = defineEmits<{
  (e: 'resultClicked', value: SearchZoneResult): void
}>();

</script>

<template>
  <div class="simple-result" :data-value="value" :data-text="name" @click="emit('resultClicked', {name, value})">
    {{ name }}
  </div>
</template>

<style scoped>

</style>