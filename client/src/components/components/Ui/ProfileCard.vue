<script setup lang="ts">
import {UserPublicProfile} from "~@/types.ts";
import {onMounted} from "vue";

const props = defineProps<{
  elementId?: string;
  id: number;
  username: string;
  profilePicture: number|null;
  avatar: string;
  status?: string;
  actionText?: string;
}>();

const elementId: string = props.elementId ? props.elementId+props.id : `profileCard${props.id}`;

const emit = defineEmits<{
  (e: 'profileClicked', user: UserPublicProfile): void
  (e: 'actionClicked', user: UserPublicProfile): void
}>()

function profileClicked() {
  emit("profileClicked", {
    id: props.id,
    name: props.username,
    status: props.status,
    profilePicture: props.profilePicture,
  });
}

function actionClicked() {
  emit("actionClicked", {
    id: props.id,
    name: props.username,
    status: props.status,
    profilePicture: props.profilePicture,
  });
}

</script>

<template>
  <div :id="elementId" class="profile-card" @click="profileClicked" @touchstart="profileClicked">
    <div class="profile-picture" :style="{'background-image': `url(${props.avatar})`}"></div>
    <div class="profile-meta">
      <div class="profile-name">
        {{ props.username }}
      </div>
      <div class="profile-action">
        <div v-if="props.actionText" style="cursor: pointer;" @click="actionClicked" @touchstart="actionClicked">
          {{ props.actionText }}
        </div>
        <div v-else>
          {{ props.status }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
