<script setup lang="ts">
import {SearchZoneResult} from "~@/types.ts";
import apiConfig from "~@/config/apiConfig.ts";

const {attachment} = apiConfig;

const props = defineProps<{
  name: string;
  value: string;
  attachment: number;
}>();

const emit = defineEmits<{
  (e: 'resultClicked', value: SearchZoneResult): void
}>();

const attachementUrl = attachment + props.attachment;
</script>

<template>
  <div class="result-with-attachment" :data-value="value" :data-text="name"
       @click="emit('resultClicked', {name, value})" @touchstart="emit('resultClicked', {name, value})">
    <div class="profile-picture" :style="{'background-image': `url(${attachementUrl})`}"></div>
    <div class="text">
      {{ name }}
    </div>
  </div>
</template>

<style scoped>

</style>